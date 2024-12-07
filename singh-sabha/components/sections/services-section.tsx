"use client";

import * as React from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { staggerContainer, fadeInWithDelay } from "./hero-section";
import { EventType } from "@/db/schema";
import { RainbowBorder } from "../animations/rainbow-border";
import BookEventDialog from "../dialogs/book-event-dialog";

interface ServicesSectionProps {
  eventTypes: EventType[];
}

export default function ServicesSection({ eventTypes }: ServicesSectionProps) {
  const ref = React.useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedService, setSelectedService] = React.useState<EventType[]>([]);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (isInView) {
      controls.start("show");
    }
  }, [isInView, controls]);

  const handleBookService = (service: EventType) => {
    setSelectedService([service]);
    setIsOpen(true);
  };

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
                <RainbowBorder>
                  <Card
                    className="relative bg-background cursor-pointer"
                    onClick={() => handleBookService(type)}
                  >
                    <CardHeader>
                      <CardTitle>{type.displayName}</CardTitle>
                    </CardHeader>
                    <CardContent>{type.description}</CardContent>
                  </Card>
                </RainbowBorder>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <BookEventDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        eventTypes={selectedService}
      />
    </section>
  );
}
