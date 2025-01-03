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
  CarouselPrevious,
  CarouselNext,
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
    <section
      className="border-t py-8 sm:py-12 md:py-16 bg-background"
      ref={ref}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
          className="space-y-6 sm:space-y-8"
        >
          <motion.div variants={fadeInWithDelay(0.1)} className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Upcoming Events
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Join us for these upcoming events this week
            </p>
          </motion.div>

          <motion.div variants={fadeInWithDelay(0.3)} className="w-full">
            {upcomingEvents.length > 0 ? (
              <div className="relative">
                <Carousel
                  className="w-full"
                  plugins={[plugin.current]}
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {upcomingEvents.map((event) => (
                      <CarouselItem
                        key={event.id}
                        className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 min-w-64"
                      >
                        <Card className="h-full">
                          <CardHeader className="space-y-2 p-4 sm:p-6">
                            <CardTitle className="text-lg sm:text-xl line-clamp-2">
                              {event.occassion}
                            </CardTitle>
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                className="text-xs sm:text-sm"
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
                              <Badge className="text-xs sm:text-sm">
                                {event.eventType?.displayName}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 sm:p-6 space-y-2">
                            <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                              <Calendar className="mr-1 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                              <span className="truncate">
                                {format(event.start, "MMMM d, yyyy")}
                                {format(event.start, "MMMM d, yyyy") !==
                                  format(event.end, "MMMM d, yyyy") &&
                                  ` - ${format(event.end, "MMMM d, yyyy")}`}
                              </span>
                            </div>
                            <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                              <span>
                                {format(new Date(event.start), "h:mm a")} -{" "}
                                {format(new Date(event.end), "h:mm a")}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="hidden sm:block">
                    <CarouselPrevious className="absolute -left-12 top-1/2" />
                    <CarouselNext className="absolute -right-12 top-1/2" />
                  </div>
                </Carousel>
              </div>
            ) : (
              <motion.div
                variants={fadeInWithDelay(0.3)}
                className="flex justify-center px-4"
              >
                <Card className="w-full max-w-md bg-background rounded-xl border overflow-hidden">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                      <CalendarX2 className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground" />
                      <CardTitle className="text-xl sm:text-2xl font-semibold tracking-tight">
                        No Upcoming Events
                      </CardTitle>
                      <p className="text-sm sm:text-base text-muted-foreground">
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
