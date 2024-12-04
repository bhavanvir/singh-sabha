"use client";

import Link from "next/link";
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
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

import { Menu, LogOut, FlagTriangleLeft } from "lucide-react";

import { logout } from "@/components/actions/logout-action";
import BookingCalendar from "@/components/booking-calendar";
import Notifications from "@/components/notifications";
import Settings from "@/components/settings";
import AnalyticsDashboard from "@/components/analytics-dashboard";

import type { ConflictingEvent } from "@/components/notifications";
import type {
  User,
  Event,
  MailingList,
  EventType,
  Announcement,
} from "@/db/schema";
import { Analytics } from "@/lib/types/analytics";

const PAGES = {
  CALENDAR: "Calendar",
  NOTIFICATIONS: "Notifications",
  SETTINGS: "Settings",
  ANALYTICS: "Analytics",
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
  analytics: Analytics;
}

export function Dashboard({
  user,
  users,
  events,
  notifications,
  mailingList,
  eventTypes,
  announcements,
  analytics,
}: DashboardProps) {
  const [activePage, setActivePage] = React.useState<PageKey>("CALENDAR");
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

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
    ANALYTICS: <AnalyticsDashboard analytics={analytics} />,
  };

  const handleLogOut = () => {
    toast.promise(logout, {
      loading: "Logging out...",
      success: "Logged out successfully!",
      error: "Failed to log out.",
    });
  };

  const NavLink = ({
    page,
    onClick,
  }: {
    page: PageKey;
    onClick?: () => void;
  }) => (
    <Link
      href="#"
      className={`transition-colors hover:text-foreground ${
        activePage === page ? "text-foreground" : "text-muted-foreground"
      }`}
      onClick={() => {
        setActivePage(page);
        onClick?.();
      }}
    >
      {PAGES[page]}
    </Link>
  );

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="z-10 sticky top-0 flex h-16 items-center gap-4 px-4 md:px-6 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
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
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <nav className="grid gap-6 text-lg font-medium p-6">
                  <Link
                    href="/"
                    className="flex items-center space-x-2 text-lg font-semibold"
                  >
                    <FlagTriangleLeft className="h-5 w-5 mr-1 fill-black" />
                    Gurdwara Singh Sabha
                  </Link>
                  {Object.keys(PAGES).map((page) => (
                    <NavLink
                      key={page}
                      page={page as PageKey}
                      onClick={() => setIsDrawerOpen(false)}
                    />
                  ))}
                </nav>
              </DrawerContent>
            </Drawer>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(user.email)}&round=50&backgroundType=solid`}
                />
                <AvatarFallback>{user.fullName[0]}</AvatarFallback>
              </Avatar>
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
