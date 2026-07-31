CREATE TABLE "canon_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"canon_id" uuid NOT NULL,
	"guidance" text NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "canons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"father_user_id" text NOT NULL,
	"spiritual_child_id" uuid NOT NULL,
	"appointment_id" uuid NOT NULL,
	"fetha_date" date NOT NULL,
	"fetha_time" varchar(5) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "canon_tasks" ADD CONSTRAINT "canon_tasks_canon_id_canons_id_fk" FOREIGN KEY ("canon_id") REFERENCES "public"."canons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "canons" ADD CONSTRAINT "canons_spiritual_child_id_spiritual_children_id_fk" FOREIGN KEY ("spiritual_child_id") REFERENCES "public"."spiritual_children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "canons" ADD CONSTRAINT "canons_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "canon_tasks_canon_idx" ON "canon_tasks" USING btree ("canon_id");--> statement-breakpoint
CREATE INDEX "canons_father_idx" ON "canons" USING btree ("father_user_id");--> statement-breakpoint
CREATE INDEX "canons_child_idx" ON "canons" USING btree ("spiritual_child_id");--> statement-breakpoint
CREATE INDEX "canons_appointment_idx" ON "canons" USING btree ("appointment_id");