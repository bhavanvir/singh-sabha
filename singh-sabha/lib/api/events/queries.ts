"use server";

import { cache } from "react";
import { db } from "@/db/db";
import { eventTable } from "@/db/schema";

import type { InferSelectModel } from "drizzle-orm";

export type DatabaseEvent = InferSelectModel<typeof eventTable>;

export const GetAllEvents = cache(async (): Promise<DatabaseEvent[]> => {
  try {
    const events = await db.select().from(eventTable);
    return events;
  } catch (err) {
    throw new Error(`Could not fetch events: ${err}`);
  }
});
