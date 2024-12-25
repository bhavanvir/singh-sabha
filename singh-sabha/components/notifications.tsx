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
  HandCoins,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

import { sendEventEmails } from "@/lib/send-event-email";
import ReviewEventDialog from "./dialogs/review-event-dialog";
import { DeleteEvent, UpdateEvent } from "@/lib/api/events/mutations";
import { cn } from "@/lib/utils";

import type { EventWithType } from "@/db/schema";
import { EventColors } from "@/lib/types/event-colours";

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
              <Card
                key={notification.id}
                className="overflow-hidden shadow-lg "
              >
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
                        <div className="flex items-center space-x-2">
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
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HandCoins
                                  className={cn(
                                    "h-5 w-5",
                                    {
                                      "stroke-green-500":
                                        notification.isDepositPaid,
                                    },
                                    {
                                      "stroke-red-500":
                                        !notification.isDepositPaid,
                                    },
                                  )}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                {notification.isDepositPaid
                                  ? "Deposit paid"
                                  : "Deposit not paid"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
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
                        <Button
                          onClick={() => handleApprove(notification)}
                          disabled={!notification.isDepositPaid}
                        >
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
          <div className="flex flex-col items-center justify-center h-full">
            <Card className="max-w-md shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Bell className="w-12 h-12 text-muted-foreground" />
                  <CardTitle className="text-2xl font-semibold tracking-tight">
                    No Notifications
                  </CardTitle>
                  <p className="text-muted-foreground">
                    You&apos;re all caught up! Check back later for new
                    notifications.
                  </p>
                </div>
              </CardContent>
            </Card>
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
