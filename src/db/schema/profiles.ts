import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const spiritualChildren = pgTable(
  "spiritual_children",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Better Auth owns the user table. We store its user ID without declaring
    // a foreign key so Drizzle does not need to manage Better Auth's tables.
    fatherUserId: text("father_user_id").notNull(),
    linkedUserId: text("linked_user_id"),

    slug: varchar("slug", { length: 180 }).notNull(),
    status: varchar("status", { length: 40 }).notNull().default("ACTIVE"),

    baptismalName: varchar("baptismal_name", { length: 160 }).notNull(),
    legalName: varchar("legal_name", { length: 200 }).notNull(),
    gender: varchar("gender", { length: 20 }).notNull(),
    dateOfBirth: date("date_of_birth", { mode: "string" }).notNull(),
    phoneNumber: varchar("phone_number", { length: 40 }).notNull(),
    address: text("address").notNull(),
    occupation: varchar("occupation", { length: 180 }).notNull(),
    educationalLevel: varchar("educational_level", { length: 60 }),

    spiritualEducation: jsonb("spiritual_education")
      .$type<string[]>()
      .notNull(),
    sundaySchoolYears: integer("sunday_school_years"),
    abinetDisciplines: jsonb("abinet_disciplines")
      .$type<string[]>()
      .notNull(),

    previousSpiritualFather: varchar("previous_spiritual_father", {
      length: 200,
    }),
    reasonForChangingSpiritualFather: text(
      "reason_for_changing_spiritual_father",
    ),
    receivedPreviousFatherBlessing: boolean(
      "received_previous_father_blessing",
    ).notNull(),
    placeOfBaptism: varchar("place_of_baptism", { length: 240 }).notNull(),
    dateOfBaptism: date("date_of_baptism", { mode: "string" }).notNull(),
    holyCommunionFrequency: varchar("holy_communion_frequency", {
      length: 80,
    }).notNull(),

    prayerFrequency: text("prayer_frequency").notNull(),
    prayerBooks: jsonb("prayer_books").$type<string[]>().notNull(),
    otherPrayerBook: varchar("other_prayer_book", { length: 240 }),
    fastingPractice: text("fasting_practice").notNull(),
    readsSpiritualBooks: boolean("reads_spiritual_books").notNull(),
    hasDailyProstrationRule: boolean(
      "has_daily_prostration_rule",
    ).notNull(),
    dailyProstrationCount: integer("daily_prostration_count"),
    faithfullyGivesTithe: boolean("faithfully_gives_tithe").notNull(),

    maritalStatus: varchar("marital_status", { length: 80 }).notNull(),
    spiritualChildJoinedDate: date("spiritual_child_joined_date", {
      mode: "string",
    }).notNull(),
    spouseName: varchar("spouse_name", { length: 200 }),
    spouseSpiritualFather: varchar("spouse_spiritual_father", {
      length: 200,
    }),
    childrenNamesAndAges: text("children_names_and_ages"),

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
    uniqueIndex("spiritual_children_father_slug_unique").on(
      table.fatherUserId,
      table.slug,
    ),
    index("spiritual_children_father_idx").on(table.fatherUserId),
    index("spiritual_children_phone_idx").on(table.phoneNumber),
    index("spiritual_children_joined_idx").on(
      table.spiritualChildJoinedDate,
    ),
  ],
);

export const spiritualChildPrivateIntake = pgTable(
  "spiritual_child_private_intake",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    spiritualChildId: uuid("spiritual_child_id")
      .notNull()
      .references(() => spiritualChildren.id, { onDelete: "cascade" }),

    greatestFamilyChallenge: text("greatest_family_challenge"),
    healthStatus: text("health_status"),
    bodilyTemptations: text("bodily_temptations"),
    spiritualEmotionalStruggles: text("spiritual_emotional_struggles"),
    significantFutureDecisions: text("significant_future_decisions"),
    additionalInformation: text("additional_information"),

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
    uniqueIndex("spiritual_child_private_intake_child_unique").on(
      table.spiritualChildId,
    ),
  ],
);

export const spiritualChildFamilyChildren = pgTable(
  "spiritual_child_family_children",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    spiritualChildId: uuid("spiritual_child_id")
      .notNull()
      .references(() => spiritualChildren.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 200 }).notNull(),
    gender: varchar("gender", { length: 20 }).notNull(),
    dateOfBirth: date("date_of_birth", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("spiritual_child_family_children_child_idx").on(
      table.spiritualChildId,
    ),
  ],
);

export type SpiritualChildRecord =
  typeof spiritualChildren.$inferSelect;
export type NewSpiritualChildRecord =
  typeof spiritualChildren.$inferInsert;

export type SpiritualChildPrivateIntakeRecord =
  typeof spiritualChildPrivateIntake.$inferSelect;
export type SpiritualChildFamilyChildRecord =
  typeof spiritualChildFamilyChildren.$inferSelect;

// Kept for compatibility with code that previously imported ProfileRecord.
export type ProfileRecord = {
  id: string;
  role: "father" | "child";
  displayName: string;
};
