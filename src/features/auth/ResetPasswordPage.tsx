import React, { useEffect, useState } from "react";
import {
  useNavigate,
  Link as RouterLink,
  useSearchParams,
} from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useResetPasswordMutation } from "./authApi";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SignInContainer } from "@/theme/components/SignInContainer";

interface ResetPasswordPageFormFields extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
  password_confirmation: HTMLInputElement;
}
interface ResetPasswordPageFormElements extends HTMLFormElement {
  readonly elements: ResetPasswordPageFormFields;
}

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [resetPassword, { isLoading, error, isSuccess }] =
    useResetPasswordMutation();

  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [emailValue, setEmailValue] = useState(email || "");

  useEffect(() => {
    if (!token || !email) {
      navigate("/user/forgot-password");
    }
  }, [token, email, navigate]);

  const handleSubmit = async (
    e: React.FormEvent<ResetPasswordPageFormElements>
  ) => {
    e.preventDefault();

    if (!token || !email) return;

    const password = e.currentTarget.elements.password.value;
    const password_confirmation =
      e.currentTarget.elements.password_confirmation.value;

    try {
      await resetPassword({
        token,
        email,
        password,
        password_confirmation,
      }).unwrap();
      // Navigate to login after successful reset
      setTimeout(() => {
        navigate("/user/login");
      }, 2000);
    } catch (err) {
      // Error is handled by the mutation hook
      console.error("Password reset failed:", err);
    }
  };

  let errorRender = null;
  let successRender = null;

  if (error) {
    let errorMessage = "An error occurred while resetting password";
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
          Password has been successfully reset! You will be redirected to the
          login page shortly.
        </AlertDescription>
      </Alert>
    );
  }

  if (!token || !email) {
    return (
      <SignInContainer>
        <Card className="flex flex-col self-center w-full p-8 gap-4 mx-auto max-w-[450px] shadow-lg">
          <Alert className="border-destructive/30 bg-destructive/10 text-destructive">
            <AlertDescription>
              Invalid or missing reset token. Please request a new password
              reset.
            </AlertDescription>
          </Alert>
          <div className="text-center mt-4">
            <RouterLink
              to="/user/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Request new password reset
            </RouterLink>
          </div>
        </Card>
      </SignInContainer>
    );
  }

  return (
    <SignInContainer>
      <Card className="flex flex-col self-center w-full p-8 gap-4 mx-auto max-w-[450px] shadow-lg">
        <h1
          className="w-full text-4xl font-semibold"
          style={{ fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Reset Password
        </h1>
        <p className="mb-4 text-muted-foreground">
          Enter your new password below.
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
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              autoComplete="email"
              required
              disabled={isLoading || isSuccess}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              New Password
            </label>
            <Input
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="new-password"
              required
              disabled={isLoading || isSuccess}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password_confirmation"
              className="text-sm font-medium"
            >
              Confirm New Password
            </label>
            <Input
              name="password_confirmation"
              placeholder="••••••"
              type="password"
              id="password_confirmation"
              autoComplete="new-password"
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
              ? "Resetting..."
              : isSuccess
                ? "Password Reset"
                : "Reset Password"}
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
