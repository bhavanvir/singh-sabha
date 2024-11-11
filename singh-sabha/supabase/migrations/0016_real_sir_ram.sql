DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_type_event_types_id_fk" FOREIGN KEY ("type") REFERENCES "public"."event_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
