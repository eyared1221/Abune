ALTER TABLE "availability_entries" DROP CONSTRAINT "availability_entries_start_minutes_check";--> statement-breakpoint
ALTER TABLE "availability_entries" DROP CONSTRAINT "availability_entries_end_minutes_check";--> statement-breakpoint
ALTER TABLE "availability_entries" DROP CONSTRAINT "availability_entries_duration_check";--> statement-breakpoint
ALTER TABLE "availability_entries" DROP CONSTRAINT "availability_entries_time_order_check";--> statement-breakpoint
DROP INDEX "availability_entries_father_start_idx";--> statement-breakpoint
DROP INDEX "availability_entries_exact_time_unique";--> statement-breakpoint
ALTER TABLE "availability_entries" ALTER COLUMN "start_time" SET DATA TYPE time USING "start_time"::time;--> statement-breakpoint
ALTER TABLE "availability_entries" ALTER COLUMN "end_time" SET DATA TYPE time USING "end_time"::time;--> statement-breakpoint
CREATE INDEX "availability_entries_father_start_idx" ON "availability_entries" USING btree ("father_user_id","schedule_date","start_time");--> statement-breakpoint
CREATE UNIQUE INDEX "availability_entries_exact_time_unique" ON "availability_entries" USING btree ("father_user_id","schedule_date","start_time","end_time");--> statement-breakpoint
ALTER TABLE "availability_entries" DROP COLUMN "start_minutes";--> statement-breakpoint
ALTER TABLE "availability_entries" DROP COLUMN "end_minutes";--> statement-breakpoint
ALTER TABLE "availability_entries" ADD CONSTRAINT "availability_entries_time_order_check" CHECK ("availability_entries"."end_time" > "availability_entries"."start_time");
