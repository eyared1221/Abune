import { NextResponse } from "next/server";
import { z } from "zod";

import { sendRegistrationVerificationCode } from "@/lib/email";
import {
  generateRegistrationOtp,
  hashRegistrationOtp,
  hashRequestIp,
  normalizeEmail,
} from "@/lib/registration-security";
import {
  getRequestIp,
  isTrustedRegistrationRequest,
} from "@/lib/request-security";
import {
  countRecentChallengesByEmail,
  countRecentChallengesByIp,
  createRegistrationChallenge,
  deleteExpiredRegistrationChallenges,
  deleteRegistrationChallenge,
  invalidateOpenChallenges,
  userExistsByEmail,
  type RegistrationAccountType,
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
  email: z.string().trim().email().max(320),
  invitationToken: z.string().trim().min(32).max(512).optional(),
});

const CODE_EXPIRES_IN_SECONDS = 10 * 60;
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_EMAIL_SENDS_PER_HOUR = 5;
const MAX_IP_SENDS_PER_HOUR = 20;

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
      "Enter a valid email address.",
      400,
    );
  }

  const email = normalizeEmail(parsed.data.email);
  let accountType: RegistrationAccountType = "SPIRITUAL_CHILD";
  let fatherInvitationId: string | null = null;

  if (parsed.data.invitationToken) {
    const validation = await validateFatherInvitation({
      email,
      token: parsed.data.invitationToken,
    });

    if (!validation.ok) {
      return invitationError(validation.code);
    }

    accountType = "SPIRITUAL_FATHER";
    fatherInvitationId = validation.invitation.id;
  }

  if (await userExistsByEmail(email)) {
    return errorResponse(
      "ACCOUNT_EXISTS",
      "An account already exists with this email.",
      409,
    );
  }

  const now = Date.now();
  const minuteAgo = new Date(now - RESEND_COOLDOWN_SECONDS * 1000);
  const hourAgo = new Date(now - 60 * 60 * 1000);

  const recentlySent = await countRecentChallengesByEmail(
    email,
    minuteAgo,
  );

  if (recentlySent > 0) {
    return errorResponse(
      "RESEND_COOLDOWN",
      "Please wait before requesting another code.",
      429,
    );
  }

  const emailHourlyCount = await countRecentChallengesByEmail(
    email,
    hourAgo,
  );

  if (emailHourlyCount >= MAX_EMAIL_SENDS_PER_HOUR) {
    return errorResponse(
      "RATE_LIMITED",
      "Too many codes were requested. Please try again later.",
      429,
    );
  }

  const requestIpHash = hashRequestIp(getRequestIp(request));

  if (requestIpHash) {
    const ipHourlyCount = await countRecentChallengesByIp(
      requestIpHash,
      hourAgo,
    );

    if (ipHourlyCount >= MAX_IP_SENDS_PER_HOUR) {
      return errorResponse(
        "RATE_LIMITED",
        "Too many codes were requested. Please try again later.",
        429,
      );
    }
  }

  const code = generateRegistrationOtp();
  const otpHash = hashRegistrationOtp(email, code);
  const expiresAt = new Date(
    now + CODE_EXPIRES_IN_SECONDS * 1000,
  );

  await invalidateOpenChallenges(email);

  const challengeId = await createRegistrationChallenge({
    accountType,
    email,
    expiresAt,
    fatherInvitationId,
    otpHash,
    requestIpHash,
  });

  try {
    await sendRegistrationVerificationCode({
      accountType,
      code,
      email,
    });
  } catch (error) {
    await deleteRegistrationChallenge(challengeId);
    console.error("Registration email could not be sent:", error);

    return errorResponse(
      "EMAIL_SEND_FAILED",
      "The verification email could not be sent.",
      503,
    );
  }

  void deleteExpiredRegistrationChallenges().catch((error) => {
    console.error("Expired OTP cleanup failed:", error);
  });

  return NextResponse.json({
    challengeId,
    expiresInSeconds: CODE_EXPIRES_IN_SECONDS,
    resendAfterSeconds: RESEND_COOLDOWN_SECONDS,
  });
}
