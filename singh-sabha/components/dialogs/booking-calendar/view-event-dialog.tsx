import { format } from "date-fns";
import { CalendarIcon, ClockIcon, RepeatIcon } from "lucide-react";
import { RRule } from "rrule";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import { EventColors } from "@/lib/types/event-colours";

import { capitalizeFirstLetter, isGurdwaraEvent } from "@/lib/utils";

import type { EventWithType } from "@/db/schema";

interface ViewEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventWithType | null;
}

export default function ViewEventDialog({
  isOpen,
  onClose,
  event,
}: ViewEventDialogProps) {
  if (!event) return null;

  const isRecurring = event.frequencyRule
    ? (RRule.fromString(event.frequencyRule)?.options?.count ?? 0) > 1
    : false;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {event.occassion}
          </DialogTitle>
          <DialogDescription className="space-x-2">
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
            {isRecurring && (
              <Badge variant="secondary">
                <RepeatIcon className="h-3 w-3 mr-1" />
                Recurring
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <CalendarIcon className="h-4 w-4 " />
            <span className="text-md">
              {format(event.start, "MMMM d, yyyy")}
              {format(event.start, "MMMM d, yyyy") !==
                format(event.end, "MMMM d, yyyy") &&
                ` - ${format(event.end, "MMMM d, yyyy")}`}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <ClockIcon className="h-4 w-4" />
            <span className="text-md">{`${format(event.start, "h:mm a")} - ${format(event.end, "h:mm a")}`}</span>
          </div>
          {isRecurring && event.frequencyRule && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <RepeatIcon className="h-4 w-4 " />
              <span className="text-md">
                {capitalizeFirstLetter(
                  RRule.fromString(event.frequencyRule).toText(),
                )}
              </span>
            </div>
          )}
          {isGurdwaraEvent(event) && event.note && (
            <p className="whitespace-pre-wrap">{event.note}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
