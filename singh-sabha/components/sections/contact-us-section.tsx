"use client";

import * as React from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";

import { staggerContainer, fadeInWithDelay } from "./hero-section";

export function ContactUsSection() {
  const ref = React.useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  React.useEffect(() => {
    if (isInView) {
      controls.start("show");
    }
  }, [isInView, controls]);

  return (
    <section className="border-t py-16 bg-background" ref={ref} id="contact">
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
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Contact Us
            </h2>
            <p className="mt-2 text-muted-foreground">
              We welcome your visit to our Gurdwara. If you have any questions
              or need assistance, please don&apos;t hesitate to reach out
            </p>
          </motion.div>

          <motion.div variants={fadeInWithDelay(0.3)}>
            <Card className="w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <motion.div
                  variants={fadeInWithDelay(0.5)}
                  className="flex items-start space-x-4"
                >
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      470 Cecelia Rd Victoria, BC V8T 4T5
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  variants={fadeInWithDelay(0.7)}
                  className="flex items-start space-x-4"
                >
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      +1 250 475-2280
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  variants={fadeInWithDelay(0.9)}
                  className="flex items-start space-x-4"
                >
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      singhsabhayyj@gmail.com
                    </p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
