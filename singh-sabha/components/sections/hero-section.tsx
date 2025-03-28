"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { notoSansGurmukhi } from "@/app/fonts";
import { FadeText } from "../animations/fade-text";

import { ChevronDown, HandPlatter, HandCoins } from "lucide-react";

export const staggerContainer = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export const fadeInWithDelay = (delay = 0) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      type: "spring",
      delay,
    },
  },
});

export const scaleInWithDelay = (delay = 0) => ({
  hidden: { scaleX: 0, opacity: 0 },
  show: {
    scaleX: 1,
    opacity: 1,
    transition: {
      type: "spring",
      delay,
      duration: 0.4,
    },
  },
});

export default function HeroSection() {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
    });
  };

  return (
    <section className="relative bg-[url('/assets/gurdwara-hero.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md filter" />
      <motion.div
        className="relative mx-auto min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-center items-center"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div
          className="w-full max-w-4xl mx-auto text-center space-y-8"
          variants={staggerContainer}
        >
          <motion.div className="relative" variants={fadeInWithDelay(0.1)}>
            <h2 className="text-2xl sm:text-3xl font-medium text-white/90 mb-2">
              <FadeText text="Gurdwara Singh Sabha of Victoria" />
            </h2>
            <motion.div
              className="h-1 w-20 bg-primary mx-auto rounded-full"
              variants={scaleInWithDelay(0.2)}
              style={{ originX: 0.5 }}
            />
          </motion.div>

          <motion.div
            variants={fadeInWithDelay(0.3)}
            className="leading-[2.51rem] md:leading-[4.92rem]"
          >
            <FadeText
              text="ਆਵਹੁ ਸਿਖ ਸਤਿਗੁਰੂ ਕੇ ਪਿਆਰਿਹੋ ਗਾਵਹੁ ਸਚੀ ਬਾਣੀ"
              className={cn(
                notoSansGurmukhi.className,
                "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white",
              )}
              direction="up"
            />
          </motion.div>

          <motion.div variants={fadeInWithDelay(0.5)}>
            <FadeText
              text="Come, O beloved Sikhs of the True Guru, and sing the True Word of His Bani"
              className="text-xl sm:text-2xl text-white/80"
            />
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInWithDelay(0.7)}>
              <Button size="lg" className="text-lg" asChild>
                <Link href="#services" scroll={true}>
                  <HandPlatter className="mr-2 h-5 w-5" />
                  Our Services
                </Link>
              </Button>
            </motion.div>
            <motion.div variants={fadeInWithDelay(0.9)}>
              <Button variant="secondary" size="lg" className="text-lg" asChild>
                <Link href="#donations" scroll={true}>
                  <HandCoins className="mr-2 h-5 w-5" />
                  Donate
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.button
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 hover:text-white transition-colors duration-300 focus:outline-none"
          aria-label="Scroll to content"
          variants={fadeInWithDelay(1.1)}
        >
          <ChevronDown className="w-8 h-8 animate-bounce" />
        </motion.button>
      </motion.div>
    </section>
  );
}
