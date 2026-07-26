CREATE TABLE "spiritual_child_family_children" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"spiritual_child_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"gender" varchar(20) NOT NULL,
	"date_of_birth" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spiritual_child_private_intake" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"spiritual_child_id" uuid NOT NULL,
	"greatest_family_challenge" text,
	"health_status" text,
	"bodily_temptations" text,
	"spiritual_emotional_struggles" text,
	"significant_future_decisions" text,
	"additional_information" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spiritual_children" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"father_user_id" text NOT NULL,
	"linked_user_id" text,
	"slug" varchar(180) NOT NULL,
	"status" varchar(40) DEFAULT 'ACTIVE' NOT NULL,
	"baptismal_name" varchar(160) NOT NULL,
	"legal_name" varchar(200) NOT NULL,
	"gender" varchar(20) NOT NULL,
	"date_of_birth" date NOT NULL,
	"phone_number" varchar(40) NOT NULL,
	"address" text NOT NULL,
	"occupation" varchar(180) NOT NULL,
	"educational_level" varchar(60),
	"spiritual_education" jsonb NOT NULL,
	"sunday_school_years" integer,
	"abinet_disciplines" jsonb NOT NULL,
	"previous_spiritual_father" varchar(200),
	"reason_for_changing_spiritual_father" text,
	"received_previous_father_blessing" boolean NOT NULL,
	"place_of_baptism" varchar(240) NOT NULL,
	"date_of_baptism" date NOT NULL,
	"holy_communion_frequency" varchar(80) NOT NULL,
	"prayer_frequency" text NOT NULL,
	"prayer_books" jsonb NOT NULL,
	"other_prayer_book" varchar(240),
	"fasting_practice" text NOT NULL,
	"reads_spiritual_books" boolean NOT NULL,
	"has_daily_prostration_rule" boolean NOT NULL,
	"daily_prostration_count" integer,
	"faithfully_gives_tithe" boolean NOT NULL,
	"marital_status" varchar(80) NOT NULL,
	"spiritual_child_joined_date" date NOT NULL,
	"spouse_name" varchar(200),
	"spouse_spiritual_father" varchar(200),
	"children_names_and_ages" text,
	"emergency_contact_name" varchar(200),
	"emergency_relationship" varchar(60),
	"emergency_phone_number" varchar(40),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "spiritual_child_family_children" ADD CONSTRAINT "spiritual_child_family_children_spiritual_child_id_spiritual_children_id_fk" FOREIGN KEY ("spiritual_child_id") REFERENCES "public"."spiritual_children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spiritual_child_private_intake" ADD CONSTRAINT "spiritual_child_private_intake_spiritual_child_id_spiritual_children_id_fk" FOREIGN KEY ("spiritual_child_id") REFERENCES "public"."spiritual_children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "spiritual_child_family_children_child_idx" ON "spiritual_child_family_children" USING btree ("spiritual_child_id");--> statement-breakpoint
CREATE UNIQUE INDEX "spiritual_child_private_intake_child_unique" ON "spiritual_child_private_intake" USING btree ("spiritual_child_id");--> statement-breakpoint
CREATE UNIQUE INDEX "spiritual_children_father_slug_unique" ON "spiritual_children" USING btree ("father_user_id","slug");--> statement-breakpoint
CREATE INDEX "spiritual_children_father_idx" ON "spiritual_children" USING btree ("father_user_id");--> statement-breakpoint
CREATE INDEX "spiritual_children_phone_idx" ON "spiritual_children" USING btree ("phone_number");--> statement-breakpoint
CREATE INDEX "spiritual_children_joined_idx" ON "spiritual_children" USING btree ("spiritual_child_joined_date");