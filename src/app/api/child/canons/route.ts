import { NextResponse } from "next/server";

import { getApiSession } from "@/lib/api-session";
import { pool } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getApiSession();

  if (!session) {
    return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
  }
  if (session.user.role !== "SPIRITUAL_CHILD") {
    return NextResponse.json({ error: "Spiritual Child access is required." }, { status: 403 });
  }

  try {
    const result = await pool.query<{
      id: string;
      reason: string;
      fethaDate: string;
      fethaTime: string;
      tasks: string[];
    }>(
      `
        SELECT
          c.id,
          a.reason,
          c.fetha_date::text AS "fethaDate",
          c.fetha_time AS "fethaTime",
          COALESCE(
            array_agg(ct.guidance ORDER BY ct.created_at)
              FILTER (WHERE ct.guidance IS NOT NULL),
            ARRAY[]::text[]
          ) AS tasks
        FROM canons AS c
        INNER JOIN appointments AS a
          ON a.id = c.appointment_id
        LEFT JOIN canon_tasks AS ct
          ON ct.canon_id = c.id
        WHERE c.child_user_id = $1
        GROUP BY c.id, a.id
        ORDER BY c.fetha_date DESC, c.fetha_time DESC
      `,
      [session.user.id],
    );

    return NextResponse.json({ canons: result.rows }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error: unknown) {
    console.error("Unable to load child canons.", error);
    return NextResponse.json({ error: "Unable to load canon guidance." }, { status: 500 });
  }
}
