"use client";

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Rss, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { Announcement } from "@/db/schema";

export function ActiveAnnouncement({
  announcement,
}: {
  announcement: Announcement | null;
}) {
  const [isVisible, setIsVisible] = useState(true);

  if (!announcement || !isVisible) {
    return null;
  }

  return (
    <Alert className="flex flex-row justify-between">
      <Rss className="h-4 w-4 animate-pulse" />
      <div>
        <AlertTitle>{announcement.title}</AlertTitle>
        <AlertDescription>{announcement.message}</AlertDescription>
      </div>
      <div>
        <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </Alert>
  );
}
