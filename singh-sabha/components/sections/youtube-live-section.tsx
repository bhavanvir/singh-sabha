"use client";

import * as React from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { staggerContainer, fadeInWithDelay } from "./hero-section";
import Link from "next/link";

export function YoutubeLiveSection() {
  const ref = React.useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  React.useEffect(() => {
    if (isInView) {
      controls.start("show");
    }
  }, [isInView, controls]);

  return (
    <section className="border-t py-16 bg-background" ref={ref} id="youtube">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.div
            variants={fadeInWithDelay(0.1)}
            className="text-center space-y-2"
          >
            <h2 className="text-3xl font-bold tracking-tighter">Live Stream</h2>
            <p className="mx-auto text-muted-foreground">
              Join us virtually for our live services and events.
            </p>
          </motion.div>

          <motion.div variants={fadeInWithDelay(0.3)}>
            <Card className="mx-auto overflow-hidden bg-accent">
              <CardHeader>
                <CardTitle className="flex items-center justify-center">
                  <Link
                    href="https://www.youtube.com/@GurdwaraSinghSabhaVictoria"
                    className="flex items-center space-x-2 hover:text-muted-foreground hover:fill-muted-foreground transition-colors"
                  >
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="main-grid-item-icon h-6 w-6 "
                    >
                      <title>YouTube</title>
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    <span>Gurdwara Singh Sabha (Victoria) Live</span>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 aspect-video">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/tucLMCttWrA"
                  title="Gurdwara Singh Sabha (Victoria) is live!"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
