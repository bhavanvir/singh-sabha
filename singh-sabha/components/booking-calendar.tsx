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
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import CreateEventDialog from "@/components/create-event-dialog";
import EditEventDialog from "@/components/edit-event-dialog";
import RequestEventDialog from "@/components/request-event-dialog";
import { typeColourMap } from "@/lib/utils";

import type { ToolbarProps } from "react-big-calendar";
import type { SlotInfo } from "react-big-calendar";
import type { Event } from "@/lib/types/event";
import type { User } from "lucia";

interface BookingCalenderProps {
  user: User | null;
  events: Event[];
}

export default function BookingCalendar({
  user,
  events,
}: BookingCalenderProps) {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Small delay to ensure CSS is loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  moment.locale("en-CA");
  const localizer = momentLocalizer(moment);

  const CustomToolbar = ({ date, onNavigate, onView, view }: ToolbarProps) => {
    const formatDate = () => {
      if (view === "day") {
        return moment(date).format("MMMM D, YYYY");
      }

      if (view === "week") {
        const start = moment(date).startOf("week");
        const end = moment(date).endOf("week");
        return `${start.format("MMMM D")} - ${end.format("MMMM D, YYYY")}`;
      }

      if (view === "month") {
        return moment(date).format("MMMM YYYY");
      }

      return null;
    };
    return (
      <div className="flex justify-between pb-4 w-full">
        <div className="flex items-center w-fit space-x-4">
          <div className="space-x-1">
            <Button
              size="icon"
              variant="outline"
              onClick={() => onNavigate("PREV")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="outline"
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
  const [isRequestEventDialogOpen, setRequestEventDialogOpen] =
    React.useState(false);
  const [selectedSlot, setSelectedSlot] = React.useState<SlotInfo | null>(null);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);

  const onSelectSlot = React.useCallback(
    (slotInfo: SlotInfo) => {
      setSelectedSlot(slotInfo);
      if (user) setCreateEventDialogOpen(true);
      else setRequestEventDialogOpen(true);
    },
    [user],
  );

  // TODO: Fix type
  const onSelectEvent = React.useCallback(
    (event: any) => {
      setSelectedEvent(event);
      if (user) setEditEventDialogOpen(true);
    },
    [user],
  );

  // TODO: Fix type
  const eventPropGetter = React.useCallback((event: any) => {
    const newStyle = {
      backgroundColor: "lightgrey",
      color: "black",
      borderRadius: "0.375rem", // rounded-md
      border: "none",
      opacity: "1",
    };

    newStyle.backgroundColor = typeColourMap[event.type];

    if (!event.verified) newStyle.opacity = ".5";

    return {
      className: "",
      style: newStyle,
    };
  }, []);

  return isLoading ? (
    <div className="h-[calc(100vh-6rem)] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ) : (
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
      <RequestEventDialog
        isOpen={isRequestEventDialogOpen}
        onClose={() => setRequestEventDialogOpen(false)}
        slot={selectedSlot}
      />
    </div>
  );
}
