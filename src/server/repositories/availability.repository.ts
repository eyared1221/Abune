import {
  and,
  asc,
  eq,
  gt,
  gte,
  lt,
  lte,
  ne,
} from "drizzle-orm";

import {
  availabilityEntries,
  type AvailabilityEntryRecord,
} from "@/db/schema";
import { db } from "@/lib/db";
import type { MeetingMethod } from "@/types/availability";

export type SaveAvailabilityRepositoryInput = {
  scheduleDate: string;
  startTime: string;
  endTime: string;
  meetingMethod: MeetingMethod;
  location: string;
  notes: string | null;
};

export type CalendarRepositoryEntry = {
  entry: AvailabilityEntryRecord;
};

export type CalendarRepositoryData = {
  entries: CalendarRepositoryEntry[];
};

type PgErrorLike = {
  code?: string;
};

function isSerializationFailure(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as PgErrorLike).code === "40001"
  );
}

export async function listAvailabilityCalendarByFather(
  fatherUserId: string,
  startDate: string,
  endDate: string,
): Promise<CalendarRepositoryData> {
  const entries = await db
      .select()
      .from(availabilityEntries)
      .where(
        and(
          eq(availabilityEntries.fatherUserId, fatherUserId),
          gte(availabilityEntries.scheduleDate, startDate),
          lte(availabilityEntries.scheduleDate, endDate),
        ),
      )
      .orderBy(
        asc(availabilityEntries.scheduleDate),
        asc(availabilityEntries.startTime),
      );

  return {
    entries: entries.map((entry) => ({
      entry,
    })),
  };
}

export async function createAvailabilityEntryForFather(
  fatherUserId: string,
  input: SaveAvailabilityRepositoryInput,
): Promise<AvailabilityEntryRecord> {
  console.log("Creating availability entry for father:", fatherUserId);
  console.log("Input data:", input);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await db.transaction(
        async (tx) => {
          console.log("Starting transaction, attempt:", attempt + 1);

          const [overlap] = await tx
            .select({ id: availabilityEntries.id })
            .from(availabilityEntries)
            .where(
              and(
                eq(availabilityEntries.fatherUserId, fatherUserId),
                eq(availabilityEntries.scheduleDate, input.scheduleDate),
                lt(availabilityEntries.startTime, input.endTime),
                gt(availabilityEntries.endTime, input.startTime),
              ),
            )
            .limit(1);

          if (overlap) throw new Error("ENTRY_OVERLAP");

          const now = new Date();

          console.log("Inserting availability entry");
          const [created] = await tx
            .insert(availabilityEntries)
            .values({
              fatherUserId,
              scheduleDate: input.scheduleDate,
              startTime: input.startTime,
              endTime: input.endTime,
              meetingMethod: input.meetingMethod,
              location: input.location,
              notes: input.notes,
              createdAt: now,
              updatedAt: now,
            })
            .returning();

          if (!created) throw new Error("ENTRY_CREATE_FAILED");
          console.log("Successfully created entry:", created);
          return created;
        },
        { isolationLevel: "serializable" },
      );
    } catch (error) {
      console.error("Transaction error on attempt", attempt + 1, ":", error);
      if (isSerializationFailure(error) && attempt < 2) continue;
      if (isSerializationFailure(error)) throw new Error("WRITE_CONFLICT");
      throw error;
    }
  }

  throw new Error("WRITE_CONFLICT");
}

export async function updateAvailabilityEntryForFather(
  fatherUserId: string,
  entryId: string,
  input: SaveAvailabilityRepositoryInput,
): Promise<AvailabilityEntryRecord> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await db.transaction(
        async (tx) => {
          const [existing] = await tx
            .select()
            .from(availabilityEntries)
            .where(
              and(
                eq(availabilityEntries.id, entryId),
                eq(availabilityEntries.fatherUserId, fatherUserId),
              ),
            )
            .limit(1);

          if (!existing) throw new Error("ENTRY_NOT_FOUND");

          const now = new Date();

          const [overlap] = await tx
            .select({ id: availabilityEntries.id })
            .from(availabilityEntries)
            .where(
              and(
                eq(availabilityEntries.fatherUserId, fatherUserId),
                eq(availabilityEntries.scheduleDate, input.scheduleDate),
                lt(availabilityEntries.startTime, input.endTime),
                gt(availabilityEntries.endTime, input.startTime),
                ne(availabilityEntries.id, entryId),
              ),
            )
            .limit(1);

          if (overlap) throw new Error("ENTRY_OVERLAP");

          const [updated] = await tx
            .update(availabilityEntries)
            .set({
              scheduleDate: input.scheduleDate,
              startTime: input.startTime,
              endTime: input.endTime,
              meetingMethod: input.meetingMethod,
              location: input.location,
              notes: input.notes,
              updatedAt: now,
            })
            .where(
              and(
                eq(availabilityEntries.id, entryId),
                eq(availabilityEntries.fatherUserId, fatherUserId),
              ),
            )
            .returning();

          if (!updated) throw new Error("ENTRY_UPDATE_FAILED");
          return updated;
        },
        { isolationLevel: "serializable" },
      );
    } catch (error) {
      if (isSerializationFailure(error) && attempt < 2) continue;
      if (isSerializationFailure(error)) throw new Error("WRITE_CONFLICT");
      throw error;
    }
  }

  throw new Error("WRITE_CONFLICT");
}

export async function deleteAvailabilityEntryForFather(
  fatherUserId: string,
  entryId: string,
): Promise<void> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await db.transaction(
        async (tx) => {
          const [existing] = await tx
            .select({ id: availabilityEntries.id })
            .from(availabilityEntries)
            .where(
              and(
                eq(availabilityEntries.id, entryId),
                eq(availabilityEntries.fatherUserId, fatherUserId),
              ),
            )
            .limit(1);

          if (!existing) throw new Error("ENTRY_NOT_FOUND");

          await tx
            .delete(availabilityEntries)
            .where(
              and(
                eq(availabilityEntries.id, entryId),
                eq(availabilityEntries.fatherUserId, fatherUserId),
              ),
            );
        },
        { isolationLevel: "serializable" },
      );
      return;
    } catch (error) {
      if (isSerializationFailure(error) && attempt < 2) continue;
      if (isSerializationFailure(error)) throw new Error("WRITE_CONFLICT");
      throw error;
    }
  }

  throw new Error("WRITE_CONFLICT");
}
