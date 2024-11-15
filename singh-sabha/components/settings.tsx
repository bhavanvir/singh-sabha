import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
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
  UpdateUserPrivilege,
  DeleteUser,
} from "@/lib/api/events/mutations";
import {
  RefreshCw,
  Info,
  Copy,
  Plus,
  PenLine,
  Trash,
  TrashIcon,
} from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EventColors } from "@/lib/types/eventcolours";

import type { User as SessionUser } from "lucia";
import type { User as DatabaseUser } from "@/lib/types/user";
import type { MailingList } from "@/lib/types/mailinglist";
import type { EventType } from "@/lib/types/eventtype";
import { ScrollArea } from "./ui/scroll-area";

interface SettingsProps {
  user: SessionUser;
  users: DatabaseUser[];
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

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  isAdmin: z.boolean(),
  isMod: z.boolean(),
});

export default function Settings({
  user,
  users,
  mailingList,
  eventTypes,
}: SettingsProps) {
  const [otp, setOtp] = useState("");
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [editingUser, setEditingUser] = useState<DatabaseUser | null>(null);

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

  const userForm = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      id: "",
      email: "",
      fullName: "",
      isAdmin: false,
      isMod: false,
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
      loading: "Creating OTP...",
      success: (_) => {
        setOtp(generatedOtp);
        return "Temporary password created! It is set to auto-expire in 15 minutes.";
      },
      error: "Failed to create OTP.",
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(otp);
      toast.info("OTP copied to clipboard!");
    } catch (_) {
      toast.error("Failed to copy OTP to clipboard.");
    }
  };

  const handleChangeEmail: SubmitHandler<z.infer<typeof emailSchema>> = (
    data,
  ) => {
    toast.promise(ChangeEmail({ id: user?.id, email: data.email }), {
      loading: "Changing email...",
      success: "Email changed!",
      error: "Failed to change email.",
    });
  };

  const handleChangePassword: SubmitHandler<z.infer<typeof passwordSchema>> = (
    data,
  ) => {
    toast.promise(ChangePassword({ id: user?.id, password: data.password }), {
      loading: "Changing password...",
      success: "Password changed!",
      error: "Failed to change password.",
    });
  };

  const handleAddEmail = (data: z.infer<typeof emailSchema>) => {
    toast.promise(AddEmail({ email: data.email }), {
      loading: "Adding email to mailing list...",
      success: (_) => {
        mailingListForm.reset();
        return `Added ${data.email} to mailing list.`;
      },
      error: "Failed to add email to mailing list.",
    });
  };

  const handleRemoveEmail = (data: MailingList) => {
    toast.promise(RemoveEmail({ id: data.id }), {
      loading: "Removing email from mailing list...",
      success: `Removed ${data.email} from mailing list.`,
      error: "Failed to remove email from mailing list.",
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
      error: "Failed to create an event.",
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

  const handleUpdateUser: SubmitHandler<z.infer<typeof userSchema>> = (
    data,
  ) => {
    if (data.isAdmin && data.isMod) {
      toast.warning("A user cannot be both an admin and a mod.");
      return;
    }

    toast.promise(UpdateUserPrivilege({ user: data }), {
      loading: `Updating ${data.fullName}'s privileges...`,
      success: (_) => {
        setEditingUser(null);
        userForm.reset();
        return "User updated successfully!";
      },
      error: "Failed to update user.",
    });
  };

  const handleDeleteUser = (id: string) => {
    toast.promise(DeleteUser({ id }), {
      loading: "Deleting user...",
      success: "User deleted successfully!",
      error: "Failed to delete user.",
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

        {user?.isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingUser && (
                <Form {...userForm}>
                  <form
                    onSubmit={userForm.handleSubmit(handleUpdateUser)}
                    className="space-y-4"
                  >
                    <FormField
                      control={userForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="User's full name"
                              disabled={true}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={userForm.control}
                      name="isAdmin"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Admin</FormLabel>
                            <FormDescription className="flex items-center">
                              <Info className="h-4 w-4 mr-1" />
                              Grant admin privileges
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
                      control={userForm.control}
                      name="isMod"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Moderator
                            </FormLabel>
                            <FormDescription className="flex items-center">
                              <Info className="h-4 w-4 mr-1" />
                              Grant moderator privileges
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
                        <PenLine className="h-4 w-4" /> Change
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Current Users</h3>
                {users.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No users added yet.
                  </p>
                ) : (
                  <ScrollArea>
                    <ul className="space-y-2 max-h-[180px]">
                      {users.map((u) => (
                        <li
                          key={u.id}
                          className="flex items-center justify-between bg-secondary p-2 rounded-md"
                        >
                          <div className="inline-flex items-center space-x-2">
                            <Badge>
                              {u.isAdmin ? "Admin" : u.isMod ? "Mod" : "User"}
                            </Badge>
                            <span className="font-medium">{u.fullName}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {u.email}
                            </span>
                          </div>

                          <div className="space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingUser(u);
                                userForm.reset(u);
                              }}
                              aria-label={`Edit ${u.fullName}`}
                            >
                              <PenLine className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(u.id)}
                              aria-label={`Delete ${u.fullName}`}
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
        )}

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
                        <Input {...field} placeholder="New event type" />
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
                          <span>{type.displayName}</span>
                        </div>

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
