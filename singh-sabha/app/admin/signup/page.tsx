"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { CreateMod, ValidateOtp } from "@/lib/api/events/mutations";
import { toast } from "sonner";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const formSchema = z.object({
  name: z.string().min(1, "Full name missing").max(128, "Full name too long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignUpForm() {
  const [isOtpValid, setIsOtpValid] = React.useState(false);

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const signUpForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleOtpSubmit = async (data: z.infer<typeof otpSchema>) => {
    toast.promise(ValidateOtp({ otp: data.otp }), {
      loading: "Validating one-time password...",
      success: (_) => {
        setIsOtpValid(true);
        otpForm.reset();
        return "One-time password has been validated! You can now create your account.";
      },
      error: "Your one-time password failed to be validated.",
    });
  };

  const handleSignUp = async (data: z.infer<typeof formSchema>) => {
    toast.promise(
      CreateMod({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
      {
        loading: "Creating account...",
        success: "Account created! You can now login.",
        error: "Unable to create an account. Contact the administrator.",
      },
    );
  };

  return (
    <div className="flex h-screen">
      <Card className="w-full max-w-sm mx-auto my-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Admin sign up</CardTitle>
          <CardDescription>
            {isOtpValid
              ? "Enter your details to sign up."
              : "Enter the OTP to proceed with sign up."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isOtpValid ? (
            <Form {...otpForm}>
              <form
                onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                          {...field}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Verify OTP
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...signUpForm}>
              <form
                onSubmit={signUpForm.handleSubmit(handleSignUp)}
                className="space-y-4"
                autoComplete="off"
              >
                <FormField
                  control={signUpForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Full name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Add full name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="me@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Sign up
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
