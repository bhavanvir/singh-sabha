import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { ClockAlert, Trash } from "lucide-react";

import { DeleteEvent } from "@/lib/api/events/mutations";
import DeleteExpiredEventsDialog from "@/components/dialogs/admin-dashboard/delete-expired-events-dialog";

import { EventWithType } from "@/db/schema";
import { EventColors } from "@/lib/types/event-colours";

interface EventManagementCardProps {
  events: EventWithType[];
}

export default function EventManagementCard({
  events,
}: EventManagementCardProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleDeleteEvent = (id: string) => {
    toast.promise(DeleteEvent({ id }), {
      loading: "Deleting event...",
      success: "Deleted event successfully!",
      error: "Failed to delete event.",
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiredEvents = events.filter((event) => event.start < today);
  const expiredEventsLength = expiredEvents.length;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Event Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">All Events</h3>
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No events added yet.
              </p>
            ) : (
              <ScrollArea>
                <ul className="space-y-2 max-h-[160px]">
                  {events.map((event) => (
                    <li
                      key={event.id}
                      className="flex items-center justify-between bg-secondary p-2 rounded-md"
                    >
                      <div className="inline-flex items-center space-x-2">
                        <Badge
                          style={{
                            backgroundColor: event.eventType?.isSpecial
                              ? EventColors.special
                              : EventColors.regular,
                          }}
                        >
                          {event.eventType?.isSpecial ? "Special" : "Regular"}
                        </Badge>
                        <Badge>{event.eventType?.displayName}</Badge>
                        {event.start < today && (
                          <Badge variant="destructive">
                            <ClockAlert className="h-3 w-3 mr-1" />
                            Expired
                          </Badge>
                        )}
                        <span>{event.occassion}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          {event.registrantFullName}
                        </span>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                        aria-label={`Delete ${event.eventType?.displayName}`}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </div>
          {expiredEventsLength > 0 && (
            <div className="flex justify-end">
              <Button onClick={() => setIsOpen(true)}>
                <Trash /> Delete {expiredEventsLength} expired event
                {expiredEventsLength > 1 ? "s" : ""}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <DeleteExpiredEventsDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        expiredEvents={expiredEvents}
      />
    </>
  );
}
