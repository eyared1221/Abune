import "server-only";

import type { PoolClient } from "pg";

import type {
  AppointmentRequestListItem,
  AppointmentRequestStats,
  ReviewAppointmentRequestInput,
} from "@/contracts/appointment-request";
import { pool } from "@/lib/db";

export class AppointmentRequestNotFoundError extends Error {
  constructor() {
    super("The appointment request was not found.");
    this.name = "AppointmentRequestNotFoundError";
  }
}

export class AppointmentRequestConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppointmentRequestConflictError";
  }
}

type RequestDatabaseRow = Omit<
  AppointmentRequestListItem,
  "reviewedAt" | "createdAt"
> & {
  reviewedAt: Date | null;
  createdAt: Date;
};

type StatsDatabaseRow = {
  pending: string;
  approved: string;
  rejected: string;
  cancelled: string;
  expired: string;
  total: string;
};

type LockedRequestRow = {
  id: string;
  fatherUserId: string;
  childUserId: string | null;
  availabilityEntryId: string | null;
  status: string;
  reason: string;
  requestedDate: string;
  requestedStartTime: string;
  requestedEndTime: string;
  meetingMethod: string;
  location: string | null;
};

const childNameSql = `
  COALESCE(
    NULLIF(u.name, ''),
    'Spiritual Child'
  )
`;

const childPhoneSql = `NULL::text`;

function serializeRequest(
  row: RequestDatabaseRow,
): AppointmentRequestListItem {
  return {
    ...row,
    reviewedAt: row.reviewedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

async function findRequestByIdWithExecutor(
  executor: PoolClient | typeof pool,
  requestId: string,
  fatherUserId: string,
) {
  const result = await executor.query<RequestDatabaseRow>(
    `
      SELECT
        ar.id,
        ar.child_user_id AS "childId",
        ${childNameSql} AS "childName",
        ${childPhoneSql} AS "childPhone",
        ar.reason,
        ar.request_message AS "requestMessage",
        ar.status,
        ar.requested_date::text AS "requestedDate",
        ar.requested_start_time AS "requestedStartTime",
        ar.requested_end_time AS "requestedEndTime",
        ar.meeting_method AS "meetingMethod",
        ar.location,
        ar.response_note AS "responseNote",
        ar.reviewed_at AS "reviewedAt",
        ar.created_at AS "createdAt"
      FROM appointment_requests AS ar
      LEFT JOIN "user" AS u
        ON u.id = ar.child_user_id
      WHERE ar.id = $1
        AND ar.father_user_id = $2
      LIMIT 1
    `,
    [requestId, fatherUserId],
  );

  const row = result.rows[0];

  return row ? serializeRequest(row) : null;
}

export async function listRequestsForFather(
  fatherUserId: string,
): Promise<AppointmentRequestListItem[]> {
  const result = await pool.query<RequestDatabaseRow>(
    `
      SELECT
        ar.id,
        ar.child_user_id AS "childId",
        ${childNameSql} AS "childName",
        ${childPhoneSql} AS "childPhone",
        ar.reason,
        ar.request_message AS "requestMessage",
        ar.status,
        ar.requested_date::text AS "requestedDate",
        ar.requested_start_time AS "requestedStartTime",
        ar.requested_end_time AS "requestedEndTime",
        ar.meeting_method AS "meetingMethod",
        ar.location,
        ar.response_note AS "responseNote",
        ar.reviewed_at AS "reviewedAt",
        ar.created_at AS "createdAt"
      FROM appointment_requests AS ar
      LEFT JOIN "user" AS u
        ON u.id = ar.child_user_id
      WHERE ar.father_user_id = $1
      ORDER BY
        CASE ar.status
          WHEN 'PENDING' THEN 0
          ELSE 1
        END,
        ar.created_at DESC
    `,
    [fatherUserId],
  );

  return result.rows.map(serializeRequest);
}

export async function getRequestStatsForFather(
  fatherUserId: string,
): Promise<AppointmentRequestStats> {
  const result = await pool.query<StatsDatabaseRow>(
    `
      SELECT
        COUNT(*) FILTER (
          WHERE status = 'PENDING'
        )::text AS pending,
        COUNT(*) FILTER (
          WHERE status = 'APPROVED'
        )::text AS approved,
        COUNT(*) FILTER (
          WHERE status = 'REJECTED'
        )::text AS rejected,
        COUNT(*) FILTER (
          WHERE status = 'CANCELLED'
        )::text AS cancelled,
        COUNT(*) FILTER (
          WHERE status = 'EXPIRED'
        )::text AS expired,
        COUNT(*)::text AS total
      FROM appointment_requests
      WHERE father_user_id = $1
    `,
    [fatherUserId],
  );

  const row = result.rows[0];

  return {
    pending: Number(row?.pending ?? 0),
    approved: Number(row?.approved ?? 0),
    rejected: Number(row?.rejected ?? 0),
    cancelled: Number(row?.cancelled ?? 0),
    expired: Number(row?.expired ?? 0),
    total: Number(row?.total ?? 0),
  };
}

export async function reviewRequestForFather({
  action,
  fatherUserId,
  requestId,
  responseNote,
  reviewedByUserId,
}: ReviewAppointmentRequestInput & {
  fatherUserId: string;
  requestId: string;
  reviewedByUserId: string;
}): Promise<AppointmentRequestListItem> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const lockedResult = await client.query<LockedRequestRow>(
      `
        SELECT
          id,
          father_user_id AS "fatherUserId",
          child_user_id AS "childUserId",
          availability_entry_id AS "availabilityEntryId",
          status,
          reason,
          requested_date AS "requestedDate",
          requested_start_time AS "requestedStartTime",
          requested_end_time AS "requestedEndTime",
          meeting_method AS "meetingMethod",
          location
        FROM appointment_requests
        WHERE id = $1
          AND father_user_id = $2
        FOR UPDATE
      `,
      [requestId, fatherUserId],
    );

    const request = lockedResult.rows[0];

    if (!request) {
      throw new AppointmentRequestNotFoundError();
    }

    const canChangeAcceptedRequest =
      action === "DECLINE" && request.status === "APPROVED";
    const canChangeRejectedRequest =
      action === "ACCEPT" && request.status === "REJECTED";

    if (
      request.status !== "PENDING" &&
      !canChangeAcceptedRequest &&
      !canChangeRejectedRequest
    ) {
      throw new AppointmentRequestConflictError(
        "Only pending requests can be reviewed. Accepted and rejected requests can be changed to the other decision.",
      );
    }

    if (action === "DECLINE") {
      if (request.status === "APPROVED") {
        await client.query(
          `
            UPDATE appointments
            SET
              status = 'CANCELLED',
              active_availability_entry_id = NULL,
              notes = COALESCE($3, notes),
              updated_at = NOW()
            WHERE appointment_request_id = $1
              AND father_user_id = $2
              AND status = 'CONFIRMED'
          `,
          [
            requestId,
            fatherUserId,
            responseNote ?? null,
          ],
        );
      }

      await client.query(
        `
          UPDATE appointment_requests
          SET
            status = 'REJECTED',
            active_availability_entry_id = NULL,
            response_note = $3,
            reviewed_at = NOW(),
            reviewed_by_user_id = $4,
            updated_at = NOW()
          WHERE id = $1
            AND father_user_id = $2
        `,
        [
          requestId,
          fatherUserId,
          responseNote ?? null,
          reviewedByUserId,
        ],
      );
    } else {
      if (request.availabilityEntryId) {
        const occupied = await client.query(
          `
            SELECT 1
            FROM appointments
            WHERE active_availability_entry_id = $1
              AND status = 'CONFIRMED'
            LIMIT 1
            FOR UPDATE
          `,
          [request.availabilityEntryId],
        );

        if (occupied.rowCount === 1) {
          throw new AppointmentRequestConflictError(
            "This availability has already been booked.",
          );
        }
      }

      const existingAppointment = await client.query<{
        id: string;
      }>(
        `
          SELECT id
          FROM appointments
          WHERE appointment_request_id = $1
            AND father_user_id = $2
          FOR UPDATE
        `,
        [requestId, fatherUserId],
      );

      if (existingAppointment.rows[0]) {
        await client.query(
          `
            UPDATE appointments
            SET
              status = 'CONFIRMED',
              active_availability_entry_id = $2,
              notes = COALESCE($3, notes),
              updated_at = NOW()
            WHERE id = $1
          `,
          [
            existingAppointment.rows[0].id,
            request.availabilityEntryId,
            responseNote ?? null,
          ],
        );
      } else {
        await client.query(
          `
            INSERT INTO appointments (
              father_user_id,
              spiritual_child_id,
              child_user_id,
              availability_entry_id,
              active_availability_entry_id,
              appointment_request_id,
              reason,
              status,
              schedule_date,
              start_time,
              end_time,
              meeting_method,
              location,
              notes,
              created_at,
              updated_at
            )
            VALUES (
              $1, NULL, $2, $3, $4, $5, 'CONFIRMED',
              $6, $7, $8, $9, $10, $11, NOW(), NOW()
            )
          `,
          [
            fatherUserId,
            request.childUserId,
            request.availabilityEntryId,
            request.availabilityEntryId,
            request.id,
            request.reason,
            request.requestedDate,
            request.requestedStartTime,
            request.requestedEndTime,
            request.meetingMethod,
            request.location,
            responseNote ?? null,
          ],
        );
      }

      await client.query(
        `
          UPDATE appointment_requests
          SET
            status = 'APPROVED',
            active_availability_entry_id = NULL,
            response_note = $3,
            reviewed_at = NOW(),
            reviewed_by_user_id = $4,
            updated_at = NOW()
          WHERE id = $1
            AND father_user_id = $2
        `,
        [
          requestId,
          fatherUserId,
          responseNote ?? null,
          reviewedByUserId,
        ],
      );
    }

    const updated = await findRequestByIdWithExecutor(
      client,
      requestId,
      fatherUserId,
    );

    if (!updated) {
      throw new AppointmentRequestNotFoundError();
    }

    await client.query("COMMIT");

    return updated;
  } catch (error: unknown) {
    await client.query("ROLLBACK");

    const postgresError = error as {
      code?: string;
      constraint?: string;
    };

    if (postgresError.code === "23505") {
      throw new AppointmentRequestConflictError(
        postgresError.constraint ===
        "appointments_active_slot_unique"
          ? "This availability has already been booked."
          : "This request has already created an appointment.",
      );
    }

    throw error;
  } finally {
    client.release();
  }
}
