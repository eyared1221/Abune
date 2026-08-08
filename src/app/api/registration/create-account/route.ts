import { isAPIError } from "better-auth/api";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import {
  getInternalRegistrationSecret,
  INTERNAL_REGISTRATION_HEADER,
} from "@/lib/internal-registration";
import {
  hashRegistrationToken,
  normalizeEmail,
  secureHashEquals,
} from "@/lib/registration-security";
import { isTrustedRegistrationRequest } from "@/lib/request-security";
import {
  finalizeRegistration,
  findRegistrationChallenge,
  userExistsByEmail,
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

const requestSchema = z
  .object({
    challengeId: z.string().uuid(),
    registrationToken: z.string().min(32).max(256),
    baptismalName: z.string().trim().min(2).max(160),
    email: z.string().trim().email().max(320),
    password: z.string().min(10).max(128),
    confirmPassword: z.string().min(10).max(128),
    invitationToken: z.string().trim().min(32).max(512).optional(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

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
      parsed.error.issues[0]?.message ?? "Invalid registration data.",
      400,
    );
  }

  const email = normalizeEmail(parsed.data.email);
  const challenge = await findRegistrationChallenge(
    parsed.data.challengeId,
    email,
  );

  if (
    !challenge ||
    challenge.consumedAt ||
    !challenge.verifiedAt ||
    !challenge.registrationTokenHash ||
    !challenge.registrationTokenExpiresAt
  ) {
    return errorResponse(
      "VERIFICATION_REQUIRED",
      "Verify your email before creating an account.",
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

  if (challenge.registrationTokenExpiresAt.getTime() <= Date.now()) {
    return errorResponse(
      "REGISTRATION_TOKEN_EXPIRED",
      "Your verified registration session has expired.",
      400,
    );
  }

  const submittedTokenHash = hashRegistrationToken(
    parsed.data.registrationToken,
  );

  if (
    !secureHashEquals(
      challenge.registrationTokenHash,
      submittedTokenHash,
    )
  ) {
    return errorResponse(
      "INVALID_REGISTRATION_TOKEN",
      "The registration verification is invalid.",
      400,
    );
  }

  if (await userExistsByEmail(email)) {
    return errorResponse(
      "ACCOUNT_EXISTS",
      "An account already exists with this email.",
      409,
    );
  }

  try {
    const signUpResult = await auth.api.signUpEmail({
      body: {
        name: parsed.data.baptismalName,
        email,
        password: parsed.data.password,
      },
      headers: new Headers({
        [INTERNAL_REGISTRATION_HEADER]:
          getInternalRegistrationSecret(),
      }),
    });

    const createdUserId = signUpResult.user?.id;

    if (!createdUserId) {
      throw new Error("Better Auth did not return a created user.");
    }

    await finalizeRegistration({
      accountType: challenge.accountType,
      challengeId: challenge.id,
      email,
      fatherInvitationId: challenge.fatherInvitationId,
      userId: createdUserId,
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
        role: challenge.accountType,
      },
      { status: 201 },
    );
  } catch (error) {
    if (isAPIError(error)) {
      console.error("Better Auth registration error:", {
        status: error.status,
        message: error.message,
      });
    } else {
      console.error("Account creation failed:", error);
    }

    return errorResponse(
      "ACCOUNT_CREATE_FAILED",
      "The account could not be created. Please try again.",
      500,
    );
  }
}
