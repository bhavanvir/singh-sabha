CREATE TABLE IF NOT EXISTS "event" (
	"id" text PRIMARY KEY NOT NULL,
	"registrant_full_name" text NOT NULL,
	"registrant_email" text NOT NULL,
	"registrant_phone_number" text,
	"type" text NOT NULL,
	"startTime" timestamp NOT NULL,
	"endTime" timestamp NOT NULL,
	"isAllDay" boolean DEFAULT false NOT NULL
);
