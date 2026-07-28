CREATE TABLE "registration_email_otps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(320) NOT NULL,
	"otp_hash" text NOT NULL,
	"request_ip_hash" varchar(64),
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"verified_at" timestamp with time zone,
	"consumed_at" timestamp with time zone,
	"registration_token_hash" text,
	"registration_token_expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "registration_email_otps_email_created_idx" ON "registration_email_otps" USING btree ("email","created_at");--> statement-breakpoint
CREATE INDEX "registration_email_otps_ip_created_idx" ON "registration_email_otps" USING btree ("request_ip_hash","created_at");--> statement-breakpoint
CREATE INDEX "registration_email_otps_expires_idx" ON "registration_email_otps" USING btree ("expires_at");