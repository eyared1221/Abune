import {
  inferAdditionalFields,
  usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_APP_URL ??
    undefined,

  plugins: [
    usernameClient(),
    inferAdditionalFields<typeof auth>(),
  ],
});

export const {
  useSession,
  signOut,
} = authClient;

export type ClientSession =
  typeof authClient.$Infer.Session;