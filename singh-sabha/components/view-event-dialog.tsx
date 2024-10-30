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

import { typeEventMap } from "@/lib/types/eventdetails";

import type { Event } from "@/lib/types/event";

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

  const formatDate = (date: Date) => {
    return format(date, "MMMM d, yyyy");
  };

  const formatTime = (date: Date) => {
    return format(date, "h:mm a");
  };

  const isRecurring = event.frequencyRule
    ? (RRule.fromString(event.frequencyRule)?.options?.count ?? 0) > 0
    : false;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {event.title}
          </DialogTitle>
          <DialogDescription>
            <Badge
              variant="outline"
              style={{
                color: typeEventMap[event.type].colour,
                borderColor: typeEventMap[event.type].colour,
              }}
            >
              {typeEventMap[event.type].displayName}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-md">{formatDate(event.start)}</span>
          </div>
          {!event.allDay && (
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-md">{`${formatTime(event.start)} - ${formatTime(event.end)}`}</span>
            </div>
          )}
          {event.allDay && (
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-4 h-4 text-muted-foreground" />
              <span>All Day</span>
            </div>
          )}
          {isRecurring && (
            <div className="flex items-center space-x-2">
              <RepeatIcon className="w-4 h-4 text-muted-foreground" />
              <span>
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
