import moment from "moment";
import { RRule } from "rrule";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Event, EventWithType } from "@/db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRecurringEvents = (
  events: EventWithType[],
): EventWithType[] => {
  const allGeneratedEvents: EventWithType[] = [];

  events.forEach((event) => {
    allGeneratedEvents.push(event);
    const { start, end, frequencyRule } = event;

    if (frequencyRule) {
      const rule = RRule.fromString(frequencyRule);
      const occurrenceDates = rule.all();

      const startTime = moment(start);
      const endTime = moment(end);

      const duration = moment.duration(endTime.diff(startTime));

      const startHours = startTime.hours();
      const startMinutes = startTime.minutes();

      occurrenceDates.forEach((date) => {
        const updatedStartDate = moment(date)
          .hours(startHours)
          .minutes(startMinutes);

        const updatedEndDate = moment(updatedStartDate).add(duration);

        if (
          !allGeneratedEvents.some((existingEvent) =>
            moment(existingEvent.start).isSame(updatedStartDate),
          ) &&
          updatedStartDate.isAfter(startTime)
        ) {
          allGeneratedEvents.push({
            ...event,
            start: updatedStartDate.toDate(),
            end: updatedEndDate.toDate(),
          });
        }
      });
    }
  });

  return allGeneratedEvents;
};

export function findConflicts(
  notification: EventWithType,
  verifiedEvents: EventWithType[],
) {
  const startA = moment(notification.start);
  const endA = moment(notification.end);

  const conflicts: EventWithType[] = [];
  verifiedEvents.forEach((verifiedEvent) => {
    const startB = moment(verifiedEvent.start);
    const endB = moment(verifiedEvent.end);

    if (
      startA.isBetween(startB, endB, null, "[)") ||
      startB.isBetween(startA, endA, null, "[)")
    ) {
      conflicts.push(verifiedEvent);
    }
  });
  return conflicts;
}

export function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export function isGurdwaraEvent(event: Event | EventWithType) {
  return (
    !event.registrantFullName &&
    !event.registrantEmail &&
    !event.registrantPhoneNumber
  );
}

export function getDurationFromNow(startDate: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}
