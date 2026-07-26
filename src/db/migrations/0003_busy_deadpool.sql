-- Reset existing availability before applying the simplified available-time model.
-- Referencing appointment/request slot IDs are set to NULL by their foreign keys.
DELETE FROM "availability_entries";--> statement-breakpoint
ALTER TABLE "availability_day_settings" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "availability_day_settings" CASCADE;--> statement-breakpoint
DROP INDEX "availability_entries_exact_time_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "availability_entries_exact_time_unique" ON "availability_entries" USING btree ("father_user_id","schedule_date","start_minutes","end_minutes");--> statement-breakpoint
ALTER TABLE "availability_entries" DROP COLUMN "kind";--> statement-breakpoint
ALTER TABLE "availability_entries" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "availability_entries" DROP COLUMN "accepted_appointment_types";
