import * as React from "react";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import moment from "moment";
import { RRule, Frequency } from "rrule";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import FrequencyForm from "@/components/frequency-form";
import { ParametersForm } from "@/components/parameters-form";
import { superUserEventSchema } from "@/lib/event-schema";
import { UpdateEvent, DeleteEvent } from "@/lib/api/events/mutations";

import { Event, EventType } from "@/db/schema";

interface EditEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  eventTypes: EventType[];
}

export default function EditEventDialog({
  isOpen,
  onClose,
  event,
  eventTypes,
}: EditEventDialogProps) {
  const form = useForm<z.infer<typeof superUserEventSchema>>({
    resolver: zodResolver(superUserEventSchema),
    defaultValues: {
      title: event?.title ?? "",
      type: event?.type ?? "",
      note: event?.note ?? "",
      frequency: "",
      selectedDays: [],
      selectedMonths: [],
      count: undefined,
      interval: undefined,
      timeRange: [9 * 4, 17 * 4],
      isPublic: event?.isPublic ?? true,
    },
  });

  React.useEffect(() => {
    if (event) {
      const startTime = moment(event.start);
      const endTime = moment(event.end);
      const timeRange = [
        startTime.hour() * 4 + Math.floor(startTime.minute() / 15),
        endTime.hour() * 4 + Math.floor(endTime.minute() / 15),
      ];

      let frequency = "";
      let selectedDays: string[] = [];
      let selectedMonths: string[] = [];
      let interval: number | undefined;
      let count: number | undefined;

      if (event.frequencyRule) {
        const rrule = RRule.fromString(event.frequencyRule);
        frequency = Frequency[rrule.options.freq];
        selectedDays = rrule.options.byweekday?.map(String) ?? [];
        selectedMonths = rrule.options.bymonth?.map(String) ?? [];
        interval = rrule.options.interval;
        count = rrule.options.count ?? undefined;
      }

      form.reset({
        title: event.title,
        type: event.type,
        note: event.note ?? "",
        frequency,
        selectedDays,
        selectedMonths,
        interval,
        count,
        dateRange: {
          from: startTime.toDate(),
          to: endTime.toDate(),
        },
        timeRange,
        isPublic: event.isPublic!,
      });
    }
  }, [event, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit: SubmitHandler<z.infer<typeof superUserEventSchema>> = (
    data,
  ) => {
    if (!event) return;

    const startDateTime = moment(data.dateRange.from)
      .hour(Math.floor(data.timeRange[0] / 4))
      .minute((data.timeRange[0] % 4) * 15);

    const endDateTime = moment(data.dateRange.to)
      .hour(Math.floor(data.timeRange[1] / 4))
      .minute((data.timeRange[1] % 4) * 15);

    const rule = data.frequency
      ? new RRule({
          freq: Frequency[data.frequency as keyof typeof Frequency],
          interval: data.interval,
          count: data.count,
          byweekday: data.selectedDays?.map((day) => Number(day)),
          bymonth: data.selectedMonths?.map((month) => Number(month)),
          dtstart: startDateTime.toDate(),
        })
      : null;

    const updatedEvent: Event = {
      ...event,
      type: data.type,
      start: startDateTime.toDate(),
      end: endDateTime.toDate(),
      allDay: startDateTime === endDateTime,
      title: data.title,
      note: data.note,
      frequencyRule: rule ? rule.toString() : null,
      isPublic: data.isPublic,
    };

    toast.promise(UpdateEvent({ updatedEvent }), {
      loading: "Updating event...",
      success: "Event updated successfully!",
      error: "Failed to update event.",
    });

    handleClose();
  };

  const handleDeleteEventSubmit = () => {
    if (!event) return;

    toast.promise(DeleteEvent({ id: event.id! }), {
      loading: "Deleting event...",
      success: "Event deleted successfully!",
      error: "Failed to delete event.",
    });

    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Make changes to the event parameters. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="parameters">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="frequency">Frequency</TabsTrigger>
          </TabsList>
          <TabsContent value="parameters">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="grid grid-cols-1 gap-4"
                autoComplete="off"
              >
                <ParametersForm eventTypes={eventTypes} />
                <DialogFooter className="flex">
                  <Button
                    variant="destructive"
                    onClick={handleDeleteEventSubmit}
                  >
                    Delete
                  </Button>
                  <Button type="submit" disabled={!form.formState.isDirty}>
                    Save changes
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="frequency">
            <Form {...form}>
              <form className="grid gap-4">
                <FrequencyForm
                  watchFrequency={form.watch("frequency")}
                  form={form}
                />
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
