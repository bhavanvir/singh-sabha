import BookingCalendar from "@/components/booking-calendar";
import NavBar from "@/components/navbar";
import {
  GetAllVerifiedEvents,
  GetAllEventTypes,
} from "@/lib/api/events/queries";
import { generateRecurringEvents } from "@/lib/utils";

export default async function Calendar() {
  const events = await GetAllVerifiedEvents();
  const eventTypes = await GetAllEventTypes();

  // Applies all reoccurence rules
  const allGeneratedEvents = generateRecurringEvents(events);

  return (
    <>
      <NavBar currentLink="Calendar" />
      <div className="p-4">
        <BookingCalendar
          user={null}
          events={allGeneratedEvents}
          eventTypes={eventTypes}
        />
      </div>
    </>
  );
}
