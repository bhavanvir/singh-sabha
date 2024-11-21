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

import { Info } from "lucide-react";

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

const FrequencyForm: React.FC<FrequencyFormProps> = ({
  watchFrequency,
  form,
}) => {
  const { control } = useFormContext();
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
                onChange={(e) => field.onChange(Number(e.target.value))}
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
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="pt-1 text-muted-foreground text-sm flex items-center">
          <Info className="mr-1 h-4 w-4" />
          Specifies how often the event repeats within the given frequency.
        </p>
      </div>
    </>
  );
};

export default FrequencyForm;
