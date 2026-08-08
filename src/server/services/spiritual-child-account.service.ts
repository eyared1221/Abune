import "server-only";

import { and, eq, isNull } from "drizzle-orm";

import { spiritualChildren, type SpiritualChildRecord } from "@/db/schema";
import { db } from "@/lib/db";

/**
 * Resolves the profile owned by a signed-in child. Older child accounts may
 * predate `linked_user_id`; a single unlinked profile with the exact same
 * baptismal name can be safely claimed once. We never fall back to an
 * arbitrary or newest profile.
 */
export async function resolveSpiritualChildForUser({
  fatherUserId,
  userId,
  userName,
}: {
  fatherUserId?: string;
  userId: string;
  userName?: string | null;
}): Promise<SpiritualChildRecord | null> {
  const linked = await db
    .select()
    .from(spiritualChildren)
    .where(eq(spiritualChildren.linkedUserId, userId))
    .limit(1);

  if (linked[0]) {
    return !fatherUserId || linked[0].fatherUserId === fatherUserId
      ? linked[0]
      : null;
  }

  const baptismalName = userName?.trim();
  if (!baptismalName) return null;

  const matches = await db
    .select()
    .from(spiritualChildren)
    .where(
      and(
        eq(spiritualChildren.baptismalName, baptismalName),
        isNull(spiritualChildren.linkedUserId),
        ...(fatherUserId
          ? [eq(spiritualChildren.fatherUserId, fatherUserId)]
          : []),
      ),
    )
    .limit(2);

  if (matches.length !== 1) return null;

  const claimed = await db
    .update(spiritualChildren)
    .set({ linkedUserId: userId, updatedAt: new Date() })
    .where(
      and(
        eq(spiritualChildren.id, matches[0].id),
        isNull(spiritualChildren.linkedUserId),
      ),
    )
    .returning();

  return claimed[0] ?? null;
}
