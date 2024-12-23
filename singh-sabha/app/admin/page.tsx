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

import type { Analytics } from "@/lib/types/analytics";

export const metadata = {
  title: "Admin",
};

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    redirect("/admin/sign-in");
  }

  const users = await GetAllUsers();
  const events = await GetAllEvents();
  const notifications = await GetAllUnverifiedEvents();
  const mailingList = await GetMailingList();
  const eventTypes = await GetAllEventTypes();
  const announcements = await GetAllAnnouncements();

  const analytics: Analytics = {};
  const eventsOverTime = await GetEventsOverTime();
  analytics.EventsOverTime = eventsOverTime;

  // Applies all reoccurence rules
  const allGeneratedEvents = generateRecurringEvents(events);

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
