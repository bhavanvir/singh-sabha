import BookingCalendar from "@/components/booking-calendar";
import NavBar from "@/components/navbar";
import { GetAllVerifiedEvents } from "@/lib/api/events/queries";
import { GetAllRequestableEventTypes } from "@/lib/api/event-types/queries";
import { generateRecurringEvents } from "@/lib/utils";

export const metadata = {
  title: "Calendar",
};

export default async function Calendar() {
  const events = await GetAllVerifiedEvents();
  const eventTypes = await GetAllRequestableEventTypes();

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
