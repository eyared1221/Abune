import { NextResponse } from "next/server";
import { z } from "zod";

import { reviewAppointmentRequestSchema } from "@/contracts/appointment-request";
import { getApiSession } from "@/lib/api-session";
import {
  AppointmentRequestConflictError,
  AppointmentRequestNotFoundError,
} from "@/server/repositories/appointment-request.repository";
import { reviewFatherAppointmentRequest } from "@/server/services/appointment-request.service";

const requestIdSchema = z.string().uuid();

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
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

  const { id } = await context.params;
  const parsedId = requestIdSchema.safeParse(id);

  if (!parsedId.success) {
    return NextResponse.json(
      { error: "The request ID is invalid." },
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

  const parsedBody =
    reviewAppointmentRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Check the request action and response note.",
        issues: parsedBody.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const updated =
      await reviewFatherAppointmentRequest({
        fatherUserId: session.user.id,
        input: parsedBody.data,
        requestId: parsedId.data,
        reviewedByUserId: session.user.id,
      });

    return NextResponse.json({
      request: updated,
      message:
        parsedBody.data.action === "ACCEPT"
          ? "The request was accepted."
          : "The request was declined.",
    });
  } catch (error: unknown) {
    if (error instanceof AppointmentRequestNotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 },
      );
    }

    if (error instanceof AppointmentRequestConflictError) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 },
      );
    }

    console.error(
      "Unable to review appointment request.",
      error,
    );

    return NextResponse.json(
      { error: "Unable to review the appointment request." },
      { status: 500 },
    );
  }
}
