import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, formatDistanceToNow } from "date-fns";
import * as React from "react";
import { toast } from "sonner";

import {
  Bell,
  Calendar,
  CircleCheck,
  HandCoins,
  Mail,
  Phone,
  Search,
  User,
  X,
} from "lucide-react";

import EmptyDataCard from "@/components/cards/empty-data-card";
import ReviewEventDialog from "@/components/dialogs/admin-dashboard/review-event-dialog";
import { UpdateEvent } from "@/lib/api/events/mutations";
import { sendEmail } from "@/lib/send-email";
import { cn } from "@/lib/utils";

import type { EventWithType } from "@/db/schema";
import DismissEventDialog from "./dialogs/admin-dashboard/dimiss-event-dialog";

interface NotificationsProps {
  unverifiedEvents: EventWithType[];
  verifiedEvents: EventWithType[];
}

export default function Notifications({
  unverifiedEvents,
  verifiedEvents,
}: NotificationsProps) {
  const [isReviewDialogOpen, setIsReviewDialogOpen] =
    React.useState<boolean>(false);
  const [isDismissEventCommenctDialogOpen, setIsDismissEventDialogOpen] =
    React.useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] =
    React.useState<EventWithType | null>(null);
  const [understood, setUnderstood] = React.useState<boolean>(false);

  const approveEvent = (event: EventWithType) => {
    toast.promise(
      async () => {
        let updatedEvent: EventWithType | void = event;
        if (!event.isVerified) {
          updatedEvent = await UpdateEvent({
            updatedEvent: { ...event, isVerified: true },
          });
          await sendEmail(event, "/api/send/approved");
          setIsReviewDialogOpen(false);
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

  return (
    <>
      <ScrollArea className="h-[calc(100vh-6rem)] mx-auto container px-4 md:px-6">
        {unverifiedEvents.length > 0 ? (
          <div className="space-y-4">
            {unverifiedEvents.map((notification) => (
              <Card
                key={notification.id}
                className="overflow-hidden w-full max-w-xl mx-auto"
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                    <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-0">
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-muted-foreground mb-2">
                    {notification.registrantFullName && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate">
                          {notification.registrantFullName}
                        </span>
                      </div>
                    )}
                    {notification.registrantEmail && (
                      <>
                        <Separator
                          orientation="vertical"
                          className="hidden sm:block h-4"
                        />
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="text-sm truncate">
                            {notification.registrantEmail}
                          </span>
                        </div>
                      </>
                    )}
                    {notification.registrantPhoneNumber && (
                      <>
                        <Separator
                          orientation="vertical"
                          className="hidden sm:block h-4"
                        />
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="text-sm truncate">
                            {notification.registrantPhoneNumber}
                          </span>
                        </div>
                      </>
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
                      onClick={() => {
                        setSelectedEvent(notification);
                        setIsDismissEventDialogOpen(true);
                      }}
                    >
                      <X className="w-4 h-4" />
                      Dismiss
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedEvent(notification);
                        setIsReviewDialogOpen(true);
                      }}
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
          <EmptyDataCard
            icon={Bell}
            title="No Notifications"
            description="You're all caught up! Check back later for new notifications."
            className="h-[calc(100vh-6rem)]"
          />
        )}
      </ScrollArea>
      {selectedEvent && (
        <>
          <ReviewEventDialog
            isOpen={isReviewDialogOpen}
            onClose={() => setIsReviewDialogOpen(false)}
            selectedEvent={selectedEvent}
            approveEvent={approveEvent}
            verifiedEvents={verifiedEvents}
          />
          <DismissEventDialog
            isOpen={isDismissEventCommenctDialogOpen}
            onClose={() => setIsDismissEventDialogOpen(false)}
            selectedEvent={selectedEvent}
          />
        </>
      )}
    </>
  );
}
