import { validateRequest } from "@/lib/auth";
import { Dashboard } from "@/components/dashboard";
import {
  GetAllEvents,
  GetAllUnverifiedEvents,
  GetEventsOverTime,
} from "@/lib/api/events/queries";
import { GetMailingList } from "@/lib/api/mailing-list/queries";
import { GetAllEventTypes } from "@/lib/api/event-types/queries";
import { GetAllUsers } from "@/lib/api/users/queries";
import { GetAllAnnouncements } from "@/lib/api/announcements/queries";
import { generateRecurringEvents } from "@/lib/utils";
import { redirect } from "next/navigation";
import moment from "moment";

import type { ConflictingEvent } from "@/components/notifications";
import type { EventWithType } from "@/db/schema";
import type { Analytics } from "@/lib/types/analytics";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    redirect("/admin/signin");
  }

  const users = await GetAllUsers();
  const events = await GetAllEvents();
  const notifications = (await GetAllUnverifiedEvents()) as ConflictingEvent[];
  const mailingList = await GetMailingList();
  const eventTypes = await GetAllEventTypes();
  const announcements = await GetAllAnnouncements();

  const analytics: Analytics = {};
  const eventsOverTime = await GetEventsOverTime();
  analytics.EventsOverTime = eventsOverTime;

  // Applies all reoccurence rules
  const allGeneratedEvents = generateRecurringEvents(events);

  const verifiedEvents = events.filter(
    (event: EventWithType) => event.isVerified === true,
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
        users={users}
        events={allGeneratedEvents}
        notifications={notifications}
        mailingList={mailingList}
        eventTypes={eventTypes}
        announcements={announcements}
        analytics={analytics}
      />
    </>
  );
}
