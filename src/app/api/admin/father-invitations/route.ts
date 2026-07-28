import { NextResponse } from "next/server";
import { z } from "zod";

import {
  ADMIN_INVITE_HEADER,
  isValidAdminInviteSecret,
} from "@/lib/admin-invite";
import { sendSpiritualFatherInvitationEmail } from "@/lib/email";
import {
  generateFatherInvitationToken,
  hashFatherInvitationToken,
  normalizeEmail,
} from "@/lib/registration-security";
import {
  createFatherInvitation,
  deleteExpiredFatherInvitations,
  deleteFatherInvitation,
  invalidateOpenFatherInvitations,
} from "@/server/repositories/father-invitation.repository";
import { userExistsByEmail } from "@/server/repositories/registration.repository";

export const runtime = "nodejs";

const requestSchema = z.object({
  email: z.string().trim().email().max(320),
  name: z.string().trim().min(2).max(200).optional(),
  locale: z.enum(["en", "am"]).default("en"),
});

const INVITATION_EXPIRES_IN_DAYS = 7;

function errorResponse(
  code: string,
  message: string,
  status: number,
) {
  return NextResponse.json({ code, message }, { status });
}

function getPublicAppUrl() {
  const value =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.BETTER_AUTH_URL?.trim();

  if (!value) {
    throw new Error(
      "NEXT_PUBLIC_APP_URL or BETTER_AUTH_URL must be configured.",
    );
  }

  return value.replace(/\/$/, "");
}

export async function POST(request: Request) {
  const suppliedSecret = request.headers.get(ADMIN_INVITE_HEADER);

  if (!isValidAdminInviteSecret(suppliedSecret)) {
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
      parsed.error.issues[0]?.message ?? "Invalid invitation data.",
      400,
    );
  }

  const email = normalizeEmail(parsed.data.email);
  const invitedName = parsed.data.name?.trim() || null;

  if (await userExistsByEmail(email)) {
    return errorResponse(
      "ACCOUNT_EXISTS",
      "An account already exists with this email.",
      409,
    );
  }

  const token = generateFatherInvitationToken();
  const tokenHash = hashFatherInvitationToken(token);
  const expiresAt = new Date(
    Date.now() + INVITATION_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
  );

  await invalidateOpenFatherInvitations(email);

  const invitationId = await createFatherInvitation({
    email,
    expiresAt,
    invitedName,
    tokenHash,
  });

  const invitationUrl = `${getPublicAppUrl()}/${parsed.data.locale}/register/father/invitation?token=${encodeURIComponent(token)}`;

  try {
    await sendSpiritualFatherInvitationEmail({
      email,
      expiresAt,
      invitationUrl,
      invitedName,
    });
  } catch (error) {
    await deleteFatherInvitation(invitationId);
    console.error("Spiritual Father invitation email failed:", error);

    return errorResponse(
      "EMAIL_SEND_FAILED",
      "The invitation email could not be sent.",
      503,
    );
  }

  void deleteExpiredFatherInvitations().catch((error) => {
    console.error("Expired Father invitation cleanup failed:", error);
  });

  return NextResponse.json(
    {
      message: "Spiritual Father invitation sent successfully.",
      email,
      expiresAt: expiresAt.toISOString(),
    },
    { status: 201 },
  );
}
