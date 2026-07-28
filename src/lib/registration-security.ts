import "server-only";

import {
  createHash,
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from "node:crypto";

const OTP_LENGTH = 6;

function getRegistrationOtpSecret() {
  const secret = process.env.REGISTRATION_OTP_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "REGISTRATION_OTP_SECRET must be configured with at least 32 characters.",
    );
  }

  return secret;
}

function hmac(value: string) {
  return createHmac("sha256", getRegistrationOtpSecret())
    .update(value)
    .digest("hex");
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function generateRegistrationOtp() {
  return randomInt(10 ** (OTP_LENGTH - 1), 10 ** OTP_LENGTH).toString();
}

export function hashRegistrationOtp(email: string, code: string) {
  return hmac(`otp:${normalizeEmail(email)}:${code}`);
}

export function generateRegistrationToken() {
  return randomBytes(32).toString("base64url");
}

export function hashRegistrationToken(token: string) {
  return hmac(`registration-token:${token}`);
}

export function generateFatherInvitationToken() {
  return randomBytes(32).toString("base64url");
}

export function hashFatherInvitationToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function hashRequestIp(ipAddress: string | null) {
  return ipAddress ? hmac(`ip:${ipAddress}`) : null;
}

export function secureHashEquals(expected: string, actual: string) {
  const expectedBuffer = Buffer.from(expected, "hex");
  const actualBuffer = Buffer.from(actual, "hex");

  return (
    expectedBuffer.length === actualBuffer.length &&
    timingSafeEqual(expectedBuffer, actualBuffer)
  );
}
