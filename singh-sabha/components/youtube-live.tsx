"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import * as React from "react";

import {
  fadeInWithDelay,
  staggerContainer,
} from "@/components/sections/hero-section";
import Link from "next/link";

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
            <h2 className="text-3xl font-bold tracking-tighter">Live Stream</h2>
            <p className="mx-auto text-muted-foreground">
              Join us virtually for our live services and events.
            </p>
          </motion.div>
          <motion.div variants={fadeInWithDelay(0.3)}>
            <Card className="mx-auto overflow-hidden">
              {isLoading ? (
                <>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-6 w-6" />
                        <Skeleton className="h-6 w-64" />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Skeleton className="aspect-video w-full rounded-none" />
                  </CardContent>
                </>
              ) : liveStream ? (
                <>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center">
                      <Link
                        href={`https://www.youtube.com/watch?v=${liveStream.videoId}`}
                        className="flex items-center space-x-2 hover:text-muted-foreground hover:fill-muted-foreground transition-colors"
                      >
                        <Image
                          src={liveStream.thumbnails.default.url}
                          alt={liveStream.title}
                          height={liveStream.thumbnails.default.height}
                          width={liveStream.thumbnails.default.width}
                          className="h-6 w-6 rounded"
                        />
                        <span>{liveStream.title}</span>
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
                </>
              ) : (
                <>
                  <CardHeader>
                    <CardTitle className="text-center">
                      No Live Stream Available
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center p-8">
                    <p className="text-muted-foreground">
                      There is currently no live stream. Please check back later
                      or visit our YouTube channel for past recordings.
                    </p>
                  </CardContent>
                </>
              )}
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
