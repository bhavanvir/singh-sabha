import * as React from "react";
import { format } from "date-fns";
import {
  Mail,
  Phone,
  Clock,
  Bell,
  CalendarCheck2,
  CalendarX2,
  Check,
  User,
  X,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

import { EventColors } from "@/lib/types/event-colours";

import type { ConflictingEvent } from "../notifications";

interface ConflictingEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: ConflictingEvent;
  approveEvent: (event: ConflictingEvent) => void;
}

export default function ConflictingEventDialog({
  isOpen,
  onClose,
  selectedEvent,
  approveEvent,
}: ConflictingEventDialogProps) {
  const [understood, setUnderstood] = React.useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Event Approval</DialogTitle>
          <DialogDescription>
            This event conflicts with existing events. Please review and
            confirm.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[60vh]">
          {selectedEvent?.conflict.map((conflictEvent, index) => (
            <div key={index} className="mb-4 p-4 border rounded-md">
              <div className="space-x-2">
                <Badge
                  style={{
                    backgroundColor: conflictEvent.eventType?.isSpecial
                      ? EventColors.special
                      : EventColors.regular,
                  }}
                >
                  {conflictEvent.eventType?.isSpecial ? "Special" : "Regular"}
                </Badge>
                <Badge>{conflictEvent.eventType?.displayName}</Badge>
              </div>
              <h4 className="font-bold mt-2">{conflictEvent.title}</h4>
              <span className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {format(conflictEvent.start, "EEE, MMM d, h:mm a")} -{" "}
                {format(conflictEvent.end, "h:mm a")}
              </span>
            </div>
          ))}
        </ScrollArea>
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            id="understood"
            checked={understood}
            onCheckedChange={(checked) => setUnderstood(checked as boolean)}
          />
          <label htmlFor="understood" className="text-sm">
            I understand the conflicts and want to approve this event.
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => selectedEvent && approveEvent(selectedEvent)}
            disabled={!understood}
          >
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
