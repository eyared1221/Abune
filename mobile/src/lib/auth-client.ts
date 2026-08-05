import { createAuthClient } from "better-auth/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
const bearerTokenKey = "abune.mobile.bearer-token";

export const isApiConfigured = Boolean(baseUrl);

export function getBearerToken() {
  if (typeof window === "undefined") return undefined;
  return window.localStorage.getItem(bearerTokenKey) ?? undefined;
}

// TODO: Replace localStorage with encrypted Capacitor native storage before a
// Play Store release. This development store keeps all token access in one place.
export function saveBearerToken(token: string) {
  if (typeof window !== "undefined") window.localStorage.setItem(bearerTokenKey, token);
}

export function clearBearerToken() {
  if (typeof window !== "undefined") window.localStorage.removeItem(bearerTokenKey);
}

export function saveBearerTokenFromResponse(response: Response) {
  const token = response.headers.get("set-auth-token");
  if (token) saveBearerToken(token);
  return token;
}

export const authClient = createAuthClient({
  baseURL: baseUrl,
  fetchOptions: {
    auth: {
      type: "Bearer",
      token: getBearerToken,
    },
  },
});
