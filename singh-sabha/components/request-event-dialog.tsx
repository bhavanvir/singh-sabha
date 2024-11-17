import * as React from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { format } from "date-fns";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import moment from "moment";
import { CreateEvent } from "@/lib/api/events/mutations";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Info } from "lucide-react";

import type { Event } from "@/lib/types/event";
import type { DateRange } from "react-day-picker";
import type { EventType } from "@/lib/types/event-type";

const formSchema = z.object({
  name: z.string().min(1, "Full name missing").max(128, "Full name too long"),
  email: z.string().min(1, "Email missing").email("Invalid email"),
  phoneNumber: z
    .string()
    .min(1, "Phone number missing")
    .refine((value) => {
      if (!value) return true;
      const phoneNumber = parsePhoneNumberFromString(value, "CA");
      return phoneNumber?.isValid();
    }, "Invalid phone number")
    .transform((value) => {
      if (!value) return value;
      const phoneNumber = parsePhoneNumberFromString(value, "CA");
      return phoneNumber ? phoneNumber.formatInternational() : value;
    }),
  title: z
    .string()
    .min(1, "Title missing")
    .min(6, "Title too short")
    .max(64, "Title too long"),
  type: z.string().min(1, "Type missing"),
  note: z.string().max(128, "Note took long"),
  dateRange: z.object(
    {
      from: z.date(),
      to: z.date().nullish().catch(undefined),
    },
    {
      required_error: "Please select a date range",
    },
  ),
  timeRange: z.array(z.number()).length(2),
  isPublic: z.boolean().default(false),
});

interface RequestEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventTypes: EventType[];
}

function RequestEventDialog({
  isOpen,
  onClose,
  eventTypes,
}: RequestEventDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      title: "",
      type: "",
      note: "",
      timeRange: [9 * 4, 17 * 4],
      isPublic: false,
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    const startDateTime = moment(data.dateRange.from)
      .hour(Math.floor(data.timeRange[0] / 4))
      .minute((data.timeRange[0] % 4) * 15);

    const endDateTime = moment(data.dateRange.to)
      .hour(Math.floor(data.timeRange[1] / 4))
      .minute((data.timeRange[1] % 4) * 15);

    const newEvent: Event = {
      registrantFullName: data.name,
      registrantEmail: data.email,
      registrantPhoneNumber: data.phoneNumber ?? null,
      type: data.type,
      start: startDateTime.toDate(),
      end: endDateTime.toDate(),
      allDay: startDateTime === endDateTime,
      title: data.title,
      note: data.note,
      verified: false,
      isPublic: data.isPublic,
    };

    toast.promise(CreateEvent({ newEvent }), {
      loading: "Submitting event request...",
      success: "Event request submitted successfully!",
      error: "Failed to submit an event request.",
    });
    handleClose();
  };

  const formatTimeValue = (value: number) => {
    const hours = Math.floor(value / 4);
    const minutes = (value % 4) * 15;
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request event</DialogTitle>
          <DialogDescription>
            Parameters based on your selection. Click submit when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 gap-4"
            autoComplete="off"
          >
            <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
              {/* Left column */}
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

              {/* Separator */}
              <Separator className="md:hidden" />
              <Separator orientation="vertical" className="hidden md:block" />

              {/* Right column */}
              <div className="grid grid-cols-1 gap-4 w-full md:w-2/3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Title</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Add title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="dateRange"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel required>Date Range</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value?.from ? (
                                  field.value.to ? (
                                    <>
                                      {format(field.value.from, "LLL dd, y")} -{" "}
                                      {format(field.value.to, "LLL dd, y")}
                                    </>
                                  ) : (
                                    format(field.value.from, "LLL dd, y")
                                  )
                                ) : (
                                  <span>Pick a date range</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="range"
                              selected={field.value as DateRange}
                              onSelect={(range) => {
                                if (range?.from && !range.to) {
                                  range.to = range.from;
                                }
                                field.onChange(range);
                              }}
                              initialFocus
                              showOutsideDays={false}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Time Range</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Slider
                              min={0}
                              max={95}
                              step={1}
                              value={field.value}
                              onValueChange={field.onChange}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>{formatTimeValue(field.value[0])}</span>
                              <span>{formatTimeValue(field.value[1])}</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an event type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="overflow-y-auto max-h-[10rem]">
                          <SelectGroup>
                            {eventTypes
                              .filter((type) => type.isRequestable)
                              .map((type) => (
                                <SelectItem value={type.id!} key={type.id}>
                                  <span className="flex items-center gap-2">
                                    {type.displayName}
                                  </span>
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add a special note" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Public Event</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <p className="pt-1 flex items-center text-sm text-muted-foreground">
                    <Info className="h-4 w-4 mr-1" />
                    If checked, event details will be shown on the calendar.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default RequestEventDialog;
