import * as React from "react";
import { RRule, Frequency } from "rrule";
import { format } from "date-fns";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Info, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreateEvent } from "@/lib/api/events/mutations";
import moment from "moment";

import type { Event } from "@/lib/types/event";
import { EventType } from "@/lib/types/event-type";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title missing")
    .min(6, "Title too short")
    .max(64, "Title too long"),
  type: z.string().min(1, "Type missing"),
  note: z.string().max(128, "Note too long"),
  frequency: z.string(),
  selectedDays: z.array(z.string()).optional(),
  selectedMonths: z.array(z.string()).optional(),
  interval: z
    .number()
    .min(1, "Interval must be at least 1")
    .max(365, "Interval can't be over 365")
    .optional(),
  count: z
    .number()
    .min(1, "Count must be at least 1")
    .max(365, "Count can't be over 365")
    .optional(),
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
  isPublic: z.boolean().default(true),
});

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventTypes: EventType[];
}

const CreateEventDialog: React.FC<CreateEventDialogProps> = ({
  isOpen,
  onClose,
  eventTypes,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "",
      note: "",
      frequency: "",
      selectedDays: [],
      selectedMonths: [],
      count: undefined,
      interval: undefined,
      timeRange: [9 * 4, 17 * 4],
      isPublic: true,
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

    const rule = data.frequency
      ? new RRule({
          freq: Frequency[data.frequency as keyof typeof Frequency],
          interval: data.interval,
          count: data.count,
          byweekday: data.selectedDays?.map((day) => Number(day)),
          bymonth: data.selectedMonths?.map((month) => Number(month)),
          dtstart: startDateTime.toDate(),
        })
      : null;

    const newEvent: Event = {
      type: data.type,
      start: startDateTime.toDate(),
      end: endDateTime.toDate(),
      allDay: startDateTime === endDateTime,
      title: data.title,
      note: data.note,
      verified: true,
      frequencyRule: rule ? rule.toString() : undefined,
      isPublic: data.isPublic,
    };

    toast.promise(CreateEvent({ newEvent }), {
      loading: "Creating event...",
      success: "Event created successfully!",
      error: "Failed to create an event.",
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
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create event</DialogTitle>
          <DialogDescription>
            Parameters based on your selection. Click create when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="parameters">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="frequency">Frequency</TabsTrigger>
          </TabsList>
          <TabsContent value="parameters">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="grid grid-cols-1 gap-4"
                autoComplete="off"
              >
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
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an event type" />
                          </SelectTrigger>
                          <SelectContent className="overflow-y-auto max-h-[10rem]">
                            <SelectGroup>
                              {eventTypes.map((type) => (
                                <SelectItem
                                  value={type.id!}
                                  key={type.id || type.displayName}
                                >
                                  <span className="flex items-center gap-2">
                                    {type.displayName}
                                  </span>
                                </SelectItem>
                              ))}
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
                <DialogFooter>
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="frequency">
            <Form {...form}>
              <form className="grid gap-4">
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Frequency</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);

                            // Reset values when selecting another frequency
                            form.setValue("frequency", value);
                            form.setValue("selectedDays", []);
                            form.setValue("selectedMonths", []);
                            form.setValue("count", 1);
                          }}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DAILY">Daily</SelectItem>
                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                            <SelectItem value="YEARLY">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(form.watch("frequency") === "DAILY" ||
                  form.watch("frequency") === "WEEKLY") && (
                  <FormField
                    control={form.control}
                    name="selectedDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select weekdays</FormLabel>
                        <ToggleGroup
                          type="multiple"
                          value={field.value}
                          onValueChange={field.onChange}
                          className="grid grid-cols-7"
                        >
                          {weekdays.map((day, index) => (
                            <ToggleGroupItem key={day} value={index.toString()}>
                              {day}
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                      </FormItem>
                    )}
                  />
                )}

                {form.watch("frequency") === "MONTHLY" && (
                  <FormField
                    control={form.control}
                    name="selectedMonths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select months</FormLabel>
                        <ToggleGroup
                          type="multiple"
                          value={field.value}
                          onValueChange={field.onChange}
                          className="grid grid-cols-6"
                        >
                          {months.map((month, index) => (
                            <ToggleGroupItem
                              key={month}
                              value={(index + 1).toString()}
                            >
                              {month}
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Repeat Count</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          className="w-full"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormField
                    control={form.control}
                    name="interval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Repeat Every</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            className="w-full"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p className="pt-1 text-muted-foreground text-sm flex items-center">
                    <Info className="mr-1 h-4 w-4" />
                    Specifies how often the event repeats within the given
                    frequency.
                  </p>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
