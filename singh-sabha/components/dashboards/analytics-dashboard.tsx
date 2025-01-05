import { BookingLeadTimesCard } from "@/components/cards/admin-dashboard/booking-lead-times";
import { EventsOverTimeCard } from "@/components/cards/admin-dashboard/events-overtime-card";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)]">
        <Card className="max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <BarChart2 className="w-12 h-12 text-muted-foreground" />
              <CardTitle className="text-2xl font-semibold tracking-tight">
                No Analytics Data
              </CardTitle>
              <p className="text-muted-foreground">
                There&apos;s no analytics data available at the moment. Check
                back later for insights.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
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
