import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

import { Calendar, Clock } from "lucide-react";

import type { EventWithType } from "@/db/schema";
import { EventColors } from "@/lib/types/event-colours";

export default function EventSummary({ event }: { event: EventWithType }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-semibold">{event.occassion}</span>
        <div className="flex items-center space-x-2">
          {event.eventType?.isSpecial && (
            <Badge
              className="text-xs sm:text-sm"
              style={{
                backgroundColor: EventColors.special,
              }}
            >
              Special
            </Badge>
          )}
          <Badge>{event.eventType?.displayName}</Badge>
        </div>
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <Calendar className="mr-1 h-4 w-4" />
        <span>{format(event.start, "MMMM d, yyyy")}</span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <Clock className="mr-1 h-4 w-4" />
        {format(new Date(event.start), "h:mm a")} -{" "}
        {format(new Date(event.end), "h:mm a")}
      </div>
    </div>
  );
}
