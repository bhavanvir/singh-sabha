import * as React from "react";
import { format } from "date-fns";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import { Info, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreateEvent } from "@/lib/api/events/mutations";
import { typeEventMap } from "@/lib/types/eventdetails";
import moment from "moment";

import type { Event } from "@/lib/types/event";
import type { SlotInfo } from "react-big-calendar";

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
  startTime: z.string().min(1, "Start time missing"),
  endTime: z.string().min(1, "End time missing"),
});

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  slot: SlotInfo | null;
}

const CreateEventDialog: React.FC<CreateEventDialogProps> = ({
  isOpen,
  onClose,
  slot,
}) => {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const [frequency, setFrequency] = React.useState<string>("daily");
  const [selectedDays, setSelectedDays] = React.useState<string[]>([]);
  const [selectedMonths, setSelectedMonths] = React.useState<string[]>([]);
  const [count, setCount] = React.useState<number>(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "",
      note: "",
    },
  });

  React.useEffect(() => {
    if (isOpen && slot) {
      setDate({
        from: slot.start,
        to: slot.end,
      });

      form.setValue("startTime", moment(slot.start).format("HH:mm"));
      form.setValue("endTime", moment(slot.end).format("HH:mm"));
    } else {
      setDate(undefined);
    }
  }, [form, isOpen, slot]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    if (!slot) return;

    const startDateTime = moment(
      `${moment(date?.from).format("YYYY-MM-DD")} ${data.startTime}`,
      "YYYY-MM-DD HH:mm",
    );

    const endDateTime = moment(
      `${moment(date?.to ?? date?.from).format("YYYY-MM-DD")} ${data.endTime}`,
      "YYYY-MM-DD HH:mm",
    );

    const newEvent: Event = {
      type: data.type,
      start: startDateTime.toDate(),
      end: endDateTime.toDate(),
      allDay: data.startTime === data.endTime,
      title: data.title,
      note: data.note,
      verified: true,
    };

    toast.promise(CreateEvent({ newEvent }), {
      loading: "Creating event...",
      success: "Event created successfully!",
      error: "An unknown error occured.",
    });

    handleClose();
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleMonthToggle = (month: string) => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month],
    );
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

        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="frequency">Frequency</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
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

                <FormLabel required>Time period</FormLabel>
                <div className="grid grid-cols-2 gap-x-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal w-[80%]",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <span className="ml-[-0.375rem]">
                          {date?.from ? (
                            date.to ? (
                              <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(date.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={(selected) => {
                          if (selected?.from) {
                            setDate(selected);
                          } else if (date) {
                            setDate(date);
                          }
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>

                  <div className="flex items-center justify-end space-x-1">
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="time" {...field} className="w-fit" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Minus className="w-4" />

                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="time" {...field} className="w-fit" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {form.getValues()["startTime"] ==
                    form.getValues()["endTime"] && (
                    <p className="pt-1 text-muted-foreground text-sm flex items-center">
                      <Info className="mr-1 h-4 w-4" />
                      This is an all day event.
                    </p>
                  )}
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
                              {Object.entries(typeEventMap).map(
                                ([type, { colour, displayName }]) => (
                                  <SelectItem value={type} key={type}>
                                    <span className="flex items-center gap-2">
                                      <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: colour }}
                                      />
                                      {displayName}
                                    </span>
                                  </SelectItem>
                                ),
                              )}
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
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="frequency">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select onValueChange={setFrequency} defaultValue={frequency}>
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {frequency === "daily" && (
                <div>
                  <Label>Select weekdays</Label>
                  <ToggleGroup
                    type="multiple"
                    id="weekdays"
                    value={selectedDays}
                    onValueChange={setSelectedDays}
                    className="grid grid-cols-7"
                  >
                    {weekdays.map((day) => (
                      <ToggleGroupItem key={day} value={day} aria-label={day}>
                        {day}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              )}

              {frequency === "monthly" && (
                <div>
                  <Label>Select months</Label>
                  <ToggleGroup
                    type="multiple"
                    id="months"
                    value={selectedMonths}
                    onValueChange={setSelectedMonths}
                    className="grid grid-cols-6"
                  >
                    {months.map((month) => (
                      <ToggleGroupItem
                        key={month}
                        value={month}
                        aria-label={month}
                      >
                        {month}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              )}

              <div>
                <Label htmlFor="count">
                  Repeat for how many{" "}
                  <span>
                    {frequency === "daily"
                      ? "days"
                      : frequency === "weekly"
                        ? "weeks"
                        : frequency === "monthly"
                          ? "months"
                          : "years"}
                  </span>
                </Label>
                <div className="flex items-center space-x-2 justify-between">
                  <Input
                    id="count"
                    type="number"
                    min="1"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value, 10))}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
