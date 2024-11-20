"use server";

import { cache } from "react";
import { db } from "@/db/db";
import { eventTable, eventTypeTable } from "@/db/schema";
import { eq } from "drizzle-orm";

import type { Event } from "@/db/schema";

export const GetAllVerifiedEvents = cache(async (): Promise<Event[]> => {
  try {
    const events = await db
      .select()
      .from(eventTable)
      .leftJoin(eventTypeTable, eq(eventTable.type, eventTypeTable.id))
      .where(eq(eventTable.verified, true));

    return events.map(({ events, event_types }) => ({
      ...events,
      eventType: {
        ...event_types,
      },
    }));
  } catch (err) {
    throw new Error(`Could not fetch events: ${err}`);
  }
});

export const GetAllUnverifiedEvents = cache(async (): Promise<Event[]> => {
  try {
    const events = await db
      .select()
      .from(eventTable)
      .leftJoin(eventTypeTable, eq(eventTable.type, eventTypeTable.id))
      .where(eq(eventTable.verified, false));

    return events.map(({ events, event_types }) => ({
      ...events,
      eventType: {
        ...event_types,
      },
    }));
  } catch (err) {
    throw new Error(`Could not fetch events: ${err}`);
  }
});

export const GetAllEvents = cache(async (): Promise<Event[]> => {
  try {
    const events = await db
      .select()
      .from(eventTable)
      .leftJoin(eventTypeTable, eq(eventTable.type, eventTypeTable.id));

    return events.map(({ events, event_types }) => ({
      ...events,
      eventType: {
        ...event_types,
      },
    }));
  } catch (err) {
    throw new Error(`Could not fetch events: ${err}`);
  }
});
