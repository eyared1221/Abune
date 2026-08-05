import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "@/i18n/routing";

const handleI18n = createMiddleware(routing);

// Vercel environment variable, for example:
// MOBILE_APP_ORIGINS=capacitor://localhost,http://localhost,http://localhost:5173
// Keep this an explicit allow-list; do not reflect arbitrary Origin headers.
const mobileOrigins = new Set(
  (process.env.MOBILE_APP_ORIGINS ?? "https://localhost,capacitor://localhost")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

function withMobileCors(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get("origin");

  if (!origin || !mobileOrigins.has(origin)) {
    return response;
  }

  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Expose-Headers", "set-auth-token");
  response.headers.set("Vary", "Origin");
  return response;
}

export default function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    if (request.method === "OPTIONS") {
      return withMobileCors(request, new NextResponse(null, { status: 204 }));
    }

    return withMobileCors(request, NextResponse.next());
  }

  return handleI18n(request);
}

export const config = {
  matcher: "/((?!trpc|_next|_vercel|.*\\..*).*)",
};
