import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { UpdateEvent } from "@/lib/api/events/mutations";
import { toast } from "sonner";

import type { Event } from "@/lib/types/event";

interface EditEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title missing")
    .min(6, "Title too short")
    .max(64, "Title too long"),
  type: z.string().min(1, "Type missing"),
  note: z.string().max(128, "Note too long"),
});

const EditEventDialog: React.FC<EditEventDialogProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: event?.title,
      type: event?.type,
      note: event?.note ?? "",
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    if (event) {
      form.reset({
        title: event.title,
        type: event.type,
        note: event.note ?? "",
      });
    }
  }, [event, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleEditEventSubmit: SubmitHandler<z.infer<typeof formSchema>> = (
    data,
  ) => {
    if (!event) return;
    const updatedEvent = { ...event };

    for (const [key, value] of Object.entries(data)) {
      if (key in updatedEvent) {
        (updatedEvent[key as keyof Event] as any) = value; // Can't be bothered with this nonsense
      }
    }

    toast.promise(UpdateEvent({ updatedEvent }), {
      loading: "Updating event...",
      success: "Event updated successfully!",
      error: "An unknown error occured.",
    });

    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit event</DialogTitle>
          <DialogDescription>
            Make any changes to the events parameters. Click either save or
            delete when done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleEditEventSubmit)}
            className="grid grid-cols-1 gap-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={event?.type}
                      {...field}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="funeral">Funeral</SelectItem>
                          <SelectItem value="wedding">Wedding</SelectItem>
                          <SelectItem value="akhand-path">
                            Akhand Path
                          </SelectItem>
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
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex">
              <Button variant="destructive" type="submit">
                Delete
              </Button>
              <Button type="submit" disabled={!form.formState.isDirty}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventDialog;
