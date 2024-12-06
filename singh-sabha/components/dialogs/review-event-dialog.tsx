import * as React from "react";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { timeRangeSchema } from "@/lib/event-schema";

import { EventColors } from "@/lib/types/event-colours";
import { EventWithType } from "@/db/schema";
import { findConflicts } from "@/lib/utils";

interface ReviewEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: EventWithType;
  approveEvent: (event: EventWithType) => void;
  verifiedEvents: EventWithType[];
}

export default function ReviewEventDialog({
  isOpen,
  onClose,
  selectedEvent,
  approveEvent,
  verifiedEvents,
}: ReviewEventDialogProps) {
  const [understood, setUnderstood] = React.useState<boolean>(false);
  const [startTime, setStartTime] = React.useState<string | null>(null);
  const [endTime, setEndTime] = React.useState<string | null>(null);
  const [conflicts, setConflicts] = React.useState<EventWithType[]>([]);
  const [updatedEvent, setUpdatedEvent] = React.useState<EventWithType | null>(
    null,
  );

  const areTimesFilled = startTime && endTime;

  const form = useForm<z.infer<typeof timeRangeSchema>>({
    resolver: zodResolver(timeRangeSchema),
    defaultValues: {
      startTime: null,
      endTime: null,
    },
  });

  const handleSubmit: SubmitHandler<z.infer<typeof timeRangeSchema>> = () => {
    console.log(updatedEvent);
  };

  const handleClose = () => {
    setStartTime(null);
    setEndTime(null);
    onClose();
  };

  React.useEffect(() => {
    if (startTime && endTime && selectedEvent) {
      const updateEventTime = (originalDate: Date, timeString: string) => {
        const newDate = new Date(originalDate);
        const [hours, minutes] = timeString.split(":").map(Number);
        newDate.setHours(hours, minutes, 0, 0);
        return newDate;
      };

      const updatedEvent = {
        ...selectedEvent,
        start: updateEventTime(selectedEvent.start, startTime),
        end: updateEventTime(selectedEvent.end, endTime),
        allDay: false,
      };
      setUpdatedEvent(updatedEvent);

      const conflicts = findConflicts(updatedEvent, verifiedEvents);
      setConflicts(conflicts);
    }
  }, [startTime, endTime, selectedEvent, verifiedEvents]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Event</DialogTitle>
          <DialogDescription>
            Select an appropriate time range for the event.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 gap-4"
            autoComplete="off"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Start Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        value={startTime || ""}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>End Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        value={endTime || ""}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {conflicts.length > 0 && (
              <>
                <ScrollArea className="mt-4 max-h-[60vh]">
                  {conflicts.map((conflictEvent, index) => (
                    <div key={index} className="mb-4 p-4 border rounded-md">
                      <div className="space-x-2">
                        <Badge
                          style={{
                            backgroundColor: conflictEvent.eventType?.isSpecial
                              ? EventColors.special
                              : EventColors.regular,
                          }}
                        >
                          {conflictEvent.eventType?.isSpecial
                            ? "Special"
                            : "Regular"}
                        </Badge>
                        <Badge>{conflictEvent.eventType?.displayName}</Badge>
                      </div>
                      <h4 className="font-bold mt-2">{conflictEvent.title}</h4>
                      <span className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {format(
                          conflictEvent.start,
                          "EEE, MMM d, h:mm a",
                        )} - {format(conflictEvent.end, "h:mm a")}
                      </span>
                    </div>
                  ))}
                </ScrollArea>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="understood"
                    checked={understood}
                    onCheckedChange={(checked) =>
                      setUnderstood(checked as boolean)
                    }
                  />
                  <label htmlFor="understood" className="text-sm">
                    I understand the conflicts and want to approve this event.
                  </label>
                </div>
              </>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!areTimesFilled || !understood}>
                Approve
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
