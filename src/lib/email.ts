import "server-only";

import nodemailer, { type Transporter } from "nodemailer";

const globalForEmail = globalThis as unknown as {
  abuneEmailTransporter?: Transporter;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getEmailSettings() {
  const user = process.env.GMAIL_USER?.trim();
  const appPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  const fromName = process.env.EMAIL_FROM_NAME?.trim() || "Abune";

  if (!user || !appPassword) {
    throw new Error(
      "GMAIL_USER and GMAIL_APP_PASSWORD must be configured before sending email.",
    );
  }

  return { user, appPassword, fromName };
}

function getTransporter() {
  if (globalForEmail.abuneEmailTransporter) {
    return globalForEmail.abuneEmailTransporter;
  }

  const { user, appPassword } = getEmailSettings();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass: appPassword,
    },
  });

  if (process.env.NODE_ENV !== "production") {
    globalForEmail.abuneEmailTransporter = transporter;
  }

  return transporter;
}

export async function sendRegistrationVerificationCode({
  accountType = "SPIRITUAL_CHILD",
  code,
  email,
}: {
  accountType?: "SPIRITUAL_FATHER" | "SPIRITUAL_CHILD";
  code: string;
  email: string;
}) {
  const { user, fromName } = getEmailSettings();
  const isFather = accountType === "SPIRITUAL_FATHER";
  const accountLabel = isFather
    ? "Spiritual Father account"
    : "Spiritual Child account";

  await getTransporter().sendMail({
    from: {
      name: fromName,
      address: user,
    },
    to: email,
    subject: "Your Abune verification code",
    text: [
      `Use this verification code to continue creating your ${accountLabel}:`,
      "",
      code,
      "",
      "This code expires in 10 minutes.",
      "If you did not request this code, you can ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;background:#fffaf1;padding:32px;color:#17223f">
        <div style="max-width:520px;margin:0 auto;background:#fffdf8;border:1px solid #e8d4aa;border-radius:20px;padding:32px;text-align:center">
          <h1 style="margin:0;color:#18335f;font-size:26px">Abune Email Verification</h1>
          <p style="margin:18px 0 8px;color:#68738a;line-height:1.6">
            Use the code below to continue creating your ${escapeHtml(accountLabel)}.
          </p>
          <div style="margin:24px auto;padding:16px 24px;max-width:260px;border-radius:14px;background:#fff5de;border:1px solid #ddb84f;color:#9b6714;font-size:34px;font-weight:700;letter-spacing:10px">
            ${code}
          </div>
          <p style="margin:0;color:#7d899a;font-size:14px">This code expires in 10 minutes.</p>
          <p style="margin:16px 0 0;color:#9a9ca2;font-size:12px">
            If you did not request this code, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendSpiritualFatherInvitationEmail({
  email,
  expiresAt,
  invitationUrl,
  invitedName,
}: {
  email: string;
  expiresAt: Date;
  invitationUrl: string;
  invitedName: string | null;
}) {
  const { user, fromName } = getEmailSettings();
  const greeting = invitedName?.trim()
    ? `Dear ${invitedName.trim()},`
    : "Dear Father,";
  const expiryText = expiresAt.toUTCString();
  const safeInvitationUrl = escapeHtml(invitationUrl);

  await getTransporter().sendMail({
    from: {
      name: fromName,
      address: user,
    },
    to: email,
    subject: "Invitation to create your Abune Spiritual Father account",
    text: [
      greeting,
      "",
      "You have been invited to create a Spiritual Father account on Abune.",
      "Open the secure invitation link below and select Register Now:",
      invitationUrl,
      "",
      `This invitation expires on ${expiryText} and can only be used once.`,
      "If you were not expecting this invitation, you can ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;background:#fffaf1;padding:32px;color:#17223f">
        <div style="max-width:560px;margin:0 auto;background:#fffdf8;border:1px solid #e8d4aa;border-radius:22px;padding:34px;text-align:center">
          <div style="font-size:34px;color:#c98d21;margin-bottom:10px">✣</div>
          <h1 style="margin:0;color:#18335f;font-size:27px">Spiritual Father Registration Invitation</h1>
          <p style="margin:20px 0 10px;color:#465675;font-weight:700">${escapeHtml(greeting)}</p>
          <p style="margin:0 auto 24px;max-width:440px;color:#68738a;line-height:1.7">
            You have been invited to create a Spiritual Father account on Abune. Open the secure invitation page and continue with email verification and password creation.
          </p>
          <a
            href="${safeInvitationUrl}"
            style="display:inline-block;margin:4px 0 24px;padding:14px 26px;border-radius:13px;background:#c98d21;color:#ffffff;text-decoration:none;font-weight:700"
          >
            Open Registration
          </a>
          <p style="margin:0;color:#7d899a;font-size:14px">
            This invitation expires on ${escapeHtml(expiryText)} and can only be used once.
          </p>
          <p style="margin:16px 0 0;color:#9a9ca2;font-size:12px">
            If you were not expecting this invitation, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail({
  email,
  resetUrl,
}: {
  email: string;
  resetUrl: string;
}) {
  const { user, fromName } = getEmailSettings();
  const safeResetUrl = escapeHtml(resetUrl);

  await getTransporter().sendMail({
    from: {
      name: fromName,
      address: user,
    },
    to: email,
    subject: "Reset your Abune password",
    text: [
      "A password reset was requested for your Abune account.",
      "",
      "Open this secure link to create a new password:",
      resetUrl,
      "",
      "This link expires in one hour and can only be used once.",
      "If you did not request a password reset, you can ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;background:#fffaf1;padding:32px;color:#17223f">
        <div style="max-width:520px;margin:0 auto;background:#fffdf8;border:1px solid #e8d4aa;border-radius:20px;padding:32px;text-align:center">
          <h1 style="margin:0;color:#18335f;font-size:26px">Reset Your Abune Password</h1>
          <p style="margin:18px 0;color:#68738a;line-height:1.6">
            A password reset was requested for your Abune account. Use the secure button below to create a new password.
          </p>
          <a
            href="${safeResetUrl}"
            style="display:inline-block;margin:10px 0 22px;padding:14px 24px;border-radius:12px;background:#c98d21;color:#ffffff;text-decoration:none;font-weight:700"
          >
            Reset Password
          </a>
          <p style="margin:0;color:#7d899a;font-size:14px">
            This link expires in one hour and can only be used once.
          </p>
          <p style="margin:16px 0 0;color:#9a9ca2;font-size:12px">
            If you did not request a password reset, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });
}
