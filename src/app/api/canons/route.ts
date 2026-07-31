import { NextResponse } from "next/server";

import { createCanonSchema } from "@/contracts/canon";
import { getApiSession } from "@/lib/api-session";
import { CanonAppointmentNotFoundError } from "@/server/repositories/canon.repository";
import {
  createFatherCanon,
  getFatherCanons,
} from "@/server/services/canon.service";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getApiSession();

  if (!session) {
    return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
  }
  if (session.user.role !== "SPIRITUAL_FATHER") {
    return NextResponse.json({ error: "Spiritual Father access is required." }, { status: 403 });
  }

  try {
    return NextResponse.json(await getFatherCanons(session.user.id), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error: unknown) {
    console.error("Unable to load canons.", error);
    return NextResponse.json({ error: "Unable to load canons." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getApiSession();

  if (!session) {
    return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
  }
  if (session.user.role !== "SPIRITUAL_FATHER") {
    return NextResponse.json({ error: "Spiritual Father access is required." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The request body must be valid JSON." }, { status: 400 });
  }

  const parsed = createCanonSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Add canon guidance and a valid Fetha date and time." }, { status: 400 });
  }

  try {
    const canon = await createFatherCanon(session.user.id, parsed.data);
    return NextResponse.json({ canon }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof CanonAppointmentNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("Unable to save canon.", error);
    return NextResponse.json({ error: "Unable to save the canon." }, { status: 500 });
  }
}
