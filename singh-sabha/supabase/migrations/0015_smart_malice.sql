CREATE TABLE IF NOT EXISTS "event_types" (
	"id" text PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"is_requestable" boolean DEFAULT false,
	"is_special" boolean DEFAULT false
);
