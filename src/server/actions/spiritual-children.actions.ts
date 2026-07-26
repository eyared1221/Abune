"use server";

import { headers } from "next/headers";
import { ZodError } from "zod";

import { auth } from "@/lib/auth";
import { isSpiritualFather } from "@/lib/permissions";
import {
  listChildren,
  registerSpiritualChild,
} from "@/server/services/child.service";
import {
  getSpiritualChildBySlugForFather,
} from "@/server/repositories/child.repository";
import type {
  NewSpiritualChildSubmission,
  SpiritualChildActionResult,
  SpiritualChildrenListActionResult,
} from "@/types/spiritual-child";

type SessionUserWithRole = {
  id: string;
  role?: unknown;
};

async function requireSpiritualFather() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("UNAUTHENTICATED");
  }

  const user = session.user as SessionUserWithRole;

  if (!isSpiritualFather(user.role)) {
    throw new Error("FORBIDDEN");
  }

  return user;
}

function getSafeActionError(error: unknown) {
  if (error instanceof ZodError) {
    const firstIssue = error.issues[0];

    return {
      error:
        firstIssue?.message ??
        "Please review the form and try again.",
      field:
        firstIssue?.path.length
          ? firstIssue.path.join(".")
          : undefined,
    };
  }

  if (error instanceof Error) {
    switch (error.message) {
      case "UNAUTHENTICATED":
        return {
          error: "Your session has expired. Please sign in again.",
        };
      case "FORBIDDEN":
        return {
          error:
            "Only a spiritual-father account can manage spiritual children.",
        };
      default:
        console.error(
          "Spiritual-child server action failed:",
          error,
        );
    }
  } else {
    console.error(
      "Spiritual-child server action failed with an unknown error:",
      error,
    );
  }

  return {
    error:
      "The request could not be completed. Please try again.",
  };
}

export async function createSpiritualChildAction(
  submission: NewSpiritualChildSubmission,
): Promise<SpiritualChildActionResult> {
  try {
    const father = await requireSpiritualFather();
    const child = await registerSpiritualChild(
      father.id,
      submission,
    );

    return {
      success: true,
      child,
    };
  } catch (error) {
    return {
      success: false,
      ...getSafeActionError(error),
    };
  }
}

export async function listSpiritualChildrenAction(): Promise<SpiritualChildrenListActionResult> {
  try {
    const father = await requireSpiritualFather();
    const children = await listChildren(father.id);

    return {
      success: true,
      children,
    };
  } catch (error) {
    return {
      success: false,
      error: getSafeActionError(error).error,
    };
  }
}

export async function getSpiritualChildBySlugAction(
  slug: string,
): Promise<SpiritualChildActionResult> {
  try {
    const father = await requireSpiritualFather();
    const aggregate = await getSpiritualChildBySlugForFather(
      father.id,
      slug,
    );

    if (!aggregate) {
      return {
        success: false,
        error: "Spiritual child not found.",
      };
    }

    const { mapAggregateToDto } = await import("@/server/services/child.service");
    const child = mapAggregateToDto(aggregate);

    return {
      success: true,
      child,
    };
  } catch (error) {
    return {
      success: false,
      error: getSafeActionError(error).error,
    };
  }
}
