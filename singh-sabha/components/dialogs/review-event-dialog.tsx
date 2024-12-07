import * as React from "react";
import { format } from "date-fns";
import { Clock, Info } from "lucide-react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Calendar } from "lucide-react";

import { findConflicts } from "@/lib/utils";
import { timeRangeSchema } from "@/lib/event-schema";

import { EventColors } from "@/lib/types/event-colours";
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

  const form = useForm<z.infer<typeof timeRangeSchema>>({
    resolver: zodResolver(timeRangeSchema),
    defaultValues: {
      startTime: null,
      endTime: null,
    },
  });

  const handleSubmit: SubmitHandler<z.infer<typeof timeRangeSchema>> = (
    data,
  ) => {
    if (updatedEvent && (conflicts.length === 0 || understood)) {
      // approveEvent(updatedEvent);
      handleClose();
    }
  };

  const handleClose = () => {
    form.reset();
    setUnderstood(false);
    setConflicts([]);
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

            <Accordion type="multiple" className="space-y-2">
              {conflicts.map((conflict) => (
                <AccordionItem
                  key={conflict.id}
                  value={conflict.id}
                  className="border rounded-lg"
                >
                  <AccordionTrigger className="hover:no-underline p-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor: conflict.eventType?.isSpecial
                              ? EventColors.special
                              : EventColors.regular,
                          }}
                        />
                        <span className="font-medium">{conflict.title}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-muted-foreground space-y-1 px-4">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>
                          {format(conflict.start, "MMM d, yyyy")}
                          {format(conflict.start, "MMM d") !==
                            format(conflict.end, "MMM d") &&
                            ` - ${format(conflict.end, "MMM d, yyyy")}`}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>
                          {format(conflict.start, "h:mm a")} -{" "}
                          {format(conflict.end, "h:mm a")}
                        </span>
                      </div>
                      <Badge
                        variant={
                          conflict.eventType?.isSpecial
                            ? "secondary"
                            : "default"
                        }
                      >
                        {conflict.eventType?.displayName}
                      </Badge>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {conflicts.length > 0 && (
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
            )}

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={conflicts.length > 0 && !understood}
              >
                Approve
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
