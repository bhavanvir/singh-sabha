import { validateRequest } from "@/lib/auth";
import LoginForm from "@/components/login";
import { Dashboard } from "@/components/dashboard";
import { GetAllEvents, GetAllUnverifiedEvents } from "@/lib/api/events/queries";
import moment from "moment";

import type { Event } from "@/lib/types/event";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    return <LoginForm />;
  }

  const events = await GetAllEvents();
  const notifications = await GetAllUnverifiedEvents();

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
      <Dashboard user={user} events={events} notifications={notifications} />
    </>
  );
}
