"use client";

import * as React from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { staggerContainer, fadeInWithDelay } from "./hero-section";
import { EventType } from "@/db/schema";
import { EventColors } from "@/lib/types/event-colours";

interface ServicesSectionProps {
  eventTypes: EventType[];
}

export default function ServicesSection({ eventTypes }: ServicesSectionProps) {
  const ref = React.useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  React.useEffect(() => {
    if (isInView) {
      controls.start("show");
    }
  }, [isInView, controls]);

  return (
    <section className="border-t py-16 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.div variants={fadeInWithDelay(0.1)} className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Our Services</h2>
            <p className="mt-2 text-muted-foreground">
              Explore the various services offered at Gurdwara Singh Sabha
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {eventTypes.map((eventType, index) => (
              <motion.div
                key={eventType.id}
                variants={fadeInWithDelay(0.3 + index * 0.1)}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>{eventType.displayName}</CardTitle>
                    <CardDescription>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          style={{
                            backgroundColor: eventType.isSpecial
                              ? EventColors.special
                              : EventColors.regular,
                          }}
                        >
                          {eventType.isSpecial ? "Special" : "Regular"}
                        </Badge>
                        {eventType.isRequestable && <Badge>Requestable</Badge>}
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
