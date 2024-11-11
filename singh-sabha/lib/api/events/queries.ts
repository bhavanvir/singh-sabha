"use server";

import { cache } from "react";
import { db } from "@/db/db";
import { eventTable, eventTypeTable, mailTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// TODO: Fix types
export const GetAllVerifiedEvents = cache(async (): Promise<any> => {
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

export const GetAllUnverifiedEvents = cache(async (): Promise<any> => {
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

export const GetAllEvents = cache(async (): Promise<any> => {
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

export const GetMailingList = cache(async (): Promise<any> => {
  try {
    const mailingList = await db.select().from(mailTable);
    return mailingList;
  } catch (err) {
    throw new Error(`Could not fetch mailing list: ${err}`);
  }
});

export const GetAllEventTypes = cache(async (): Promise<any> => {
  try {
    const eventTypes = await db.select().from(eventTypeTable);
    return eventTypes;
  } catch (err) {
    throw new Error(`Could not fetch event types: ${err}`);
  }
});
