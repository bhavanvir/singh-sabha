import { RRule } from "rrule";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Event } from "@/lib/types/event";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRecurringEvents = (events: Event[]): Event[] => {
  const allGeneratedEvents: Event[] = [];

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
