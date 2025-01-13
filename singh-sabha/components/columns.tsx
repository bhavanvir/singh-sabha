"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { toast } from "sonner";

import { ArrowUpDown, Edit, Trash } from "lucide-react";

import { DeleteEventType } from "@/lib/api/event-types/mutations";
import { DeleteEvent } from "@/lib/api/events/mutations";
import { RemoveEmail } from "@/lib/api/mailing-list/mutations";
import { getDurationFromNow } from "@/lib/utils";

import type {
  Announcement,
  EventType,
  EventWithType,
  MailingList,
  User,
} from "@/db/schema";

export const mailingListColumns: ColumnDef<MailingList>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("email")}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const email = row.original;

      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              toast.promise(RemoveEmail({ id: row.original.id }), {
                loading: "Removing email from mailing list...",
                success: `Removed ${row.original.email} from mailing list.`,
                error: "Failed to remove email from mailing list.",
              });
            }}
            aria-label={`Remove ${email.email} from mailing list`}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

export const eventTypeColumns = (
  onEdit: (eventType: EventType) => void,
): ColumnDef<EventType>[] => [
  {
    accessorKey: "displayName",
    header: "Display Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "isRequestable",
    header: "Requestable",
    cell: ({ row }) => (row.original.isRequestable ? "Yes" : "No"),
  },
  {
    accessorKey: "isSpecial",
    header: "Special Event",
    cell: ({ row }) => (row.original.isSpecial ? "Yes" : "No"),
  },
  {
    accessorKey: "deposit",
    header: "Deposit",
    cell: ({ row }) => <span>${row.original.deposit.toFixed(2)}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const eventType = row.original;

      return (
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(eventType)}
            aria-label={`Edit ${eventType.displayName}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              toast.promise(DeleteEventType({ id: eventType.id! }), {
                loading: "Deleting event type...",
                success: "Deleted event type successfully!",
                error: "Failed to delete event type",
              });
            }}
            aria-label={`Delete ${eventType.displayName}`}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

export const announcementColumns: ColumnDef<Announcement>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => format(row.getValue("createdAt"), "MMMM d, yyyy"),
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "message",
    header: "Message",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (row.original.isActive ? "Active" : "Inactive"),
  },
];

export const eventColumns = (
  isExpired: boolean,
): ColumnDef<EventWithType>[] => [
  {
    accessorKey: "eventType",
    header: "Event Type",
    cell: ({ row }) => row.original.eventType?.displayName,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const durationFromNow = getDurationFromNow(row.original.start);
      return isExpired ? (
        <div>
          Expired {durationFromNow} day{durationFromNow > 1 ? "s" : ""} ago
        </div>
      ) : (
        <div>
          In {durationFromNow} day{durationFromNow > 1 ? "s" : ""}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const durationA = getDurationFromNow(rowA.original.start);
      const durationB = getDurationFromNow(rowB.original.start);

      if (durationA === durationB) return 0;
      return durationA > durationB ? 1 : -1;
    },
  },
  {
    accessorKey: "occassion",
    header: "Occasion",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              toast.promise(DeleteEvent({ id: event.id }), {
                loading: "Deleting event...",
                success: "Deleted event successfully!",
                error: "Failed to delete event.",
              });
            }}
            aria-label={`Delete ${event.eventType?.displayName}`}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

export const userColumns = (
  onEdit: (user: Omit<User, "passwordHash">) => void,
  onDelete: (id: string) => void,
): ColumnDef<Omit<User, "passwordHash">>[] => [
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "isAdmin",
    header: "Role",
    cell: ({ row }) => (row.original.isAdmin ? "Admin" : "Mod"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(user)}
            aria-label={`Edit ${user.fullName}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(user.id)}
            aria-label={`Delete ${user.fullName}`}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
