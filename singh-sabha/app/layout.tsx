import { Toaster } from "sonner";
import { ReactQueryClientProvider } from "@/providers/react-query-client-provider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <body className="antialiased">{children}</body>
        <Toaster richColors={true} />
      </html>
    </ReactQueryClientProvider>
  );
}
