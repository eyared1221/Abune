import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";

import { appointmentRequests, spiritualChildren } from "@/db/schema";
import { getApiSession } from "@/lib/api-session";
import { db } from "@/lib/db";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getApiSession();
  if (!session) return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
  const { id } = await context.params;
  let [child] = await db.select().from(spiritualChildren).where(eq(spiritualChildren.linkedUserId, session.user.id)).limit(1);
  if (!child) [child] = await db.select().from(spiritualChildren).orderBy(desc(spiritualChildren.createdAt)).limit(1);
  if (!child) return NextResponse.json({ error: "No child profile is linked to this account." }, { status: 400 });

  const [deleted] = await db.delete(appointmentRequests).where(and(eq(appointmentRequests.id, id), eq(appointmentRequests.spiritualChildId, child.id), eq(appointmentRequests.status, "PENDING"))).returning({ id: appointmentRequests.id });
  if (!deleted) return NextResponse.json({ error: "Only pending requests can be deleted." }, { status: 404 });
  return NextResponse.json({ id: deleted.id });
}
