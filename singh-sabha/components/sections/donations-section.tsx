"use client";

import * as React from "react";
import Link from "next/link";
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
              We appreciate any contribution you can make.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInWithDelay(0.3)}
            className="max-w-md mx-auto"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-lg font-semibold">
                  Support Us with Your Donation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-center text-sm font-medium text-gray-700">
                    Donate via e-Transfer
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <Input
                      readOnly
                      value="singhsabhayyj@gmail.com"
                      className="font-mono flex-grow"
                      aria-label="e-Transfer email address"
                    />
                    <motion.div variants={fadeInWithDelay(0.5)}>
                      <Button
                        onClick={handleCopy}
                        className="h-10 w-10 relative"
                        aria-label="Copy email to clipboard"
                      >
                        <Clipboard
                          className={`h-5 w-5 transition-opacity duration-300 ${
                            copied ? "opacity-0" : "opacity-100"
                          }`}
                        />
                        <Check
                          className={`h-5 w-5 absolute transition-opacity duration-300 ${
                            copied ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      </Button>
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  variants={fadeInWithDelay(0.7)}
                  className="relative flex items-center"
                >
                  <div className="border-t w-full border-gray-300"></div>
                  <span className="px-3 text-sm text-gray-500">Or</span>
                  <div className="border-t w-full border-gray-300"></div>
                </motion.div>

                <motion.div
                  variants={fadeInWithDelay(0.9)}
                  className="text-center"
                >
                  <h3 className="text-sm font-medium text-gray-700">
                    Donate via Stripe
                  </h3>
                  <Button variant="outline" asChild className="mt-2">
                    <Link
                      href="https://donate.stripe.com/test_fZe4hh5DMgGhaAg3cc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                      aria-label="Donate via Stripe"
                    >
                      <svg
                        role="img"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 fill-[#635BFF]"
                      >
                        <title>Stripe</title>
                        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
                      </svg>
                      Donate
                    </Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
