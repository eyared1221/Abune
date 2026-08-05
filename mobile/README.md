# Abune Spiritual Child mobile app

This Vite + React + Capacitor project is the **Spiritual Child** client only. The
root Next.js project remains the Vercel-hosted API and Spiritual Father portal.
Do not copy Spiritual Father screens, Drizzle, database code, server actions, or
environment secrets into this project.

## Mobile source inventory

The child-only page/component inventory is in [`src/README.md`](src/README.md).
The existing `App.tsx` is a small working prototype containing those child-only
screens; extract each named screen/component as it expands.

## Connect to Vercel

Create an uncommitted `mobile/.env.local`:

```dotenv
VITE_API_BASE_URL=https://YOUR-PROJECT.vercel.app
```

In Vercel, set the server-only `MOBILE_APP_ORIGINS` variable to a comma-separated
allow-list such as `capacitor://localhost,http://localhost,http://localhost:5173`.
The backend middleware uses this list only to permit cross-origin API requests
and expose Better Auth's `set-auth-token` response header; it must not be `*`
when using authentication.

Use it only for public HTTPS API origins:

```ts
const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");
await fetch(`${baseUrl}/api/appointments/slots?...`);
```

Vite embeds every `VITE_*` value in the shipped application. Never put
`DATABASE_URL`, Neon credentials, `BETTER_AUTH_SECRET`, email credentials, or
internal registration secrets in this project or any `VITE_*` variable. Those
stay solely in Vercel environment variables for the Next.js deployment.

## Better Auth for Capacitor

Cookie sessions are designed for browsers and are unreliable across the
Capacitor WebView origin and your Vercel origin. Upgrade Better Auth to a version
that provides the Bearer plugin, add `bearer({ requireSignature: true })` to the
server's `plugins` in `src/lib/auth.ts`, and add `capacitor://localhost` (plus
any development origins) to `trustedOrigins`. Match that exact allow-list in
the Vercel-only `MOBILE_APP_ORIGINS` variable above.

After an email/password sign-in, read the `set-auth-token` response header and
store that *session token* in device-secure storage (for Capacitor, use a secure
storage plugin; do not use a database credential or the auth secret). Send it on
every API request:

```http
Authorization: Bearer <session-token>
```

The existing Next API routes already obtain the request headers through
`getApiSession()`, so Better Auth can validate this Authorization header once
the bearer plugin is enabled. Clear the local token on sign-out and revoke the
session server-side. Do not log tokens.

For the current browser-oriented prototype, `services.ts` uses
`credentials: "include"`. Replace that cookie transport with the bearer-token
flow before shipping Android/iOS.

## Next.js replacement map

| Next.js portal feature | Mobile replacement |
| --- | --- |
| `next/link` | `react-router-dom` `Link` / `useNavigate` |
| `next/image` | normal `<img>` with explicit size, or Capacitor asset URL |
| App Router pages/layouts | React Router routes plus shared layout components |
| Server Components | client React components using `useEffect` / a query library and API calls |
| Server Actions | `fetch` calls to the existing `/api/*` Vercel endpoints |
| `next/headers`, `cookies`, `server-only` | keep on the Next.js API server; never import into mobile |
| `NEXT_PUBLIC_*` | `VITE_*` only for public client configuration |

Install React Router before using the route implementation:

```sh
cd mobile
npm install react-router-dom
```
