import { GetActiveAnnouncement } from "@/lib/api/announcements/queries";
import NavBar from "@/components/navbar";
import { ActiveAnnouncement } from "@/components/announcement";
import Hero from "@/components/hero";

export default async function Home() {
  const [announcement] = await GetActiveAnnouncement();

  return (
    <>
      <NavBar currentLink="" />
      <ActiveAnnouncement announcement={announcement} />
      <main>
        <Hero />
      </main>
    </>
  );
}
