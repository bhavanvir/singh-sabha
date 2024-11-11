import { validateRequest } from "@/lib/auth";
import { Dashboard } from "@/components/dashboard";
import {
  GetAllEvents,
  GetAllUnverifiedEvents,
  GetMailingList,
  GetAllEventTypes,
} from "@/lib/api/events/queries";
import { generateRecurringEvents } from "@/lib/utils";
import { redirect } from "next/navigation";
import moment from "moment";

import type { Event } from "@/lib/types/event";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    redirect("/admin/signin");
  }

  const events = await GetAllEvents();
  const notifications = await GetAllUnverifiedEvents();
  const mailingList = await GetMailingList();
  const eventTypes = await GetAllEventTypes();

  // Applies all reoccurence rules
  const allGeneratedEvents = generateRecurringEvents(events);

  const verifiedEvents = events.filter(
    (event: Event) => event.verified === true,
  );

  for (let i = 0; i < notifications.length; i++) {
    const unverifiedEvent = notifications[i];
    const startA = moment(unverifiedEvent.start);
    const endA = moment(unverifiedEvent.end);

    notifications[i].conflict = [];
    for (let j = 0; j < verifiedEvents.length; j++) {
      const verifiedEvent = verifiedEvents[j];
      const startB = moment(verifiedEvent.start);
      const endB = moment(verifiedEvent.end);

      if (
        startA.isBetween(startB, endB, null, "[)") ||
        startB.isBetween(startA, endA, null, "[)")
      ) {
        notifications[i].conflict.push(verifiedEvent);
      }
    }
  }

  return (
    <>
      <Dashboard
        user={user}
        events={allGeneratedEvents}
        notifications={notifications}
        mailingList={mailingList}
        eventTypes={eventTypes}
      />
    </>
  );
}
