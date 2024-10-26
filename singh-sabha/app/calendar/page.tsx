import BookingCalendar from "@/components/booking-calendar";
import NavBar from "@/components/navbar";
import { GetAllVerifiedEvents } from "@/lib/api/events/queries";
import { generateRecurringEvents } from "@/lib/utils";

export default async function Calendar() {
  const events = await GetAllVerifiedEvents();

  // Applies all reoccurence rules
  const allGeneratedEvents = generateRecurringEvents(events);

  return (
    <div>
      <NavBar />
      <div className="p-4">
        <BookingCalendar user={null} events={allGeneratedEvents} />
      </div>
    </div>
  );
}
