import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Info, CircleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import type { EventType } from "@/db/schema";

interface ParametersFormProps {
  eventTypes: EventType[];
  role: "admin" | "user";
}

export function ParametersForm({ eventTypes, role }: ParametersFormProps) {
  const isAdmin = role === "admin";
  const { control } = useFormContext();

  const selectedType = useWatch({ control, name: "type" });
  const selectedEventType = eventTypes.find((type) => type.id === selectedType);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="grid grid-cols-1 gap-6">
      <FormField
        control={control}
        name="occassion"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Occassion</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Add the occasion" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={control}
          name="dateRange"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel required>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
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
                        <span>Pick a date</span>
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
                      if (range?.from) {
                        if (range.from < today) {
                          return;
                        }
                        if (!range.to) {
                          range.to = range.from;
                        }
                        if (range.to && range.to < range.from) {
                          range.to = range.from;
                        }
                      }
                      field.onChange(range);
                    }}
                    disabled={(date) => {
                      return date < today || (!isAdmin && date.getDay() === 0); // Disables Sundays (getDay() returns 0 for Sunday)
                    }}
                    initialFocus
                    fromDate={today}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        {isAdmin && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Type</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                name={field.name}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an event type" />
                </SelectTrigger>
                <SelectContent className="overflow-y-auto max-h-[10rem]">
                  <SelectGroup>
                    {eventTypes.map((type) => (
                      <SelectItem
                        value={type.id}
                        key={type.id || type.displayName}
                      >
                        {type.displayName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />

            {!isAdmin &&
              selectedEventType &&
              selectedEventType.deposit > 0.0 && (
                <p className="pt-1 text-sm text-muted-foreground flex items-center">
                  <CircleAlert className="h-4 w-4 mr-1" />
                  You will be charged a ${selectedEventType.deposit.toFixed(
                    2,
                  )}{" "}
                  non-refundable deposit upon confirmation.
                </p>
              )}
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="note"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Note</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Add any notes or requests, for example, requesting an evening or afternoon Langar"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="isPublic"
        render={({ field }) => (
          <FormItem className="rounded-md border p-4">
            <div className="flex space-x-2 items-center">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Public Event</FormLabel>
            </div>
            <p className="pt-1 text-sm text-muted-foreground flex items-center">
              <Info className="h-4 w-4 mr-1" />
              Public event details will be shown on the calendar.
            </p>
          </FormItem>
        )}
      />
    </div>
  );
}
