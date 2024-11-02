"use client";

import * as React from "react";
import NavBar from "@/components/navbar";
import type { HukamnamaRoot } from "@/lib/types/hukamnama";
import { Book, Pen, Loader2, Music2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function Hukamnama() {
  const [hukamnama, setHukamnama] = React.useState<HukamnamaRoot | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchHukamnama = async () => {
      try {
        const response = await fetch("/api/hukamnama");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setHukamnama(data);
      } catch (err) {
        setError("An error occurred while fetching the Hukamnama");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHukamnama();
  }, []);

  return (
    <>
      <NavBar currentLink="Hukamnama" />
      <main className="p-4 max-w-full mx-2">
        {isLoading && (
          <div className="h-[calc(100vh-6rem)] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
        {hukamnama ? (
          <>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold">
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

            <ScrollArea className="h-[calc(100vh-16.25rem)] sm:h-[calc(100vh-10.75rem)] mt-4 rounded-md border p-4">
              <section className="grid grid-cols-1 gap-4">
                {hukamnama.hukamnama.map((item, index) => (
                  <div key={index}>
                    <p className="text-xl">{item.line.gurmukhi.unicode}</p>
                    <p className="text-md text-muted-foreground">
                      {item.line.translation.english.default}
                    </p>
                    <p className="text-md text-muted-foreground italic">
                      {item.line.transliteration.english.text}
                    </p>
                  </div>
                ))}
              </section>
            </ScrollArea>
          </>
        ) : (
          <div className="h-[calc(100vh-6rem)] flex items-center justify-center text-center">
            <p>No Hukamnama data available.</p>
            {error && <p>{error}</p>}
          </div>
        )}
      </main>
    </>
  );
}
