import "server-only";

function normalizeOrigin(value: string) {
  return value.replace(/\/$/, "");
}

export function isTrustedRegistrationRequest(request: Request) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return false;
  }

  const allowedOrigins = new Set<string>([
    normalizeOrigin(new URL(request.url).origin),
  ]);

  for (const candidate of [
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    // Capacitor serves the installed mobile client from a local origin. The
    // Vite origin is included for mobile development; deployed web origins
    // remain controlled by the two environment variables above.
    "http://localhost",
    "https://localhost",
    "capacitor://localhost",
    "http://localhost:5173",
  ]) {
    if (candidate) {
      allowedOrigins.add(normalizeOrigin(candidate));
    }
  }

  return allowedOrigins.has(normalizeOrigin(origin));
}

export function getRequestIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || null;
  }

  return request.headers.get("x-real-ip")?.trim() || null;
}
