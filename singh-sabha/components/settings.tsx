import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  AddOtp,
  ChangeEmail,
  ChangePassword,
  AddEmail,
  RemoveEmail,
  CreateEventType,
  UpdateEventType,
  DeleteEventType,
} from "@/lib/api/events/mutations";
import {
  RefreshCw,
  Info,
  Copy,
  X,
  Plus,
  PenLine,
  Trash,
  TrashIcon,
} from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import type { User } from "lucia";
import type { MailingList } from "@/lib/types/mailinglist";
import type { EventType } from "@/lib/types/eventtype";
import { ScrollArea } from "./ui/scroll-area";

interface SettingsProps {
  user: User;
  mailingList: MailingList[];
  eventTypes: EventType[];
}

const emailSchema = z.object({
  email: z.string().min(1, "Email missing").email("Invalid email"),
});

const passwordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const eventTypeSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  isRequestable: z.boolean(),
  isSpecial: z.boolean(),
});

export default function Settings({
  user,
  mailingList,
  eventTypes,
}: SettingsProps) {
  const [otp, setOtp] = useState("");
  const [events, setEvents] = useState<EventType[]>(eventTypes);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  const mailingListForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const eventTypeForm = useForm<z.infer<typeof eventTypeSchema>>({
    resolver: zodResolver(eventTypeSchema),
    defaultValues: {
      displayName: "",
      isRequestable: false,
      isSpecial: false,
    },
  });

  const generateOtp = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let generatedOtp = "";
    for (let i = 0; i < 6; i++) {
      generatedOtp += charset.charAt(
        Math.floor(Math.random() * charset.length),
      );
    }

    toast.promise(AddOtp({ otp: generatedOtp, issuer: user?.id }), {
      loading: "Submitting event request...",
      success: (_) => {
        setOtp(generatedOtp);
        return "Temporary password created! It is set to auto-expire in 15 minutes.";
      },
      error: "An unknown error occurred.",
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(otp);
      toast.info("OTP copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy OTP to clipboard.");
    }
  };

  const handleChangeEmail: SubmitHandler<z.infer<typeof emailSchema>> = (
    data,
  ) => {
    toast.promise(ChangeEmail({ id: user?.id, email: data.email }), {
      loading: "Changing email...",
      success: "Email changed!",
      error: "An unknown error occured.",
    });
  };

  const handleChangePassword: SubmitHandler<z.infer<typeof passwordSchema>> = (
    data,
  ) => {
    toast.promise(ChangePassword({ id: user?.id, password: data.password }), {
      loading: "Changing password...",
      success: "Password changed!",
      error: "An unknown error occured.",
    });
  };

  const handleAddEmail = (data: z.infer<typeof emailSchema>) => {
    toast.promise(AddEmail({ email: data.email }), {
      loading: "Adding email to mailing list...",
      success: (_) => {
        mailingListForm.reset();
        return `Added ${data.email} to mailing list.`;
      },
      error: "An unknown error occured.",
    });
  };

  const handleRemoveEmail = (data: MailingList) => {
    toast.promise(RemoveEmail({ id: data.id }), {
      loading: "Removing email from mailing list...",
      success: `Removed ${data.email} from mailing list.`,
      error: "An unknown error occured.",
    });
  };

  const handleCreateEventType: SubmitHandler<
    z.infer<typeof eventTypeSchema>
  > = (data) => {
    toast.promise(CreateEventType({ eventType: data }), {
      loading: "Creating event type...",
      success: (_) => {
        eventTypeForm.reset();
        return `Created ${data.displayName}.`;
      },
      error: "An unknown error occured.",
    });
  };

  const handleEditEvent: SubmitHandler<z.infer<typeof eventTypeSchema>> = (
    data,
  ) => {
    if (editingEvent) {
      const updatedEvent: EventType = data;
      updatedEvent["id"] = editingEvent.id;

      toast.promise(UpdateEventType({ eventType: updatedEvent }), {
        loading: "Updating event...",
        success: (_) => {
          setEditingEvent(null);
          eventTypeForm.reset();
          return "Event updated successfully!";
        },
        error: "Failed to update event.",
      });
    }
  };

  const handleDeleteEvent = (id: string) => {
    toast.promise(DeleteEventType({ id }), {
      loading: "Deleting event type...",
      success: "Delted event type successfully!",
      error: "Failed to delete event.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-2">
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(handleChangeEmail)}
                autoComplete="false"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Change Email</FormLabel>
                      <FormControl>
                        <div className="flex space-x-2">
                          <Input
                            type="text"
                            placeholder="New email"
                            {...field}
                            className="flex-grow"
                          />
                          <Button type="submit">
                            <PenLine />
                            Change
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <div>
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(handleChangePassword)}
                  autoComplete="false"
                >
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Change Password</FormLabel>
                        <FormControl>
                          <div className="flex space-x-2">
                            <Input
                              type="text"
                              placeholder="New password"
                              {...field}
                              className="flex-grow"
                            />
                            <Button type="submit">
                              <PenLine />
                              Change
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
            {user?.isAdmin && (
              <div>
                <Label htmlFor="temp-password">
                  Generate One-Time Password
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="temp-password"
                    type="text"
                    value={otp}
                    readOnly
                    className="flex-grow"
                  />
                  <Button type="button" onClick={generateOtp}>
                    <RefreshCw />
                    Generate
                  </Button>
                  <Button
                    type="button"
                    onClick={copyToClipboard}
                    disabled={!otp}
                  >
                    <Copy />
                    Copy
                    <span className="sr-only">Copy to clipboard</span>
                  </Button>
                </div>
                <p className="pt-1 text-muted-foreground text-sm flex items-center">
                  <Info className="mr-1 h-4 w-4" />
                  Gives a user 15 minutes to create an account.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mailing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...mailingListForm}>
              <form
                onSubmit={mailingListForm.handleSubmit(handleAddEmail)}
                className="space-y-2"
              >
                <FormField
                  control={mailingListForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Add Email to Mailing List</FormLabel>
                      <FormControl>
                        <div className="flex space-x-2">
                          <Input
                            type="email"
                            placeholder="New email address"
                            {...field}
                            className="flex-grow"
                          />
                          <Button type="submit">
                            <Plus />
                            Add
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Current Mailing List</h3>
              {mailingList.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No emails in the list yet.
                </p>
              ) : (
                <ScrollArea>
                  <ul className="space-y-2 max-h-[180px]">
                    {mailingList.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between bg-secondary p-2 rounded-md"
                      >
                        <span className="text-sm">{item.email}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEmail(item)}
                          aria-label={`Remove ${item.email} from mailing list`}
                        >
                          <TrashIcon className="h-4 w-4 stroke-destructive" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              )}
            </div>
          </CardContent>
        </Card>

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
                        <Input {...field} />
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
                          <Info className="h-4 w-4 mr-1" /> Allow users to
                          request this event
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
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
                        <FormLabel className="text-base">
                          Special Event
                        </FormLabel>
                        <FormDescription className="flex items-center">
                          <Info className="h-4 w-4 mr-1" /> Mark this as a
                          special event
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
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
                        <PenLine /> Update
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
                        <span className="text-sm">{type.displayName}</span>
                        <div className="space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingEvent(type);
                              eventTypeForm.reset(type);
                            }}
                            aria-label={`Edit ${type.displayName}`}
                          >
                            <PenLine className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEvent(type.id!)}
                            aria-label={`Delete ${type.displayName}`}
                          >
                            <Trash className="h-4 w-4 stroke-destructive" />
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
      </div>
    </div>
  );
}
