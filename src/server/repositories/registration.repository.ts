import "server-only";

import type { PoolClient } from "pg";

import { pool } from "@/lib/db";

export type RegistrationAccountType =
  | "SPIRITUAL_FATHER"
  | "SPIRITUAL_CHILD";

type RegistrationChallenge = {
  id: string;
  email: string;
  otpHash: string;
  accountType: RegistrationAccountType;
  fatherInvitationId: string | null;
  attemptCount: number;
  expiresAt: Date;
  verifiedAt: Date | null;
  consumedAt: Date | null;
  registrationTokenHash: string | null;
  registrationTokenExpiresAt: Date | null;
  createdAt: Date;
};

export async function userExistsByEmail(email: string) {
  const result = await pool.query(
    `
      SELECT 1
      FROM "user"
      WHERE email = $1
      LIMIT 1
    `,
    [email],
  );

  return result.rowCount === 1;
}

export async function countRecentChallengesByEmail(
  email: string,
  since: Date,
) {
  const result = await pool.query<{ count: string }>(
    `
      SELECT COUNT(*)::text AS count
      FROM registration_email_otps
      WHERE email = $1
        AND created_at >= $2
    `,
    [email, since],
  );

  return Number(result.rows[0]?.count ?? 0);
}

export async function countRecentChallengesByIp(
  requestIpHash: string,
  since: Date,
) {
  const result = await pool.query<{ count: string }>(
    `
      SELECT COUNT(*)::text AS count
      FROM registration_email_otps
      WHERE request_ip_hash = $1
        AND created_at >= $2
    `,
    [requestIpHash, since],
  );

  return Number(result.rows[0]?.count ?? 0);
}

export async function invalidateOpenChallenges(email: string) {
  await pool.query(
    `
      UPDATE registration_email_otps
      SET consumed_at = NOW(), updated_at = NOW()
      WHERE email = $1
        AND consumed_at IS NULL
    `,
    [email],
  );
}

export async function createRegistrationChallenge({
  accountType,
  email,
  expiresAt,
  fatherInvitationId,
  otpHash,
  requestIpHash,
}: {
  accountType: RegistrationAccountType;
  email: string;
  expiresAt: Date;
  fatherInvitationId: string | null;
  otpHash: string;
  requestIpHash: string | null;
}) {
  const result = await pool.query<{ id: string }>(
    `
      INSERT INTO registration_email_otps (
        email,
        otp_hash,
        account_type,
        father_invitation_id,
        request_ip_hash,
        expires_at
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `,
    [
      email,
      otpHash,
      accountType,
      fatherInvitationId,
      requestIpHash,
      expiresAt,
    ],
  );

  const id = result.rows[0]?.id;

  if (!id) {
    throw new Error("The registration challenge could not be created.");
  }

  return id;
}

export async function deleteRegistrationChallenge(id: string) {
  await pool.query(
    `DELETE FROM registration_email_otps WHERE id = $1`,
    [id],
  );
}

export async function findRegistrationChallenge(
  id: string,
  email: string,
) {
  const result = await pool.query<RegistrationChallenge>(
    `
      SELECT
        id,
        email,
        otp_hash AS "otpHash",
        account_type AS "accountType",
        father_invitation_id AS "fatherInvitationId",
        attempt_count AS "attemptCount",
        expires_at AS "expiresAt",
        verified_at AS "verifiedAt",
        consumed_at AS "consumedAt",
        registration_token_hash AS "registrationTokenHash",
        registration_token_expires_at AS "registrationTokenExpiresAt",
        created_at AS "createdAt"
      FROM registration_email_otps
      WHERE id = $1
        AND email = $2
      LIMIT 1
    `,
    [id, email],
  );

  return result.rows[0] ?? null;
}

export async function recordFailedVerificationAttempt(
  id: string,
  consumeChallenge: boolean,
) {
  await pool.query(
    `
      UPDATE registration_email_otps
      SET
        attempt_count = attempt_count + 1,
        consumed_at = CASE
          WHEN $2::boolean THEN NOW()
          ELSE consumed_at
        END,
        updated_at = NOW()
      WHERE id = $1
    `,
    [id, consumeChallenge],
  );
}

export async function markChallengeVerified({
  id,
  registrationTokenExpiresAt,
  registrationTokenHash,
}: {
  id: string;
  registrationTokenExpiresAt: Date;
  registrationTokenHash: string;
}) {
  await pool.query(
    `
      UPDATE registration_email_otps
      SET
        verified_at = NOW(),
        registration_token_hash = $2,
        registration_token_expires_at = $3,
        updated_at = NOW()
      WHERE id = $1
        AND consumed_at IS NULL
    `,
    [id, registrationTokenHash, registrationTokenExpiresAt],
  );
}

async function markUserRole(
  client: PoolClient,
  userId: string,
  email: string,
  accountType: RegistrationAccountType,
) {
  const result = await client.query<{ id: string }>(
    `
      UPDATE "user"
      SET
        "emailVerified" = TRUE,
        role = $3,
        "updatedAt" = NOW()
      WHERE id = $1
        AND email = $2
      RETURNING id
    `,
    [userId, email, accountType],
  );

  if (result.rowCount !== 1) {
    throw new Error("The Better Auth user could not be finalized.");
  }
}

export async function finalizeRegistration({
  accountType,
  challengeId,
  email,
  fatherInvitationId,
  userId,
}: {
  accountType: RegistrationAccountType;
  challengeId: string;
  email: string;
  fatherInvitationId: string | null;
  userId: string;
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await markUserRole(client, userId, email, accountType);

    if (accountType === "SPIRITUAL_FATHER") {
      if (!fatherInvitationId) {
        throw new Error("The Father invitation is missing.");
      }

      const invitationResult = await client.query<{ id: string }>(
        `
          UPDATE father_invitations
          SET
            used_at = NOW(),
            used_by_user_id = $2,
            updated_at = NOW()
          WHERE id = $1
            AND email = $3
            AND used_at IS NULL
            AND revoked_at IS NULL
            AND expires_at > NOW()
          RETURNING id
        `,
        [fatherInvitationId, userId, email],
      );

      if (invitationResult.rowCount !== 1) {
        throw new Error("The Father invitation is no longer valid.");
      }
    }

    const challengeResult = await client.query<{ id: string }>(
      `
        UPDATE registration_email_otps
        SET consumed_at = NOW(), updated_at = NOW()
        WHERE id = $1
          AND consumed_at IS NULL
        RETURNING id
      `,
      [challengeId],
    );

    if (challengeResult.rowCount !== 1) {
      throw new Error("The registration challenge was already consumed.");
    }

    await client.query("COMMIT");
    return userId;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteExpiredRegistrationChallenges() {
  await pool.query(
    `
      DELETE FROM registration_email_otps
      WHERE created_at < NOW() - INTERVAL '2 days'
    `,
  );
}
