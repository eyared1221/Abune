import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { fatherInvitations } from "./father-invitations";

export const registrationEmailOtps = pgTable(
  "registration_email_otps",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 320 }).notNull(),
    otpHash: text("otp_hash").notNull(),
    accountType: varchar("account_type", { length: 40 })
      .notNull()
      .default("SPIRITUAL_CHILD"),
    fatherInvitationId: uuid("father_invitation_id").references(
      () => fatherInvitations.id,
      { onDelete: "set null" },
    ),
    requestIpHash: varchar("request_ip_hash", { length: 64 }),
    attemptCount: integer("attempt_count").notNull().default(0),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    verifiedAt: timestamp("verified_at", {
      withTimezone: true,
      mode: "date",
    }),
    consumedAt: timestamp("consumed_at", {
      withTimezone: true,
      mode: "date",
    }),
    registrationTokenHash: text("registration_token_hash"),
    registrationTokenExpiresAt: timestamp(
      "registration_token_expires_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),
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
    index("registration_email_otps_email_created_idx").on(
      table.email,
      table.createdAt,
    ),
    index("registration_email_otps_ip_created_idx").on(
      table.requestIpHash,
      table.createdAt,
    ),
    index("registration_email_otps_expires_idx").on(table.expiresAt),
    index("registration_email_otps_father_invitation_idx").on(
      table.fatherInvitationId,
    ),
  ],
);

export type RegistrationEmailOtpRecord =
  typeof registrationEmailOtps.$inferSelect;
