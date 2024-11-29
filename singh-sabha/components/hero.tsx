"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { notoSansGurmukhi } from "@/app/fonts";

import { ChevronDown, HandPlatter, HandCoins } from "lucide-react";

export default function Hero() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative bg-[url('/gurdwara-hero.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md filter" />
      <div className="relative mx-auto min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-center items-center">
        <div className="w-full max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-2xl sm:text-3xl font-medium text-white/90 mb-2">
              Gurdwara Singh Sabha of Victoria
            </h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full mb-6" />
          </motion.div>

          <motion.h1
            className={cn(
              notoSansGurmukhi.className,
              "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4",
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            ਆਵਹੁ ਸਿਖ ਸਤਿਗੁਰੂ ਕੇ ਪਿਆਰਿਹੋ ਗਾਵਹੁ ਸਚੀ ਬਾਣੀ
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl text-white/80 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Come, O beloved Sikhs of the True Guru, and sing the True Word of
            His Bani
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button size="lg" className="text-lg">
              <HandPlatter className="mr-2 h-5 w-5" />
              Our Services
            </Button>
            <Button variant="secondary" size="lg" className="text-lg">
              <HandCoins className="mr-2 h-5 w-5" />
              Donate
            </Button>
          </motion.div>
        </div>

        <motion.button
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 hover:text-white transition-colors duration-300 focus:outline-none"
          aria-label="Scroll to content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <ChevronDown className="w-8 h-8 animate-bounce" />
        </motion.button>
      </div>
    </section>
  );
}
