import React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { selectAuthData } from "@/features/auth/authSlice";
import { useRegisterMutation, useLazyGetCurrentUserQuery } from "./authApi";
import {
  selectLocalCartItems,
  clearLocalCart,
} from "@/features/cart/cartSlice";
import { useMergeCartMutation } from "@/features/cart/cartApi";
import { formatCartItemsForMerge } from "@/features/cart/cartUtils";

import { SignInContainer } from "@/theme/components/SignInContainer";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RegisterPageFormFields extends HTMLFormControlsCollection {
  name: HTMLInputElement;
  email: HTMLInputElement;
  password: HTMLInputElement;
  password_confirmation: HTMLInputElement;
}
interface RegisterPageFormElements extends HTMLFormElement {
  readonly elements: RegisterPageFormFields;
}

export const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status: authStatus } = useAppSelector(selectAuthData);
  const localCartItems = useAppSelector(selectLocalCartItems);
  const [register, { isLoading, error }] = useRegisterMutation();
  const [getCurrentUser] = useLazyGetCurrentUserQuery();
  const [mergeCart] = useMergeCartMutation();
  const [hasJustRegistered, setHasJustRegistered] = React.useState(false);

  React.useEffect(() => {
    // Only redirect if user is authorized and we haven't just completed a registration
    if (authStatus === "authorized" && !hasJustRegistered) {
      navigate("/");
    }
  }, [authStatus, navigate, hasJustRegistered]);

  const handleSubmit = async (e: React.FormEvent<RegisterPageFormElements>) => {
    e.preventDefault();

    const name = e.currentTarget.elements.name.value;
    const email = e.currentTarget.elements.email.value;
    const password = e.currentTarget.elements.password.value;
    const password_confirmation =
      e.currentTarget.elements.password_confirmation.value;

    try {
      await register({ name, email, password, password_confirmation }).unwrap();
      // After successful registration, fetch the current user to populate the auth state
      await getCurrentUser();

      // Set flag to prevent useEffect from redirecting
      setHasJustRegistered(true);

      // Automatically merge local cart with server cart (no confirmation needed for new users)
      if (localCartItems.length > 0) {
        try {
          const itemsToMerge = formatCartItemsForMerge(localCartItems);
          await mergeCart({ items: itemsToMerge }).unwrap();
          dispatch(clearLocalCart());
        } catch (mergeError) {
          console.error("Failed to merge cart after registration:", mergeError);
          // Continue to home page even if merge fails
        }
      }

      navigate("/");
    } catch (err) {
      // Error is handled by the mutation hook
      console.error("Registration failed:", err);
    }
  };

  let errorsRender = null;

  if (error) {
    let errorMessage = t("auth.errorDuringRegistration");
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
      <Card className="flex flex-col self-center w-full p-8 gap-4 mx-auto max-w-[450px]">
        <h1
          className="w-full text-4xl font-semibold"
          style={{ fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          {t("auth.signUp")}
        </h1>
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col w-full gap-4"
        >
          {errorsRender}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              {t("auth.fullName")}
            </label>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="John Doe"
              autoComplete="name"
              autoFocus
              required
              disabled={isLoading}
            />
          </div>
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
              autoComplete="new-password"
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password_confirmation"
              className="text-sm font-medium"
            >
              {t("common.confirmPassword")}
            </label>
            <Input
              name="password_confirmation"
              placeholder={t("auth.passwordPlaceholder")}
              type="password"
              id="password_confirmation"
              autoComplete="new-password"
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? t("auth.creatingAccount") : t("auth.signUp")}
          </Button>
          <div className="text-center mt-4">
            <RouterLink
              to="/user/login"
              className="text-sm text-primary hover:underline"
            >
              {t("auth.alreadyHaveAccount")}
            </RouterLink>
          </div>
        </form>
      </Card>
    </SignInContainer>
  );
};
