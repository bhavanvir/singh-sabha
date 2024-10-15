"use client";

import Link from "next/link";
import { CircleUser, Menu, Package2, Bell } from "lucide-react";
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

const PAGES = {
  DASHBOARD: "dashboard",
  ANALYTICS: "analytics",
};

// Add a proper type for the user
export function Dashboard({ user }: any) {
  const [activePage, setActivePage] = React.useState(PAGES.DASHBOARD);

  const renderContent = () => {
    switch (activePage) {
      case PAGES.DASHBOARD:
        return <div>Welcome to the Dashboard!</div>;
      case PAGES.ANALYTICS:
        return <div>Here are you Analytics.</div>;
    }
  };
  const getLinkClass = (page: string) =>
    page === activePage
      ? "text-foreground"
      : "text-muted-foreground hover:text-foreground";

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
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
            className={`${getLinkClass(PAGES.DASHBOARD)}`}
            onClick={() => setActivePage(PAGES.DASHBOARD)}
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className={`${getLinkClass(PAGES.ANALYTICS)}`}
            onClick={() => setActivePage(PAGES.ANALYTICS)}
          >
            Analytics
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
                className={`${getLinkClass(PAGES.DASHBOARD)}`}
                onClick={() => setActivePage(PAGES.DASHBOARD)}
              >
                Dashboard
              </Link>
              <Link
                href="#"
                className={`${getLinkClass(PAGES.ANALYTICS)}`}
                onClick={() => setActivePage(PAGES.ANALYTICS)}
              >
                Analytics
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <Bell />
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
              <DropdownMenuItem onClick={async () => await logout()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
}
