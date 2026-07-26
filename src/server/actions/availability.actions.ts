"use server";

import { headers } from "next/headers";
import { ZodError } from "zod";

import { auth } from "@/lib/auth";
import { isSpiritualFather } from "@/lib/permissions";
import {
  createAvailability,
  deleteAvailability,
  listAvailabilityCalendar,
  updateAvailability,
} from "@/server/services/availability.service";
import type {
  AvailabilityCalendarActionResult,
  AvailabilityDeleteActionResult,
  AvailabilityFormSubmission,
  AvailabilityMutationActionResult,
} from "@/types/availability";

type SessionUserWithRole = {
  id: string;
  role?: unknown;
};

async function requireSpiritualFather() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("UNAUTHENTICATED");

  const user = session.user as SessionUserWithRole;
  if (!isSpiritualFather(user.role)) throw new Error("FORBIDDEN");

  return user;
}

function getSafeActionError(error: unknown) {
  if (error instanceof ZodError) {
    const firstIssue = error.issues[0];
    return {
      error: firstIssue?.message ?? "Please review the form and try again.",
      field: firstIssue?.path.length
        ? firstIssue.path.join(".")
        : undefined,
    };
  }

  if (error instanceof Error) {
    switch (error.message) {
      case "UNAUTHENTICATED":
        return { error: "Your session has expired. Please sign in again." };
      case "FORBIDDEN":
        return {
          error: "Only a spiritual-father account can manage availability.",
        };
      case "ENTRY_OVERLAP":
        return {
          error:
            "This time overlaps another available appointment time.",
          field: "startTime",
        };
      case "ENTRY_NOT_FOUND":
        return { error: "This calendar entry no longer exists." };
      case "WRITE_CONFLICT":
        return {
          error:
            "Another calendar change happened at the same time. Please try again.",
        };
      default:
        console.error("Availability server action failed:", error);
    }
  } else {
    console.error("Availability action failed with an unknown error:", error);
  }

  return {
    error: "The calendar request could not be completed. Please try again.",
  };
}

export async function listAvailabilityCalendarAction(input: {
  startDate: string;
  endDate: string;
}): Promise<AvailabilityCalendarActionResult> {
  try {
    const father = await requireSpiritualFather();
    const data = await listAvailabilityCalendar(father.id, input);
    return { success: true, data };
  } catch (error) {
    return { success: false, ...getSafeActionError(error) };
  }
}

export async function createAvailabilityAction(
  submission: AvailabilityFormSubmission,
): Promise<AvailabilityMutationActionResult> {
  console.log("Action: Creating availability with submission:", submission);
  try {
    const father = await requireSpiritualFather();
    console.log("Action: Father user ID:", father.id);
    const entry = await createAvailability(father.id, submission);
    console.log("Action: Successfully created entry:", entry);
    return { success: true, entry };
  } catch (error) {
    console.error("Action: Error creating availability:", error);
    return { success: false, ...getSafeActionError(error) };
  }
}

export async function updateAvailabilityAction(
  entryId: string,
  submission: AvailabilityFormSubmission,
): Promise<AvailabilityMutationActionResult> {
  try {
    const father = await requireSpiritualFather();
    const entry = await updateAvailability(father.id, entryId, submission);
    return { success: true, entry };
  } catch (error) {
    return { success: false, ...getSafeActionError(error) };
  }
}

export async function deleteAvailabilityAction(
  entryId: string,
): Promise<AvailabilityDeleteActionResult> {
  try {
    const father = await requireSpiritualFather();
    const id = await deleteAvailability(father.id, entryId);
    return { success: true, id };
  } catch (error) {
    return {
      success: false,
      error: getSafeActionError(error).error,
    };
  }
}
