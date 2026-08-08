import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { appointmentRequests, availabilityEntries } from "@/db/schema";
import { getApiSession } from "@/lib/api-session";
import { db } from "@/lib/db";
import { appointmentReasonValues, meetingMethodValues } from "@/types/availability";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await getApiSession();
  if (!session) return NextResponse.json({ error: "Authentication is required." }, { status: 401 });

  const type = request.nextUrl.searchParams.get("type");
  if (type !== "requests" && type !== "history") return NextResponse.json({ error: "Invalid request list type." }, { status: 400 });

  const rows = await db.select().from(appointmentRequests)
    .where(eq(appointmentRequests.childUserId, session.user.id))
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
    responseNote: row.responseNote,
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

      const [createdRequest] = await tx.insert(appointmentRequests).values({
        fatherUserId: slot.fatherUserId,
        childUserId: session.user.id,
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
    const databaseError = error as { code?: string; constraint?: string };
    if (message === "SLOT_NOT_FOUND") return NextResponse.json({ error: "This slot is no longer available." }, { status: 404 });
    if (databaseError.code === "42703" || (databaseError.code === "23502" && databaseError.constraint?.includes("spiritual_child_id"))) {
      return NextResponse.json({ error: "The appointment database migration has not been applied to this environment." }, { status: 503 });
    }
    if (message.includes("unique") || message.includes("duplicate")) return NextResponse.json({ error: "This slot has already been requested." }, { status: 409 });
    console.error("Unable to create appointment request.", error);
    return NextResponse.json({ error: "Unable to submit the appointment request." }, { status: 500 });
  }
}
