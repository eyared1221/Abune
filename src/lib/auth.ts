import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";

import { pool } from "./db";

const betterAuthSecret = process.env.BETTER_AUTH_SECRET;
const betterAuthUrl = process.env.BETTER_AUTH_URL;

if (!betterAuthSecret) {
  throw new Error("BETTER_AUTH_SECRET is missing.");
}

if (!betterAuthUrl) {
  throw new Error("BETTER_AUTH_URL is missing.");
}

export const auth = betterAuth({
  appName: "Abune",
  database: pool,
  secret: betterAuthSecret,
  baseURL: betterAuthUrl,

  trustedOrigins: [betterAuthUrl],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
    maxPasswordLength: 128,
  },

  session: {
    // Session remains valid for seven days.
    expiresIn: 60 * 60 * 24 * 7,

    // Refresh session information after one day.
    updateAge: 60 * 60 * 24,
  },

  user: {
    additionalFields: {
      role: {
        type: [
          "SPIRITUAL_FATHER",
          "SPIRITUAL_CHILD",
        ],
        required: false,
        defaultValue: "SPIRITUAL_CHILD",

        input: false,
      },
    },
  },

  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 30,

      usernameValidator: (value) =>
        /^[a-zA-Z0-9_.]+$/.test(value),
    }),

    nextCookies(),
  ],
});

export type AuthSession = typeof auth.$Infer.Session;
