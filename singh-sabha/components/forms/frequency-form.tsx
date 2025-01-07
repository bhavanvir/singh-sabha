import * as React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { RRule, Frequency } from "rrule";

import { Languages } from "lucide-react";

import { capitalizeFirstLetter } from "@/lib/utils";

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

interface FrequencyFormProps {
  watchFrequency: string;
  form: any;
}

export function FrequencyForm({ watchFrequency, form }: FrequencyFormProps) {
  const { control } = useFormContext();
  const [rrule, setRrule] = React.useState<RRule | null>(null);

  const frequency = form.watch("frequency");
  const selectedDays = form.watch("selectedDays");
  const selectedMonths = form.watch("selectedMonths");
  const interval = form.watch("interval");
  const count = form.watch("count");
  const repeatUntil = form.watch("repeatUntil");

  React.useEffect(() => {
    if (frequency) {
      const rule = new RRule({
        freq: Frequency[frequency as keyof typeof Frequency],
        interval: interval || 1,
        count: count || undefined,
        byweekday: selectedDays?.map((day: number) => Number(day)),
        bymonth: selectedMonths?.map((month: number) => Number(month)),
      });

      setRrule(rule);
    } else {
      setRrule(null);
    }
  }, [frequency, selectedDays, selectedMonths, interval, count]);

  React.useEffect(() => {
    if (repeatUntil && frequency) {
      const startDate = new Date();
      let endDate = new Date();

      switch (repeatUntil) {
        case "end-of-year":
          endDate = new Date(startDate.getFullYear(), 11, 31);
          break;
        case "end-of-month":
          endDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth() + 1,
            0,
          );
          break;
        case "end-of-week":
          const daysUntilEndOfWeek = 7 - startDate.getDay();
          endDate = new Date(
            startDate.getTime() + daysUntilEndOfWeek * 24 * 60 * 60 * 1000,
          );
          break;
      }

      const rule = new RRule({
        freq: Frequency[frequency as keyof typeof Frequency],
        interval: interval || 1,
        dtstart: startDate,
        until: endDate,
        byweekday: selectedDays?.map((day: number) => Number(day)),
        bymonth: selectedMonths?.map((month: number) => Number(month)),
      });

      const occurrences = rule.all();
      form.setValue("count", occurrences.length);
    }
  }, [repeatUntil, frequency, interval, selectedDays, selectedMonths, form]);

  return (
    <>
      <FormField
        control={control}
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
                  form.setValue("repeatUntil", "");
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

      {(watchFrequency === "DAILY" || watchFrequency === "WEEKLY") && (
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
                  <ToggleGroupItem
                    key={day}
                    value={index.toString()}
                    className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    {day}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FormItem>
          )}
        />
      )}

      {watchFrequency === "MONTHLY" && (
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
                    className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
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
        name="repeatUntil"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Repeat Until</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                form.setValue("repeatUntil", value);
              }}
              value={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select end date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="end-of-week">End of Week</SelectItem>
                <SelectItem value="end-of-month">End of Month</SelectItem>
                <SelectItem value="end-of-year">End of Year</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      {form.watch("repeatUntil") === "custom" && (
        <>
          <FormField
            control={form.control}
            name="count"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Total Number of Repeats</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    className="w-full"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interval Between Repeats</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    className="w-full"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}

      {rrule && (
        <div className="mt-4 text-sm text-muted-foreground flex items-center">
          <Languages className="h-4 w-4 mr-1" />
          {capitalizeFirstLetter(rrule.toText())}
        </div>
      )}
    </>
  );
}
