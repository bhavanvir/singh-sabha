"use client";
import * as React from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clipboard } from "lucide-react";
import { staggerContainer, fadeInWithDelay } from "./hero-section";
import { Input } from "../ui/input";

export function DonationsSection() {
  const ref = React.useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (isInView) {
      controls.start("show");
    }
  }, [isInView, controls]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText("singhsabhayyj@gmail.com")
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  return (
    <section className="border-t py-16 bg-background" ref={ref} id="donations">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.div
            variants={fadeInWithDelay(0.1)}
            className="text-center space-y-4"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Support Our Mission
            </h2>
            <p className="mt-2 text-muted-foreground">
              Your generous donations help us maintain and improve our services.
              We appreciate any contribution you can make via e-Transfer.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInWithDelay(0.3)}
            className="max-w-md mx-auto"
          >
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-center">
                  Donate via e-Transfer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value="singhsabhayyj@gmail.com"
                    className="font-mono flex-grow"
                  />

                  <motion.div variants={fadeInWithDelay(0.5)}>
                    <Button onClick={handleCopy} className="h-10 w-10">
                      <Clipboard
                        className={`h-4 w-4 transition-opacity duration-300 ${copied ? "opacity-0" : "opacity-100"}`}
                      />
                      <Check
                        className={`h-4 w-4 absolute transition-opacity duration-300 ${copied ? "opacity-100" : "opacity-0"}`}
                      />
                      <span className="sr-only">Copy to clipboard</span>
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
