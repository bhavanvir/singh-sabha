"use server";

import { cache } from "react";
import { db } from "@/db/db";
import { eventTable } from "@/db/schema";

import type { Event } from "@/lib/types/event";

export const GetAllEvents = cache(async (): Promise<Event[]> => {
  try {
    const events = await db.select().from(eventTable);
    return events;
  } catch (err) {
    throw new Error(`Could not fetch events: ${err}`);
  }
});
