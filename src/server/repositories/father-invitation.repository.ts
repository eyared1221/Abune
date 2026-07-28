import "server-only";

import { pool } from "@/lib/db";

export type FatherInvitation = {
  id: string;
  email: string;
  invitedName: string | null;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
  usedByUserId: string | null;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const invitationSelect = `
  SELECT
    id,
    email,
    invited_name AS "invitedName",
    token_hash AS "tokenHash",
    expires_at AS "expiresAt",
    used_at AS "usedAt",
    used_by_user_id AS "usedByUserId",
    revoked_at AS "revokedAt",
    created_at AS "createdAt",
    updated_at AS "updatedAt"
  FROM father_invitations
`;

export async function findFatherInvitationByTokenHash(
  tokenHash: string,
) {
  const result = await pool.query<FatherInvitation>(
    `${invitationSelect}
     WHERE token_hash = $1
     LIMIT 1`,
    [tokenHash],
  );

  return result.rows[0] ?? null;
}

export async function findFatherInvitationById(id: string) {
  const result = await pool.query<FatherInvitation>(
    `${invitationSelect}
     WHERE id = $1
     LIMIT 1`,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function invalidateOpenFatherInvitations(email: string) {
  await pool.query(
    `
      UPDATE father_invitations
      SET revoked_at = NOW(), updated_at = NOW()
      WHERE email = $1
        AND used_at IS NULL
        AND revoked_at IS NULL
    `,
    [email],
  );
}

export async function createFatherInvitation({
  email,
  expiresAt,
  invitedName,
  tokenHash,
}: {
  email: string;
  expiresAt: Date;
  invitedName: string | null;
  tokenHash: string;
}) {
  const result = await pool.query<{ id: string }>(
    `
      INSERT INTO father_invitations (
        email,
        invited_name,
        token_hash,
        expires_at
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `,
    [email, invitedName, tokenHash, expiresAt],
  );

  const id = result.rows[0]?.id;

  if (!id) {
    throw new Error("The Spiritual Father invitation could not be created.");
  }

  return id;
}

export async function deleteFatherInvitation(id: string) {
  await pool.query(`DELETE FROM father_invitations WHERE id = $1`, [id]);
}

export async function deleteExpiredFatherInvitations() {
  await pool.query(
    `
      DELETE FROM father_invitations
      WHERE created_at < NOW() - INTERVAL '30 days'
        AND (
          expires_at < NOW()
          OR used_at IS NOT NULL
          OR revoked_at IS NOT NULL
        )
    `,
  );
}
