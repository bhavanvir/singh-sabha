import Link from "next/link";
import { Copyright, FlagTriangleLeft, Phone, Mail, MapPin } from "lucide-react";

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
                <Phone className="h-5 w-5 mr-1" /> + 1 250 589-2751
              </span>
              <span className="flex items-center">
                <Mail className="h-5 w-5 mr-1" /> singhsabhayyj@gmail.com
              </span>
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-2">
              <Link href="https://www.youtube.com/@GurdwaraSinghSabhaVictoria">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="main-grid-item-icon h-6 w-6"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span className="sr-only">YouTube</span>
              </Link>
              <Link href="https://www.facebook.com/SinghSabhaYYJ/">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="main-grid-item-icon h-6 w-6"
                >
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                </svg>
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
              href="https://github.com/bhavanvir/singh-sabha"
              className="hover:text-primary transition-colors flex items-center"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="main-grid-item-icon h-5 w-5 mr-1"
              >
                <title>GitHub</title>
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              bhavanvir
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
