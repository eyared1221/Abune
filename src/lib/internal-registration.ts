import "server-only";

import { timingSafeEqual } from "node:crypto";

export const INTERNAL_REGISTRATION_HEADER =
  "x-abune-registration-secret";

export function getInternalRegistrationSecret() {
  const secret = process.env.INTERNAL_REGISTRATION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "INTERNAL_REGISTRATION_SECRET must be configured with at least 32 characters.",
    );
  }

  return secret;
}

export function isValidInternalRegistrationSecret(
  candidate: string | null | undefined,
) {
  if (!candidate) {
    return false;
  }

  const expected = getInternalRegistrationSecret();
  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);

  return (
    candidateBuffer.length === expectedBuffer.length &&
    timingSafeEqual(candidateBuffer, expectedBuffer)
  );
}
