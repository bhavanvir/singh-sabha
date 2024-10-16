"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ChevronLeft, ChevronRight, Minus, Info } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CreateEvent } from "@/lib/api/events/mutations";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";

import type { ToolbarProps } from "react-big-calendar";
import type { SlotInfo } from "react-big-calendar";
import type { Event } from "@/lib/types/event";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formSchema = z.object({
  title: z
    .string()
    .nonempty("Title missing")
    .min(6, "Title too short")
    .max(64, "Title too long"),
  type: z.string().nonempty("Type missing"),
  note: z.string().max(128, "Note too long"),
});

// TODO: Add proper types
interface BookingCalenderProps {
  events: any;
}

export default function BookingCalendar({ events }: BookingCalenderProps) {
  moment.locale("en-CA");
  const localizer = momentLocalizer(moment);

  const CustomToolbar = ({ date, onNavigate, onView, view }: ToolbarProps) => {
    const startOfWeek = moment(date).startOf("week");
    const endOfWeek = moment(date).endOf("week");
    const weekDisplay =
      startOfWeek.month() === endOfWeek.month()
        ? `${monthNames[startOfWeek.month()]} ${startOfWeek.date()} - ${endOfWeek.date()}, ${startOfWeek.year()}`
        : `${monthNames[startOfWeek.month()]} ${startOfWeek.date()} - ${monthNames[endOfWeek.month()]} ${endOfWeek.date()}, ${startOfWeek.year()}`;

    return (
      <div className="flex justify-between pb-4">
        <div className="relative flex items-center justify-center w-[35rem]">
          <Button
            size="icon"
            variant="outline"
            onClick={() => onNavigate("PREV")}
            className="absolute left-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <h1 className="text-2xl font-bold">
            {view === "week"
              ? weekDisplay
              : `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`}
          </h1>

          <Button
            size="icon"
            variant="outline"
            onClick={() => onNavigate("NEXT")}
            className="absolute right-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex space-x-2">
          <Select
            onValueChange={(value) => onView(value as View)}
            defaultValue="month"
          >
            <SelectTrigger className="w-24 capitalize">
              <SelectValue placeholder={view} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>View</SelectLabel>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => onNavigate("TODAY")}>
            Today
          </Button>
        </div>
      </div>
    );
  };

  const CustomHeader = ({ date }: { date: Date }) => {
    const dayOfWeek = moment(date).format("ddd");
    const dayOfMonth = moment(date).format("D");
    const isToday = moment(date).isSame(moment(), "day");

    return (
      <div className="flex items-center justify-between">
        <div>{dayOfWeek}</div>
        <div className="ml-1">
          {isToday ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground">
              <span className="text-background">{dayOfMonth}</span>
            </div>
          ) : (
            <span>{dayOfMonth}</span>
          )}
        </div>
      </div>
    );
  };

  const CustomDateHeader = ({ date }: { date: Date }) => {
    const isToday = moment(date).isSame(moment(), "day");
    const dayOfMonth = moment(date).format("D");

    return (
      <div className="flex items-center justify-center mt-0.5">
        {isToday ? (
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground">
            <span className="text-background">{dayOfMonth}</span>
          </div>
        ) : (
          <span>{dayOfMonth}</span>
        )}
      </div>
    );
  };

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedSlot, setSelectedSlot] = React.useState<SlotInfo | null>(null);

  const onSelectSlot = React.useCallback((slotInfo: SlotInfo) => {
    setSelectedSlot(slotInfo);
    setIsDialogOpen(true);
    form.reset();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "",
      note: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!selectedSlot) return;

    const newEvent: Event = {
      type: data.type,
      start: selectedSlot.start,
      end: selectedSlot.end,
      allDay: selectedSlot.action === "select",
      title: data.title,
      note: data.note,
    };

    toast.promise(CreateEvent({ newEvent }), {
      loading: "Creating event...",
      success: "Event created successfully!",
      error: "An unknown error occured.",
    });

    setIsDialogOpen(false);
  };

  return (
    <div className="h-[calc(100vh-6rem)] overflow-y-auto p-2">
      <Calendar
        selectable
        onSelectSlot={onSelectSlot}
        localizer={localizer}
        events={events}
        defaultView="month"
        views={["week", "day", "month"]}
        components={{
          toolbar: CustomToolbar,
          week: { header: CustomHeader },
          month: { dateHeader: CustomDateHeader },
        }}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create event</DialogTitle>
            <DialogDescription>
              Parameters based on your selection. Click submit when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input type="title" placeholder="Add title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Label htmlFor="period">Time period</Label>
              <div>
                <div id="period" className="flex items-center space-x-2">
                  <span className="rounded-md border px-3 py-2 text-sm">
                    {moment(selectedSlot?.start ?? new Date()).format(
                      "MMMM Do YYYY, h:mm a",
                    )}
                  </span>
                  <Minus className="w-4" />
                  <span className="rounded-md border px-3 py-2 text-sm">
                    {moment(selectedSlot?.end ?? new Date()).format(
                      "MMMM Do YYYY, h:mm a",
                    )}
                  </span>
                </div>
                {selectedSlot?.action === "select" ? (
                  <p className="pt-1 text-muted-foreground text-sm flex items-center">
                    <Info className="mr-1 h-4 w-4" />
                    This is an all day event.
                  </p>
                ) : null}
              </div>

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        {...field}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select an event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="funeral">Funeral</SelectItem>
                            <SelectItem value="wedding">Wedding</SelectItem>
                            <SelectItem value="akhand-path">
                              Akhand Path
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
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
              <DialogFooter>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
