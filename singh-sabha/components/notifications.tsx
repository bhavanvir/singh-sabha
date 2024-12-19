import * as React from "react";
import { format } from "date-fns";
import {
  Mail,
  Phone,
  Bell,
  Calendar,
  CalendarSearch,
  User,
  X,
  Search,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider } from "./ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

import { sendEventEmails } from "@/lib/send-event-email";
import ReviewEventDialog from "./dialogs/review-event-dialog";
import { DeleteEvent, UpdateEvent } from "@/lib/api/events/mutations";

import type { EventWithType } from "@/db/schema";
import { EventColors } from "@/lib/types/event-colours";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

interface NotificationsProps {
  notifications: EventWithType[];
  verifiedEvents: EventWithType[];
}

export default function Notifications({
  notifications,
  verifiedEvents,
}: NotificationsProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] =
    React.useState<EventWithType | null>(null);
  const [understood, setUnderstood] = React.useState<boolean>(false);
  const [isReviewed, setIsReviewed] = React.useState<boolean>(false);

  const handleApprove = (event: EventWithType) => {
    setSelectedEvent(event);
    setIsOpen(true);
  };

  const approveEvent = (event: EventWithType) => {
    toast.promise(
      async () => {
        const updatedEvent = await UpdateEvent({
          updatedEvent: { ...event, isVerified: true },
        });
        await sendEventEmails(event, "/api/send/approved");
        setIsOpen(false);
        setUnderstood(false);
        return updatedEvent;
      },
      {
        loading: "Approving event and sending notification...",
        success: "Event approved and notification sent successfully!",
        error: "Failed to approve event or send notification.",
      },
    );
  };

  const handleDismiss = (event: EventWithType) => {
    toast.promise(
      async () => {
        await DeleteEvent({ id: event.id });
        await sendEventEmails(event, "/api/send/denied");
        return event;
      },
      {
        loading: "Dismissing event and sending notification...",
        success: "Event dismissed and notification sent successfully!",
        error: "Failed to dismiss event or send notification.",
      },
    );
  };

  return (
    <>
      <ScrollArea className="h-[calc(100vh-6rem)] mx-auto container px-4 md:px-6">
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    <div className="flex-grow p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="space-x-2">
                          <Badge
                            style={{
                              backgroundColor: notification.eventType?.isSpecial
                                ? EventColors.special
                                : EventColors.regular,
                            }}
                          >
                            {notification.eventType?.isSpecial
                              ? "Special"
                              : "Regular"}
                          </Badge>
                          <Badge>{notification.eventType?.displayName}</Badge>
                        </div>
                        {!isReviewed && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <CalendarSearch className="h-5 w-5 stroke-yellow-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Event requires review</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-1">
                        {notification.occassion}
                      </h3>
                      <div>
                        <p className="flex items-center text-sm text-muted-foreground mb-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(notification.start, "MMMM d, yyyy")}
                          {format(notification.start, "MMMM d, yyyy") !==
                            format(notification.end, "MMMM d, yyyy") &&
                            ` - ${format(notification.end, "MMMM d, yyyy")}`}
                        </p>
                      </div>
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
                          variant="outline"
                          onClick={() => handleDismiss(notification)}
                        >
                          <X />
                          Dismiss
                        </Button>
                        <Button onClick={() => handleApprove(notification)}>
                          <Search />
                          Review
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
      {selectedEvent && (
        <ReviewEventDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          selectedEvent={selectedEvent}
          approveEvent={approveEvent}
          verifiedEvents={verifiedEvents}
        />
      )}
    </>
  );
}
