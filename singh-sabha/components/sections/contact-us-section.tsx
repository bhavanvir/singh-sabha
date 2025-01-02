"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

import { Phone, Mail, MapPin, Send, ExternalLink } from "lucide-react";

import { staggerContainer, fadeInWithDelay } from "./hero-section";
import { sendEmail } from "@/lib/send-email";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  name: z.string().min(1, "Full name missing").max(128, "Full name too long"),
  email: z.string().min(1, "Email missing").email("Invalid email"),
  subject: z.string().min(6, "Subject missing").max(64),
  message: z.string().min(1, "Message missing").max(256, "Note too long"),
});

export function ContactUsSection() {
  const ref = React.useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    toast.promise(
      async () => {
        await sendEmail(data, "/api/send/message");
      },
      {
        loading: "Sending message...",
        success: "Message sent succesfully!",
        error: "Failed send message",
      },
    );
  };

  React.useEffect(() => {
    if (isInView) {
      controls.start("show");
    }
  }, [isInView, controls]);

  return (
    <section className="py-16 bg-background" ref={ref} id="contact">
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
            <h2 className="text-3xl font-bold tracking-tight">Contact Us</h2>
            <p className="text-muted-foreground mx-auto">
              We welcome your visit to our Gurdwara. If you have any questions
              or need assistance, please don&apos;t hesitate to reach out.
            </p>
          </motion.div>

          <motion.div variants={fadeInWithDelay(0.3)}>
            <Card className="w-full max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>
                  We&apos;re here to help and answer any question you might
                  have.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="contact" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="contact">Contact Info</TabsTrigger>
                    <TabsTrigger value="message">Send a Message</TabsTrigger>
                  </TabsList>
                  <TabsContent value="contact">
                    <div className="grid gap-6 py-4">
                      <div className="flex items-center space-x-4 justify-between">
                        <div className="flex items-center space-x-4">
                          <MapPin className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">Address</p>
                            <p className="text-sm text-muted-foreground">
                              470 Cecelia Rd Victoria, BC V8T 4T5
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          asChild
                          className="hidden md:inline-flex"
                        >
                          <Link
                            href="https://www.google.com/maps/search/?api=1&query=470+Cecelia+Rd,+Victoria,+BC+V8T+4T5"
                            target="_blank"
                          >
                            <ExternalLink />
                            Directions
                          </Link>
                        </Button>
                      </div>

                      <Separator />

                      <div className="flex items-center space-x-4">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <p className="text-sm text-muted-foreground">
                            +1 250 475-2280
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center space-x-4">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">
                            singhsabhayyj@gmail.com
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="message">
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                        autoComplete="off"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your Name"
                                    className={cn(
                                      "transition-colors focus-visible:ring-1 focus-visible:ring-ring",
                                      "hover:border-primary/50",
                                    )}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="Your Email"
                                    className={cn(
                                      "transition-colors focus-visible:ring-1 focus-visible:ring-ring",
                                      "hover:border-primary/50",
                                    )}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="What is this regarding?"
                                  className={cn(
                                    "transition-colors focus-visible:ring-1 focus-visible:ring-ring",
                                    "hover:border-primary/50",
                                  )}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Your Message"
                                  className={cn(
                                    "min-h-[100px]",
                                    "transition-colors focus-visible:ring-1 focus-visible:ring-ring",
                                    "hover:border-primary/50",
                                  )}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end">
                          <Button type="submit">
                            <Send />
                            Send Message
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
