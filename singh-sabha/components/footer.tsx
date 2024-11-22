import Link from "next/link";
import {
  Copyright,
  FlagTriangleLeft,
  Github,
  Youtube,
  Facebook,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col">
            <Link
              href="/"
              className="flex items-center text-lg font-semibold mb-4"
            >
              <FlagTriangleLeft className="h-5 w-5 mr-1 fill-black" />
              Gurdwara Singh Sabha
            </Link>
            <p className="text-sm text-muted-foreground">
              Serving the Sikh community with devotion and compassion.
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/calendar"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Calendar
              </Link>
              <Link
                href="/hukamnama"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Hukamnama
              </Link>
            </nav>
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-sm text-muted-foreground space-y-2 mb-2">
              <span className="flex items-center">
                <MapPin className="h-5 w-5 mr-1" />
                470 Cecelia Rd Victoria, BC V8T 4T5
              </span>
              <span className="flex items-center">
                <Phone className="h-5 w-5 mr-1" /> (250) 589-2751
              </span>
              <span className="flex items-center">
                <Mail className="h-5 w-5 mr-1" /> singhsabhayyj@gmail.com
              </span>
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-2">
              <Link
                href="https://www.youtube.com/@GurdwaraSinghSabhaVictoria"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Youtube className="h-6 w-6" />
                <span className="sr-only">YouTube</span>
              </Link>
              <Link
                href="https://www.facebook.com/SinghSabhaYYJ/"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            <span className="flex items-center">
              <Copyright className="h-5 w-5 mr-1" /> {currentYear} Gurdwara
              Singh Sabha. All rights reserved.
            </span>
          </p>
          <div className="flex items-center mt-4 sm:mt-0 text-sm text-muted-foreground">
            <Link
              href="https://github.com/bhavanvir"
              className="hover:text-primary transition-colors flex items-center"
            >
              <Github className="h-5 w-5 mr-1" />
              bhavanvir
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
