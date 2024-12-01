import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Footer } from "@/components/footer";

import { inter } from "./fonts";

export const metadata: Metadata = {
  title: "Gurdwara Singh Sabha",
  description: "Serving the Sikh community with devotion and compassion.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
