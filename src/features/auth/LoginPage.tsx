import React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useAppSelector } from "@/app/hooks";
import { selectAuthData } from "@/features/auth/authSlice";
import { useLoginMutation, useLazyGetCurrentUserQuery } from "./authApi";
import { SignInContainer } from "@/theme/components/SignInContainer";
import { selectLocalCartItems } from "@/features/cart/cartSlice";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginPageFormFields extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}
interface LoginPageFormElements extends HTMLFormElement {
  readonly elements: LoginPageFormFields;
}

export const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { status: authStatus } = useAppSelector(selectAuthData);
  const localCartItems = useAppSelector(selectLocalCartItems);
  const [login, { isLoading, error }] = useLoginMutation();
  const [getCurrentUser] = useLazyGetCurrentUserQuery();
  const [hasJustLoggedIn, setHasJustLoggedIn] = React.useState(false);

  React.useEffect(() => {
    // Only redirect if user is authorized and we haven't just completed a login
    if (authStatus === "authorized" && !hasJustLoggedIn) {
      navigate("/");
    }
  }, [authStatus, navigate, hasJustLoggedIn]);

  const handleSubmit = async (e: React.FormEvent<LoginPageFormElements>) => {
    e.preventDefault();

    const email = e.currentTarget.elements.email.value;
    const password = e.currentTarget.elements.password.value;

    try {
      await login({ email, password }).unwrap();
      // After successful login, fetch the current user to populate the auth state
      await getCurrentUser();

      // Set flag to prevent useEffect from redirecting
      setHasJustLoggedIn(true);

      // Check if user has items in localStorage cart
      //console.log("Login successful, local cart items:", localCartItems.length);
      if (localCartItems.length > 0) {
        //console.log("Redirecting to merge-cart page");
        navigate("/merge-cart");
      } else {
        //console.log("No local cart items, redirecting to home");
        navigate("/");
      }
    } catch (err) {
      // Error is handled by the mutation hook
      console.error("Login failed:", err);
    }
  };

  let errorsRender = null;

  if (error) {
    let errorMessage = t("auth.errorDuringLogin");
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
    errorsRender = (
      <Alert className="border-destructive/30 bg-destructive/10 text-destructive">
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    );
  }

  return (
    <SignInContainer>
      <Card className="flex flex-col self-center w-full p-8 gap-4 mx-auto max-w-[450px] shadow-lg">
        <h1 className="w-full text-4xl font-semibold" style={{ fontSize: "clamp(2rem, 10vw, 2.15rem)" }}>
          {t("auth.signIn")}
        </h1>
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col w-full gap-4"
        >
          {errorsRender}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              {t("common.email")}
            </label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder={t("auth.yourEmail")}
              autoComplete="email"
              autoFocus
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              {t("common.password")}
            </label>
            <Input
              name="password"
              placeholder={t("auth.passwordPlaceholder")}
              type="password"
              id="password"
              autoComplete="current-password"
              required
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? t("auth.signingIn") : t("auth.signIn")}
          </Button>
          <div className="text-center mt-4 space-y-2">
            <div>
              <RouterLink
                to="/user/register"
                className="text-sm text-primary hover:underline"
              >
                {t("auth.dontHaveAccount")}
              </RouterLink>
            </div>
            <div>
              <RouterLink
                to="/user/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                {t("auth.forgotPassword")}
              </RouterLink>
            </div>
          </div>
        </form>
      </Card>
    </SignInContainer>
  );
};
