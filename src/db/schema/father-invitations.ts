import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const fatherInvitations = pgTable(
  "father_invitations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 320 }).notNull(),
    invitedName: varchar("invited_name", { length: 200 }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    usedAt: timestamp("used_at", {
      withTimezone: true,
      mode: "date",
    }),
    usedByUserId: text("used_by_user_id"),
    revokedAt: timestamp("revoked_at", {
      withTimezone: true,
      mode: "date",
    }),
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
    uniqueIndex("father_invitations_token_hash_unique").on(table.tokenHash),
    index("father_invitations_email_created_idx").on(
      table.email,
      table.createdAt,
    ),
    index("father_invitations_expires_idx").on(table.expiresAt),
  ],
);

export type FatherInvitationRecord =
  typeof fatherInvitations.$inferSelect;
