"use client";

import Link from "next/link";
import { CircleUser, Menu, LogOut, FlagTriangleLeft } from "lucide-react";
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

import type { ConflictingEvent } from "@/components/notifications";
import type {
  User,
  Event,
  MailingList,
  EventType,
  Announcement,
} from "@/db/schema";

const PAGES = {
  CALENDAR: "Calendar",
  NOTIFICATIONS: "Notifications",
  SETTINGS: "Settings",
} as const;

type PageKey = keyof typeof PAGES;

interface DashboardProps {
  user: User;
  users: Omit<User, "passwordHash">[];
  events: Event[];
  notifications: ConflictingEvent[];
  mailingList: MailingList[];
  eventTypes: EventType[];
  announcements: Announcement[];
}

export function Dashboard({
  user,
  users,
  events,
  notifications,
  mailingList,
  eventTypes,
  announcements,
}: DashboardProps) {
  const [activePage, setActivePage] = React.useState<PageKey>("CALENDAR");

  const pageComponents = {
    CALENDAR: (
      <BookingCalendar user={user} events={events} eventTypes={eventTypes} />
    ),
    NOTIFICATIONS: <Notifications notifications={notifications} />,
    SETTINGS: (
      <Settings
        user={user}
        users={users}
        mailingList={mailingList}
        eventTypes={eventTypes}
        announcements={announcements}
      />
    ),
  };

  const handleLogOut = () => {
    toast.promise(logout, {
      loading: "Logging out...",
      success: "Logged out successfully!",
      error: "Failed to log out.",
    });
  };

  const NavLink = ({ page }: { page: PageKey }) => (
    <Link
      href="#"
      className={`transition-colors hover:text-foreground ${
        activePage === page ? "text-foreground" : "text-muted-foreground"
      }`}
      onClick={() => setActivePage(page)}
    >
      {PAGES[page]}
    </Link>
  );

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="z-10 sticky top-0 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center space-x-2 text-lg font-semibold md:text-base"
          >
            <span className="whitespace-nowrap flex items-center">
              <FlagTriangleLeft className="h-5 w-5 mr-1 fill-black" />
              Gurdwara Singh Sabha
            </span>
          </Link>
          <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
            {Object.keys(PAGES).map((page) => (
              <NavLink key={page} page={page as PageKey} />
            ))}
          </div>
        </nav>

        <div className="flex w-full items-center justify-between md:justify-end space-x-4">
          <div className="flex items-center">
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
                <nav className="grid gap-6 text-lg font-medium mt-6">
                  <Link
                    href="/"
                    className="flex items-center space-x-2 text-lg font-semibold"
                  >
                    <FlagTriangleLeft className="h-5 w-5 mr-1 fill-black" />
                    Gurdwara Singh Sabha
                  </Link>
                  {Object.keys(PAGES).map((page) => (
                    <NavLink key={page} page={page as PageKey} />
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

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
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 p-4">{pageComponents[activePage]}</main>
    </div>
  );
}
