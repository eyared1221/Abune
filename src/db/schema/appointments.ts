import {
  date,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import type {
  AppointmentReason,
  MeetingMethod,
} from "@/types/availability";

import { appointmentRequests } from "./appointment-requests";
import { availabilityEntries } from "./availability";
import { spiritualChildren } from "./profiles";

export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    fatherUserId: text("father_user_id").notNull(),

    // Legacy profile link. New mobile appointments are owned by childUserId.
    spiritualChildId: uuid("spiritual_child_id")
      .references(() => spiritualChildren.id, {
        onDelete: "cascade",
      }),

    childUserId: text("child_user_id"),

    availabilityEntryId: uuid("availability_entry_id").references(
      () => availabilityEntries.id,
      { onDelete: "set null" },
    ),

    // Populated only while this appointment actively occupies the slot.
    activeAvailabilityEntryId: uuid(
      "active_availability_entry_id",
    ).references(() => availabilityEntries.id, {
      onDelete: "set null",
    }),

    appointmentRequestId: uuid("appointment_request_id").references(
      () => appointmentRequests.id,
      { onDelete: "set null" },
    ),

    reason: varchar("reason", { length: 40 })
      .$type<AppointmentReason>()
      .notNull(),

    status: varchar("status", { length: 24 })
      .$type<
        | "CONFIRMED"
        | "COMPLETED"
        | "CANCELLED"
        | "NO_SHOW"
        | "RESCHEDULED"
      >()
      .notNull()
      .default("CONFIRMED"),

    scheduleDate: date("schedule_date", {
      mode: "string",
    }).notNull(),

    startTime: varchar("start_time", {
      length: 5,
    }).notNull(),

    endTime: varchar("end_time", {
      length: 5,
    }).notNull(),

    meetingMethod: varchar("meeting_method", {
      length: 24,
    })
      .$type<MeetingMethod>()
      .notNull(),

    location: text("location"),
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
    uniqueIndex("appointments_active_slot_unique").on(
      table.activeAvailabilityEntryId,
    ),
    index("appointments_availability_entry_idx").on(
      table.availabilityEntryId,
    ),
    uniqueIndex("appointments_request_unique").on(
      table.appointmentRequestId,
    ),
    index("appointments_father_date_idx").on(
      table.fatherUserId,
      table.scheduleDate,
    ),
    index("appointments_father_status_idx").on(
      table.fatherUserId,
      table.status,
    ),
    index("appointments_child_idx").on(
      table.spiritualChildId,
    ),
    index("appointments_child_user_idx").on(table.childUserId),
  ],
);

export type AppointmentRecord =
  typeof appointments.$inferSelect;

export type NewAppointmentRecord =
  typeof appointments.$inferInsert;
