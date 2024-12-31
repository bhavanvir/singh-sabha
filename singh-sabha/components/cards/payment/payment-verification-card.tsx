"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

import { Loader2, CheckCircle, XCircle, Clipboard, Check } from "lucide-react";

import { processDeposit } from "@/lib/api/events/mutations";

export default function PaymentVerification() {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isValidSession, setIsValidSession] = React.useState<boolean>(false);
  const [copied, setCopied] = React.useState(false);
  const [referenceNumber, setReferenceNumber] = React.useState<string | null>(
    null,
  );
  const searchParams = useSearchParams();

  const sessionId = searchParams.get("session_id");
  const eventId = searchParams.get("event_id");

  React.useEffect(() => {
    if (!sessionId || !eventId) {
      setIsLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const resp = await fetch(`/api/stripe/validate-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!resp.ok) {
          throw new Error("Failed to verify the session.");
        }

        const data = await resp.json();
        if (data.success) {
          await processDeposit(eventId ?? "");
          setIsValidSession(true);
          setReferenceNumber(eventId);
        }
      } catch (err) {
        throw new Error(`Came across an error when processing deposit: ${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, eventId]);

  const handleCopy = () => {
    if (referenceNumber) {
      navigator.clipboard
        .writeText(referenceNumber)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => console.error("Failed to copy: ", err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Payment Verification
          </CardTitle>
          <CardDescription className="text-center">
            We&apos;re confirming your payment status with Stripe
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-lg font-medium text-muted-foreground">
                Verifying payment...
              </p>
            </div>
          ) : isValidSession ? (
            <div className="flex flex-col items-center space-y-4 w-full">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-lg font-medium text-green-600">
                Payment successful!
              </p>
              <p className="text-center text-muted-foreground">
                Your transaction has been completed successfully! Please check
                your email inbox for your booking details confirmation.
              </p>
              {referenceNumber && (
                <>
                  <Separator className="my-4" />
                  <div className="flex flex-col items-center space-y-2 w-full">
                    <p className="text-sm font-medium text-muted-foreground">
                      Reference Number
                    </p>
                    <div className="flex items-center space-x-2 w-full">
                      <Input
                        readOnly
                        value={referenceNumber}
                        className="font-mono"
                        aria-label="Reference number"
                      />
                      <Button
                        onClick={handleCopy}
                        className="h-10 w-10 relative"
                        aria-label="Copy reference number to clipboard"
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
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-16 w-16 text-red-500" />
              <p className="text-lg font-medium text-red-600">
                Payment verification failed
              </p>
              <p className="text-center text-muted-foreground">
                We couldn&apos;t verify your payment. Please try again or
                contact support if the issue persists.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {!isLoading && (
            <Button className="w-full" asChild>
              <Link href="/">Return Home</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
