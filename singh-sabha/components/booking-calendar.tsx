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
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CreateEvent } from "@/lib/api/events/mutations";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import { toast } from "sonner";
import CreateEventDialog from "@/components/create-event-dialog";
import EditEventDialog from "@/components/edit-event-dialog";

import type { ToolbarProps } from "react-big-calendar";
import type { SlotInfo } from "react-big-calendar";
import type { Event } from "@/lib/types/event";

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
    .min(1, "Title missing")
    .min(6, "Title too short")
    .max(64, "Title too long"),
  type: z.string().min(1, "Type missing"),
  note: z.string().max(128, "Note too long"),
});

// TODO: Add proper types
interface BookingCalenderProps {
  events: any;
}

export default function BookingCalendar({ events }: BookingCalenderProps) {
  moment.locale("en-CA");
  const localizer = momentLocalizer(moment);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "",
      note: "",
    },
  });

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

  const [isCreateEventDialogOpen, setCreateEventDialogOpen] =
    React.useState(false);
  const [isEditEventDialogOpen, setEditEventDialogOpen] = React.useState(false);
  const [selectedSlot, setSelectedSlot] = React.useState<SlotInfo | null>(null);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);

  const onSelectSlot = React.useCallback(
    (slotInfo: SlotInfo) => {
      setSelectedSlot(slotInfo);
      setCreateEventDialogOpen(true);
      form.reset();
    },
    [form],
  );

  // TODO: Fix type
  const onSelectEvent = React.useCallback((event: any) => {
    setSelectedEvent(event);
    setEditEventDialogOpen(true);
  }, []);

  // TODO: Fix type
  const eventPropGetter = React.useCallback((event: any) => {
    const newStyle = {
      backgroundColor: "lightgrey",
      color: "black",
      borderRadius: "0px",
      border: "none",
    };

    switch (event.type) {
      case "wedding":
        newStyle.backgroundColor = "lightblue";
        break;
      case "akhand-path":
        newStyle.backgroundColor = "lightgreen";
        break;
      case "funeral":
        newStyle.backgroundColor = "lightred";
        break;
    }

    return {
      className: "",
      style: newStyle,
    };
  }, []);

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

    setCreateEventDialogOpen(false);
  };

  return (
    <div className="h-[calc(100vh-6rem)] overflow-y-auto p-2">
      <Calendar
        selectable
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        eventPropGetter={eventPropGetter}
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
      <CreateEventDialog
        isOpen={isCreateEventDialogOpen}
        onClose={() => setCreateEventDialogOpen(false)}
        slot={selectedSlot}
        onSubmit={onSubmit}
      />
      <EditEventDialog
        isOpen={isEditEventDialogOpen}
        onClose={() => setEditEventDialogOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
}
