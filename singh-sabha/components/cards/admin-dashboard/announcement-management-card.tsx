import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Plus, Rss } from "lucide-react";

import { announcementColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { Announcement } from "@/db/schema";
import {
  CreateAnnouncement,
  DisableAnnouncement,
} from "@/lib/api/announcements/mutations";

const announcementSchema = z.object({
  title: z.string().min(6, "Title is required").max(64, "Title too long"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(150, "Message too long"),
});

interface AnnouncementManagementCardProps {
  announcements: Announcement[];
}

export default function AnnouncementManagementCard({
  announcements,
}: AnnouncementManagementCardProps) {
  const activeAnnouncement = announcements.find((a) => a.isActive);
  const pastAnnouncements = announcements.filter((a) => !a.isActive);

  const [enabled, setEnabled] = React.useState<boolean>(
    activeAnnouncement?.isActive ?? true,
  );

  const announcementForm = useForm<z.infer<typeof announcementSchema>>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      message: "",
    },
  });

  const handleAddAnnouncement: SubmitHandler<
    z.infer<typeof announcementSchema>
  > = (data) => {
    toast.promise(
      CreateAnnouncement({
        title: data.title,
        message: data.message,
      }),
      {
        loading: "Creating announcement...",
        success: "Announcement created successfully!",
        error: "Failed to create an announcement.",
      },
    );
    announcementForm.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Announcement Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...announcementForm}>
          <form
            onSubmit={announcementForm.handleSubmit(handleAddAnnouncement)}
            className="space-y-4"
          >
            <FormField
              control={announcementForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter announcement title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={announcementForm.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter announcement message"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
          </form>
        </Form>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Active Announcement</h3>
          {!activeAnnouncement ? (
            <p className="text-sm text-muted-foreground">
              No active announcement.
            </p>
          ) : (
            <div className="bg-secondary p-4 rounded-md flex flex-row items-center justify-between">
              <div className="flex flex-row items-start">
                <Rss className="h-4 w-4 mr-4 mt-1 animate-pulse" />
                <span>
                  <h4>{activeAnnouncement.title}</h4>
                  <p className="text-sm">{activeAnnouncement.message}</p>
                </span>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={() => {
                  setEnabled(false);
                  toast.promise(
                    DisableAnnouncement({ id: activeAnnouncement.id! }),
                    {
                      loading: "Disabling announcement...",
                      success: "Announcement disabled successfully!",
                      error: "Failed to disable announcement.",
                    },
                  );
                }}
              />
            </div>
          )}
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Past Announcements</h3>
          {pastAnnouncements.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No past announcements.
            </p>
          ) : (
            <DataTable columns={announcementColumns} data={pastAnnouncements} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
