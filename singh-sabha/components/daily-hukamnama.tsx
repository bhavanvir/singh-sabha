"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import * as React from "react";

import { Book, Languages, Music2, Pen } from "lucide-react";

import { notoSansGurmukhi } from "@/app/fonts";
import { cn } from "@/lib/utils";

import type { HukamnamaRoot } from "@/lib/types/hukamnama";

export default function DailyHukamnama() {
  const [hukamnama, setHukamnama] = React.useState<HukamnamaRoot | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [transLang, setTransLang] = React.useState<"eng" | "span">("eng");

  React.useEffect(() => {
    const fetchHukamnama = async () => {
      try {
        const response = await fetch("/api/hukamnama");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setHukamnama(data);
      } catch (_) {
        setError("An error occurred while fetching the Hukamnama");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHukamnama();
  }, []);

  const toggleLanguage = () => {
    setTransLang(transLang === "eng" ? "span" : "eng");
  };

  return (
    <div className="mx-auto container py-4 px-4 md:px-6">
      {isLoading ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-8 w-24" />
          </div>

          <div className="flex gap-4 mb-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
          </div>

          <Skeleton className="h-[calc(100vh-11rem)] w-full" />
        </>
      ) : hukamnama ? (
        <>
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <h1 className="text-xl sm:text-3xl font-bold">
                Today&apos;s Hukamnama
              </h1>
              <div className="flex space-x-2">
                <Badge>
                  {hukamnama.date.gregorian.month}{" "}
                  {hukamnama.date.gregorian.date}
                  {", "}
                  {hukamnama.date.gregorian.year}
                </Badge>
                <Badge>
                  {hukamnama.date.nanakshahi.punjabi.month}{" "}
                  {hukamnama.date.nanakshahi.punjabi.date}
                  {", "}
                  {hukamnama.date.nanakshahi.punjabi.year}
                </Badge>
              </div>
            </div>
            <Button onClick={toggleLanguage} variant="outline" size="sm">
              <Languages className="h-4 w-4" />
              {transLang === "eng" ? "Spanish" : "English"}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center text-muted-foreground text-sm md:text-md mt-2 sm:mt-0">
            <span className="flex items-center mb-1 sm:mb-0">
              <Book className="h-4 w-4 mr-1" />
              {hukamnama.hukamnamainfo.source.english}
            </span>

            <Separator
              orientation="vertical"
              className="h-4 mx-2 hidden sm:block"
            />

            <span className="flex items-center mb-1 sm:mb-0">
              <Pen className="h-4 w-4 mr-1" />
              {hukamnama.hukamnamainfo.writer.english}
            </span>

            <Separator
              orientation="vertical"
              className="h-4 mx-2 hidden sm:block"
            />

            <span className="flex items-center mb-1 sm:mb-0">
              <Music2 className="h-4 w-4 mr-1" />
              {hukamnama.hukamnamainfo.raag.raagwithpage}
            </span>
          </div>

          <ScrollArea className="h-[calc(100vh-18.25rem)] sm:h-[calc(100vh-11rem)] mt-4 rounded-md border p-4 mb-4">
            <section className="grid grid-cols-1 gap-4">
              {hukamnama.hukamnama.map((item, index) => (
                <div key={index}>
                  <p className={cn(notoSansGurmukhi.className, "text-xl")}>
                    {item.line.gurmukhi.unicode}
                  </p>
                  <p className="text-md text-muted-foreground italic">
                    {item.line.transliteration.english.text}
                  </p>
                  <p className="text-md text-muted-foreground">
                    {transLang === "eng"
                      ? item.line.translation.english.default
                      : item.line.translation.spanish}
                  </p>
                </div>
              ))}
            </section>
          </ScrollArea>
        </>
      ) : (
        <div className="h-[calc(100vh-6rem)] flex items-center justify-center text-center">
          <p>
            {transLang === "eng"
              ? "No Hukamnama data available."
              : "No hay datos de Hukamnama disponibles."}
          </p>
          {error && <p>{error}</p>}
        </div>
      )}
    </div>
  );
}
