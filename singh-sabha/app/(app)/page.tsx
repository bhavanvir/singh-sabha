import { ActiveAnnouncement } from "@/components/announcement";
import { ContactUsSection } from "@/components/sections/contact-us-section";
import { DonationsSection } from "@/components/sections/donations-section";
import HeroSection from "@/components/sections/hero-section";
import ServicesSection from "@/components/sections/services-section";
import UpcomingEventsSection from "@/components/sections/upcoming-events-section";
import { YoutubeLiveSection } from "@/components/sections/youtube-live-section";
import { GetActiveAnnouncement } from "@/lib/api/announcements/queries";
import { GetAllRequestableEventTypes } from "@/lib/api/event-types/queries";
import { GetAllEventsAfterDate } from "@/lib/api/events/queries";

export default async function Home() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [announcement] = await GetActiveAnnouncement();
  const upcomingEvents = await GetAllEventsAfterDate({
    startDate: today.toISOString(),
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
