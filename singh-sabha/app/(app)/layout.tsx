import AppNavBar from "@/components/navbars/app-navbar";
import { Footer } from "@/components/footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppNavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
