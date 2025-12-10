import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useRequestPasswordResetMutation } from "./authApi";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SignInContainer } from "@/theme/components/SignInContainer";

interface ForgotPasswordPageFormFields extends HTMLFormControlsCollection {
  email: HTMLInputElement;
}
interface ForgotPasswordPageFormElements extends HTMLFormElement {
  readonly elements: ForgotPasswordPageFormFields;
}

export const ForgotPasswordPage = () => {
  const [requestPasswordReset, { isLoading, error, isSuccess }] =
    useRequestPasswordResetMutation();
  const [email, setEmail] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<ForgotPasswordPageFormElements>
  ) => {
    e.preventDefault();

    const emailValue = e.currentTarget.elements.email.value;
    setEmail(emailValue);

    try {
      await requestPasswordReset({ email: emailValue }).unwrap();
    } catch (err) {
      // Error is handled by the mutation hook
      console.error("Password reset request failed:", err);
    }
  };

  let errorRender = null;
  let successRender = null;

  if (error) {
    let errorMessage = "An error occurred while requesting password reset";
    if (
      "data" in error &&
      error.data &&
      typeof error.data === "object" &&
      "message" in error.data
    ) {
      errorMessage = error.data.message as string;
    } else if ("message" in error) {
      errorMessage = error.message as string;
    }
    errorRender = (
      <Alert className="border-destructive/30 bg-destructive/10 text-destructive">
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    );
  }

  if (isSuccess) {
    successRender = (
      <Alert className="border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400">
        <AlertDescription>
          Password reset link has been sent to {email}. Please check your email
          and follow the instructions to reset your password.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <SignInContainer>
      <Card className="flex flex-col self-center w-full p-8 gap-4 mx-auto max-w-[450px]">
        <h1
          className="w-full text-4xl font-semibold"
          style={{ fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Forgot Password
        </h1>
        <p className="mb-4 text-muted-foreground">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col w-full gap-4"
        >
          {errorRender}
          {successRender}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              disabled={isLoading || isSuccess}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isSuccess}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading
              ? "Sending..."
              : isSuccess
                ? "Email Sent"
                : "Send Reset Link"}
          </Button>
          <div className="text-center mt-4">
            <RouterLink
              to="/user/login"
              className="text-sm text-primary hover:underline"
            >
              Back to Sign in
            </RouterLink>
          </div>
        </form>
      </Card>
    </SignInContainer>
  );
};
