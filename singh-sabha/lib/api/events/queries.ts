"use server";
import { cache } from "react";
import { db } from "@/db/db";
import { eventTable, eventTypeTable } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import type { EventWithType } from "@/db/schema";

export const GetAllVerifiedEvents = cache(
  async (): Promise<EventWithType[]> => {
    try {
      const events = await db
        .select({
          events: eventTable,
          event_types: eventTypeTable,
        })
        .from(eventTable)
        .leftJoin(eventTypeTable, eq(eventTable.type, eventTypeTable.id))
        .where(eq(eventTable.verified, true));

      return events.map(({ events, event_types }) => ({
        ...events,
        eventType: event_types ?? undefined,
      }));
    } catch (err) {
      throw new Error(`Could not fetch events: ${err}`);
    }
  },
);

export const GetAllUnverifiedEvents = cache(
  async (): Promise<EventWithType[]> => {
    try {
      const events = await db
        .select({
          events: eventTable,
          event_types: eventTypeTable,
        })
        .from(eventTable)
        .leftJoin(eventTypeTable, eq(eventTable.type, eventTypeTable.id))
        .where(eq(eventTable.verified, false));

      return events.map(({ events, event_types }) => ({
        ...events,
        eventType: event_types ?? undefined,
      }));
    } catch (err) {
      throw new Error(`Could not fetch events: ${err}`);
    }
  },
);

export const GetAllEvents = cache(async (): Promise<EventWithType[]> => {
  try {
    const events = await db
      .select({
        events: eventTable,
        event_types: eventTypeTable,
      })
      .from(eventTable)
      .leftJoin(eventTypeTable, eq(eventTable.type, eventTypeTable.id));

    return events.map(({ events, event_types }) => ({
      ...events,
      eventType: event_types ?? undefined,
    }));
  } catch (err) {
    throw new Error(`Could not fetch events: ${err}`);
  }
});

export const GetEventsBetweenDates = cache(
  async ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }): Promise<EventWithType[]> => {
    try {
      if (!startDate || !endDate) {
        throw new Error("Missing start date or end date or both");
      }
      const events = await db
        .select({
          events: eventTable,
          event_types: eventTypeTable,
        })
        .from(eventTable)
        .leftJoin(eventTypeTable, eq(eventTable.type, eventTypeTable.id))
        .where(
          and(
            gte(eventTable.start, new Date(startDate)),
            lte(eventTable.end, new Date(endDate)),
            eq(eventTable.isPublic, true),
          ),
        );
      return events.map(({ events, event_types }) => ({
        ...events,
        eventType: event_types ?? undefined,
      }));
    } catch (err) {
      throw new Error(`Could not fetch events: ${err}`);
    }
  },
);
