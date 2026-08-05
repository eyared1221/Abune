import {
  authClient,
  clearBearerToken,
  getBearerToken,
  isApiConfigured,
} from "./lib/auth-client";

export { authClient, clearBearerToken, getBearerToken, isApiConfigured };

const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  if (!baseUrl) throw new Error("The mobile API URL has not been configured.");

  const token = getBearerToken();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
  });
  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    clearBearerToken();
    throw new Error("Your session has expired. Please sign in again.");
  }
  if (!response.ok) throw new Error(data.error || "The server could not complete this request.");
  return data as T;
}
