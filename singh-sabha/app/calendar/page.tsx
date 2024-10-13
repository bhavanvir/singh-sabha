import BookingCalendar from "@/components/booking-calendar";

export default function Calendar() {
  return (
    <>
      <div className="flex h-screen gap-8 p-8">
        <div className="w-full">
          <BookingCalendar />
        </div>
      </div>
    </>
  );
}
