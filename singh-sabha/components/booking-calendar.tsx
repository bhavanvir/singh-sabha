"use client";

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
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import type { ToolbarProps, View } from "react-big-calendar";

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

export default function BookingCalendar() {
  moment.locale("en-CA");
  const localizer = momentLocalizer(moment);

  const CustomToolbar = (toolbar: ToolbarProps) => {
    const date = new Date(toolbar.date);
    const startOfWeek = moment(date).startOf("week");
    const endOfWeek = moment(date).endOf("week");

    let weekDisplay;
    if (startOfWeek.month() === endOfWeek.month()) {
      weekDisplay = `${monthNames[startOfWeek.month()]} ${startOfWeek.date()} - ${endOfWeek.date()}, ${startOfWeek.year()}`;
    } else {
      weekDisplay = `${monthNames[startOfWeek.month()]} ${startOfWeek.date()} - ${monthNames[endOfWeek.month()]} ${endOfWeek.date()}, ${startOfWeek.year()}`;
    }

    return (
      <>
        <div className="flex justify-between pb-4">
          <div className="relative flex h-full w-[35rem] flex-grow-0 items-center justify-center">
            <Button
              size="icon"
              variant="outline"
              onClick={() => toolbar.onNavigate("PREV")}
              className="absolute left-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <h1 className="text-2xl font-bold">
              {toolbar.view === "week" ? (
                <span>{weekDisplay}</span>
              ) : (
                <span>
                  {monthNames[date.getMonth()]} {date.getDate()},{" "}
                  {date.getFullYear()}
                </span>
              )}
            </h1>

            <Button
              size="icon"
              variant="outline"
              onClick={() => toolbar.onNavigate("NEXT")}
              className="absolute right-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex space-x-2">
            <Select onValueChange={(view: View) => toolbar.onView(view)}>
              <SelectTrigger className="w-24 capitalize">
                <SelectValue placeholder={toolbar.view} />
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

            <Button
              variant="outline"
              onClick={() => toolbar.onNavigate("TODAY")}
            >
              Today
            </Button>
          </div>
        </div>
      </>
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
            <>
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground">
                <span className="text-background">{dayOfMonth}</span>
              </div>
            </>
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

  return (
    <>
      <div className="h-[calc(100vh-2rem)] pb-8">
        <Calendar
          localizer={localizer}
          defaultView={"week"}
          views={["week", "day", "month"]}
          components={{
            toolbar: CustomToolbar,
            week: {
              header: CustomHeader,
            },
            month: {
              dateHeader: CustomDateHeader,
            },
          }}
        />
      </div>
    </>
  );
}
