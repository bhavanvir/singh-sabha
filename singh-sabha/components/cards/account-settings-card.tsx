import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { RefreshCw, Info, Clipboard, Edit, Check } from "lucide-react";

import { AddOtp, ChangeEmail, ChangePassword } from "@/lib/api/users/mutations";
import { User } from "@/db/schema";

const emailSchema = z.object({
  email: z.string().min(1, "Email missing").email("Invalid email"),
});

const passwordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

interface AccountSettingsFormProps {
  user: User;
}

export default function AccountSettingsForm({
  user,
}: AccountSettingsFormProps) {
  const [otp, setOtp] = React.useState<string>("");
  const [copied, setCopied] = React.useState<boolean>(false);

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

  const handleChangeEmail: SubmitHandler<z.infer<typeof emailSchema>> = (
    data,
  ) => {
    toast.promise(ChangeEmail({ id: user?.id, email: data.email }), {
      loading: "Changing email...",
      success: "Email changed!",
      error: "Failed to change email.",
    });
  };

  const handleChangePassword: SubmitHandler<z.infer<typeof passwordSchema>> = (
    data,
  ) => {
    toast.promise(ChangePassword({ id: user?.id, password: data.password }), {
      loading: "Changing password...",
      success: "Password changed!",
      error: "Failed to change password.",
    });
  };

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
      loading: "Creating OTP...",
      success: (_) => {
        setOtp(generatedOtp);
        return "Temporary password created! It is set to auto-expire in 15 minutes.";
      },
      error: "Failed to create OTP.",
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(otp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      toast.error("Failed to copy OTP to clipboard.");
    }
  };

  return (
    <Card className="shadow-lg">
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
                        <Edit />
                        Change
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
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
                        <Edit />
                        Change
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        {user?.isAdmin && (
          <div>
            <Label htmlFor="temp-password">Generate One-Time Password</Label>
            <div className="flex space-x-2">
              <Input
                id="temp-password"
                type="text"
                value={otp}
                readOnly
                className="flex-grow font-mono"
              />
              <Button type="button" onClick={generateOtp}>
                <RefreshCw />
                Generate
              </Button>
              <Button
                onClick={copyToClipboard}
                disabled={!otp}
                className="h-10 w-10"
              >
                <Clipboard
                  className={`h-4 w-4 transition-opacity duration-300 ${copied ? "opacity-0" : "opacity-100"}`}
                />
                <Check
                  className={`h-4 w-4 absolute transition-opacity duration-300 ${copied ? "opacity-100" : "opacity-0"}`}
                />
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
  );
}
