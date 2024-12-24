"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/db";
import { eventTable, eventTypeTable } from "@/db/schema";
import { eq } from "drizzle-orm";

import { sendEventEmails } from "@/lib/send-event-email";

import type { Event } from "@/db/schema";

export const CreateEvent = async ({
  newEvent,
}: {
  newEvent: Omit<
    Event,
    "id" | "registrantFullName" | "registrantEmail" | "registrantPhoneNumber"
  >;
}): Promise<string> => {
  try {
    const { ...eventData } = newEvent;

    const [insertedEvent] = await db
      .insert(eventTable)
      .values(eventData)
      .returning({ id: eventTable.id });

    if (!insertedEvent) {
      throw new Error("Event insertion failed, no ID returned");
    }

    revalidatePath("/calendar");
    revalidatePath("/admin");

    return insertedEvent.id;
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

    revalidatePath("/calendar");
    revalidatePath("/admin");
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

    revalidatePath("/calendar");
    revalidatePath("/admin");
  } catch (err) {
    throw new Error(`Could not delete event: ${err}`);
  }
};

export const processDeposit = async (id: string): Promise<void> => {
  if (!id) {
    throw new Error("Missing event ID");
  }

  try {
    const event = await db
      .select({
        events: eventTable,
        event_types: eventTypeTable,
      })
      .from(eventTable)
      .leftJoin(eventTypeTable, eq(eventTable.type, eventTypeTable.id))
      .where(eq(eventTable.id, id));

    if (!event) {
      throw new Error(`No event exists with ID ${id}`);
    }

    const [eventWithType] = event.map(({ events, event_types }) => ({
      ...events,
      eventType: event_types ?? undefined,
    }));

    if (!eventWithType.isDepositPaid) {
      await UpdateEvent({
        updatedEvent: {
          ...eventWithType,
          isDepositPaid: true,
        },
      });
      sendEventEmails(
        eventWithType,
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/send/confirmation`,
      );
    }
  } catch (err) {
    throw new Error(`Could not process deposit: ${err}`);
  }
};
