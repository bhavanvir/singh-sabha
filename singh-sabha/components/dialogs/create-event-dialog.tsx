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
import { RRule, Frequency } from "rrule";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { set } from "date-fns";

import { FrequencyForm } from "@/components/forms/frequency-form";
import { ParametersForm } from "@/components/forms/parameters-form";
import { superUserEventSchema } from "@/lib/event-schema";
import { CreateEvent } from "@/lib/api/events/mutations";

import type { Event, EventType } from "@/db/schema";

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventTypes: EventType[];
}

export default function CreateEventDialog({
  isOpen,
  onClose,
  eventTypes,
}: CreateEventDialogProps) {
  const form = useForm<z.infer<typeof superUserEventSchema>>({
    resolver: zodResolver(superUserEventSchema),
    defaultValues: {
      occassion: "",
      type: "",
      note: "",
      startTime: "",
      endTime: "",
      frequency: "",
      selectedDays: [],
      selectedMonths: [],
      count: undefined,
      interval: undefined,
      isPublic: true,
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit: SubmitHandler<z.infer<typeof superUserEventSchema>> = (
    data,
  ) => {
    const startDate = data.dateRange.from;
    const endDate = data.dateRange.to || data.dateRange.from;

    const startDateTime = set(startDate, {
      hours: parseInt(data.startTime!.split(":")[0]),
      minutes: parseInt(data.startTime!.split(":")[1]),
    });

    const endDateTime = set(endDate, {
      hours: parseInt(data.endTime!.split(":")[0]),
      minutes: parseInt(data.endTime!.split(":")[1]),
    });

    const rule = data.frequency
      ? new RRule({
          freq: Frequency[data.frequency as keyof typeof Frequency],
          interval: data.interval,
          count: data.count,
          byweekday: data.selectedDays?.map((day) => Number(day)),
          bymonth: data.selectedMonths?.map((month) => Number(month)),
          dtstart: startDateTime,
        })
      : null;

    const newEvent: Omit<
      Event,
      "id" | "registrantFullName" | "registrantEmail" | "registrantPhoneNumber"
    > = {
      type: data.type,
      start: startDateTime,
      end: endDateTime,
      allDay: false,
      occassion: data.occassion,
      note: data.note,
      isVerified: true,
      frequencyRule: rule ? rule.toString() : null,
      isPublic: data.isPublic,
    };

    toast.promise(CreateEvent({ newEvent }), {
      loading: "Creating event...",
      success: "Event created successfully!",
      error: "Failed to create an event.",
    });

    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>
            Parameters based on your selection. Click create when you&apos;re
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
                <ParametersForm eventTypes={eventTypes} role="admin" />
                <DialogFooter>
                  <Button type="submit">Create</Button>
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
