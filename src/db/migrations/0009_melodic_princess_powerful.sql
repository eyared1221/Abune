ALTER TABLE "appointment_requests" ADD COLUMN "seed_key" varchar(160);--> statement-breakpoint
ALTER TABLE "appointment_requests" ADD COLUMN "response_note" text;--> statement-breakpoint
CREATE UNIQUE INDEX "appointment_requests_seed_key_unique" ON "appointment_requests" USING btree ("seed_key");--> statement-breakpoint
CREATE INDEX "appointment_requests_requested_date_idx" ON "appointment_requests" USING btree ("requested_date");