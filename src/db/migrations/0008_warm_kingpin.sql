CREATE TABLE "father_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(320) NOT NULL,
	"invited_name" varchar(200),
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"used_by_user_id" text,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "registration_email_otps" ADD COLUMN "account_type" varchar(40) DEFAULT 'SPIRITUAL_CHILD' NOT NULL;--> statement-breakpoint
ALTER TABLE "registration_email_otps" ADD COLUMN "father_invitation_id" uuid;--> statement-breakpoint
CREATE UNIQUE INDEX "father_invitations_token_hash_unique" ON "father_invitations" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "father_invitations_email_created_idx" ON "father_invitations" USING btree ("email","created_at");--> statement-breakpoint
CREATE INDEX "father_invitations_expires_idx" ON "father_invitations" USING btree ("expires_at");--> statement-breakpoint
ALTER TABLE "registration_email_otps" ADD CONSTRAINT "registration_email_otps_father_invitation_id_father_invitations_id_fk" FOREIGN KEY ("father_invitation_id") REFERENCES "public"."father_invitations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "registration_email_otps_father_invitation_idx" ON "registration_email_otps" USING btree ("father_invitation_id");