"use server";

import { db } from "@/db/db";
import { eventTypeTable } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import type { EventType } from "@/lib/types/eventtype";

export const CreateEventType = async ({
  eventType,
}: {
  eventType: EventType;
}): Promise<void> => {
  if (!eventType.displayName) {
    throw new Error("Missing required parameter to create an event type");
  }

  try {
    await db.insert(eventTypeTable).values({
      displayName: eventType.displayName,
      isSpecial: eventType.isSpecial,
      isRequestable: eventType.isRequestable,
    });
    revalidatePath("/admin");
  } catch (err) {
    throw new Error(`Could not create event type: ${err}`);
  }
};

export const UpdateEventType = async ({
  eventType,
}: {
  eventType: EventType;
}): Promise<void> => {
  if (!eventType.id) {
    throw new Error("Missing required parameter to create an event type");
  }

  try {
    await db
      .update(eventTypeTable)
      .set({
        displayName: eventType.displayName,
        isSpecial: eventType.isSpecial,
        isRequestable: eventType.isRequestable,
      })
      .where(eq(eventTypeTable.id, eventType.id!));
    revalidatePath("/admin");
  } catch (err) {
    throw new Error(`Could not update event type: ${err}`);
  }
};

export const DeleteEventType = async ({
  id,
}: {
  id: string;
}): Promise<void> => {
  if (!id) {
    throw new Error("Missing required parameter to create an event type");
  }

  try {
    await db.delete(eventTypeTable).where(eq(eventTypeTable.id, id));
    revalidatePath("/admin");
  } catch (err) {
    throw new Error(`Could not update event type: ${err}`);
  }
};
