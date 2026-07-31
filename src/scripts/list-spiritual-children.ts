import "dotenv/config";

import { pool } from "../lib/db";

type SpiritualChildRow = {
  id: string;
  name: string;
  phone: string | null;
};

const childNameSql = `
  COALESCE(
    NULLIF(to_jsonb(sc)->>'legal_name', ''),
    NULLIF(to_jsonb(sc)->>'legalName', ''),
    NULLIF(to_jsonb(sc)->>'baptismal_name', ''),
    NULLIF(to_jsonb(sc)->>'baptismalName', ''),
    NULLIF(to_jsonb(sc)->>'display_name', ''),
    NULLIF(to_jsonb(sc)->>'displayName', ''),
    NULLIF(to_jsonb(sc)->>'name', ''),
    'Unnamed Spiritual Child'
  )
`;

const childPhoneSql = `
  COALESCE(
    NULLIF(to_jsonb(sc)->>'phone_number', ''),
    NULLIF(to_jsonb(sc)->>'phoneNumber', ''),
    NULLIF(to_jsonb(sc)->>'phone', '')
  )
`;

async function main() {
  const result = await pool.query<SpiritualChildRow>(
    `
      SELECT
        sc.id,
        ${childNameSql} AS name,
        ${childPhoneSql} AS phone
      FROM spiritual_children AS sc
      ORDER BY name ASC
    `,
  );

  if (result.rowCount === 0) {
    console.log(
      "No Spiritual Child profiles exist in spiritual_children.",
    );
    return;
  }

  console.table(result.rows);
}

main()
  .catch((error: unknown) => {
    console.error("Unable to list Spiritual Children.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
