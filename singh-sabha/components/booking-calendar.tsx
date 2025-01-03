"use client";

import * as React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";

import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  HelpCircle,
  EyeOff,
  CalendarPlus,
  Calendar as CalendarIcon,
  CalendarRange,
  CalendarDays,
} from "lucide-react";

import CreateEventDialog from "@/components/dialogs/booking-calendar/create-event-dialog";
import EditEventDialog from "@/components/dialogs/booking-calendar/edit-event-dialog";
import BookEventDialog from "@/components/dialogs/booking-calendar/book-event-dialog";
import ViewEventDialog from "@/components/dialogs/booking-calendar/view-event-dialog";
import { EventColors } from "@/lib/types/event-colours";

import type { ToolbarProps } from "react-big-calendar";
import type { Event, EventType, User } from "@/db/schema";

interface BookingCalendarProps {
  user: User | null;
  events: Event[];
  eventTypes: EventType[];
}

export default function BookingCalendar({
  user,
  events,
  eventTypes,
}: BookingCalendarProps) {
  moment.locale("en-CA");
  const localizer = momentLocalizer(moment);

  const [isLoading, setIsLoading] = React.useState(true);
  const [isCreateEventDialogOpen, setCreateEventDialogOpen] =
    React.useState(false);
  const [isEditEventDialogOpen, setEditEventDialogOpen] = React.useState(false);
  const [isBookEventDialogOpen, setBookEventDialogOpen] = React.useState(false);
  const [isViewEventDialogOpen, setViewEventDialogOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [currentView, setCurrentView] = React.useState<View>("month");

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  const CustomToolbar = ({ date, onNavigate, onView, view }: ToolbarProps) => {
    const formatDate = () => {
      if (view === "day") {
        return moment(date).format("MMM D, YYYY");
      }

      if (view === "week") {
        const start = moment(date).startOf("week");
        const end = moment(date).endOf("week");
        return `${start.format("MMM D")} - ${end.format("MMM D, YYYY")}`;
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
        setBookEventDialogOpen(true);
      }
    };

    return (
      <div className="flex flex-col space-y-4 pb-4 w-full sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigate("PREV")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-xl sm:text-2xl font-bold w-[300px] text-center">
            {formatDate()}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigate("NEXT")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between sm:justify-end space-x-4">
          <ToggleGroup
            type="single"
            value={currentView}
            onValueChange={(value) => {
              if (value) {
                onView(value as View);
                setCurrentView(value as View);
              }
            }}
            className="border rounded-md"
          >
            <ToggleGroupItem
              value="month"
              aria-label="Month view"
              className="px-3 py-2 text-xs sm:text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Month
            </ToggleGroupItem>
            <ToggleGroupItem
              value="week"
              aria-label="Week view"
              className="px-3 py-2 text-xs sm:text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <CalendarRange className="h-4 w-4 mr-2" />
              Week
            </ToggleGroupItem>
            <ToggleGroupItem
              value="day"
              aria-label="Day view"
              className="px-3 py-2 text-xs sm:text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Day
            </ToggleGroupItem>
          </ToggleGroup>
          <Button
            variant="outline"
            className="text-xs sm:text-sm px-2 sm:px-3"
            onClick={handleAddEvent}
          >
            <CalendarPlus />
            {user ? "Create" : "Book"} Event
          </Button>
          <div className="hidden lg:block">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <HelpCircle />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end" className="p-4">
                  <div className="space-y-2">
                    {Object.entries(EventColors).map(([key, color]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: color,
                          }}
                        ></div>
                        <span className="text-xs sm:text-sm capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                      </div>
                    ))}
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
        <div className="text-xs sm:text-sm">{dayOfWeek}</div>
        <div className="ml-1">
          {isToday ? (
            <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-primary">
              <span className="text-xs sm:text-sm text-primary-foreground">
                {dayOfMonth}
              </span>
            </div>
          ) : (
            <span className="text-xs sm:text-sm">{dayOfMonth}</span>
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
          <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-primary">
            <span className="text-xs sm:text-sm text-primary-foreground">
              {dayOfMonth}
            </span>
          </div>
        ) : (
          <span className="text-xs sm:text-sm">{dayOfMonth}</span>
        )}
      </div>
    );
  };

  const CustomEvent = ({ event }: { event: Event | any }) => {
    const eventDuration = moment(event.end).diff(moment(event.start), "hours");
    const isEventVisible = event.isPublic || user;

    return (
      <div className="flex justify-between items-center w-full text-xs sm:text-sm">
        {isEventVisible ? (
          <>
            <span className="truncate">{event.occassion}</span>
            {eventDuration > 24 && (
              <span className="hidden sm:inline-block text-xs">
                {moment(event.start).format("HH:mm")} -{" "}
                {moment(event.end).format("HH:mm")}
              </span>
            )}
          </>
        ) : (
          <>
            <span className="truncate">Private event</span>
            <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
          </>
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

  const eventPropGetter = React.useCallback(
    (event: Event | any) => {
      const newStyle: React.CSSProperties = {
        backgroundColor: event.eventType.isSpecial
          ? EventColors.special
          : EventColors.regular,
        borderRadius: "0.375rem", // Tailwind rounded-md
        border: "none",
        opacity: event.isVerified ? "1" : ".5",
      };

      if (!event.isPublic && !user)
        newStyle.backgroundColor = EventColors.private;

      return {
        className: "",
        style: newStyle,
      };
    },
    [user],
  );

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
        view={currentView}
        onView={setCurrentView}
        views={["month", "week", "day"]}
        components={{
          event: CustomEvent,
          toolbar: CustomToolbar,
          week: { header: CustomHeader },
          month: { dateHeader: CustomDateHeader },
        }}
        className="text-xs sm:text-sm"
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
      <BookEventDialog
        isOpen={isBookEventDialogOpen}
        onClose={() => setBookEventDialogOpen(false)}
        eventTypes={eventTypes}
        selectedEventType={null}
      />
      <ViewEventDialog
        isOpen={isViewEventDialogOpen}
        onClose={() => setViewEventDialogOpen(false)}
        event={selectedEvent?.isPublic ? selectedEvent : null}
      />
    </div>
  );
}
