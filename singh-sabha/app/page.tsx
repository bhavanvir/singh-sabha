import moment from "moment";

import { GetActiveAnnouncement } from "@/lib/api/announcements/queries";
import { GetEventsBetweenDates } from "@/lib/api/events/queries";
import NavBar from "@/components/navbar";
import { ActiveAnnouncement } from "@/components/announcement";
import HeroSection from "@/components/sections/hero-section";
import UpcomingEventsSection from "@/components/sections/upcoming-events-section";
import { GetAllRequestableEventTypes } from "@/lib/api/event-types/queries";
import ServicesSection from "@/components/sections/services-section";

export default async function Home() {
  moment.locale("en-CA");

  const currentDate = moment();
  const weekStart = currentDate.startOf("week").toISOString();
  const weekEnd = currentDate.endOf("week").toISOString();

  const [announcement] = await GetActiveAnnouncement();
  const upcomingEvents = await GetEventsBetweenDates({
    startDate: weekStart,
    endDate: weekEnd,
  });
  const eventTypes = await GetAllRequestableEventTypes();

  return (
    <>
      <NavBar currentLink="" />
      <ActiveAnnouncement announcement={announcement} />
      <main>
        <HeroSection />
        {upcomingEvents.length > 0 && (
          <UpcomingEventsSection upcomingEvents={upcomingEvents} />
        )}
        <ServicesSection eventTypes={eventTypes} />
      </main>
    </>
  );
}
