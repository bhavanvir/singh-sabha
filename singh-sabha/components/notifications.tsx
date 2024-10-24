import * as React from "react";
import { format } from "date-fns";
import {
  Calendar,
  CalendarCheck2,
  CalendarX2,
  Check,
  Clock,
  Mail,
  Phone,
  User,
  X,
  Inbox,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { typeEventMap } from "@/lib/types/eventdetails";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteEvent, UpdateEvent } from "@/lib/api/events/mutations";
import { toast } from "sonner";

import type { Event } from "@/lib/types/event";

interface ConflictingEvent extends Event {
  conflict: Event[];
}

interface NotificationsProps {
  notifications: ConflictingEvent[];
}

export default function Notifications({ notifications }: NotificationsProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] =
    React.useState<ConflictingEvent | null>(null);
  const [understood, setUnderstood] = React.useState(false);

  const formatEventTime = (event: Event) => {
    if (event.allDay) {
      return "All Day";
    }
    return `${format(event.start, "HH:mm")} - ${format(event.end, "HH:mm")}`;
  };

  const handleApprove = (id: string) => {
    const updatedEvent = notifications.find(
      (notification) => notification.id === id,
    );

    if (updatedEvent && updatedEvent.conflict.length > 0) {
      setSelectedEvent(updatedEvent);
      setIsOpen(true);
    } else if (updatedEvent) {
      approveEvent(updatedEvent);
    }
  };

  const approveEvent = (event: ConflictingEvent) => {
    const updatedEvent = { ...event, verified: true };

    toast.promise(UpdateEvent({ updatedEvent }), {
      loading: "Approving event...",
      success: "Event approved successfully!",
      error: "An unknown error occurred.",
    });

    setIsOpen(false);
    setUnderstood(false);
  };

  const handleDismiss = (id: string) => {
    toast.promise(DeleteEvent({ id }), {
      loading: "Dismissing event...",
      success: "Event dismissed successfully!",
      error: "An unknown error occurred.",
    });
  };

  return (
    <>
      <ScrollArea className="h-[calc(100vh-6rem)] mx-auto w-1/2 p-2 flex justify-center items-center">
        {notifications.length > 0 ? (
          <div className="space-y-4 w-full">
            {notifications.map((notification) => (
              <div key={notification.id} className="w-full">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        style={{
                          backgroundColor: `${typeEventMap[notification.type].colour}`,
                        }}
                      >
                        {typeEventMap[notification.type].displayName}
                      </Badge>
                      <div>
                        {notification.conflict.length > 0 ? (
                          <CalendarX2 className="h-5 w-5 text-red-500" />
                        ) : (
                          <CalendarCheck2 className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {notification.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {format(notification.start, "LLL dd, y")} -{" "}
                        {format(notification.end, "LLL dd, y")}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{formatEventTime(notification)}</span>
                    </div>
                    {notification.registrantFullName && (
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <User className="h-4 w-4 mr-2" />
                        <span>{notification.registrantFullName}</span>
                      </div>
                    )}
                    {notification.registrantEmail && (
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{notification.registrantEmail}</span>
                      </div>
                    )}
                    {notification.registrantPhoneNumber && (
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{notification.registrantPhoneNumber}</span>
                      </div>
                    )}
                    {notification.note && (
                      <p className="text-md text-gray-600 mt-2">
                        {notification.note}
                      </p>
                    )}
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center"
                        onClick={() => handleApprove(notification.id!)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center"
                        onClick={() => handleDismiss(notification.id!)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Inbox className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No notifications
            </h3>
            <p className="text-sm text-gray-500">
              You&apos;re all caught up! Check back later for new notifications.
            </p>
          </div>
        )}
      </ScrollArea>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm event approval</DialogTitle>
            <DialogDescription>
              This event conflicts with the following existing events:
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="mt-4 max-h-[60vh]">
            {selectedEvent?.conflict.map((conflictEvent, index) => (
              <div key={index} className="mb-4 p-4 border rounded-md">
                <Badge
                  style={{
                    backgroundColor: `${typeEventMap[conflictEvent.type].colour}`,
                  }}
                >
                  {typeEventMap[conflictEvent.type].displayName}
                </Badge>
                <h4 className="font-semibold">{conflictEvent.title}</h4>
                <p className="text-sm text-gray-500">
                  {format(conflictEvent.start, "LLL dd, y HH:mm")} -{" "}
                  {format(conflictEvent.end, "LLL dd, y HH:mm")}
                </p>
              </div>
            ))}
          </ScrollArea>
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="understood"
              checked={understood}
              onCheckedChange={(checked) => setUnderstood(checked as boolean)}
            />
            <label
              htmlFor="understood"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I understand that this event conflicts with existing events and
              still want to approve it.
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedEvent && approveEvent(selectedEvent)}
              disabled={!understood}
            >
              I understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
