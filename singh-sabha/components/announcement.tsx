import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Rss } from "lucide-react";
import { GetActiveAnnouncement } from "@/lib/api/events/queries";

export async function ActiveAnnouncement() {
  const [announcement] = await GetActiveAnnouncement();

  return (
    <Alert>
      <Rss className="h-4 w-4 animate-pulse" />
      <AlertTitle>{announcement.title}</AlertTitle>
      <AlertDescription>{announcement.message}</AlertDescription>
    </Alert>
  );
}
