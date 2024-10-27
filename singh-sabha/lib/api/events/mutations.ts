"use server";

import { db } from "@/db/db";
import { eventTable, tempPasswordTable } from "@/db/schema";
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
      verified: newEvent.verified,
      frequencyRule: newEvent.frequencyRule,
    });
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

export const AddTempPassword = async ({
  tempPassword,
  issuer,
}: {
  tempPassword: string;
  issuer: string;
}): Promise<void> => {
  if (!tempPassword) {
    throw new Error("Temporary pasword is required to insert");
  }

  try {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    await db.insert(tempPasswordTable).values({
      tempPassword: tempPassword,
      issuer,
      expiresAt: expiresAt,
    });
  } catch (err) {
    throw new Error(`Could not insert temporary password: ${err}`);
  }
};
