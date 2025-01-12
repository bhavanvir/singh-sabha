import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";

import { inter } from "./fonts";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Gurdwara Singh Sabha",
    template: "%s | Gurdwara Singh Sabha",
  },
  keywords: [
    "Gurdwara",
    "Victoria",
    "Singh Sabha",
    "Sikhi",
    "Canada",
    "British Columbia",
  ],
  authors: [{ name: "Bhavanvir Rai", url: "https://bhavanvir.ca" }],
  creator: "Bhavanvir Rai",
  description: "Serving the Sikh community with devotion and compassion.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ scrollBehavior: "smooth" }}>
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body className={`${inter.className}`}>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">{children}</main>
        </div>
        <Analytics />
        <Toaster richColors={true} />
      </body>
    </html>
  );
}
