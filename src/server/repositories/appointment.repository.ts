import "server-only";

import type {
  AppointmentStatus,
  FatherAppointmentListItem,
  UpdateAppointmentStatusInput,
} from "@/contracts/appointment";
import { pool } from "@/lib/db";
import type { PoolClient } from "pg";

type AppointmentDatabaseRow = Omit<
  FatherAppointmentListItem,
  "scheduleDate"
> & {
  scheduleDate: string | Date;
};

type LockedAppointmentRow = {
  id: string;
  availabilityEntryId: string | null;
  status: AppointmentStatus;
};

export class AppointmentNotFoundError extends Error {
  constructor() {
    super("The appointment was not found.");
    this.name = "AppointmentNotFoundError";
  }
}

export class AppointmentConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppointmentConflictError";
  }
}

const childNameSql = `
  COALESCE(
    NULLIF(u.name, ''),
    NULLIF(to_jsonb(sc)->>'baptismal_name', ''),
    NULLIF(to_jsonb(sc)->>'baptismalName', ''),
    NULLIF(to_jsonb(sc)->>'legal_name', ''),
    NULLIF(to_jsonb(sc)->>'legalName', ''),
    NULLIF(to_jsonb(sc)->>'display_name', ''),
    NULLIF(to_jsonb(sc)->>'displayName', ''),
    NULLIF(to_jsonb(sc)->>'name', ''),
    'Spiritual Child'
  )
`;

const childPhoneSql = `
  COALESCE(
    NULLIF(to_jsonb(sc)->>'phone_number', ''),
    NULLIF(to_jsonb(sc)->>'phoneNumber', ''),
    NULLIF(to_jsonb(sc)->>'phone', '')
  )
`;

function serializeAppointment(
  appointment: AppointmentDatabaseRow,
): FatherAppointmentListItem {
  return {
    ...appointment,
    scheduleDate:
      appointment.scheduleDate instanceof Date
        ? appointment.scheduleDate.toISOString().slice(0, 10)
        : appointment.scheduleDate,
  };
}

export async function listAppointmentsForFather(
  fatherUserId: string,
): Promise<FatherAppointmentListItem[]> {
  const result = await pool.query<AppointmentDatabaseRow>(
    `
      SELECT
        a.id,
        a.spiritual_child_id AS "childId",
        ${childNameSql} AS "childName",
        ${childPhoneSql} AS "childPhone",
        a.reason,
        a.status,
        a.schedule_date::text AS "scheduleDate",
        a.start_time AS "startTime",
        a.end_time AS "endTime",
        a.meeting_method AS "meetingMethod",
        a.location,
        a.notes
      FROM appointments AS a
      INNER JOIN spiritual_children AS sc
        ON sc.id = a.spiritual_child_id
      LEFT JOIN "user" AS u
        ON u.id = sc.linked_user_id
      WHERE a.father_user_id = $1
      ORDER BY
        CASE a.status
          WHEN 'CONFIRMED' THEN 0
          WHEN 'COMPLETED' THEN 1
          WHEN 'CANCELLED' THEN 2
          ELSE 3
        END,
        a.schedule_date ASC,
        a.start_time ASC
    `,
    [fatherUserId],
  );

  return result.rows.map(serializeAppointment);
}

export async function updateAppointmentStatusForFather({
  action,
  appointmentId,
  fatherUserId,
}: UpdateAppointmentStatusInput & {
  appointmentId: string;
  fatherUserId: string;
}): Promise<{ id: string; status: AppointmentStatus }> {
  const client: PoolClient = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query<LockedAppointmentRow>(
      `
        SELECT
          id,
          availability_entry_id AS "availabilityEntryId",
          status
        FROM appointments
        WHERE id = $1
          AND father_user_id = $2
        FOR UPDATE
      `,
      [appointmentId, fatherUserId],
    );
    const appointment = result.rows[0];

    if (!appointment) {
      throw new AppointmentNotFoundError();
    }

    if (appointment.status === "CONFIRMED") {
      if (action !== "COMPLETE" && action !== "CANCEL" && action !== "FOLLOW_UP") {
        throw new AppointmentConflictError(
          "A confirmed appointment can only be completed or canceled.",
        );
      }

      const status = action === "COMPLETE" ? "COMPLETED" : action === "FOLLOW_UP" ? "RESCHEDULED" : "CANCELLED";
      await client.query(
        `
          UPDATE appointments
          SET
            status = $3,
            active_availability_entry_id = NULL,
            updated_at = NOW()
          WHERE id = $1
            AND father_user_id = $2
        `,
        [appointmentId, fatherUserId, status],
      );

      await client.query("COMMIT");
      return { id: appointmentId, status };
    }

    if (
      (appointment.status === "COMPLETED" ||
        appointment.status === "CANCELLED") &&
      action === "REOPEN"
    ) {
      if (appointment.availabilityEntryId) {
        const occupied = await client.query(
          `
            SELECT 1
            FROM appointments
            WHERE active_availability_entry_id = $1
              AND status = 'CONFIRMED'
              AND id <> $2
            LIMIT 1
            FOR UPDATE
          `,
          [appointment.availabilityEntryId, appointmentId],
        );

        if (occupied.rowCount === 1) {
          throw new AppointmentConflictError(
            "This availability has already been booked.",
          );
        }
      }

      await client.query(
        `
          UPDATE appointments
          SET
            status = 'CONFIRMED',
            active_availability_entry_id = $3,
            updated_at = NOW()
          WHERE id = $1
            AND father_user_id = $2
        `,
        [
          appointmentId,
          fatherUserId,
          appointment.availabilityEntryId,
        ],
      );

      await client.query("COMMIT");
      return { id: appointmentId, status: "CONFIRMED" };
    }

    throw new AppointmentConflictError(
      "Only completed or canceled appointments can be restored to upcoming.",
    );
  } catch (error: unknown) {
    await client.query("ROLLBACK");

    const postgresError = error as { code?: string };
    if (postgresError.code === "23505") {
      throw new AppointmentConflictError(
        "This availability has already been booked.",
      );
    }

    throw error;
  } finally {
    client.release();
  }
}
