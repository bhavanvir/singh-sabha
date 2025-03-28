import * as React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { startOfDay, endOfDay } from "date-fns";

import { Send } from "lucide-react";

import { ParametersForm } from "@/components/forms/parameters-form";
import { CreateEvent } from "@/lib/api/events/mutations";
import { sendEmail } from "@/lib/send-email";

import { userEventSchema } from "@/lib/event-schema";
import type { Event, EventType } from "@/db/schema";

interface BookEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventTypes: EventType[];
  selectedEventType: EventType | null;
}

export default function BookEventDialog({
  isOpen,
  onClose,
  eventTypes,
  selectedEventType,
}: BookEventDialogProps) {
  const form = useForm<z.infer<typeof userEventSchema>>({
    resolver: zodResolver(userEventSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      occassion: "",
      type: selectedEventType?.id ?? "",
      note: "",
      isPublic: true,
      startTime: null,
      endTime: null,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: "",
        email: "",
        phoneNumber: "",
        occassion: "",
        type: selectedEventType?.id ?? "",
        note: "",
        isPublic: true,
        startTime: null,
        endTime: null,
      });
    }
  }, [isOpen, selectedEventType, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit: SubmitHandler<z.infer<typeof userEventSchema>> = async (
    data,
  ) => {
    const startDateTime = startOfDay(data.dateRange.from);
    const endDateTime = endOfDay(data.dateRange.to || data.dateRange.from);

    const newEvent: Omit<Event, "id" | "createdAt"> = {
      registrantFullName: data.name,
      registrantEmail: data.email,
      registrantPhoneNumber: data.phoneNumber ?? null,
      type: data.type,
      start: startDateTime,
      end: endDateTime,
      allDay: true,
      occassion: data.occassion,
      note: data.note ?? null,
      isVerified: false,
      frequencyRule: null,
      isPublic: data.isPublic,
      isDepositPaid: false,
    };

    toast.promise(
      async () => {
        const createdEvent = await CreateEvent({ newEvent });
        await sendEmail(createdEvent, "/api/send/confirmation");
        return createdEvent;
      },
      {
        loading: "Submitting event and sending confirmation...",
        success:
          "Event booking submitted and confirmation email sent successfully!",
        error: "Failed to submit event booking or send confirmation email",
      },
    );
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Event</DialogTitle>
          <DialogDescription>
            Fill out the form based on your request. Click submit when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 gap-4"
            autoComplete="off"
          >
            <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
              <div className="grid grid-cols-1 gap-4 h-fit w-full md:w-1/3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Add full name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Email</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Add email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Add phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="md:hidden" />
              <Separator orientation="vertical" className="hidden md:block" />

              <div className="grid grid-cols-1 gap-4 w-full md:w-2/3">
                <ParametersForm eventTypes={eventTypes} role={"user"} />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">
                <Send />
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
