CREATE TABLE IF NOT EXISTS "temp_passwords" (
	"id" text PRIMARY KEY NOT NULL,
	"temp_password" text NOT NULL,
	"issuer" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_administrator" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_moderator" boolean DEFAULT false NOT NULL;