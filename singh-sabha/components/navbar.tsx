import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, FlagTriangleLeft } from "lucide-react";

interface NavBarProps {
  currentLink: string;
}

export default function NavBar({ currentLink }: NavBarProps) {
  const links = [
    { href: "/calendar", label: "Calendar" },
    { href: "/hukamnama", label: "Hukamnama" },
  ];

  return (
    <header className="z-10 sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center text-lg font-semibold md:text-base"
        >
          <FlagTriangleLeft className="h-5 w-5 mr-1 fill-black" />
          Gurdwara Singh Sabha
        </Link>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`transition-colors hover:text-primary ${
              currentLink.toLowerCase() === link.label.toLowerCase()
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="/" className="flex items-center text-lg font-semibold">
              <FlagTriangleLeft className="h-5 w-5 mr-1 fill-black" />
              Gurdwara Singh Sabha
            </Link>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-primary ${
                  currentLink.toLowerCase() === link.label.toLowerCase()
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
