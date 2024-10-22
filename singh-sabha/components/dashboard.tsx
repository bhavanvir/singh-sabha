"use client";

import Link from "next/link";
import { CircleUser, Menu, Package2 } from "lucide-react";
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

const PAGES = {
  BOOKINGS: "bookings",
  NOTIFICATIONS: "notifications",
  SETTINGS: "settings",
};

// TODO: Update the types
interface DashboardProps {
  user: any;
  events: any;
}

export function Dashboard({ user, events }: DashboardProps) {
  const [activePage, setActivePage] = React.useState(PAGES.BOOKINGS);

  const renderContent = () => {
    switch (activePage) {
      case PAGES.BOOKINGS:
        return <BookingCalendar user={user} events={events} />;
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
            className={`${getLinkClass(PAGES.BOOKINGS)}`}
            onClick={() => setActivePage(PAGES.BOOKINGS)}
          >
            Bookings
          </Link>
          <Link
            href="#"
            className={`${getLinkClass(PAGES.NOTIFICATIONS)}`}
            onClick={() => setActivePage(PAGES.NOTIFICATIONS)}
          >
            Notifications
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
                className={`${getLinkClass(PAGES.BOOKINGS)}`}
                onClick={() => setActivePage(PAGES.BOOKINGS)}
              >
                Bookings
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
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="p-4">{renderContent()}</main>
    </div>
  );
}
