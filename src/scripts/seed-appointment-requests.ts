import "dotenv/config";

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import type { PoolClient } from "pg";
import { z } from "zod";

import {
  appointmentRequestReasonSchema,
  appointmentRequestStatusSchema,
  meetingMethodSchema,
} from "../contracts/appointment-request";
import { pool } from "../lib/db";

const timeSchema = z
  .string()
  .regex(
    /^(?:[01]\d|2[0-3]):[0-5]\d$/,
    "Time must use HH:mm.",
  );

const dateSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}$/,
    "Date must use YYYY-MM-DD.",
  );

const seedEntrySchema = z.object({
  seedKey: z.string().trim().min(1).max(160),
  fatherEmail: z.string().trim().email(),
  spiritualChildId: z.string().uuid().nullable().optional(),
  childName: z.string().trim().min(1),
  availabilityEntryId: z.string().uuid().nullable().optional(),
  reason: appointmentRequestReasonSchema,
  requestMessage: z.string().trim().max(4000).nullable().optional(),
  status: appointmentRequestStatusSchema,
  requestedDate: dateSchema,
  requestedStartTime: timeSchema,
  requestedEndTime: timeSchema,
  meetingMethod: meetingMethodSchema,
  location: z.string().trim().max(1000).nullable().optional(),
  responseNote: z.string().trim().max(1000).nullable().optional(),
  requestedAt: z.string().datetime({ offset: true }),
});

const seedFileSchema = z.array(seedEntrySchema).min(1);

type SeedEntry = z.infer<typeof seedEntrySchema>;

type UserRow = {
  id: string;
};

type ChildRow = {
  id: string;
  name: string;
};

const childNameSql = `
  COALESCE(
    NULLIF(to_jsonb(sc)->>'legal_name', ''),
    NULLIF(to_jsonb(sc)->>'legalName', ''),
    NULLIF(to_jsonb(sc)->>'baptismal_name', ''),
    NULLIF(to_jsonb(sc)->>'baptismalName', ''),
    NULLIF(to_jsonb(sc)->>'display_name', ''),
    NULLIF(to_jsonb(sc)->>'displayName', ''),
    NULLIF(to_jsonb(sc)->>'name', ''),
    'Unnamed Spiritual Child'
  )
`;

function assertTimeOrder(startTime: string, endTime: string) {
  if (endTime <= startTime) {
    throw new Error(
      `Invalid time range: ${startTime}-${endTime}.`,
    );
  }
}

async function findFatherUserId(
  client: PoolClient,
  fatherEmail: string,
): Promise<string> {
  const result = await client.query<UserRow>(
    `
      SELECT id
      FROM "user"
      WHERE LOWER(email) = LOWER($1)
        AND role = 'SPIRITUAL_FATHER'
      LIMIT 1
    `,
    [fatherEmail],
  );

  const father = result.rows[0];

  if (!father) {
    throw new Error(
      `No SPIRITUAL_FATHER user was found for ${fatherEmail}.`,
    );
  }

  return father.id;
}

async function resolveSpiritualChild(
  client: PoolClient,
  entry: SeedEntry,
): Promise<ChildRow> {
  if (entry.spiritualChildId) {
    const byId = await client.query<ChildRow>(
      `
        SELECT
          sc.id,
          ${childNameSql} AS name
        FROM spiritual_children AS sc
        WHERE sc.id = $1
        LIMIT 1
      `,
      [entry.spiritualChildId],
    );

    const child = byId.rows[0];

    if (!child) {
      throw new Error(
        `Spiritual Child ID ${entry.spiritualChildId} does not exist.`,
      );
    }

    return child;
  }

  const byName = await client.query<ChildRow>(
    `
      SELECT
        sc.id,
        ${childNameSql} AS name
      FROM spiritual_children AS sc
      WHERE LOWER(${childNameSql}) = LOWER($1)
      ORDER BY sc.id
      LIMIT 2
    `,
    [entry.childName],
  );

  if (byName.rowCount === 0) {
    throw new Error(
      `No Spiritual Child profile matched "${entry.childName}". ` +
        `Run npm run db:list-children and put its UUID in spiritualChildId.`,
    );
  }

  if ((byName.rowCount ?? 0) > 1) {
    throw new Error(
      `More than one Spiritual Child matched "${entry.childName}". ` +
        `Use spiritualChildId instead of the name.`,
    );
  }

  return byName.rows[0];
}

async function validateAvailability(
  client: PoolClient,
  availabilityEntryId: string | null | undefined,
  fatherUserId: string,
) {
  if (!availabilityEntryId) {
    return;
  }

  const result = await client.query(
    `
      SELECT 1
      FROM availability_entries
      WHERE id = $1
        AND father_user_id = $2
      LIMIT 1
    `,
    [availabilityEntryId, fatherUserId],
  );

  if (result.rowCount !== 1) {
    throw new Error(
      `Availability ${availabilityEntryId} does not exist ` +
        `or does not belong to the selected Father.`,
    );
  }
}

async function upsertSeedEntry(
  client: PoolClient,
  entry: SeedEntry,
) {
  assertTimeOrder(
    entry.requestedStartTime,
    entry.requestedEndTime,
  );

  const fatherUserId = await findFatherUserId(
    client,
    entry.fatherEmail,
  );
  const child = await resolveSpiritualChild(client, entry);

  await validateAvailability(
    client,
    entry.availabilityEntryId,
    fatherUserId,
  );

  const activeAvailabilityEntryId =
    entry.status === "PENDING"
      ? (entry.availabilityEntryId ?? null)
      : null;

  const reviewedAt =
    entry.status === "PENDING" ? null : new Date();

  const requestResult = await client.query<{ id: string }>(
    `
      INSERT INTO appointment_requests (
        seed_key,
        father_user_id,
        spiritual_child_id,
        availability_entry_id,
        active_availability_entry_id,
        reason,
        request_message,
        status,
        requested_date,
        requested_start_time,
        requested_end_time,
        meeting_method,
        location,
        response_note,
        reviewed_at,
        reviewed_by_user_id,
        created_at,
        updated_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15,
        $16, $17, NOW()
      )
      ON CONFLICT (seed_key)
      DO UPDATE SET
        father_user_id = EXCLUDED.father_user_id,
        spiritual_child_id = EXCLUDED.spiritual_child_id,
        availability_entry_id = EXCLUDED.availability_entry_id,
        active_availability_entry_id =
          EXCLUDED.active_availability_entry_id,
        reason = EXCLUDED.reason,
        request_message = EXCLUDED.request_message,
        status = EXCLUDED.status,
        requested_date = EXCLUDED.requested_date,
        requested_start_time = EXCLUDED.requested_start_time,
        requested_end_time = EXCLUDED.requested_end_time,
        meeting_method = EXCLUDED.meeting_method,
        location = EXCLUDED.location,
        response_note = EXCLUDED.response_note,
        reviewed_at = EXCLUDED.reviewed_at,
        reviewed_by_user_id = EXCLUDED.reviewed_by_user_id,
        created_at = EXCLUDED.created_at,
        updated_at = NOW()
      RETURNING id
    `,
    [
      entry.seedKey,
      fatherUserId,
      child.id,
      entry.availabilityEntryId ?? null,
      activeAvailabilityEntryId,
      entry.reason,
      entry.requestMessage ?? null,
      entry.status,
      entry.requestedDate,
      entry.requestedStartTime,
      entry.requestedEndTime,
      entry.meetingMethod,
      entry.location ?? null,
      entry.responseNote ?? null,
      reviewedAt,
      reviewedAt ? fatherUserId : null,
      new Date(entry.requestedAt),
    ],
  );

  const requestId = requestResult.rows[0]?.id;

  if (!requestId) {
    throw new Error(
      `Request ${entry.seedKey} could not be inserted.`,
    );
  }

  if (entry.status === "APPROVED") {
    await client.query(
      `
        INSERT INTO appointments (
          father_user_id,
          spiritual_child_id,
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
          $1, $2, $3, $4, $5, $6, 'CONFIRMED',
          $7, $8, $9, $10, $11, $12, NOW(), NOW()
        )
        ON CONFLICT (appointment_request_id)
        DO UPDATE SET
          father_user_id = EXCLUDED.father_user_id,
          spiritual_child_id = EXCLUDED.spiritual_child_id,
          availability_entry_id = EXCLUDED.availability_entry_id,
          active_availability_entry_id =
            EXCLUDED.active_availability_entry_id,
          reason = EXCLUDED.reason,
          status = 'CONFIRMED',
          schedule_date = EXCLUDED.schedule_date,
          start_time = EXCLUDED.start_time,
          end_time = EXCLUDED.end_time,
          meeting_method = EXCLUDED.meeting_method,
          location = EXCLUDED.location,
          notes = EXCLUDED.notes,
          updated_at = NOW()
      `,
      [
        fatherUserId,
        child.id,
        entry.availabilityEntryId ?? null,
        entry.availabilityEntryId ?? null,
        requestId,
        entry.reason,
        entry.requestedDate,
        entry.requestedStartTime,
        entry.requestedEndTime,
        entry.meetingMethod,
        entry.location ?? null,
        entry.responseNote ?? null,
      ],
    );
  } else {
    // Development seeds are repeatable. Changing an approved seed
    // back to another state removes its seeded appointment.
    await client.query(
      `
        DELETE FROM appointments
        WHERE appointment_request_id = $1
      `,
      [requestId],
    );
  }

  return {
    seedKey: entry.seedKey,
    childName: child.name,
    status: entry.status,
  };
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Appointment-request seeding is disabled in production.",
    );
  }

  const filePath = resolve(
    process.cwd(),
    "src/db/seed-data/appointment-requests.json",
  );

  const raw = await readFile(filePath, "utf8");
  const entries = seedFileSchema.parse(JSON.parse(raw));
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const inserted = [];

    for (const entry of entries) {
      inserted.push(await upsertSeedEntry(client, entry));
    }

    await client.query("COMMIT");

    console.table(inserted);
    console.log(
      `${inserted.length} appointment-request seed records are ready.`,
    );
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

main()
  .catch((error: unknown) => {
    console.error("Appointment-request seeding failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
