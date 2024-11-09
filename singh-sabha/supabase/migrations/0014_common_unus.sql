CREATE TABLE IF NOT EXISTS "mailing_list" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "mailing_list_email_unique" UNIQUE("email")
);
