import * as React from "react";
import { format } from "date-fns";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
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
import { Label } from "@/components/ui/label";
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
import { Info, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreateEvent } from "@/lib/api/events/mutations";
import { typeColourMap, kebabToTitleCase } from "@/lib/utils";
import moment from "moment";

import type { Event } from "@/lib/types/event";
import type { SlotInfo } from "react-big-calendar";

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
    };

    toast.promise(CreateEvent({ newEvent }), {
      loading: "Creating event...",
      success: "Event created successfully!",
      error: "An unknown error occured.",
    });

    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create event</DialogTitle>
          <DialogDescription>
            Parameters based on your selection. Click when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 gap-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Add title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Label htmlFor="period">Time period</Label>
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
              {form.getValues()["startTime"] == form.getValues()["endTime"] && (
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
                          {Object.entries(typeColourMap).map(
                            ([type, colour]) => (
                              <SelectItem value={type} key={type}>
                                <span className="flex items-center gap-1">
                                  <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: colour }}
                                  />
                                  {kebabToTitleCase(type)}
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
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
