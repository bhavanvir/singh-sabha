import React from "react";
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
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
import { Minus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import moment from "moment";
import type { SlotInfo } from "react-big-calendar";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title missing")
    .min(6, "Title too short")
    .max(64, "Title too long"),
  type: z.string().min(1, "Type missing"),
  note: z.string().max(128, "Note too long"),
});

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  slot: SlotInfo | null;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}

const CreateEventDialog: React.FC<CreateEventDialogProps> = ({
  isOpen,
  onClose,
  slot,
  onSubmit,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", type: "", note: "" },
  });

  const handleSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>
            Parameters based on your selection. Click submit when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 gap-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Add title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Label htmlFor="period">Time period</Label>
            <div>
              <div id="period" className="flex items-center space-x-2">
                <span className="rounded-md border px-3 py-2 text-sm">
                  {moment(slot?.start ?? new Date()).format(
                    "MMMM Do YYYY, h:mm a",
                  )}
                </span>
                <Minus className="w-4" />
                <span className="rounded-md border px-3 py-2 text-sm">
                  {moment(slot?.end ?? new Date()).format(
                    "MMMM Do YYYY, h:mm a",
                  )}
                </span>
              </div>
              {slot?.action === "select" && (
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
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      {...field}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select an event type" />
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
                    <Textarea placeholder="Add a special note" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
