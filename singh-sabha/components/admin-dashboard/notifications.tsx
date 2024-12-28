import * as React from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Mail,
  Phone,
  Bell,
  Calendar,
  User,
  X,
  Search,
  HandCoins,
  CircleCheck,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

import { sendEventEmails } from "@/lib/send-event-email";
import ReviewEventDialog from "@/components/dialogs/review-event-dialog";
import { DeleteEvent, UpdateEvent } from "@/lib/api/events/mutations";
import { cn } from "@/lib/utils";

import type { EventWithType } from "@/db/schema";
import { EventColors } from "@/lib/types/event-colours";

interface NotificationsProps {
  unverifiedEvents: EventWithType[];
  verifiedEvents: EventWithType[];
}

export default function Notifications({
  unverifiedEvents,
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
        let updatedEvent: EventWithType | void = event;
        if (!event.isVerified) {
          updatedEvent = await UpdateEvent({
            updatedEvent: { ...event, isVerified: true },
          });
          await sendEventEmails(event, "/api/send/approved");
          setIsOpen(false);
          setUnderstood(false);
        }
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
        if (!event.isVerified) {
          await DeleteEvent({ id: event.id });
          await sendEventEmails(event, "/api/send/denied");
        }
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
        {unverifiedEvents.length > 0 ? (
          <div className="space-y-4">
            {unverifiedEvents.map((notification) => (
              <Card
                key={notification.id}
                className="overflow-hidden shadow-lg w-full max-w-xl mx-auto"
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                    <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-0">
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
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {notification.occassion}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(notification.start, "MMMM d, yyyy")}
                    {format(notification.start, "MMMM d, yyyy") !==
                      format(notification.end, "MMMM d, yyyy") &&
                      ` - ${format(notification.end, "MMMM d, yyyy")}`}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                    {notification.registrantFullName && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate">
                          {notification.registrantFullName}
                        </span>
                      </div>
                    )}
                    {notification.registrantEmail && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate">
                          {notification.registrantEmail}
                        </span>
                      </div>
                    )}
                    {notification.registrantPhoneNumber && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate">
                          {notification.registrantPhoneNumber}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mb-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <CircleCheck
                            className={cn(
                              "h-5 w-5",
                              notification.isVerified
                                ? "text-green-500"
                                : "text-red-500",
                            )}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          {notification.isVerified
                            ? "Event verified"
                            : "Event not verified"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HandCoins
                            className={cn(
                              "h-5 w-5",
                              notification.isDepositPaid
                                ? "text-green-500"
                                : "text-red-500",
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
                  {notification.note && (
                    <p className="text-sm text-muted-foreground border-t pt-2 mb-4">
                      {notification.note}
                    </p>
                  )}
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleDismiss(notification)}
                      disabled={notification.isVerified!}
                    >
                      <X className="w-4 h-4" />
                      Dismiss
                    </Button>
                    <Button
                      onClick={() => handleApprove(notification)}
                      disabled={notification.isVerified!}
                    >
                      <Search className="w-4 h-4" />
                      Review
                    </Button>
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
