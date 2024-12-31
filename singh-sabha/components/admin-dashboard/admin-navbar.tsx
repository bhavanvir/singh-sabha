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
import { logout } from "@/actions/logout-action";
import type { User } from "@/db/schema";

const PAGES = {
  CALENDAR: "Calendar",
  NOTIFICATIONS: "Notifications",
  ANALYTICS: "Analytics",
  SETTINGS: "Settings",
} as const;

type PageKey = keyof typeof PAGES;

interface AdminNavBarProps {
  user: User;
  activePage: PageKey;
  setActivePage: (page: PageKey) => void;
}

export function AdminNavBar({
  user,
  activePage,
  setActivePage,
}: AdminNavBarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

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
      scroll={false}
      onClick={() => {
        setActivePage(page);
        onClick?.();
      }}
    >
      {PAGES[page]}
    </Link>
  );

  return (
    <header className="z-10 sticky top-0 flex h-16 items-center gap-4 px-4 md:px-6 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center gap-4 justify-between">
          <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link
              href="/"
              className="flex items-center space-x-2 text-lg font-semibold md:text-base"
              scroll={false}
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
                    scroll={false}
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
                  src={`https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(user.email)}&round=50&backgroundType=solid`}
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
      </div>
    </header>
  );
}