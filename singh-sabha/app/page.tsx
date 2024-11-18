import { GetActiveAnnouncement } from "@/lib/api/announcements/queries";
import NavBar from "@/components/navbar";
import { ActiveAnnouncement } from "@/components/announcement";

export default async function Home() {
  const [announcement] = await GetActiveAnnouncement();

  return (
    <>
      <NavBar currentLink="" />
      <main className="p-4">
        <ActiveAnnouncement announcement={announcement} />
      </main>
    </>
  );
}
