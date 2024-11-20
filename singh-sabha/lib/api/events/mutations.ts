"use server";

import { db } from "@/db/db";
import { eventTable } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import type { Event } from "@/db/schema";

export const CreateEvent = async ({
  newEvent,
}: {
  newEvent: Omit<
    Event,
    "id" | "registrantFullName" | "registrantEmail" | "registrantPhoneNumber"
  >;
}): Promise<void> => {
  try {
    const { ...eventData } = newEvent;
    await db.insert(eventTable).values(eventData);
    revalidatePath("/");
  } catch (err) {
    throw new Error(`Could not add an event: ${err}`);
  }
};

export const UpdateEvent = async ({
  updatedEvent,
}: {
  updatedEvent: Event;
}): Promise<void> => {
  if (!updatedEvent.id) {
    throw new Error("Event ID is required for updating");
  }

  try {
    // Remove the id from the update payload since it's the primary key
    const { id, ...updateData } = updatedEvent;
    await db.update(eventTable).set(updateData).where(eq(eventTable.id, id));
    revalidatePath("/");
  } catch (err) {
    throw new Error(`Could not update event: ${err}`);
  }
};

export const DeleteEvent = async ({ id }: { id: string }): Promise<void> => {
  if (!id) {
    throw new Error("Event ID is required to delete event");
  }

  try {
    await db.delete(eventTable).where(eq(eventTable.id, id));
    revalidatePath("/");
  } catch (err) {
    throw new Error(`Could not delete event: ${err}`);
  }
};
