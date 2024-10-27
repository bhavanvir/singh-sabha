"use client";

import Link from "next/link";
import { CircleUser, Menu, Package2, LogOut } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { logout } from "@/components/actions/logout-action";
import { toast } from "sonner";
import BookingCalendar from "@/components/booking-calendar";
import Notifications from "@/components/notifications";
import Settings from "@/components/settings";

import type { User } from "lucia";
import type { Event } from "@/lib/types/event";
import type { ConflictingEvent } from "@/components/notifications";

const PAGES = {
  CALENDAR: "calendar",
  NOTIFICATIONS: "notifications",
  SETTINGS: "settings",
};

interface DashboardProps {
  user: User;
  events: Event[];
  notifications: ConflictingEvent[];
}

export function Dashboard({ user, events, notifications }: DashboardProps) {
  const [activePage, setActivePage] = React.useState(PAGES.CALENDAR);

  const renderContent = () => {
    switch (activePage) {
      case PAGES.CALENDAR:
        return <BookingCalendar user={user} events={events} />;
      case PAGES.NOTIFICATIONS:
        return <Notifications notifications={notifications} />;
      case PAGES.SETTINGS:
        return <Settings user={user} />;
    }
  };

  const getLinkClass = (page: string) =>
    page === activePage
      ? "text-foreground"
      : "text-muted-foreground hover:text-foreground";

  const handleLogOut = () => {
    toast.promise(logout, {
      loading: "Logging out...",
      success: "Logged out successfully!",
      error: "An unknown error occured.",
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="z-10 sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Gurdwara Singh Sabha</span>
          </Link>
          <Link
            href="#"
            className={`${getLinkClass(PAGES.CALENDAR)}`}
            onClick={() => setActivePage(PAGES.CALENDAR)}
          >
            Calendar
          </Link>
          <Link
            href="#"
            className={`${getLinkClass(PAGES.NOTIFICATIONS)}`}
            onClick={() => setActivePage(PAGES.NOTIFICATIONS)}
          >
            Notifications
          </Link>
          <Link
            href="#"
            className={`${getLinkClass(PAGES.SETTINGS)}`}
            onClick={() => setActivePage(PAGES.SETTINGS)}
          >
            Settings
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Gurdwara Singh Sabha</span>
              </Link>
              <Link
                href="#"
                className={`${getLinkClass(PAGES.CALENDAR)}`}
                onClick={() => setActivePage(PAGES.CALENDAR)}
              >
                Calendar
              </Link>
              <Link
                href="#"
                className={`${getLinkClass(PAGES.NOTIFICATIONS)}`}
                onClick={() => setActivePage(PAGES.NOTIFICATIONS)}
              >
                Notifications
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.fullName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogOut}>
                <LogOut />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="p-4">{renderContent()}</main>
    </div>
  );
}
