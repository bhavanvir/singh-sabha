import { BarChart2 } from "lucide-react";

import { BookingLeadTimesCard } from "@/components/cards/admin-dashboard/booking-lead-times";
import { EventsOverTimeCard } from "@/components/cards/admin-dashboard/events-overtime-card";
import EmptyDataCard from "@/components/cards/empty-data-card";

import type { Analytics } from "@/lib/types/analytics";

export interface AnalyticsDashboardProps {
  analytics: Analytics;
}

export default function AnalyticsDashboard({
  analytics,
}: {
  analytics: Analytics;
}) {
  const hasEventsOverTimeData =
    analytics.EventsOverTime && analytics.EventsOverTime.length > 0;
  const hasBookingLeadTimesData =
    analytics.BookingLeadTimes && analytics.BookingLeadTimes.length > 0;

  if (!hasEventsOverTimeData && !hasBookingLeadTimesData) {
    return (
      <EmptyDataCard
        icon={BarChart2}
        title="No Analytics Data"
        description="There's no analytics data available at the moment. Check back later for insights."
        className="h-[calc(100vh-6rem)]"
      />
    );
  }

  return (
    <div className="mx-auto container px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hasEventsOverTimeData && (
          <EventsOverTimeCard data={analytics.EventsOverTime} />
        )}
        {hasBookingLeadTimesData && (
          <BookingLeadTimesCard data={analytics.BookingLeadTimes} />
        )}
      </div>
    </div>
  );
}
