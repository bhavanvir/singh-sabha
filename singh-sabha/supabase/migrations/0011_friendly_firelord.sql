ALTER TABLE "temp_passwords" RENAME TO "one_time_password";--> statement-breakpoint
ALTER TABLE "one_time_password" RENAME COLUMN "temp_password" TO "one_time_password";