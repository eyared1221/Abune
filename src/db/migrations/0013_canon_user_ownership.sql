ALTER TABLE "canons" ADD COLUMN "child_user_id" text;--> statement-breakpoint
UPDATE "canons" AS c SET "child_user_id" = a."child_user_id" FROM "appointments" AS a WHERE a."id" = c."appointment_id";--> statement-breakpoint
ALTER TABLE "canons" ALTER COLUMN "spiritual_child_id" DROP NOT NULL;--> statement-breakpoint
CREATE INDEX "canons_child_user_idx" ON "canons" USING btree ("child_user_id");
