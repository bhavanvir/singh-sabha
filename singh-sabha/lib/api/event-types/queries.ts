"use server";

import { cache } from "react";
import { db } from "@/db/db";
import { eventTypeTable } from "@/db/schema";

import type { EventType } from "@/db/schema";

export const GetAllEventTypes = cache(async (): Promise<EventType[]> => {
  try {
    const eventTypes = await db.select().from(eventTypeTable);
    return eventTypes;
  } catch (err) {
    throw new Error(`Could not fetch event types: ${err}`);
  }
});
