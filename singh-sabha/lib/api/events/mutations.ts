"use server";

import { db } from "@/db/db";
import { eventTable } from "@/db/schema";
import { revalidatePath } from "next/cache";

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
    });
    revalidatePath("/admin");
  } catch (err) {
    throw new Error(`Could not add an event: ${err}`);
  }
};
