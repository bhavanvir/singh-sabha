import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AddOtp } from "@/lib/api/events/mutations";
import { RefreshCw, Info, Copy, Send } from "lucide-react";

import type { User } from "lucia";

interface SettingsProps {
  user: User;
}

export default function Settings({ user }: SettingsProps) {
  const [otp, setOtp] = useState("");

  const generateOtp = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let generatedOtp = "";
    for (let i = 0; i < 6; i++) {
      generatedOtp += charset.charAt(
        Math.floor(Math.random() * charset.length),
      );
    }

    toast.promise(AddOtp({ otp: generatedOtp, issuer: user?.id }), {
      loading: "Submitting event request...",
      success: (_) => {
        setOtp(generatedOtp);
        return "Temporary password created! It is set to auto-expire in 15 minutes.";
      },
      error: "An unknown error occurred.",
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(otp);
      toast.info("OTP copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy OTP to clipboard.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-2">
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="email">Change Email</Label>
              <div className="flex space-x-2">
                <Input className="flex-grow" />
                <Button type="button">
                  <Send className="h-4 w-4 mr-2" />
                  Submit
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="password">Change Password</Label>
              <div className="flex space-x-2">
                <Input className="flex-grow" />
                <Button type="button">
                  <Send className="h-4 w-4 mr-2" />
                  Submit
                </Button>
              </div>
            </div>
            {user?.isAdmin && (
              <div>
                <Label htmlFor="temp-password">
                  Generate One-Time Password
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="temp-password"
                    type="text"
                    value={otp}
                    readOnly
                    className="flex-grow"
                  />
                  <Button type="button" onClick={generateOtp}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                  <Button
                    type="button"
                    onClick={copyToClipboard}
                    disabled={!otp}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy to clipboard</span>
                  </Button>
                </div>
                <p className="pt-1 text-muted-foreground text-sm flex items-center">
                  <Info className="mr-1 h-4 w-4" />
                  Gives a user 15 minutes to create an account.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
