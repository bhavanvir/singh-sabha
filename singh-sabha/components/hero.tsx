"use client";

import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notoSansGurmukhi } from "@/app/fonts";

import { ChevronDown, HandPlatter, HandCoins } from "lucide-react";

export default function Hero() {
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
        <div className="w-full max-w-3xl mx-auto grid grid-cols-flow gap-4">
          <span>
            <h1
              className={clsx(
                notoSansGurmukhi.className,
                "text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white",
              )}
            >
              ਆਵਹੁ ਸਿਖ ਸਤਿਗੁਰੂ ਕੇ ਪਿਆਰਿਹੋ ਗਾਵਹੁ ਸਚੀ ਬਾਣੀ
            </h1>
            <p className="text-xl sm:text-2xl text-white/80">
              Come, O beloved Sikhs of the True Guru, and sing the True Word of
              His Bani
            </p>
          </span>
          <div className="flex flex-wrap gap-4">
            <Button size="lg">
              <HandPlatter className="h-5 w-5" />
              Our Services
            </Button>
            <Button variant="outline" size="lg">
              <HandCoins />
              Donate
            </Button>
          </div>
        </div>
        <button
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 hover:text-white transition-colors duration-300 focus:outline-none"
          aria-label="Scroll to content"
        >
          <ChevronDown className="w-8 h-8 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
