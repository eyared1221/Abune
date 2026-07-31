import { NextResponse } from "next/server";

import { getApiSession } from "@/lib/api-session";
import { getFatherAppointmentRequests } from "@/server/services/appointment-request.service";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getApiSession();

  if (!session) {
    return NextResponse.json(
      { error: "Authentication is required." },
      { status: 401 },
    );
  }

  if (session.user.role !== "SPIRITUAL_FATHER") {
    return NextResponse.json(
      { error: "Spiritual Father access is required." },
      { status: 403 },
    );
  }

  try {
    const result = await getFatherAppointmentRequests(
      session.user.id,
    );

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    console.error(
      "Unable to load appointment requests.",
      error,
    );

    return NextResponse.json(
      { error: "Unable to load appointment requests." },
      { status: 500 },
    );
  }
}
