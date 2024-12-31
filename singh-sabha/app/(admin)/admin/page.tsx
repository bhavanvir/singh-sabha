import { validateRequest } from "@/lib/auth";
import { AdminDashboard } from "@/components/admin-dashboard/admin-dashboard";
import {
  GetAllEvents,
  GetBookingLeadTimes,
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

export default async function Admin() {
  const { user } = await validateRequest();
  if (!user) {
    redirect("/admin/sign-in");
  }

  const users = await GetAllUsers();
  const events = await GetAllEvents();
  const mailingList = await GetMailingList();
  const eventTypes = await GetAllEventTypes();
  const announcements = await GetAllAnnouncements();

  const analytics: Analytics = {};
  const eventsOverTime = await GetEventsOverTime();
  const bookingLeadTimes = await GetBookingLeadTimes();
  analytics.EventsOverTime = eventsOverTime;
  analytics.BookingLeadTimes = bookingLeadTimes;

  // Applies all reoccurence rules
  const allGeneratedEvents = generateRecurringEvents(events);

  return (
    <>
      <AdminDashboard
        user={user}
        users={users}
        events={allGeneratedEvents}
        mailingList={mailingList}
        eventTypes={eventTypes}
        announcements={announcements}
        analytics={analytics}
      />
    </>
  );
}
