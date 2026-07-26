import {
  date,
  index,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

import { availabilityEntries } from "./availability";
import { spiritualChildren } from "./profiles";
import type {
  AppointmentReason,
  MeetingMethod,
} from "@/types/availability";

export const appointmentRequests = pgTable(
  "appointment_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    fatherUserId: text("father_user_id").notNull(),
    spiritualChildId: uuid("spiritual_child_id")
      .notNull()
      .references(() => spiritualChildren.id, { onDelete: "cascade" }),

    // The historical link may become null if an unused slot is later deleted.
    availabilityEntryId: uuid("availability_entry_id").references(
      () => availabilityEntries.id,
      { onDelete: "set null" },
    ),

    // This is populated only while the request actively reserves a slot.
    // PostgreSQL unique indexes allow multiple nulls, so one slot can have
    // only one active reservation while preserving older request history.
    activeAvailabilityEntryId: uuid(
      "active_availability_entry_id",
    ).references(() => availabilityEntries.id, { onDelete: "set null" }),

    reason: varchar("reason", { length: 40 })
      .$type<AppointmentReason>()
      .notNull(),
    requestMessage: text("request_message"),
    status: varchar("status", { length: 24 })
      .$type<"PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "EXPIRED">()
      .notNull()
      .default("PENDING"),
    holdExpiresAt: timestamp("hold_expires_at", {
      withTimezone: true,
      mode: "date",
    }),

    // Snapshot fields preserve the requested schedule even if a slot changes.
    requestedDate: date("requested_date", { mode: "string" }).notNull(),
    requestedStartTime: varchar("requested_start_time", { length: 5 }).notNull(),
    requestedEndTime: varchar("requested_end_time", { length: 5 }).notNull(),
    meetingMethod: varchar("meeting_method", { length: 24 })
      .$type<MeetingMethod>()
      .notNull(),
    location: text("location"),

    reviewedAt: timestamp("reviewed_at", {
      withTimezone: true,
      mode: "date",
    }),
    reviewedByUserId: text("reviewed_by_user_id"),
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
    uniqueIndex("appointment_requests_active_slot_unique").on(
      table.activeAvailabilityEntryId,
    ),
    index("appointment_requests_father_status_idx").on(
      table.fatherUserId,
      table.status,
    ),
    index("appointment_requests_child_idx").on(table.spiritualChildId),
    index("appointment_requests_slot_idx").on(table.availabilityEntryId),
  ],
);

export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    fatherUserId: text("father_user_id").notNull(),
    spiritualChildId: uuid("spiritual_child_id")
      .notNull()
      .references(() => spiritualChildren.id, { onDelete: "cascade" }),
    availabilityEntryId: uuid("availability_entry_id").references(
      () => availabilityEntries.id,
      { onDelete: "set null" },
    ),
    // Populated only while this appointment actively occupies the slot.
    // Cancelled or rescheduled records keep availabilityEntryId for history
    // and clear this field, allowing the slot to be reused safely.
    activeAvailabilityEntryId: uuid(
      "active_availability_entry_id",
    ).references(() => availabilityEntries.id, { onDelete: "set null" }),
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

    scheduleDate: date("schedule_date", { mode: "string" }).notNull(),
    startTime: varchar("start_time", { length: 5 }).notNull(),
    endTime: varchar("end_time", { length: 5 }).notNull(),
    meetingMethod: varchar("meeting_method", { length: 24 })
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
    index("appointments_child_idx").on(table.spiritualChildId),
  ],
);

export type AppointmentRequestRecord =
  typeof appointmentRequests.$inferSelect;
export type AppointmentRecord = typeof appointments.$inferSelect;
