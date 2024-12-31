"use client";

import * as React from "react";
import {
  motion,
  useAnimation,
  useInView,
  useSpring,
  useTransform,
} from "framer-motion";
import { staggerContainer, fadeInWithDelay } from "./hero-section";
import BookEventDialog from "../dialogs/book-event-dialog";

import { EventType } from "@/db/schema";

// Interaction hyperparameters
const sheenSize = 500;
const cardRotation = 15;
const cardScale = 1.07;

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
    <>
      <section className="border-t py-16 bg-background" ref={ref} id="services">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeInWithDelay(0.1)} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Our Services
              </h2>
              <p className="mt-2 text-muted-foreground">
                Explore the various services offered at Gurdwara Singh Sabha
              </p>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              {eventTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  variants={fadeInWithDelay(0.3 + index * 0.1)}
                  className="flex"
                >
                  <ServiceCard
                    type={type}
                    onBookService={() => handleBookService(type)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
      <BookEventDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        eventTypes={selectedService}
        selectedEventType={selectedService[0]}
      />
    </>
  );
}

function ServiceCard({
  type,
  onBookService,
}: {
  type: EventType;
  onBookService: () => void;
}) {
  const xPcnt = useSpring(0, { bounce: 0 });
  const yPcnt = useSpring(0, { bounce: 0 });
  const mouseX = useSpring(0, { bounce: 0 });
  const mouseY = useSpring(0, { bounce: 0 });
  const scale = useSpring(1, { bounce: 0 });

  const rotateX = useTransform(
    yPcnt,
    [-0.5, 0.5],
    [`-${cardRotation}deg`, `${cardRotation}deg`],
  );
  const rotateY = useTransform(
    xPcnt,
    [-0.5, 0.5],
    [`${cardRotation}deg`, `-${cardRotation}deg`],
  );

  const sheenX = useTransform(() => mouseX.get() - sheenSize / 2);
  const sheenY = useTransform(() => mouseY.get() - sheenSize / 2);

  const getMousePosition = (e: React.MouseEvent<Element, MouseEvent>) => {
    const { width, height, left, top } =
      e.currentTarget.getBoundingClientRect();

    const currentMouseX = e.clientX - left;
    const currentMouseY = e.clientY - top;

    return {
      currentMouseX,
      currentMouseY,
      containerWidth: width,
      containerHeight: height,
    };
  };

  const handleMouseMove: React.MouseEventHandler = (e) => {
    const { currentMouseX, currentMouseY, containerWidth, containerHeight } =
      getMousePosition(e);

    xPcnt.set(currentMouseX / containerWidth - 0.5);
    yPcnt.set(currentMouseY / containerHeight - 0.5);

    mouseX.set(currentMouseX);
    mouseY.set(currentMouseY);
  };

  const handleMouseEnter: React.MouseEventHandler = (e) => {
    const { currentMouseX, currentMouseY } = getMousePosition(e);

    mouseX.jump(currentMouseX);
    mouseY.jump(currentMouseY);
    scale.set(cardScale);
  };

  const handleMouseLeave: React.MouseEventHandler = () => {
    xPcnt.set(0);
    yPcnt.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onBookService}
      className="w-full group"
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
        scale,
      }}
    >
      <div className="relative bg-background rounded-xl border shadow-lg overflow-hidden min-h-[170px] cursor-pointer">
        <motion.div
          className="absolute z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-200 rounded-full blur-md"
          style={{
            height: sheenSize,
            width: sheenSize,
            background: "radial-gradient(white, #3984ff00 80%)",
            left: sheenX,
            top: sheenY,
          }}
        />
        <div className="p-4">
          <h3 className="text-2xl font-semibold tracking-tight mb-2">
            {type.displayName}
          </h3>
          <p className="text-muted-foreground md:text-lg">{type.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
