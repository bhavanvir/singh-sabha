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
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
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

// From https://coolors.co/palettes/trending
const typeColourMap: Record<string, string> = {
  "akhand-path": "#cdb4db",
  wedding: "#ffc8dd",
  funeral: "#ffafcc",
  langar: "#bde0fe",
  "sehaj-path": "#a2d2ff",
};

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
    const formatDate = () => {
      if (view === "day") {
        return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
      }

      if (view === "week") {
        return `${monthNames[startOfWeek.month()]} ${startOfWeek.date()} - ${monthNames[endOfWeek.month()]} ${endOfWeek.date()}, ${startOfWeek.year()}`;
      }

      if (view === "month") {
        return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      }

      return null;
    };

    return (
      <div className="flex justify-between pb-4 w-full">
        <div className="flex items-center w-fit space-x-4">
          <div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onNavigate("PREV")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => onNavigate("NEXT")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <span className="text-2xl font-bold">{formatDate()}</span>
        </div>

        <div className="flex space-x-4">
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
      <div className="flex items-center justify-center my-1">
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

  const onSelectSlot = React.useCallback((slotInfo: SlotInfo) => {
    setSelectedSlot(slotInfo);
    setCreateEventDialogOpen(true);
  }, []);

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
      borderRadius: "0.375rem", // rounded-md
      border: "none",
    };

    newStyle.backgroundColor = typeColourMap[event.type];

    return {
      className: "",
      style: newStyle,
    };
  }, []);

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
      />
      <EditEventDialog
        isOpen={isEditEventDialogOpen}
        onClose={() => setEditEventDialogOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
}
