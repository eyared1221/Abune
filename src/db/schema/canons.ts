import {
  boolean,
  date,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { appointments } from "./appointments";
import { spiritualChildren } from "./profiles";

export const canons = pgTable(
  "canons",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    fatherUserId: text("father_user_id").notNull(),
    spiritualChildId: uuid("spiritual_child_id")
      .notNull()
      .references(() => spiritualChildren.id, { onDelete: "cascade" }),
    appointmentId: uuid("appointment_id")
      .notNull()
      .references(() => appointments.id, { onDelete: "cascade" }),
    fethaDate: date("fetha_date", { mode: "string" }).notNull(),
    fethaTime: varchar("fetha_time", { length: 5 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("canons_father_idx").on(table.fatherUserId),
    index("canons_child_idx").on(table.spiritualChildId),
    index("canons_appointment_idx").on(table.appointmentId),
  ],
);

export const canonTasks = pgTable(
  "canon_tasks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    canonId: uuid("canon_id")
      .notNull()
      .references(() => canons.id, { onDelete: "cascade" }),
    guidance: text("guidance").notNull(),
    isCompleted: boolean("is_completed").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("canon_tasks_canon_idx").on(table.canonId)],
);
