"use client";

import * as React from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ChevronsUpDown, CalendarX2 } from "lucide-react";

import EventSummary from "../event-summary";
import { staggerContainer, fadeInWithDelay } from "./hero-section";
import { cn } from "@/lib/utils";

import { EventWithType } from "@/db/schema";

interface UpcomingEventsSectionProps {
  upcomingEvents: EventWithType[];
}

export default function UpcomingEventsSection({
  upcomingEvents,
}: UpcomingEventsSectionProps) {
  const ref = React.useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (isInView) {
      controls.start("show");
    }
  }, [isInView, controls]);

  return (
    <section className="border-t py-16 bg-background" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.div variants={fadeInWithDelay(0.1)} className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Upcoming Events
            </h2>
            <p className="mt-2 text-muted-foreground">
              Join us for these upcoming events at Gurdwara Singh Sabha
            </p>
          </motion.div>

          <motion.div variants={fadeInWithDelay(0.3)}>
            {upcomingEvents.length > 0 ? (
              <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="max-w-2xl mx-auto space-y-4"
              >
                <div
                  className={cn(
                    "flex items-center space-x-4 px-4",
                    { "justify-center": upcomingEvents.length === 1 },
                    { "justify-between": upcomingEvents.length > 1 },
                  )}
                >
                  <h4 className="text-sm font-semibold">
                    {upcomingEvents.length} Upcoming Event
                    {upcomingEvents.length !== 1 ? "s" : ""}
                  </h4>
                  {upcomingEvents.length > 1 && (
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle events list</span>
                      </Button>
                    </CollapsibleTrigger>
                  )}
                </div>
                <div className="rounded-md border px-4 py-3 text-sm">
                  <EventSummary event={upcomingEvents[0]} />
                </div>
                <CollapsibleContent className="space-y-2">
                  {upcomingEvents.slice(1).map((event) => (
                    <div
                      key={event.id}
                      className="rounded-md border px-4 py-3 text-sm"
                    >
                      <EventSummary event={event} />
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Card className="max-w-md mx-auto bg-background rounded-xl border overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <CalendarX2 className="w-12 h-12 text-muted-foreground" />
                    <CardTitle className="text-2xl font-semibold tracking-tight">
                      No Upcoming Events
                    </CardTitle>
                    <p className="text-muted-foreground">
                      There are no scheduled events at the moment. Check back
                      soon for updates or follow us on social media for the
                      latest announcements.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
