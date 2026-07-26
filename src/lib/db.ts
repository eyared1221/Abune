import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "@/db/schema";

const useDirectConnection = process.env.DB_USE_DIRECT === "true";

function isPlaceholderConnectionString(value: string) {
  try {
    return new URL(value).hostname.includes("example");
  } catch {
    return false;
  }
}

function normalizeConnectionString(value: string) {
  const url = new URL(value);
  const sslMode = url.searchParams.get("sslmode");

  if (
    sslMode &&
    ["prefer", "require", "verify-ca"].includes(sslMode) &&
    url.searchParams.get("uselibpqcompat") !== "true"
  ) {
    url.searchParams.set("sslmode", "verify-full");
  }

  return url.toString();
}

function getConnectionString() {
  const candidates = useDirectConnection
    ? [
        ["DIRECT_DATABASE_URL", process.env.DIRECT_DATABASE_URL],
        ["NEON_DB", process.env.NEON_DB],
        ["DATABASE_URL", process.env.DATABASE_URL],
      ]
    : [
        ["DATABASE_URL", process.env.DATABASE_URL],
        ["DIRECT_DATABASE_URL", process.env.DIRECT_DATABASE_URL],
        ["NEON_DB", process.env.NEON_DB],
      ];

  for (const [name, value] of candidates) {
    if (!value) {
      continue;
    }

    if (isPlaceholderConnectionString(value)) {
      console.warn(
        `Ignoring ${name} because it still points to an example database host.`,
      );
      continue;
    }

    return normalizeConnectionString(value);
  }

  throw new Error(
    useDirectConnection
      ? "DIRECT_DATABASE_URL is missing."
      : "No valid database connection string was found. Set DATABASE_URL or provide DIRECT_DATABASE_URL/NEON_DB as a fallback.",
  );
}

const globalForPostgres = globalThis as unknown as {
  abunePool?: Pool;
};

export const pool =
  globalForPostgres.abunePool ??
  new Pool({
    connectionString: getConnectionString(),
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    allowExitOnIdle: true,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPostgres.abunePool = pool;
}

export const db = drizzle({
  client: pool,
  schema,
});
