"use client";

import * as React from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { format } from "date-fns";
import { Calendar, Clock, CalendarX2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import { staggerContainer, fadeInWithDelay } from "./hero-section";
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

  const plugin = React.useRef(Autoplay({ stopOnInteraction: true }));

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
              <Carousel
                className="w-full justify-center"
                plugins={[plugin.current]}
              >
                <CarouselContent>
                  {upcomingEvents.map((event) => (
                    <CarouselItem
                      key={event.id}
                      className="md:basis-1/2 lg:basis-1/3"
                    >
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle className="mt-2">
                            {event.occassion}
                          </CardTitle>
                          <div className="space-x-2 flex items-center">
                            <Badge
                              style={{
                                backgroundColor: event.eventType?.isSpecial
                                  ? EventColors.special
                                  : EventColors.regular,
                              }}
                            >
                              {event.eventType?.isSpecial
                                ? "Special"
                                : "Regular"}
                            </Badge>
                            <Badge>{event.eventType?.displayName}</Badge>
                          </div>
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
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            ) : (
              <motion.div
                variants={fadeInWithDelay(0.3)}
                className="flex justify-center"
              >
                <Card className="w-full max-w-md bg-background rounded-xl border overflow-hidden">
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
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
