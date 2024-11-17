CREATE TABLE IF NOT EXISTS "announcements" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"message" text,
	"is_active" boolean DEFAULT false
);
