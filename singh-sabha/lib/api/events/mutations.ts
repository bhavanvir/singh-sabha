"use server";

import { db } from "@/db/db";
import { eventTable } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import type { Event } from "@/lib/types/event";

export const CreateEvent = async ({
  newEvent,
}: {
  newEvent: Event;
}): Promise<void> => {
  try {
    await db.insert(eventTable).values({
      registrantFullName: newEvent.registrantFullName,
      registrantEmail: newEvent.registrantEmail,
      registrantPhoneNumber: newEvent.registrantPhoneNumber,
      type: newEvent.type,
      start: newEvent.start,
      end: newEvent.end,
      allDay: newEvent.allDay,
      title: newEvent.title,
      note: newEvent.note,
    });
    revalidatePath("/admin");
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

    revalidatePath("/admin");
  } catch (err) {
    throw new Error(`Could not update event: ${err}`);
  }
};

export const DeleteEvent = async ({
  event,
}: {
  event: Event;
}): Promise<void> => {
  if (!event.id) {
    throw new Error("Event ID is required to delete event");
  }

  try {
    await db.delete(eventTable).where(eq(eventTable.id, event.id));
    revalidatePath("/admin");
  } catch (err) {
    throw new Error(`Could not delete event: ${err}`);
  }
};
