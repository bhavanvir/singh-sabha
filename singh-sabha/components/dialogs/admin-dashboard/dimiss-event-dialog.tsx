import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { Send, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

import { sendEmail } from "@/lib/send-email";
import { DeleteEvent } from "@/lib/api/events/mutations";

import type { EventWithType } from "@/db/schema";

interface DismissEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: EventWithType;
}

const formSchema = z.object({
  reason: z.string().min(6, "Reason too short").max(128, "Reason too long"),
});

export default function DismissEventDialog({
  isOpen,
  onClose,
  selectedEvent,
}: DismissEventDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
    },
  });

  const handleSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    toast.promise(
      async () => {
        if (!selectedEvent.isVerified) {
          await DeleteEvent({ id: selectedEvent.id });
          await sendEmail(selectedEvent, "/api/send/denied", data.reason);
        }
        handleClose();
        return selectedEvent;
      },
      {
        loading: "Dismissing event and sending notification...",
        success: "Event dismissed and notification sent successfully!",
        error: "Failed to dismiss event or send notification.",
      },
    );
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dismiss Event</DialogTitle>
          <DialogDescription>
            Enter an appropriate message for denying the event.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            autoComplete="off"
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Reason for Dismissal</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your reason for denying the request"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                <X />
                Cancel
              </Button>
              <Button type="submit">
                <Send />
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
