"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { FlagTriangleLeft, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const links = [
  { href: "/calendar", label: "Calendar" },
  { href: "/hukamnama", label: "Hukamnama" },
  { href: "/about-us", label: "About Us" },
];

export default function AppNavBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isCurrentPath = (linkHref: string) => {
    const path = pathname.split("/")[1];
    const linkPath = linkHref.split("/")[1];
    return path === linkPath;
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  return (
    <header className="z-10 sticky top-0 flex h-16 items-center gap-4 px-4 md:px-6 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
      <nav className="hidden container mx-auto px-4 md:px-6 flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center text-lg font-semibold md:text-base"
          scroll={false}
        >
          <FlagTriangleLeft className="h-5 w-5 mr-1 fill-black" />
          <span>Gurdwara Singh Sabha</span>
        </Link>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`transition-colors hover:text-primary ${
              isCurrentPath(link.href)
                ? "text-primary"
                : "text-muted-foreground"
            }`}
            scroll={false}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <nav className="grid gap-6 text-lg font-medium p-6">
            <Link
              href="/"
              className="flex items-center text-lg font-semibold"
              onClick={closeDrawer}
            >
              <FlagTriangleLeft className="h-5 w-5 mr-1 fill-black" />
              <span>Gurdwara Singh Sabha</span>
            </Link>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-primary ${
                  isCurrentPath(link.href)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                scroll={false}
                onClick={closeDrawer}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </DrawerContent>
      </Drawer>
    </header>
  );
}
