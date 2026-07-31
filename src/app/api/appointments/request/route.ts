import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { appointmentRequests, availabilityEntries, spiritualChildren } from "@/db/schema";
import { getApiSession } from "@/lib/api-session";
import { db } from "@/lib/db";
import { appointmentReasonValues, meetingMethodValues } from "@/types/availability";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await getApiSession();
  if (!session) return NextResponse.json({ error: "Authentication is required." }, { status: 401 });

  const type = request.nextUrl.searchParams.get("type");
  if (type !== "requests" && type !== "history") return NextResponse.json({ error: "Invalid request list type." }, { status: 400 });

  let [child] = await db.select().from(spiritualChildren).where(eq(spiritualChildren.linkedUserId, session.user.id)).limit(1);
  // Supports the current one-father development setup before each child user
  // is explicitly linked to its profile.
  if (!child) [child] = await db.select().from(spiritualChildren).orderBy(desc(spiritualChildren.createdAt)).limit(1);
  if (!child) return NextResponse.json({ requests: [], appointments: [] });

  const rows = await db.select().from(appointmentRequests)
    .where(eq(appointmentRequests.spiritualChildId, child.id))
    .orderBy(desc(appointmentRequests.createdAt));

  const requests = rows.map((row) => ({
    id: row.id,
    reason: row.reason,
    status: row.status,
    requestedDate: row.requestedDate,
    requestedStartTime: row.requestedStartTime,
    requestedEndTime: row.requestedEndTime,
    meetingMethod: row.meetingMethod,
    location: row.location,
    createdAt: row.createdAt.toISOString(),
  }));

  if (type === "requests") return NextResponse.json({ requests });
  return NextResponse.json({ appointments: [] });
}

export async function POST(request: NextRequest) {
  const session = await getApiSession();
  if (!session) return NextResponse.json({ error: "Authentication is required." }, { status: 401 });

  const input = await request.json() as {
    reason?: string; requestedDate?: string; requestedStartTime?: string; requestedEndTime?: string;
    meetingMethod?: string; location?: string; availabilityEntryId?: string;
  };

  if (!input.availabilityEntryId || !input.reason || !input.requestedDate || !input.requestedStartTime || !input.requestedEndTime || !input.meetingMethod || !appointmentReasonValues.includes(input.reason as typeof appointmentReasonValues[number]) || !meetingMethodValues.includes(input.meetingMethod as typeof meetingMethodValues[number])) {
    return NextResponse.json({ error: "Please select a valid appointment slot." }, { status: 400 });
  }

  try {
    const created = await db.transaction(async (tx) => {
      const [slot] = await tx.select().from(availabilityEntries).where(eq(availabilityEntries.id, input.availabilityEntryId!)).limit(1);
      if (!slot) throw new Error("SLOT_NOT_FOUND");

      let [child] = await tx.select().from(spiritualChildren).where(eq(spiritualChildren.linkedUserId, session.user.id)).limit(1);
      // Supports the existing single-father development setup until a child login is linked.
      if (!child) [child] = await tx.select().from(spiritualChildren).where(eq(spiritualChildren.fatherUserId, slot.fatherUserId)).limit(1);
      if (!child) throw new Error("CHILD_NOT_FOUND");

      const [createdRequest] = await tx.insert(appointmentRequests).values({
        fatherUserId: slot.fatherUserId,
        spiritualChildId: child.id,
        availabilityEntryId: slot.id,
        activeAvailabilityEntryId: slot.id,
        reason: input.reason as typeof appointmentReasonValues[number],
        requestedDate: slot.scheduleDate,
        requestedStartTime: slot.startTime.slice(0, 5),
        requestedEndTime: slot.endTime.slice(0, 5),
        meetingMethod: slot.meetingMethod,
        location: slot.location,
      }).returning();
      return createdRequest;
    });

    return NextResponse.json({ request: created }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "REQUEST_CREATE_FAILED";
    if (message === "SLOT_NOT_FOUND") return NextResponse.json({ error: "This slot is no longer available." }, { status: 404 });
    if (message === "CHILD_NOT_FOUND") return NextResponse.json({ error: "No spiritual-child profile is available for this request." }, { status: 400 });
    if (message.includes("unique") || message.includes("duplicate")) return NextResponse.json({ error: "This slot has already been requested." }, { status: 409 });
    console.error("Unable to create appointment request.", error);
    return NextResponse.json({ error: "Unable to submit the appointment request." }, { status: 500 });
  }
}
