ALTER TABLE "events" ADD COLUMN "is_deposit_paid" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "is_balance_paid" boolean DEFAULT false;