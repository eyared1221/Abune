import "server-only";

import {
  hashFatherInvitationToken,
  normalizeEmail,
  secureHashEquals,
} from "@/lib/registration-security";
import {
  findFatherInvitationById,
  findFatherInvitationByTokenHash,
  type FatherInvitation,
} from "@/server/repositories/father-invitation.repository";

export type FatherInvitationErrorCode =
  | "INVITATION_REQUIRED"
  | "INVALID_INVITATION"
  | "INVITATION_EXPIRED"
  | "INVITATION_USED"
  | "INVITATION_REVOKED"
  | "INVITATION_EMAIL_MISMATCH";

export type FatherInvitationValidation =
  | {
      ok: true;
      invitation: FatherInvitation;
    }
  | {
      ok: false;
      code: FatherInvitationErrorCode;
    };

export async function validateFatherInvitation({
  email,
  expectedInvitationId,
  token,
}: {
  email?: string;
  expectedInvitationId?: string | null;
  token?: string | null;
}): Promise<FatherInvitationValidation> {
  const normalizedToken = token?.trim();

  if (!normalizedToken) {
    return { ok: false, code: "INVITATION_REQUIRED" };
  }

  const tokenHash = hashFatherInvitationToken(normalizedToken);
  const invitation = expectedInvitationId
    ? await findFatherInvitationById(expectedInvitationId)
    : await findFatherInvitationByTokenHash(tokenHash);

  if (!invitation) {
    return { ok: false, code: "INVALID_INVITATION" };
  }

  if (!secureHashEquals(invitation.tokenHash, tokenHash)) {
    return { ok: false, code: "INVALID_INVITATION" };
  }

  if (invitation.revokedAt) {
    return { ok: false, code: "INVITATION_REVOKED" };
  }

  if (invitation.usedAt) {
    return { ok: false, code: "INVITATION_USED" };
  }

  if (invitation.expiresAt.getTime() <= Date.now()) {
    return { ok: false, code: "INVITATION_EXPIRED" };
  }

  if (email && invitation.email !== normalizeEmail(email)) {
    return { ok: false, code: "INVITATION_EMAIL_MISMATCH" };
  }

  return { ok: true, invitation };
}
