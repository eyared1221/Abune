CREATE TABLE "appointment_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"father_user_id" text NOT NULL,
	"spiritual_child_id" uuid NOT NULL,
	"availability_entry_id" uuid,
	"active_availability_entry_id" uuid,
	"reason" varchar(40) NOT NULL,
	"request_message" text,
	"status" varchar(24) DEFAULT 'PENDING' NOT NULL,
	"hold_expires_at" timestamp with time zone,
	"requested_date" date NOT NULL,
	"requested_start_time" varchar(5) NOT NULL,
	"requested_end_time" varchar(5) NOT NULL,
	"meeting_method" varchar(24) NOT NULL,
	"location" text,
	"reviewed_at" timestamp with time zone,
	"reviewed_by_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"father_user_id" text NOT NULL,
	"spiritual_child_id" uuid NOT NULL,
	"availability_entry_id" uuid,
	"active_availability_entry_id" uuid,
	"appointment_request_id" uuid,
	"reason" varchar(40) NOT NULL,
	"status" varchar(24) DEFAULT 'CONFIRMED' NOT NULL,
	"schedule_date" date NOT NULL,
	"start_time" varchar(5) NOT NULL,
	"end_time" varchar(5) NOT NULL,
	"meeting_method" varchar(24) NOT NULL,
	"location" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "availability_day_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"father_user_id" text NOT NULL,
	"schedule_date" date NOT NULL,
	"daily_appointment_limit" integer DEFAULT 5 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "availability_day_settings_limit_check" CHECK ("availability_day_settings"."daily_appointment_limit" >= 1 AND "availability_day_settings"."daily_appointment_limit" <= 50)
);
--> statement-breakpoint
CREATE TABLE "availability_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"father_user_id" text NOT NULL,
	"kind" varchar(24) NOT NULL,
	"title" varchar(180) NOT NULL,
	"schedule_date" date NOT NULL,
	"start_time" varchar(5) NOT NULL,
	"end_time" varchar(5) NOT NULL,
	"start_minutes" integer NOT NULL,
	"end_minutes" integer NOT NULL,
	"duration_minutes" integer NOT NULL,
	"meeting_method" varchar(24),
	"location" text,
	"accepted_appointment_types" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "availability_entries_start_minutes_check" CHECK ("availability_entries"."start_minutes" >= 0 AND "availability_entries"."start_minutes" < 1440),
	CONSTRAINT "availability_entries_end_minutes_check" CHECK ("availability_entries"."end_minutes" > 0 AND "availability_entries"."end_minutes" <= 1440),
	CONSTRAINT "availability_entries_time_order_check" CHECK ("availability_entries"."end_minutes" > "availability_entries"."start_minutes"),
	CONSTRAINT "availability_entries_duration_check" CHECK ("availability_entries"."duration_minutes" = "availability_entries"."end_minutes" - "availability_entries"."start_minutes")
);
--> statement-breakpoint
ALTER TABLE "appointment_requests" ADD CONSTRAINT "appointment_requests_spiritual_child_id_spiritual_children_id_fk" FOREIGN KEY ("spiritual_child_id") REFERENCES "public"."spiritual_children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_requests" ADD CONSTRAINT "appointment_requests_availability_entry_id_availability_entries_id_fk" FOREIGN KEY ("availability_entry_id") REFERENCES "public"."availability_entries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_requests" ADD CONSTRAINT "appointment_requests_active_availability_entry_id_availability_entries_id_fk" FOREIGN KEY ("active_availability_entry_id") REFERENCES "public"."availability_entries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_spiritual_child_id_spiritual_children_id_fk" FOREIGN KEY ("spiritual_child_id") REFERENCES "public"."spiritual_children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_availability_entry_id_availability_entries_id_fk" FOREIGN KEY ("availability_entry_id") REFERENCES "public"."availability_entries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_active_availability_entry_id_availability_entries_id_fk" FOREIGN KEY ("active_availability_entry_id") REFERENCES "public"."availability_entries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_appointment_request_id_appointment_requests_id_fk" FOREIGN KEY ("appointment_request_id") REFERENCES "public"."appointment_requests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "appointment_requests_active_slot_unique" ON "appointment_requests" USING btree ("active_availability_entry_id");--> statement-breakpoint
CREATE INDEX "appointment_requests_father_status_idx" ON "appointment_requests" USING btree ("father_user_id","status");--> statement-breakpoint
CREATE INDEX "appointment_requests_child_idx" ON "appointment_requests" USING btree ("spiritual_child_id");--> statement-breakpoint
CREATE INDEX "appointment_requests_slot_idx" ON "appointment_requests" USING btree ("availability_entry_id");--> statement-breakpoint
CREATE UNIQUE INDEX "appointments_active_slot_unique" ON "appointments" USING btree ("active_availability_entry_id");--> statement-breakpoint
CREATE INDEX "appointments_availability_entry_idx" ON "appointments" USING btree ("availability_entry_id");--> statement-breakpoint
CREATE UNIQUE INDEX "appointments_request_unique" ON "appointments" USING btree ("appointment_request_id");--> statement-breakpoint
CREATE INDEX "appointments_father_date_idx" ON "appointments" USING btree ("father_user_id","schedule_date");--> statement-breakpoint
CREATE INDEX "appointments_father_status_idx" ON "appointments" USING btree ("father_user_id","status");--> statement-breakpoint
CREATE INDEX "appointments_child_idx" ON "appointments" USING btree ("spiritual_child_id");--> statement-breakpoint
CREATE UNIQUE INDEX "availability_day_settings_father_date_unique" ON "availability_day_settings" USING btree ("father_user_id","schedule_date");--> statement-breakpoint
CREATE INDEX "availability_day_settings_father_idx" ON "availability_day_settings" USING btree ("father_user_id");--> statement-breakpoint
CREATE INDEX "availability_entries_father_date_idx" ON "availability_entries" USING btree ("father_user_id","schedule_date");--> statement-breakpoint
CREATE INDEX "availability_entries_father_start_idx" ON "availability_entries" USING btree ("father_user_id","schedule_date","start_minutes");--> statement-breakpoint
CREATE UNIQUE INDEX "availability_entries_exact_time_unique" ON "availability_entries" USING btree ("father_user_id","schedule_date","start_minutes","end_minutes","kind");