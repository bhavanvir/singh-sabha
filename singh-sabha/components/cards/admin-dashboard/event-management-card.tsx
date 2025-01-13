import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as React from "react";

import { Trash } from "lucide-react";

import { eventColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import DeleteExpiredEventsDialog from "@/components/dialogs/admin-dashboard/delete-expired-events-dialog";
import { EventWithType } from "@/db/schema";

interface EventManagementCardProps {
  events: EventWithType[];
}

export default function EventManagementCard({
  events,
}: EventManagementCardProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeEvents = events.filter((event) => event.end >= today);
  const expiredEvents = events.filter((event) => event.end < today);
  const expiredEventsLength = expiredEvents.length;

  const activeColumns = eventColumns(false);
  const expiredColumns = eventColumns(true);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Event Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Active Events</h3>
            {activeEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active events.</p>
            ) : (
              <DataTable columns={activeColumns} data={activeEvents} />
            )}
          </div>

          {expiredEvents.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Expired Events</h3>
              <DataTable columns={expiredColumns} data={expiredEvents} />
            </div>
          )}

          {expiredEventsLength > 0 && (
            <div className="flex justify-end">
              <Button onClick={() => setIsOpen(true)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete {expiredEventsLength} expired event
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
