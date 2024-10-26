import * as React from "react";
import parsePhoneNumber, {
  parsePhoneNumberFromString,
  PhoneNumber,
} from "libphonenumber-js";
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
import { typeEventMap } from "@/lib/types/eventdetails";
import moment from "moment";
import { CreateEvent } from "@/lib/api/events/mutations";

import type { Event } from "@/lib/types/event";
import type { SlotInfo } from "react-big-calendar";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  name: z.string().min(1, "Full name missing").max(128, "Full name too long"),
  email: z.string().min(1, "Email missing").email("Invalid email"),
  phoneNumber: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true;

      const phoneNumber = parsePhoneNumberFromString(value, "CA");
      return phoneNumber?.isValid();
    }, "Invalid phone number")
    .transform((value) => {
      if (!value) return value;

      const phoneNumber = parsePhoneNumberFromString(value, "CA");
      return phoneNumber ? phoneNumber.formatInternational() : value;
    }),
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

interface RequestEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  slot: SlotInfo | null;
}

const RequestEventDialog: React.FC<RequestEventDialogProps> = ({
  isOpen,
  onClose,
  slot,
}) => {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
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
      registrantFullName: data.name,
      registrantEmail: data.email,
      registrantPhoneNumber: data.phoneNumber ?? null,
      type: data.type,
      start: startDateTime.toDate(),
      end: endDateTime.toDate(),
      allDay: data.startTime === data.endTime,
      title: data.title,
      note: data.note,
      verified: false,
      frequencyRule: "FREQ=DAILY;COUNT=1", // Happens only once
    };

    toast.promise(CreateEvent({ newEvent }), {
      loading: "Submitting event request...",
      success:
        "Event request submitted successfully, we'll get back to you soon!",
      error: "An unknown error occured.",
    });
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Request event</DialogTitle>
          <DialogDescription>
            Parameters based on your selection. Click submit when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 gap-4"
            autoComplete="false"
          >
            <div className="flex justify-between space-x-4">
              {/* Left column */}
              <div className="grid grid-cols-1 gap-4 h-fit w-1/3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Full name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Add full name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Email</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Add email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Add phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Separator */}
              <Separator orientation="vertical" />

              {/* Right column */}
              <div className="grid grid-cols-1 gap-4">
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

                    <Minus className="w-4 text-muted-foreground" />

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
                              <div className="max-h-64 overflow-y-auto">
                                {Object.entries(typeEventMap)
                                  .filter(
                                    ([, { isRequestable }]) => isRequestable,
                                  )
                                  .map(([type, { colour, displayName }]) => (
                                    <SelectItem value={type} key={type}>
                                      <span className="flex items-center gap-2">
                                        <div
                                          className="w-4 h-4 rounded-full"
                                          style={{ backgroundColor: colour }}
                                        />
                                        {displayName}
                                      </span>
                                    </SelectItem>
                                  ))}
                              </div>
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
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestEventDialog;
