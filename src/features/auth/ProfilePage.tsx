import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useAppSelector } from "@/app/hooks";
import { selectCurrentUser } from "@/features/auth/authSlice";
import {
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useLogoutMutation,
} from "./authApi";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface ProfileFormFields extends HTMLFormControlsCollection {
  name: HTMLInputElement;
  //email: HTMLInputElement;
}
interface ProfileFormElements extends HTMLFormElement {
  readonly elements: ProfileFormFields;
}

interface PasswordFormFields extends HTMLFormControlsCollection {
  current_password: HTMLInputElement;
  new_password: HTMLInputElement;
  new_password_confirmation: HTMLInputElement;
}
interface PasswordFormElements extends HTMLFormElement {
  readonly elements: PasswordFormFields;
}

export const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: user, isLoading: isLoadingUser } = useGetCurrentUserQuery();
  const [updateProfile, { isLoading: isUpdatingProfile, error: profileError }] =
    useUpdateProfileMutation();
  const [
    updatePassword,
    { isLoading: isUpdatingPassword, error: passwordError },
  ] = useUpdatePasswordMutation();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleProfileSubmit = async (
    e: React.FormEvent<ProfileFormElements>
  ) => {
    e.preventDefault();

    const name = e.currentTarget.elements.name.value;
    //const email = e.currentTarget.elements.email.value;

    try {
      await updateProfile({ name /* , email  */ }).unwrap();
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  const handlePasswordSubmit = async (
    e: React.FormEvent<PasswordFormElements>
  ) => {
    e.preventDefault();

    const current_password = e.currentTarget.elements.current_password.value;
    const new_password = e.currentTarget.elements.new_password.value;
    const new_password_confirmation =
      e.currentTarget.elements.new_password_confirmation.value;

    try {
      await updatePassword({
        current_password,
        new_password: new_password,
        new_password_confirmation: new_password_confirmation,
      }).unwrap();
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
      // Clear form
      e.currentTarget.reset();
    } catch (err) {
      console.error("Password update failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const displayUser = user || currentUser;

  if (isLoadingUser) {
    return (
      <div className="flex justify-center p-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!displayUser) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Alert className="border-destructive/30 bg-destructive/10 text-destructive">
          <AlertDescription>{t("auth.unableToLoadProfile")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">{t("auth.userProfile")}</h1>

      {/* Profile Information Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("auth.profileInformation")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
            {profileSuccess && (
              <Alert className="border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400">
                <AlertDescription>{t("auth.profileUpdated")}</AlertDescription>
              </Alert>
            )}
            {profileError && (
              <Alert className="border-destructive/30 bg-destructive/10 text-destructive">
                <AlertDescription>
                  {"data" in profileError &&
                  profileError.data &&
                  typeof profileError.data === "object" &&
                  "message" in profileError.data
                    ? (profileError.data.message as string)
                    : t("auth.errorUpdatingProfile")}
                </AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                {t("auth.fullName")}
              </label>
              <Input
                name="name"
                id="name"
                defaultValue={displayUser.name}
                required
                disabled={isUpdatingProfile}
              />
            </div>
            <Button
              type="submit"
              disabled={isUpdatingProfile}
              className="self-start"
            >
              {isUpdatingProfile && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {isUpdatingProfile
                ? t("auth.updatingProfile")
                : t("auth.updateProfile")}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Language Preferences Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("common.language")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <label htmlFor="language" className="text-sm font-medium">
              {t("common.language")}
            </label>
            <select
              id="language"
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              <option value="en">{t("common.english")}</option>
              <option value="ru">{t("common.russian")}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("auth.changePassword")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            {passwordSuccess && (
              <Alert className="border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400">
                <AlertDescription>{t("auth.passwordUpdated")}</AlertDescription>
              </Alert>
            )}
            {passwordError && (
              <Alert className="border-destructive/30 bg-destructive/10 text-destructive">
                <AlertDescription>
                  {"data" in passwordError &&
                  passwordError.data &&
                  typeof passwordError.data === "object" &&
                  "message" in passwordError.data
                    ? (passwordError.data.message as string)
                    : t("auth.errorUpdatingPassword")}
                </AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col gap-2">
              <label htmlFor="current_password" className="text-sm font-medium">
                {t("common.currentPassword")}
              </label>
              <Input
                name="current_password"
                id="current_password"
                type="password"
                required
                disabled={isUpdatingPassword}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="new_password" className="text-sm font-medium">
                {t("common.newPassword")}
              </label>
              <Input
                name="new_password"
                id="new_password"
                type="password"
                required
                disabled={isUpdatingPassword}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="new_password_confirmation"
                className="text-sm font-medium"
              >
                {t("common.confirmPassword")}
              </label>
              <Input
                name="new_password_confirmation"
                id="new_password_confirmation"
                type="password"
                required
                disabled={isUpdatingPassword}
              />
            </div>
            <Button
              type="submit"
              disabled={isUpdatingPassword}
              className="self-start"
            >
              {isUpdatingPassword && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {isUpdatingPassword
                ? t("auth.updatingPassword")
                : t("auth.updatePassword")}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Logout Section */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold mb-4">
            {t("auth.accountActions")}
          </h2>
          <hr className="border-border mb-4" />
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            {isLoggingOut && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoggingOut ? t("auth.loggingOut") : t("common.logout")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
