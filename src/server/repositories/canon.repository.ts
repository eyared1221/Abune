import "server-only";

import type {
  CreateCanonInput,
  FatherCanonListItem,
  UpdateCanonInput,
} from "@/contracts/canon";
import { pool } from "@/lib/db";

export class CanonAppointmentNotFoundError extends Error {
  constructor() {
    super("The completed appointment was not found.");
    this.name = "CanonAppointmentNotFoundError";
  }
}

export class CanonNotFoundError extends Error {
  constructor() {
    super("The canon was not found.");
    this.name = "CanonNotFoundError";
  }
}

const childNameSql = `
  COALESCE(
    NULLIF(u.name, ''),
    NULLIF(to_jsonb(sc)->>'legal_name', ''),
    NULLIF(to_jsonb(sc)->>'legalName', ''),
    NULLIF(to_jsonb(sc)->>'baptismal_name', ''),
    NULLIF(to_jsonb(sc)->>'baptismalName', ''),
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

type CanonDatabaseRow = Omit<FatherCanonListItem, "createdAt"> & {
  createdAt: Date;
};

export async function listCanonsForFather(
  fatherUserId: string,
): Promise<FatherCanonListItem[]> {
  const result = await pool.query<CanonDatabaseRow>(
    `
      SELECT
        c.id,
        ${childNameSql} AS "childName",
        ${childPhoneSql} AS "childPhone",
        c.fetha_date::text AS "fethaDate",
        c.fetha_time AS "fethaTime",
        a.schedule_date::text AS "appointmentDate",
        a.start_time AS "appointmentStartTime",
        a.end_time AS "appointmentEndTime",
        COALESCE(
          array_agg(ct.guidance ORDER BY ct.created_at)
            FILTER (WHERE ct.guidance IS NOT NULL),
          ARRAY[]::text[]
        ) AS tasks,
        c.created_at AS "createdAt"
      FROM canons AS c
      LEFT JOIN "user" AS u
        ON u.id = c.child_user_id
      LEFT JOIN spiritual_children AS sc
        ON sc.id = c.spiritual_child_id
      INNER JOIN appointments AS a
        ON a.id = c.appointment_id
      LEFT JOIN canon_tasks AS ct
        ON ct.canon_id = c.id
      WHERE c.father_user_id = $1
      GROUP BY c.id, u.id, sc.id, a.id
      ORDER BY c.created_at DESC
    `,
    [fatherUserId],
  );

  return result.rows.map((canon) => ({
    ...canon,
    createdAt: canon.createdAt.toISOString(),
  }));
}

export async function createCanonForFather({
  fatherUserId,
  input,
}: {
  fatherUserId: string;
  input: CreateCanonInput;
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const appointmentResult = await client.query<{
      childUserId: string | null;
      spiritualChildId: string | null;
    }>(
      `
        SELECT
          child_user_id AS "childUserId",
          spiritual_child_id AS "spiritualChildId"
        FROM appointments
        WHERE id = $1
          AND father_user_id = $2
          AND status = 'COMPLETED'
        FOR UPDATE
      `,
      [input.appointmentId, fatherUserId],
    );
    const appointment = appointmentResult.rows[0];

    if (!appointment) {
      throw new CanonAppointmentNotFoundError();
    }

    const canonResult = await client.query<{ id: string }>(
      `
        INSERT INTO canons (
          father_user_id,
          spiritual_child_id,
          child_user_id,
          appointment_id,
          fetha_date,
          fetha_time,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING id
      `,
      [
        fatherUserId,
        appointment.spiritualChildId,
        appointment.childUserId,
        input.appointmentId,
        input.fethaDate,
        input.fethaTime,
      ],
    );
    const canon = canonResult.rows[0];

    for (const guidance of input.tasks) {
      await client.query(
        `
          INSERT INTO canon_tasks (canon_id, guidance, is_completed, created_at)
          VALUES ($1, $2, FALSE, NOW())
        `,
        [canon.id, guidance],
      );
    }

    await client.query("COMMIT");
    return { id: canon.id };
  } catch (error: unknown) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function updateCanonForFather({
  canonId,
  fatherUserId,
  input,
}: {
  canonId: string;
  fatherUserId: string;
  input: UpdateCanonInput;
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const canonResult = await client.query<{ id: string }>(
      `
        SELECT id
        FROM canons
        WHERE id = $1
          AND father_user_id = $2
        FOR UPDATE
      `,
      [canonId, fatherUserId],
    );
    if (!canonResult.rows[0]) {
      throw new CanonNotFoundError();
    }

    await client.query(
      `
        UPDATE canons
        SET fetha_date = $3, fetha_time = $4, updated_at = NOW()
        WHERE id = $1 AND father_user_id = $2
      `,
      [canonId, fatherUserId, input.fethaDate, input.fethaTime],
    );
    await client.query("DELETE FROM canon_tasks WHERE canon_id = $1", [canonId]);
    for (const guidance of input.tasks) {
      await client.query(
        `INSERT INTO canon_tasks (canon_id, guidance, is_completed, created_at)
         VALUES ($1, $2, FALSE, NOW())`,
        [canonId, guidance],
      );
    }
    await client.query("COMMIT");
    return { id: canonId, ...input };
  } catch (error: unknown) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteCanonForFather(
  canonId: string,
  fatherUserId: string,
) {
  const result = await pool.query(
    "DELETE FROM canons WHERE id = $1 AND father_user_id = $2",
    [canonId, fatherUserId],
  );
  if (result.rowCount !== 1) {
    throw new CanonNotFoundError();
  }
}
