import BookingCalendar from "@/components/booking-calendar";
import NavBar from "@/components/client-navbar";
import { GetAllVerifiedEvents } from "@/lib/api/events/queries";

export default async function Calendar() {
  const events = await GetAllVerifiedEvents();

  return (
    <div>
      <NavBar />
      <div className="p-4">
        <BookingCalendar user={null} events={events} />
      </div>
    </div>
  );
}
