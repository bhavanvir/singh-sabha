"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/db";
import { eventTypeTable } from "@/db/schema";

import type { EventType } from "@/db/schema";
import { eq } from "drizzle-orm";

export const GetAllEventTypes = async (): Promise<EventType[]> => {
  try {
    const eventTypes = await db.select().from(eventTypeTable);

    revalidatePath("/admin");

    return eventTypes;
  } catch (err) {
    throw new Error(`Could not fetch event types: ${err}`);
  }
};

export const GetAllRequestableEventTypes = async (): Promise<EventType[]> => {
  try {
    const eventTypes = await db
      .select()
      .from(eventTypeTable)
      .where(eq(eventTypeTable.isRequestable, true));

    revalidatePath("/admin");

    return eventTypes;
  } catch (err) {
    throw new Error(`Could not fetch event types: ${err}`);
  }
};

export const GetEventType = async ({ id }: { id: string }): Promise<string> => {
  try {
    const [eventType] = await db
      .select()
      .from(eventTypeTable)
      .where(eq(eventTypeTable.id, id));
    return eventType.displayName;
  } catch (err) {
    throw new Error(`Could not fetch event type: ${err}`);
  }
};
