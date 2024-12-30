import * as React from "react";
import { Button } from "@/components/ui/button";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { X, Check, ChevronsUpDown } from "lucide-react";

import EventSummary from "../event-summary";
import { findConflicts } from "@/lib/utils";
import { cn } from "@/lib/utils";

import { timeRangeSchema } from "@/lib/event-schema";
import type { EventWithType } from "@/db/schema";

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
  const [conflicts, setConflicts] = React.useState<EventWithType[]>([]);
  const [updatedEvent, setUpdatedEvent] = React.useState<EventWithType | null>(
    null,
  );
  const [isExpanded, setIsExpanded] = React.useState(false);

  const form = useForm<z.infer<typeof timeRangeSchema>>({
    resolver: zodResolver(timeRangeSchema),
    defaultValues: {
      startTime: null,
      endTime: null,
    },
  });

  const handleSubmit: SubmitHandler<z.infer<typeof timeRangeSchema>> = () => {
    if (updatedEvent && (conflicts.length === 0 || understood)) {
      approveEvent(updatedEvent);
      handleClose();
    }
  };

  const handleClose = () => {
    form.reset();
    setUnderstood(false);
    setConflicts([]);
    setUpdatedEvent(null);
    onClose();
  };

  const startTime = form.watch("startTime");
  const endTime = form.watch("endTime");

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
    } else {
      setConflicts([]);
    }
  }, [startTime, endTime, selectedEvent, verifiedEvents, form]);

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
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Start Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          field.onChange(e);
                          form.setValue("startTime", e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>End Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          field.onChange(e);
                          form.setValue("endTime", e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {conflicts.length > 0 && (
              <>
                <Collapsible
                  open={isExpanded}
                  onOpenChange={setIsExpanded}
                  className="w-full space-y-4"
                >
                  <div
                    className={cn(
                      "flex items-center space-x-4 px-4",
                      { "justify-center": conflicts.length === 1 },
                      { "justify-between": conflicts.length > 1 },
                    )}
                  >
                    <h4 className="text-sm font-semibold">
                      {conflicts.length} Conflicting Event
                      {conflicts.length !== 1 ? "s" : ""}
                    </h4>
                    {conflicts.length > 1 && (
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 p-0">
                          <ChevronsUpDown className="h-4 w-4" />
                          <span className="sr-only">Toggle events list</span>
                        </Button>
                      </CollapsibleTrigger>
                    )}
                  </div>
                  <div className="rounded-md border px-4 py-3 text-sm shadow-lg">
                    <EventSummary event={conflicts[0]} />
                  </div>
                  <CollapsibleContent className="space-y-2">
                    {conflicts.slice(1).map((event) => (
                      <div
                        key={event.id}
                        className="rounded-md border px-4 py-3 text-sm shadow-lg"
                      >
                        <EventSummary event={event} />
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="understood"
                    checked={understood}
                    onCheckedChange={(checked) =>
                      setUnderstood(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="understood"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I understand the conflicts and want to approve this event.
                  </label>
                </div>
              </>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                <X />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={conflicts.length > 0 && !understood}
              >
                <Check />
                Approve
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
