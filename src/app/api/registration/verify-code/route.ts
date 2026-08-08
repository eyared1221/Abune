import { NextResponse } from "next/server";
import { z } from "zod";

import {
  generateRegistrationToken,
  hashRegistrationOtp,
  hashRegistrationToken,
  normalizeEmail,
  secureHashEquals,
} from "@/lib/registration-security";
import { isTrustedRegistrationRequest } from "@/lib/request-security";
import {
  findRegistrationChallenge,
  markChallengeVerified,
  recordFailedVerificationAttempt,
} from "@/server/repositories/registration.repository";
import { validateFatherInvitation } from "@/server/services/father-invitation.service";

export const runtime = "nodejs";

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

const requestSchema = z.object({
  challengeId: z.string().uuid(),
  email: z.string().trim().email().max(320),
  code: z.string().regex(/^\d{6}$/),
  invitationToken: z.string().trim().min(32).max(512).optional(),
});

const MAX_ATTEMPTS = 5;
const REGISTRATION_TOKEN_EXPIRES_IN_SECONDS = 15 * 60;

function errorResponse(
  code: string,
  message: string,
  status: number,
) {
  return NextResponse.json({ code, message }, { status });
}

function invitationError(code: string) {
  switch (code) {
    case "INVITATION_REQUIRED":
      return errorResponse(code, "A Father invitation is required.", 400);
    case "INVITATION_EXPIRED":
      return errorResponse(code, "The Father invitation has expired.", 410);
    case "INVITATION_USED":
      return errorResponse(code, "The Father invitation was already used.", 409);
    case "INVITATION_REVOKED":
      return errorResponse(code, "The Father invitation was revoked.", 410);
    case "INVITATION_EMAIL_MISMATCH":
      return errorResponse(
        code,
        "The email does not match the Father invitation.",
        400,
      );
    default:
      return errorResponse(
        "INVALID_INVITATION",
        "The Father invitation is invalid.",
        400,
      );
  }
}

export async function POST(request: Request) {
  if (!isTrustedRegistrationRequest(request)) {
    return errorResponse("FORBIDDEN", "The request was rejected.", 403);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("INVALID_INPUT", "Invalid request body.", 400);
  }

  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse(
      "INVALID_INPUT",
      "Enter the six-digit verification code.",
      400,
    );
  }

  const email = normalizeEmail(parsed.data.email);
  const challenge = await findRegistrationChallenge(
    parsed.data.challengeId,
    email,
  );

  if (!challenge || challenge.consumedAt) {
    return errorResponse(
      "INVALID_CODE",
      "The verification code is invalid.",
      400,
    );
  }

  if (challenge.accountType === "SPIRITUAL_FATHER") {
    const validation = await validateFatherInvitation({
      email,
      expectedInvitationId: challenge.fatherInvitationId,
      token: parsed.data.invitationToken,
    });

    if (!validation.ok) {
      return invitationError(validation.code);
    }
  } else if (parsed.data.invitationToken) {
    return invitationError("INVALID_INVITATION");
  }

  if (challenge.expiresAt.getTime() <= Date.now()) {
    return errorResponse(
      "CODE_EXPIRED",
      "The verification code has expired.",
      400,
    );
  }

  if (challenge.verifiedAt) {
    return errorResponse(
      "CODE_ALREADY_VERIFIED",
      "This code has already been verified.",
      409,
    );
  }

  if (challenge.attemptCount >= MAX_ATTEMPTS) {
    return errorResponse(
      "TOO_MANY_ATTEMPTS",
      "Too many incorrect attempts were made.",
      429,
    );
  }

  const submittedHash = hashRegistrationOtp(email, parsed.data.code);

  if (!secureHashEquals(challenge.otpHash, submittedHash)) {
    const nextAttemptCount = challenge.attemptCount + 1;

    await recordFailedVerificationAttempt(
      challenge.id,
      nextAttemptCount >= MAX_ATTEMPTS,
    );

    return errorResponse(
      nextAttemptCount >= MAX_ATTEMPTS
        ? "TOO_MANY_ATTEMPTS"
        : "INVALID_CODE",
      nextAttemptCount >= MAX_ATTEMPTS
        ? "Too many incorrect attempts were made."
        : "The verification code is invalid.",
      nextAttemptCount >= MAX_ATTEMPTS ? 429 : 400,
    );
  }

  const registrationToken = generateRegistrationToken();
  const registrationTokenHash = hashRegistrationToken(registrationToken);
  const registrationTokenExpiresAt = new Date(
    Date.now() + REGISTRATION_TOKEN_EXPIRES_IN_SECONDS * 1000,
  );

  await markChallengeVerified({
    id: challenge.id,
    registrationTokenExpiresAt,
    registrationTokenHash,
  });

  return NextResponse.json({
    registrationToken,
    expiresInSeconds: REGISTRATION_TOKEN_EXPIRES_IN_SECONDS,
  });
}
