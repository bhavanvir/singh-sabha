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

import type { Event } from "@/lib/types/event";
import { EventColors } from "@/lib/types/eventcolours";

interface ViewEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
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
            {event.title}
          </DialogTitle>
          <DialogDescription className="space-x-2">
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
            {isRecurring && (
              <Badge variant="secondary">
                <RepeatIcon className="w-3 h-3 mr-1" />
                Recurring
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-md">
              {format(event.start, "MMMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <ClockIcon className="w-4 h-4" />
            <span className="text-md">{`${format(event.start, "h:mm a")} - ${format(event.end, "h:mm a")}`}</span>
          </div>
          {isRecurring && event.frequencyRule && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <RepeatIcon className="w-4 h-4" />
              <span className="text-md">
                {RRule.fromString(event.frequencyRule)
                  .toText()
                  .replace(
                    /^(\w)(.*)/,
                    (_, firstChar, rest) => firstChar.toUpperCase() + rest,
                  )}
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
