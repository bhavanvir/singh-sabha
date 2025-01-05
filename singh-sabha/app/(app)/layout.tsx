import AppNavBar from "@/components/navbars/app-navbar";
import { Footer } from "@/components/footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AppNavBar />
      {children}
      <Footer />
    </div>
  );
}
