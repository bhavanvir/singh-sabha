import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { EventWithType } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";

import { X, Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { DeleteMultipleEvents } from "@/lib/api/events/mutations";
import EventSummary from "@/components/event-summary";

interface DeleteExpiredEventsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  expiredEvents: EventWithType[];
}

export default function DeleteExpiredEventsDialog({
  isOpen,
  onClose,
  expiredEvents,
}: DeleteExpiredEventsDialogProps) {
  const [understood, setUnderstood] = React.useState<boolean>(false);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleDeleteExpiredEvents = async () => {
    const ids = expiredEvents.map((event) => event.id);

    toast.promise(DeleteMultipleEvents({ ids }), {
      loading: `Deleting ${expiredEvents.length} expired events...`,
      success: `Successfully deleted ${expiredEvents.length} expird events!`,
      error: "Failed to deleted expired events",
    });
  };

  const handleClose = () => {
    setUnderstood(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Expired Events</DialogTitle>
          <DialogDescription>
            Review the expired events and confirm if you want to delete them.
          </DialogDescription>
        </DialogHeader>

        <Collapsible
          open={isExpanded}
          onOpenChange={setIsExpanded}
          className="w-full space-y-4"
        >
          <div
            className={cn(
              "flex items-center space-x-4 px-4",
              { "justify-center": expiredEvents.length === 1 },
              { "justify-between": expiredEvents.length > 1 },
            )}
          >
            <h4 className="text-sm font-semibold">
              {expiredEvents.length} Expired Event
              {expiredEvents.length !== 1 ? "s" : ""}
            </h4>
            {expiredEvents.length > 1 && (
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle events list</span>
                </Button>
              </CollapsibleTrigger>
            )}
          </div>
          <div className="rounded-md border px-4 py-3 text-sm">
            <EventSummary event={expiredEvents[0]} />
          </div>
          <CollapsibleContent className="space-y-2">
            {expiredEvents.slice(1).map((event) => (
              <div
                key={event.id}
                className="rounded-md border px-4 py-3 text-sm"
              >
                <EventSummary event={event} />
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            id="understood"
            checked={understood}
            onCheckedChange={(checked) => setUnderstood(checked as boolean)}
          />
          <label
            htmlFor="understood"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I understand deleting these events is undoable.
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            <X />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!understood}
            onClick={handleDeleteExpiredEvents}
          >
            <Check />
            Delete Expired Events
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
