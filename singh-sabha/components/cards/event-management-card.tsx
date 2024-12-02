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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Plus, Edit, Trash, Info } from "lucide-react";

import {
  CreateEventType,
  UpdateEventType,
  DeleteEventType,
} from "@/lib/api/event-types/mutations";
import { EventType } from "@/db/schema";
import { EventColors } from "@/lib/types/event-colours";

const eventTypeSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  description: z.string().nullish(),
  isRequestable: z.boolean().nullable().default(false),
  isSpecial: z.boolean().nullable().default(false),
});

interface EventManagementCardProps {
  eventTypes: EventType[];
}

export default function EventManagementCard({
  eventTypes,
}: EventManagementCardProps) {
  const [editingEvent, setEditingEvent] = React.useState<EventType | null>(
    null,
  );

  const eventTypeForm = useForm<z.infer<typeof eventTypeSchema>>({
    resolver: zodResolver(eventTypeSchema),
    defaultValues: {
      displayName: "",
      description: undefined,
      isRequestable: false,
      isSpecial: false,
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
      error: "Failed to create an event.",
    });
  };

  const handleEditEvent: SubmitHandler<z.infer<typeof eventTypeSchema>> = (
    data,
  ) => {
    if (editingEvent) {
      const updatedEvent: Partial<EventType> = {
        ...data,
        description: data.description || null,
        id: editingEvent.id,
      };

      toast.promise(UpdateEventType({ eventType: updatedEvent as EventType }), {
        loading: "Updating event...",
        success: "Event updated successfully!",
        error: "Failed to update event.",
      });
    }
  };

  const handleDeleteEvent = (id: string) => {
    toast.promise(DeleteEventType({ id }), {
      loading: "Deleting event type...",
      success: "Deleted event type successfully!",
      error: "Failed to delete event.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...eventTypeForm}>
          <form
            onSubmit={eventTypeForm.handleSubmit(
              editingEvent ? handleEditEvent : handleCreateEventType,
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 ">
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
                {editingEvent ? (
                  <>
                    <Edit /> Update
                  </>
                ) : (
                  <>
                    <Plus /> Add
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Current Events</h3>
          {eventTypes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No events added yet.
            </p>
          ) : (
            <ScrollArea>
              <ul className="space-y-2 max-h-[180px]">
                {eventTypes.map((type) => (
                  <li
                    key={type.id}
                    className="flex items-center justify-between bg-secondary p-2 rounded-md"
                  >
                    <div className="inline-flex items-center space-x-2">
                      <Badge
                        style={{
                          backgroundColor: type.isSpecial
                            ? EventColors.special
                            : EventColors.regular,
                        }}
                      >
                        {type.isSpecial ? "Special" : "Regular"}
                      </Badge>
                      {type.isRequestable && <Badge>Requestable</Badge>}
                      <span>{type.displayName}</span>
                    </div>

                    <div className="space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingEvent(type);
                          eventTypeForm.reset(type);
                        }}
                        aria-label={`Edit ${type.displayName}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEvent(type.id!)}
                        aria-label={`Delete ${type.displayName}`}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
