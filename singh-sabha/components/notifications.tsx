import * as React from "react";
import { format } from "date-fns";
import {
  Mail,
  Phone,
  Clock,
  Bell,
  CalendarCheck2,
  CalendarX2,
  Check,
  User,
  X,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
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

export interface ConflictingEvent extends Event {
  conflict: Event[];
}

interface NotificationsProps {
  notifications: ConflictingEvent[];
}

export default function Component({ notifications = [] }: NotificationsProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] =
    React.useState<ConflictingEvent | null>(null);
  const [understood, setUnderstood] = React.useState(false);

  const handleApprove = (event: ConflictingEvent) => {
    if (event.conflict.length > 0) {
      setSelectedEvent(event);
      setIsOpen(true);
    } else {
      approveEvent(event);
    }
  };

  const approveEvent = (event: ConflictingEvent) => {
    toast.promise(UpdateEvent({ updatedEvent: { ...event, verified: true } }), {
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
      <ScrollArea className="h-[calc(100vh-6rem)] w-full max-w-4xl mx-auto p-4">
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    <div className="flex-grow p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          style={{
                            backgroundColor:
                              typeEventMap[notification.type].colour,
                          }}
                        >
                          {typeEventMap[notification.type].displayName}
                        </Badge>

                        {notification.conflict.length > 0 ? (
                          <CalendarX2 className="h-5 w-5 text-red-500" />
                        ) : (
                          <CalendarCheck2 className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-1">
                        {notification.title}
                      </h3>
                      <p className="flex items-center text-sm text-muted-foreground mb-2">
                        <Clock className="h-4 w-4 mr-1" />
                        {format(
                          notification.start,
                          "EEE, MMM d, h:mm a",
                        )} - {format(notification.end, "h:mm a")}
                      </p>
                      {(notification.registrantFullName ||
                        notification.registrantEmail ||
                        notification.registrantPhoneNumber) && (
                        <div className="flex items-center text-sm text-muted-foreground mb-2 space-x-2">
                          {notification.registrantFullName && (
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              <span>{notification.registrantFullName}</span>
                            </div>
                          )}
                          {notification.registrantEmail && (
                            <>
                              <Separator
                                orientation="vertical"
                                className="h-4"
                              />
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-1" />
                                <span>{notification.registrantEmail}</span>
                              </div>
                            </>
                          )}
                          {notification.registrantPhoneNumber && (
                            <>
                              <Separator
                                orientation="vertical"
                                className="h-4"
                              />
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-1" />
                                <span>
                                  {notification.registrantPhoneNumber}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                      {notification.note && (
                        <p className="text-sm mt-2 text-muted-foreground border-t pt-2">
                          {notification.note}
                        </p>
                      )}
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleDismiss(notification.id!)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          onClick={() => handleApprove(notification)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No notifications</h3>
            <p className="text-sm text-muted-foreground">
              You&apos;re all caught up! Check back later for new notifications.
            </p>
          </div>
        )}
      </ScrollArea>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm event approval</DialogTitle>
            <DialogDescription>
              This event conflicts with existing events. Please review and
              confirm.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="mt-4 max-h-[60vh]">
            {selectedEvent?.conflict.map((conflictEvent, index) => (
              <div key={index} className="mb-4 p-4 border rounded-md">
                <Badge
                  style={{
                    backgroundColor: typeEventMap[conflictEvent.type].colour,
                  }}
                >
                  {typeEventMap[conflictEvent.type].displayName}
                </Badge>
                <h4 className="font-bold mt-2">{conflictEvent.title}</h4>
                <span className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {format(conflictEvent.start, "EEE, MMM d, h:mm a")} -{" "}
                  {format(conflictEvent.end, "h:mm a")}
                </span>
              </div>
            ))}
          </ScrollArea>
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="understood"
              checked={understood}
              onCheckedChange={(checked) => setUnderstood(checked as boolean)}
            />
            <label htmlFor="understood" className="text-sm">
              I understand the conflicts and want to approve this event.
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
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
