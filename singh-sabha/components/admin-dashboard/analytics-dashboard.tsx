import { BookingLeadTimesCard } from "../cards/admin-dashboard/booking-lead-times";
import { EventsOverTimeCard } from "../cards/admin-dashboard/events-overtime-card";

import type { Analytics } from "@/lib/types/analytics";

export interface AnalyticsDashboardProps {
  analytics: Analytics;
}

export default function AnalyticsDashboard({
  analytics,
}: {
  analytics: Analytics;
}) {
  return (
    <div className="mx-auto container px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EventsOverTimeCard data={analytics.EventsOverTime} />
        <BookingLeadTimesCard data={analytics.BookingLeadTimes} />
      </div>
    </div>
  );
}
