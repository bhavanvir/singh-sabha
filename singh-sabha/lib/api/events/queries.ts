"use server";

import { cache } from "react";
import { db } from "@/db/db";
import { eventTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// TODO: Fix type
export const GetAllVerifiedEvents = cache(async (): Promise<any> => {
  try {
    const events = await db
      .select()
      .from(eventTable)
      .where(eq(eventTable.verified, true));
    return events;
  } catch (err) {
    throw new Error(`Could not fetch events: ${err}`);
  }
});

export const GetAllEvents = cache(async (): Promise<any> => {
  try {
    const events = await db.select().from(eventTable);
    return events;
  } catch (err) {
    throw new Error(`Could not fetch events: ${err}`);
  }
});
