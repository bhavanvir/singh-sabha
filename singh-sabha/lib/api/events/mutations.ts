"use server";

import { db } from "@/db/db";
import { eventTable } from "@/db/schema";
import type { Event } from "@/lib/types/event";

type CreateEventResponse =
  | { success: true; message: string }
  | { success: false; error: string };

export const CreateEvent = async ({
  newEvent,
}: {
  newEvent: Event;
}): Promise<CreateEventResponse> => {
  try {
    await db.insert(eventTable).values({
      registrantFullName: newEvent.registrantFullName,
      registrantEmail: newEvent.registrantEmail,
      registrantPhoneNumber: newEvent.registrantPhoneNumber,
      type: newEvent.type,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      isAllDay: newEvent.isAllDay,
      title: newEvent.title,
    });

    return { success: true, message: "Event created successfully." };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred.",
    };
  }
};
