import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { appointmentRequests } from "@/db/schema";
import { getApiSession } from "@/lib/api-session";
import { db } from "@/lib/db";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getApiSession();
  if (!session) return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
  const { id } = await context.params;
  const [deleted] = await db.delete(appointmentRequests).where(and(eq(appointmentRequests.id, id), eq(appointmentRequests.childUserId, session.user.id), eq(appointmentRequests.status, "PENDING"))).returning({ id: appointmentRequests.id });
  if (!deleted) return NextResponse.json({ error: "Only pending requests can be deleted." }, { status: 404 });
  return NextResponse.json({ id: deleted.id });
}
