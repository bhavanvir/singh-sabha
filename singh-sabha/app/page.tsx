import moment from "moment";

import { GetActiveAnnouncement } from "@/lib/api/announcements/queries";
import { GetEventsBetweenDates } from "@/lib/api/events/queries";
import NavBar from "@/components/navbar";
import { ActiveAnnouncement } from "@/components/announcement";
import HeroSection from "@/components/hero-section";
import UpcomingEventsSection from "@/components/upcoming-events-section";

export const dynamic = "force-dynamic";

export default async function Home() {
  const currentDate = moment();
  const weekStart = currentDate.startOf("week").toISOString();
  const weekEnd = currentDate.endOf("week").toISOString();

  const [announcement] = await GetActiveAnnouncement();
  const upcomingEvents = await GetEventsBetweenDates({
    startDate: weekStart,
    endDate: weekEnd,
  });

  return (
    <>
      <NavBar currentLink="" />
      <ActiveAnnouncement announcement={announcement} />
      <main>
        <HeroSection />
        {upcomingEvents.length > 0 && (
          <UpcomingEventsSection upcomingEvents={upcomingEvents} />
        )}
      </main>
    </>
  );
}
