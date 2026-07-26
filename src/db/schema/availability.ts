import { sql } from "drizzle-orm";
import {
  check,
  date,
  index,
  pgTable,
  text,
  time,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import type { MeetingMethod } from "@/types/availability";

export const availabilityEntries = pgTable(
  "availability_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Better Auth owns its user table, so this stays as a text ID without a
    // Drizzle-managed foreign key.
    fatherUserId: text("father_user_id").notNull(),

    scheduleDate: date("schedule_date", { mode: "string" }).notNull(),

    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),

    meetingMethod: varchar("meeting_method", { length: 24 })
      .$type<MeetingMethod>()
      .notNull(),
    location: text("location").notNull(),
    notes: text("notes"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("availability_entries_father_date_idx").on(
      table.fatherUserId,
      table.scheduleDate,
    ),
    index("availability_entries_father_start_idx").on(
      table.fatherUserId,
      table.scheduleDate,
      table.startTime,
    ),
    uniqueIndex("availability_entries_exact_time_unique").on(
      table.fatherUserId,
      table.scheduleDate,
      table.startTime,
      table.endTime,
    ),
    check(
      "availability_entries_time_order_check",
      sql`${table.endTime} > ${table.startTime}`,
    ),
  ],
);

export type AvailabilityEntryRecord =
  typeof availabilityEntries.$inferSelect;
export type NewAvailabilityEntryRecord =
  typeof availabilityEntries.$inferInsert;
