"use client";

import * as React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Rss, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Announcement } from "@/db/schema";

export function ActiveAnnouncement({
  announcement,
}: {
  announcement: Announcement | null;
}) {
  const initialVisibility = () => {
    if (!announcement?.id) return false;
    const dismissedId = localStorage.getItem("dismissedAnnouncementId");
    return dismissedId !== announcement.id.toString();
  };

  const [isVisible, setIsVisible] = React.useState(initialVisibility);

  React.useEffect(() => {
    if (announcement?.id) {
      const dismissedId = localStorage.getItem("dismissedAnnouncementId");
      if (dismissedId === announcement.id.toString()) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    }
  }, [announcement?.id]);

  if (!announcement || !isVisible) {
    return null;
  }

  const handleVisibilityToggle = () => {
    if (announcement.id) {
      localStorage.setItem(
        "dismissedAnnouncementId",
        announcement.id.toString(),
      );
      setIsVisible(false);
    }
  };

  return (
    <Alert className="fixed top-4 left-4 right-4 flex flex-row justify-between p-4 z-50 w-[calc(100%-2rem)]">
      <Rss className="h-4 w-4 animate-pulse" />
      <div>
        <AlertTitle>{announcement.title}</AlertTitle>
        <AlertDescription>{announcement.message}</AlertDescription>
      </div>
      <div>
        <Button variant="ghost" size="icon" onClick={handleVisibilityToggle}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </Alert>
  );
}
