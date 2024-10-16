ALTER TABLE "event" RENAME COLUMN "start_time" TO "start";--> statement-breakpoint
ALTER TABLE "event" RENAME COLUMN "end_time" TO "end";--> statement-breakpoint
ALTER TABLE "event" RENAME COLUMN "is_all_day" TO "all_day";