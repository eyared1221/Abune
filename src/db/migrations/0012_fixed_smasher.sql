ALTER TABLE "appointment_requests" ALTER COLUMN "spiritual_child_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "spiritual_child_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "appointment_requests" ADD COLUMN "child_user_id" text;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "child_user_id" text;--> statement-breakpoint
CREATE INDEX "appointment_requests_child_user_idx" ON "appointment_requests" USING btree ("child_user_id");--> statement-breakpoint
CREATE INDEX "appointments_child_user_idx" ON "appointments" USING btree ("child_user_id");