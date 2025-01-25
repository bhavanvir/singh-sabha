"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, useAnimation, useInView } from "framer-motion";
import Link from "next/link";
import * as React from "react";

import { ExternalLink, MegaphoneOff } from "lucide-react";

import EmptyDataCard from "@/components/cards/empty-data-card";
import {
  fadeInWithDelay,
  staggerContainer,
} from "@/components/sections/hero-section";

import type { YoutubeLiveStream } from "@/lib/types/youtube-live";

export function YoutubeLive() {
  const ref = React.useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [liveStream, setLiveStream] = React.useState<YoutubeLiveStream | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchYoutubeLiveStream = async () => {
      try {
        const response = await fetch("/api/youtube");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        if (data?.videoId) {
          setLiveStream(data);
        } else {
          setLiveStream(null);
        }
      } catch (err) {
        setError("An error occurred while fetching the live stream");
      } finally {
        setIsLoading(false);
      }
    };

    fetchYoutubeLiveStream();

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
            {liveStream ? (
              <h2 className="text-3xl font-bold tracking-tighter flex justify-center items-center ">
                <div className="h-4 w-4 mr-1 bg-red-500 rounded-full animate-pulse" />
                Currently Live!
              </h2>
            ) : (
              <h2 className="text-3xl font-bold tracking-tighter">
                Currently Offline
              </h2>
            )}
            <p className="mx-auto text-muted-foreground">
              Join us virtually for our live services and events.
            </p>
          </motion.div>
          <motion.div variants={fadeInWithDelay(0.3)}>
            {isLoading ? (
              <Skeleton className="w-full aspect-video rounded-lg" />
            ) : liveStream ? (
              <Card className="mx-auto overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <Link
                      href={`https://www.youtube.com/watch?v=${liveStream.videoId}`}
                      className="flex items-center space-x-2 hover:text-muted-foreground hover:fill-muted-foreground transition-colors"
                    >
                      {liveStream.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${liveStream.videoId}`}
                    title={liveStream.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </CardContent>
              </Card>
            ) : (
              <EmptyDataCard
                icon={MegaphoneOff}
                title="No Live Stream Available"
                description={
                  <>
                    There is currently no live stream. Please check back later
                    or visit our{" "}
                    <Link
                      href="https://www.youtube.com/@GurdwaraSinghSabhaVictoria"
                      className="text-primary hover:underline inline-flex items-center"
                      target="_blank"
                    >
                      YouTube channel
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </Link>{" "}
                    for past recordings.
                  </>
                }
              />
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
