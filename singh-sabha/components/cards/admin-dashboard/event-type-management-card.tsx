import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Plus, Edit, Info } from "lucide-react";

import {
  CreateEventType,
  UpdateEventType,
} from "@/lib/api/event-types/mutations";
import { EventType } from "@/db/schema";
import { DataTable } from "@/components/data-table";
import { eventTypeColumns } from "@/components/columns";

const eventTypeSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  description: z.string().max(150, "Description too long").nullish(),
  isRequestable: z.boolean().nullable().default(false),
  isSpecial: z.boolean().nullable().default(false),
  deposit: z
    .number()
    .min(0, "Deposit amount cannot be negative")
    .max(1000, "Deposit amount must be smaller than $1000"),
});

interface EventTypeManagementCardProps {
  eventTypes: EventType[];
}

export default function EventTypeManagementCard({
  eventTypes,
}: EventTypeManagementCardProps) {
  const [editingEventType, setEditingEventType] =
    React.useState<EventType | null>(null);

  const eventTypeForm = useForm<z.infer<typeof eventTypeSchema>>({
    resolver: zodResolver(eventTypeSchema),
    defaultValues: {
      displayName: "",
      description: undefined,
      isRequestable: false,
      isSpecial: false,
      deposit: 0,
    },
  });

  const handleCreateEventType: SubmitHandler<
    z.infer<typeof eventTypeSchema>
  > = (data) => {
    const eventTypeData = {
      ...data,
      description: data.description || null,
    };
    toast.promise(CreateEventType({ eventType: eventTypeData }), {
      loading: "Creating event type...",
      success: `Created ${data.displayName}.`,
      error: "Failed to create an event type",
    });
  };

  const handleEditEventType: SubmitHandler<z.infer<typeof eventTypeSchema>> = (
    data,
  ) => {
    if (editingEventType) {
      const updatedEvent: Partial<EventType> = {
        ...data,
        description: data.description || null,
        id: editingEventType.id,
      };

      toast.promise(UpdateEventType({ eventType: updatedEvent as EventType }), {
        loading: "Updating event type...",
        success: "Event type updated successfully!",
        error: "Failed to update event type",
      });
    }
  };

  const columns = eventTypeColumns((eventType) => {
    setEditingEventType(eventType);
    eventTypeForm.reset(eventType);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Type Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...eventTypeForm}>
          <form
            onSubmit={eventTypeForm.handleSubmit(
              editingEventType ? handleEditEventType : handleCreateEventType,
            )}
            className="space-y-4"
          >
            <FormField
              control={eventTypeForm.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="New event type" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={eventTypeForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Enter event description"
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {eventTypeForm.watch("isRequestable") && (
              <FormField
                control={eventTypeForm.control}
                name="deposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deposit</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-muted-foreground">
                          $
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          className="pl-7"
                          value={field.value}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={eventTypeForm.control}
              name="isRequestable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel className="text-base text-m">
                      Requestable
                    </FormLabel>
                    <FormDescription className="flex items-center">
                      <Info className="h-4 w-4 mr-1" /> Allow users to request
                      this event
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value!}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={eventTypeForm.control}
              name="isSpecial"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel className="text-base">Special Event</FormLabel>
                    <FormDescription className="flex items-center">
                      <Info className="h-4 w-4 mr-1" /> Mark this as a special
                      event
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value!}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">
                {editingEventType ? (
                  <>
                    <Edit className="mr-2 h-4 w-4" /> Update
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Add
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Event Types</h3>
          {eventTypes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No event types added yet.
            </p>
          ) : (
            <DataTable columns={columns} data={eventTypes} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
