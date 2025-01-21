"use server";

import { db } from "@/db/db";
import { eventTable, eventTypeTable } from "@/db/schema";
import { and, count, eq, gte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import type { EventWithType } from "@/db/schema";

export const GetAllVerifiedEvents = async (): Promise<EventWithType[]> => {
  try {
    const events = await db
      .select({
        events: eventTable,
        event_types: eventTypeTable,
      })
      .from(eventTable)
      .leftJoin(eventTypeTable, eq(eventTable.type, eventTypeTable.id))
      .where(
        and(
          eq(eventTable.isVerified, true),
          eq(eventTable.isDepositPaid, true),
        ),
      );

    revalidatePath("/calendar");

    return events.map(({ events, event_types }) => ({
      ...events,
      eventType: event_types ?? undefined,
    }));
  } catch (err) {
    throw new Error(`Could not fetch events: ${err}`);
  }
};

export const GetAllEvents = async (): Promise<EventWithType[]> => {
  try {
    const events = await db
      .select({
        events: eventTable,
        event_types: eventTypeTable,
      })
      .from(eventTable)
      .leftJoin(eventTypeTable, eq(eventTable.type, eventTypeTable.id));

    revalidatePath("/admin");

    return events.map(({ events, event_types }) => ({
      ...events,
      eventType: event_types ?? undefined,
    }));
  } catch (err) {
    throw new Error(`Could not fetch events: ${err}`);
  }
};

export const GetEvent = async ({
  id,
}: {
  id: string;
}): Promise<EventWithType> => {
  try {
    const events = await db
      .select({
        events: eventTable,
        event_types: eventTypeTable,
      })
      .from(eventTable)
      .leftJoin(eventTypeTable, eq(eventTable.type, eventTypeTable.id))
      .where(eq(eventTable.id, id));

    if (!events[0]) {
      throw new Error(`Event not found with id: ${id}`);
    }

    return {
      ...events[0].events,
      eventType: events[0].event_types ?? undefined,
    };
  } catch (err) {
    throw new Error(`Could not fetch event: ${err}`);
  }
};

export const GetAllEventsAfterDate = async ({
  startDate,
}: {
  startDate: string;
}): Promise<EventWithType[]> => {
  try {
    if (!startDate) {
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
          eq(eventTable.isPublic, true),
          eq(eventTable.isVerified, true),
        ),
      )
      .orderBy(sql`DATE(${eventTable.start})`);

    revalidatePath("/");

    return events.map(({ events, event_types }) => ({
      ...events,
      eventType: event_types ?? undefined,
    }));
  } catch (err) {
    throw new Error(`Could not fetch events: ${err}`);
  }
};

export const GetEventsOverTime = async (): Promise<
  {
    date: string;
    count: number;
  }[]
> => {
  try {
    const eventsOverTime = await db
      .select({
        date: sql<string>`DATE(${eventTable.createdAt})`.as("date"),
        count: count(),
      })
      .from(eventTable)
      .where(and(eq(eventTable.isVerified, true)))
      .groupBy(sql`DATE(${eventTable.createdAt})`)
      .orderBy(sql`DATE(${eventTable.createdAt})`);

    return eventsOverTime;
  } catch (err) {
    throw new Error(`Could not fetch events over time: ${err}`);
  }
};

export const GetBookingLeadTimes = async (): Promise<
  { leadTimeDays: number; count: number }[]
> => {
  try {
    const leadTimes = await db
      .select({
        leadTimeDays:
          sql<number>`DATE_PART('day', ${eventTable.start} - ${eventTable.createdAt})`.as(
            "lead_time_days",
          ),
        count: count(),
      })
      .from(eventTable)
      .where(eq(eventTable.isVerified, true))
      .groupBy(sql`lead_time_days`)
      .orderBy(sql`lead_time_days`);

    return leadTimes.map((row) => ({
      leadTimeDays: row.leadTimeDays,
      count: row.count,
    }));
  } catch (err) {
    throw new Error(`Could not fetch booking lead times: ${err}`);
  }
};
