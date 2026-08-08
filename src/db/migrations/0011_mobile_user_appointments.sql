ALTER TABLE "appointment_requests" ADD COLUMN "child_user_id" text;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "child_user_id" text;--> statement-breakpoint
UPDATE "appointment_requests" AS ar SET "child_user_id" = sc."linked_user_id" FROM "spiritual_children" AS sc WHERE sc."id" = ar."spiritual_child_id";--> statement-breakpoint
UPDATE "appointments" AS a SET "child_user_id" = sc."linked_user_id" FROM "spiritual_children" AS sc WHERE sc."id" = a."spiritual_child_id";--> statement-breakpoint
ALTER TABLE "appointment_requests" ALTER COLUMN "spiritual_child_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "spiritual_child_id" DROP NOT NULL;--> statement-breakpoint
CREATE INDEX "appointment_requests_child_user_idx" ON "appointment_requests" USING btree ("child_user_id");--> statement-breakpoint
CREATE INDEX "appointments_child_user_idx" ON "appointments" USING btree ("child_user_id");
