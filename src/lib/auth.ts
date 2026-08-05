import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { after } from "next/server";
import { bearer, username } from "better-auth/plugins";

import {
  isValidInternalRegistrationSecret,
  INTERNAL_REGISTRATION_HEADER,
} from "./internal-registration";
import { pool } from "./db";
import { sendPasswordResetEmail } from "./email";

const betterAuthSecret = process.env.BETTER_AUTH_SECRET;
const betterAuthUrl = process.env.BETTER_AUTH_URL;
const publicAppUrl = process.env.NEXT_PUBLIC_APP_URL;

if (!betterAuthSecret) {
  throw new Error("BETTER_AUTH_SECRET is missing.");
}

if (!betterAuthUrl) {
  throw new Error("BETTER_AUTH_URL is missing.");
}

// Capacitor Android serves the bundled app from https://localhost.  Older
// Capacitor configurations can use capacitor://localhost, so retain both.
// These are local application origins, not publicly hosted web origins.
const trustedOrigins = [
  betterAuthUrl,
  "http://localhost",
  "https://localhost",
  "capacitor://localhost",
];

if (publicAppUrl && publicAppUrl !== betterAuthUrl) {
  trustedOrigins.push(publicAppUrl);
}

export const auth = betterAuth({
  appName: "Abune",
  database: pool,
  secret: betterAuthSecret,
  baseURL: betterAuthUrl,
  trustedOrigins,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
    maxPasswordLength: 128,

    // Registration finishes on the success screen, then the user signs in.
    autoSignIn: false,

    // Password-reset links remain valid for one hour.
    resetPasswordTokenExpiresIn: 60 * 60,

    // Sign out any other devices after a successful password reset.
    revokeSessionsOnPasswordReset: true,

    sendResetPassword: async ({ user, url }) => {
      // Send after the response so the endpoint does not reveal whether an
      // email exists through noticeably different response times.
      after(async () => {
        try {
          await sendPasswordResetEmail({
            email: user.email,
            resetUrl: url,
          });
        } catch (error) {
          console.error("Password-reset email failed:", error);
        }
      });
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  user: {
    additionalFields: {
      role: {
        type: ["SPIRITUAL_FATHER", "SPIRITUAL_CHILD"],
        required: false,
        defaultValue: "SPIRITUAL_CHILD",
        input: false,
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") {
        return;
      }

      const internalSecret = ctx.headers?.get(
        INTERNAL_REGISTRATION_HEADER,
      );

      if (!isValidInternalRegistrationSecret(internalSecret)) {
        throw new APIError("FORBIDDEN", {
          message: "Direct public sign-up is not allowed.",
        });
      }
    }),
  },

  plugins: [
    // Enables bearer-token sessions for the Capacitor mobile client while
    // preserving the web portal's existing cookie-based sessions.
    bearer(),

    username({
      minUsernameLength: 3,
      maxUsernameLength: 30,
      usernameValidator: (value) =>
        /^[a-zA-Z0-9_.]+$/.test(value),
    }),

    // Keep this plugin last.
    nextCookies(),
  ],
});

export type AuthSession = typeof auth.$Infer.Session;
