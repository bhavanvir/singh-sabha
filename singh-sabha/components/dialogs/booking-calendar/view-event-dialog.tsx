import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { RRule } from "rrule";

import { CalendarIcon, ClockIcon, RepeatIcon, StickyNote } from "lucide-react";

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
            {isGurdwaraEvent(event) && !event.eventType?.isSpecial && (
              <Badge
                className="text-xs sm:text-sm"
                style={{
                  backgroundColor: EventColors.gurdwara,
                }}
              >
                Gurdwara
              </Badge>
            )}
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
          {event.note && (
            <div className="flex flex-row items-start">
              <StickyNote className="h-4 w-4 mr-1 mt-1" />
              <p className="whitespace-pre-wrap">{event.note}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
