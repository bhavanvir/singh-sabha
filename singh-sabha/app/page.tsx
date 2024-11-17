import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Suspense } from "react";
import { ActiveAnnouncement } from "@/components/announcement";
import NavBar from "@/components/navbar";
import { Loader2 } from "lucide-react";

export default function Home() {
  return (
    <>
      <NavBar currentLink="" />
      <main className="p-4">
        <Suspense
          fallback={
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertTitle>Loading announcement...</AlertTitle>
            </Alert>
          }
        >
          <ActiveAnnouncement />
        </Suspense>
      </main>
    </>
  );
}
