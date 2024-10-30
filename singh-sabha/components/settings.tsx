import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  AddOtp,
  ChangeEmail,
  ChangePassword,
} from "@/lib/api/events/mutations";
import { RefreshCw, Info, Copy, Send } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import type { User } from "lucia";

interface SettingsProps {
  user: User;
}

const emailSchema = z.object({
  email: z.string().min(1, "Email missing").email("Invalid email"),
});

const passwordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Settings({ user }: SettingsProps) {
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

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

  const handleChangeEmail: SubmitHandler<z.infer<typeof emailSchema>> = (
    data,
  ) => {
    toast.promise(ChangeEmail({ id: user?.id, email: data.email }), {
      loading: "Changing email...",
      success: "Email changed!",
      error: "An unknown error occured.",
    });
  };

  const handleChangePassword: SubmitHandler<z.infer<typeof passwordSchema>> = (
    data,
  ) => {
    toast.promise(ChangePassword({ id: user?.id, password: data.password }), {
      loading: "Changing password...",
      success: "Password changed!",
      error: "An unknown error occured.",
    });
  };

  return (
    <div className="max-w-xl mx-auto p-2">
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(handleChangeEmail)}
                autoComplete="false"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Change Email</FormLabel>
                      <FormControl>
                        <div className="flex space-x-2">
                          <Input
                            type="text"
                            placeholder="New email"
                            {...field}
                            className="flex-grow"
                          />
                          <Button type="submit">
                            <Send className="h-4 w-4 mr-2" />
                            Submit
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <div>
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(handleChangePassword)}
                  autoComplete="false"
                >
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Change Password</FormLabel>
                        <FormControl>
                          <div className="flex space-x-2">
                            <Input
                              type="text"
                              placeholder="New password"
                              {...field}
                              className="flex-grow"
                            />
                            <Button type="submit">
                              <Send className="h-4 w-4 mr-2" />
                              Submit
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
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
