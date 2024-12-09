import { EventsOverTimeCard } from "./cards/events-overtime-card";

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
    <div className="mx-auto p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EventsOverTimeCard data={analytics.EventsOverTime} />
      </div>
    </div>
  );
}
