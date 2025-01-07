import moment from "moment";

import { GetActiveAnnouncement } from "@/lib/api/announcements/queries";
import { GetAllEventsAfterDate } from "@/lib/api/events/queries";
import { ActiveAnnouncement } from "@/components/announcement";
import HeroSection from "@/components/sections/hero-section";
import UpcomingEventsSection from "@/components/sections/upcoming-events-section";
import { GetAllRequestableEventTypes } from "@/lib/api/event-types/queries";
import ServicesSection from "@/components/sections/services-section";
import { DonationsSection } from "@/components/sections/donations-section";
import { ContactUsSection } from "@/components/sections/contact-us-section";
import { YoutubeLiveSection } from "@/components/sections/youtube-live-section";

export default async function Home() {
  moment.locale("en-CA");

  const currentDate = moment();
  const weekStart = currentDate.startOf("week").toISOString();

  const [announcement] = await GetActiveAnnouncement();
  const upcomingEvents = await GetAllEventsAfterDate({
    startDate: weekStart,
  });
  const eventTypes = await GetAllRequestableEventTypes();

  return (
    <>
      <ActiveAnnouncement announcement={announcement} />
      <main>
        <HeroSection />
        <UpcomingEventsSection upcomingEvents={upcomingEvents} />
        <ServicesSection eventTypes={eventTypes} />
        <YoutubeLiveSection />
        <DonationsSection />
        <ContactUsSection />
      </main>
    </>
  );
}
