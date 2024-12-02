"use client";

import * as React from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { staggerContainer, fadeInWithDelay } from "./hero-section";
import { EventType } from "@/db/schema";

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
    <section className="border-t py-16 bg-background" ref={ref} id="services">
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
            className="flex flex-wrap justify-center gap-4"
          >
            {eventTypes.map((type, index) => (
              <motion.div
                key={type.id}
                variants={fadeInWithDelay(0.3 + index * 0.1)}
                className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)]"
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>{type.displayName}</CardTitle>
                  </CardHeader>
                  <CardContent>{type.description}</CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
