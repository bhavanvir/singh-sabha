import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { StickyNote } from "lucide-react";

import type { EventWithType } from "@/db/schema";

interface EventDescriptionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventWithType | null;
}

export default function EventDescriptionPopup({
  isOpen,
  onClose,
  event,
}: EventDescriptionPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event?.occassion}</DialogTitle>
          <DialogDescription>
            Additional information for this upcoming event.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row items-start">
          <StickyNote className="h-4 w-4 mr-1 mt-1" />
          <p className="whitespace-pre-wrap">{event?.note}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
