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

import { XCircle, Loader2, CheckCircle } from "lucide-react";
import { DeleteEvent } from "@/lib/api/events/mutations";

export default function PaymentCancellation() {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isDeleted, setIsDeleted] = React.useState<boolean>(false);
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const eventId = searchParams.get("event_id");
    if (!eventId) {
      setIsLoading(false);
      return;
    }

    const handleEventDeletion = async () => {
      try {
        await DeleteEvent({ id: eventId });
        setIsDeleted(true);
      } catch (err) {
        throw new Error(`Came across an error when cancelling payment: ${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    handleEventDeletion();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Payment Cancelled
          </CardTitle>
          <CardDescription className="text-center">
            Your payment process has been cancelled
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-lg font-medium text-muted-foreground">
                Processing cancellation...
              </p>
            </div>
          ) : isDeleted ? (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-lg font-medium text-green-600">
                Cancellation Successful
              </p>
              <p className="text-center text-muted-foreground">
                Your event has been successfully cancelled and deleted.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-16 w-16 text-red-500" />
              <p className="text-lg font-medium text-red-600">
                Payment Cancelled
              </p>
              <p className="text-center text-muted-foreground">
                Your payment has been cancelled. If you encountered any issues
                or have any questions, please don&apos;t hesitate to contact our
                support team.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
