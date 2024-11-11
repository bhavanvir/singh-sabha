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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pen,
  HelpCircle,
} from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import CreateEventDialog from "@/components/create-event-dialog";
import EditEventDialog from "@/components/edit-event-dialog";
import RequestEventDialog from "@/components/request-event-dialog";
import ViewEventDialog from "@/components/view-event-dialog";
import { EventColors } from "@/lib/types/eventcolours";

import type { ToolbarProps } from "react-big-calendar";
import type { Event } from "@/lib/types/event";
import type { User } from "lucia";
import type { EventType } from "@/lib/types/eventtype";

interface BookingCalenderProps {
  user: User | null;
  events: Event[];
  eventTypes: EventType[];
}

export default function BookingCalendar({
  user,
  events,
  eventTypes,
}: BookingCalenderProps) {
  moment.locale("en-CA");
  const localizer = momentLocalizer(moment);

  const [isLoading, setIsLoading] = React.useState(true);
  const [isCreateEventDialogOpen, setCreateEventDialogOpen] =
    React.useState(false);
  const [isEditEventDialogOpen, setEditEventDialogOpen] = React.useState(false);
  const [isRequestEventDialogOpen, setRequestEventDialogOpen] =
    React.useState(false);
  const [isViewEventDialogOpen, setViewEventDialogOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [currentView, setCurrentView] = React.useState<View>("month");

  React.useEffect(() => {
    // Small delay to ensure CSS is loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

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

    const handleAddEvent = () => {
      if (user) {
        setCreateEventDialogOpen(true);
      } else {
        setRequestEventDialogOpen(true);
      }
    };

    return (
      <div className="flex flex-wrap items-center justify-between pb-4 w-full space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-fit justify-center sm:justify-start">
          <div className="flex space-x-1">
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

          <span className="text-xl sm:text-2xl font-bold">{formatDate()}</span>
        </div>

        <div className="flex space-x-2 sm:space-x-4 w-full sm:w-fit justify-center sm:justify-end">
          <Select
            onValueChange={(value) => {
              onView(value as View);
              setCurrentView(value as View);
            }}
            value={currentView}
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

          <Button
            variant="outline"
            className="flex items-center"
            onClick={handleAddEvent}
          >
            <Pen />
            {user ? "Create" : "Request"} event
          </Button>

          <div className="flex justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <HelpCircle />
                    Legend
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end" className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: EventColors.regular,
                        }}
                      ></div>
                      <span className="text-sm">Regular event</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: EventColors.special,
                        }}
                      ></div>
                      <span className="text-sm">Special event</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground">
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
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground">
            <span className="text-primary-foreground">{dayOfMonth}</span>
          </div>
        ) : (
          <span>{dayOfMonth}</span>
        )}
      </div>
    );
  };

  const CustomEvent = ({ event }: { event: Event | any }) => {
    const eventDuration = moment(event.end).diff(moment(event.start), "days");

    return (
      <div className="flex justify-between items-center">
        <span>{event.title}</span>
        {eventDuration > 1 && (
          <span className="text-sm ">
            {moment(event.start).format("hh:mm a")} -{" "}
            {moment(event.end).format("hh:mm a")}
          </span>
        )}
      </div>
    );
  };

  // Adding Event as the sole type for the callback causes an error
  // an overload error for the toolbar in the Calendar component...
  const onSelectEvent = React.useCallback(
    (event: Event | any) => {
      setSelectedEvent(event);
      if (user) setEditEventDialogOpen(true);
      else setViewEventDialogOpen(true);
    },
    [user],
  );

  const eventPropGetter = React.useCallback((event: Event | any) => {
    const newStyle: React.CSSProperties = {
      backgroundColor: event.eventType.isSpecial
        ? EventColors.special
        : EventColors.regular,
      borderRadius: "0.375rem", // Tailwind rounded-md
      border: "none",
      opacity: event.verified ? "1" : ".5",
    };

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
        onSelectEvent={onSelectEvent}
        eventPropGetter={eventPropGetter}
        localizer={localizer}
        events={events}
        defaultView="month"
        views={["week", "day", "month"]}
        components={{
          event: CustomEvent,
          toolbar: CustomToolbar,
          week: { header: CustomHeader },
          month: { dateHeader: CustomDateHeader },
        }}
      />
      <CreateEventDialog
        isOpen={isCreateEventDialogOpen}
        onClose={() => setCreateEventDialogOpen(false)}
        eventTypes={eventTypes}
      />
      <EditEventDialog
        isOpen={isEditEventDialogOpen}
        onClose={() => setEditEventDialogOpen(false)}
        event={selectedEvent}
        eventTypes={eventTypes}
      />
      <RequestEventDialog
        isOpen={isRequestEventDialogOpen}
        onClose={() => setRequestEventDialogOpen(false)}
        eventTypes={eventTypes}
      />
      <ViewEventDialog
        isOpen={isViewEventDialogOpen}
        onClose={() => setViewEventDialogOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
}
