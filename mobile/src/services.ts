import { createAuthClient } from "better-auth/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

export const isApiConfigured = Boolean(baseUrl);

if (!baseUrl && import.meta.env.PROD) {
  console.warn("VITE_API_BASE_URL is not configured; the mobile app cannot reach the Abune API.");
}

export const authClient = createAuthClient({ baseURL: baseUrl, fetchOptions: { credentials: "include" } });

export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  if (!baseUrl) throw new Error("The mobile API URL has not been configured.");
  const response = await fetch(`${baseUrl}${path}`, { ...init, credentials: "include", headers: { "Content-Type": "application/json", ...(init.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "The server could not complete this request.");
  return data as T;
}
