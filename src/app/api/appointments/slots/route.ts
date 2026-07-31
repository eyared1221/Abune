import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { spiritualChildren } from "@/db/schema";
import { getApiSession } from "@/lib/api-session";
import { db, pool } from "@/lib/db";
import { listAvailabilityCalendar } from "@/server/services/availability.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await getApiSession();
  if (!session) return NextResponse.json({ error: "Authentication is required." }, { status: 401 });

  const startDate = request.nextUrl.searchParams.get("startDate");
  const endDate = request.nextUrl.searchParams.get("endDate");
  if (!startDate || !endDate) return NextResponse.json({ error: "A start and end date are required." }, { status: 400 });

  const [child] = await db
    .select({ fatherUserId: spiritualChildren.fatherUserId })
    .from(spiritualChildren)
    .where(eq(spiritualChildren.linkedUserId, session.user.id))
    .limit(1);

  let fatherUserId = child?.fatherUserId;
  let fatherName = "Your Spiritual Father";

  // A child account can be created before it is linked to a profile. In that
  // setup, use the single father account configured for this installation.
  if (!fatherUserId) {
    const result = await pool.query<{ id: string; name: string | null }>(
      'SELECT id, name FROM "user" WHERE role = $1 LIMIT 1',
      ["SPIRITUAL_FATHER"],
    );
    fatherUserId = result.rows[0]?.id;
    fatherName = result.rows[0]?.name?.trim() || fatherName;
  }

  if (!fatherUserId) return NextResponse.json({ error: "No spiritual father is available." }, { status: 404 });

  try {
    const { entries } = await listAvailabilityCalendar(fatherUserId, { startDate, endDate });
    return NextResponse.json({
      fatherName,
      slots: entries.map((entry) => ({
        id: entry.id,
        date: entry.date,
        startTime: entry.startTime,
        endTime: entry.endTime,
        meetingMethod: entry.meetingMethod,
        location: entry.location,
        notes: entry.notes || null,
      })),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Unable to load child availability.", error);
    return NextResponse.json({ error: "Unable to load available times." }, { status: 500 });
  }
}
