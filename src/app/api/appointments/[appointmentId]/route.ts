import { NextResponse } from "next/server";
import { z } from "zod";

import { updateAppointmentStatusSchema } from "@/contracts/appointment";
import { getApiSession } from "@/lib/api-session";
import {
  AppointmentConflictError,
  AppointmentNotFoundError,
} from "@/server/repositories/appointment.repository";
import { updateFatherAppointmentStatus } from "@/server/services/appointment.service";

const appointmentIdSchema = z.string().uuid();

export async function PATCH(
  request: Request,
  context: { params: Promise<{ appointmentId: string }> },
) {
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

  const { appointmentId } = await context.params;
  const parsedId = appointmentIdSchema.safeParse(appointmentId);
  if (!parsedId.success) {
    return NextResponse.json(
      { error: "The appointment ID is invalid." },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "The request body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsedBody = updateAppointmentStatusSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Check the appointment action." },
      { status: 400 },
    );
  }

  try {
    const appointment = await updateFatherAppointmentStatus({
      appointmentId: parsedId.data,
      fatherUserId: session.user.id,
      input: parsedBody.data,
    });

    return NextResponse.json({ appointment });
  } catch (error: unknown) {
    if (error instanceof AppointmentNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof AppointmentConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    console.error("Unable to update appointment.", error);
    return NextResponse.json(
      { error: "Unable to update the appointment." },
      { status: 500 },
    );
  }
}
