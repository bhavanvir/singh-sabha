import { RRule } from "rrule";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { EventWithType } from "@/db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRecurringEvents = (
  events: EventWithType[],
): EventWithType[] => {
  const allGeneratedEvents: EventWithType[] = [];

  events.forEach((event) => {
    const { start, end, frequencyRule } = event;

    if (frequencyRule) {
      const rule = RRule.fromString(frequencyRule);

      const occurrenceDates = rule.all(); // Returns an array of Dates

      const generatedEvents = occurrenceDates.map((occurrenceStart) => ({
        ...event,
        start: occurrenceStart,
        end: new Date(
          occurrenceStart.getTime() + (end.getTime() - start.getTime()),
        ),
      }));

      allGeneratedEvents.push(...generatedEvents);
    } else {
      allGeneratedEvents.push(event);
    }
  });

  return allGeneratedEvents;
};
