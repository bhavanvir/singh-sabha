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

import { Loader2 } from "lucide-react";

import { ParametersForm } from "@/components/forms/parameters-form";
import { userEventSchema } from "@/lib/event-schema";
import { CreateEvent } from "@/lib/api/events/mutations";

import type { Event, EventType } from "@/db/schema";

interface BookEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventTypes: EventType[];
}

export default function BookEventDialog({
  isOpen,
  onClose,
  eventTypes,
}: BookEventDialogProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof userEventSchema>>({
    resolver: zodResolver(userEventSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      occassion: "",
      type: "",
      note: "",
      isPublic: true,
      startTime: null,
      endTime: null,
    },
  });

  React.useEffect(() => {
    if (eventTypes && eventTypes.length === 1) {
      form.reset({
        type: eventTypes[0].id,
      });
    }
  }, [eventTypes, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const stripePayment = async (eventType: EventType, eventId: string) => {
    try {
      const stripeResponse = await fetch("/api/stripe/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType,
          eventId,
        }),
      });

      if (!stripeResponse.ok) {
        throw new Error("Failed to create Stripe session");
      }

      const { url } = await stripeResponse.json();
      window.open(url, "_self");

      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit: SubmitHandler<z.infer<typeof userEventSchema>> = (
    data,
  ) => {
    setIsLoading(true);

    const startDateTime = startOfDay(data.dateRange.from);
    const endDateTime = endOfDay(data.dateRange.to || data.dateRange.from);

    const newEvent: Omit<Event, "id"> = {
      registrantFullName: data.name,
      registrantEmail: data.email,
      registrantPhoneNumber: data.phoneNumber ?? null,
      type: data.type,
      start: startDateTime,
      end: endDateTime,
      allDay: true,
      occassion: data.occassion,
      note: data.note,
      isVerified: false,
      frequencyRule: null,
      isPublic: data.isPublic,
      isDepositPaid: false,
    };

    const eventType = eventTypes.find((type) => type.id === data.type);

    toast.promise(
      async () => {
        const eventId = await CreateEvent({ newEvent });
        const paymentSuccess = await stripePayment(eventType!, eventId);
        setIsLoading(false);
        return paymentSuccess;
      },
      {
        loading: "Submitting event...",
        success: "Event booking submitted successfully!",
        error: "Failed to submit event booking",
      },
    );
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
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  <>
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 fill-[#635BFF]"
                    >
                      <title>Stripe</title>
                      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
                    </svg>
                    Proceed with Payment
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
