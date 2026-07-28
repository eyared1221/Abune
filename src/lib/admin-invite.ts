import "server-only";

import { timingSafeEqual } from "node:crypto";

export const ADMIN_INVITE_HEADER = "x-admin-invite-secret";

export function getAdminInviteSecret() {
  const secret = process.env.ADMIN_INVITE_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_INVITE_SECRET must be configured with at least 32 characters.",
    );
  }

  return secret;
}

export function isValidAdminInviteSecret(
  candidate: string | null | undefined,
) {
  if (!candidate) {
    return false;
  }

  const expectedBuffer = Buffer.from(getAdminInviteSecret());
  const candidateBuffer = Buffer.from(candidate);

  return (
    expectedBuffer.length === candidateBuffer.length &&
    timingSafeEqual(expectedBuffer, candidateBuffer)
  );
}
