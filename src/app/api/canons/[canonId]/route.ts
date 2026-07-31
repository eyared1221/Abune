import { NextResponse } from "next/server";
import { z } from "zod";

import { updateCanonSchema } from "@/contracts/canon";
import { getApiSession } from "@/lib/api-session";
import { CanonNotFoundError } from "@/server/repositories/canon.repository";
import {
  deleteFatherCanon,
  updateFatherCanon,
} from "@/server/services/canon.service";

const canonIdSchema = z.string().uuid();

async function getFatherSession() {
  const session = await getApiSession();
  if (!session || session.user.role !== "SPIRITUAL_FATHER") return null;
  return session;
}

export async function PATCH(request: Request, context: { params: Promise<{ canonId: string }> }) {
  const session = await getFatherSession();
  if (!session) return NextResponse.json({ error: "Spiritual Father access is required." }, { status: 403 });
  const { canonId } = await context.params;
  const parsedId = canonIdSchema.safeParse(canonId);
  if (!parsedId.success) return NextResponse.json({ error: "The canon ID is invalid." }, { status: 400 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "The request body must be valid JSON." }, { status: 400 }); }
  const parsedBody = updateCanonSchema.safeParse(body);
  if (!parsedBody.success) return NextResponse.json({ error: "Add canon guidance and a valid Fetha date and time." }, { status: 400 });

  try {
    return NextResponse.json({ canon: await updateFatherCanon(session.user.id, parsedId.data, parsedBody.data) });
  } catch (error: unknown) {
    if (error instanceof CanonNotFoundError) return NextResponse.json({ error: error.message }, { status: 404 });
    console.error("Unable to update canon.", error);
    return NextResponse.json({ error: "Unable to update the canon." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ canonId: string }> }) {
  const session = await getFatherSession();
  if (!session) return NextResponse.json({ error: "Spiritual Father access is required." }, { status: 403 });
  const { canonId } = await context.params;
  const parsedId = canonIdSchema.safeParse(canonId);
  if (!parsedId.success) return NextResponse.json({ error: "The canon ID is invalid." }, { status: 400 });

  try {
    await deleteFatherCanon(session.user.id, parsedId.data);
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    if (error instanceof CanonNotFoundError) return NextResponse.json({ error: error.message }, { status: 404 });
    console.error("Unable to delete canon.", error);
    return NextResponse.json({ error: "Unable to delete the canon." }, { status: 500 });
  }
}
