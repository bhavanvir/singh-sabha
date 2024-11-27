import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Footer } from "@/components/footer";

import { inter } from "./fonts";

export const metadata: Metadata = {
  title: "Gurdwara Singh Sabha",
  description: "Serving the Sikh community with devotion and compassion.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
