"use client";

import * as React from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import {
  staggerContainer,
  fadeInWithDelay,
  scaleInWithDelay,
} from "./hero-section";
import { EventWithType } from "@/db/schema";
import { EventColors } from "@/lib/types/event-colours";

interface UpcomingEventsSectionProps {
  upcomingEvents: EventWithType[];
}

export default function UpcomingEventsSection({
  upcomingEvents,
}: UpcomingEventsSectionProps) {
  const ref = React.useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  React.useEffect(() => {
    if (isInView) {
      controls.start("show");
    }
  }, [isInView, controls]);

  return (
    <section className="py-16 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
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

          <motion.div>
            <ScrollArea className="w-full whitespace-nowrap">
              <motion.div
                className="flex w-max space-x-4"
                variants={staggerContainer}
              >
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    variants={fadeInWithDelay(0.3 + index * 0.2)}
                  >
                    <Card className="w-96 flex-shrink-0">
                      <CardHeader>
                        <div className="space-x-2 flex items-center">
                          <Badge
                            style={{
                              backgroundColor: event.eventType?.isSpecial
                                ? EventColors.special
                                : EventColors.regular,
                            }}
                          >
                            {event.eventType?.isSpecial ? "Special" : "Regular"}
                          </Badge>
                          <Badge>{event.eventType?.displayName}</Badge>
                        </div>
                        <CardTitle className="mt-2">{event.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          <span className="text-md">
                            {format(event.start, "MMMM d, yyyy")}
                            {format(event.start, "MMMM d, yyyy") !==
                              format(event.end, "MMMM d, yyyy") &&
                              ` - ${format(event.end, "MMMM d, yyyy")}`}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <Clock className="mr-1 h-4 w-4" />
                          {format(new Date(event.start), "h:mm a")} -{" "}
                          {format(new Date(event.end), "h:mm a")}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
