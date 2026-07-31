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

import type { AppointmentRequestStatus } from "@/contracts/appointment-request";
import { availabilityEntries } from "./availability";
import { spiritualChildren } from "./profiles";

export const appointmentRequests = pgTable(
  "appointment_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Used only by repeatable development seed data.
    // Real requests submitted by the Child portal leave this null.
    seedKey: varchar("seed_key", { length: 160 }),

    // Better Auth user ID of the Spiritual Father.
    fatherUserId: text("father_user_id").notNull(),

    // Profile ID of the Spiritual Child who submitted the request.
    spiritualChildId: uuid("spiritual_child_id")
      .notNull()
      .references(() => spiritualChildren.id, {
        onDelete: "cascade",
      }),

    // Historical link to the slot selected by the child.
    availabilityEntryId: uuid("availability_entry_id").references(
      () => availabilityEntries.id,
      { onDelete: "set null" },
    ),

    // Populated only while this request actively reserves a slot.
    activeAvailabilityEntryId: uuid(
      "active_availability_entry_id",
    ).references(() => availabilityEntries.id, {
      onDelete: "set null",
    }),

    reason: varchar("reason", { length: 40 })
      .$type<AppointmentReason>()
      .notNull(),

    requestMessage: text("request_message"),

    status: varchar("status", { length: 24 })
      .$type<AppointmentRequestStatus>()
      .notNull()
      .default("PENDING"),

    holdExpiresAt: timestamp("hold_expires_at", {
      withTimezone: true,
      mode: "date",
    }),

    // Snapshot fields preserve the originally requested schedule.
    requestedDate: date("requested_date", {
      mode: "string",
    }).notNull(),

    requestedStartTime: varchar("requested_start_time", {
      length: 5,
    }).notNull(),

    requestedEndTime: varchar("requested_end_time", {
      length: 5,
    }).notNull(),

    meetingMethod: varchar("meeting_method", {
      length: 24,
    })
      .$type<MeetingMethod>()
      .notNull(),

    location: text("location"),

    responseNote: text("response_note"),

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
    uniqueIndex("appointment_requests_seed_key_unique").on(
      table.seedKey,
    ),
    uniqueIndex("appointment_requests_active_slot_unique").on(
      table.activeAvailabilityEntryId,
    ),
    index("appointment_requests_father_status_idx").on(
      table.fatherUserId,
      table.status,
    ),
    index("appointment_requests_child_idx").on(
      table.spiritualChildId,
    ),
    index("appointment_requests_slot_idx").on(
      table.availabilityEntryId,
    ),
    index("appointment_requests_requested_date_idx").on(
      table.requestedDate,
    ),
  ],
);

export type AppointmentRequestRecord =
  typeof appointmentRequests.$inferSelect;

export type NewAppointmentRequestRecord =
  typeof appointmentRequests.$inferInsert;
