import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
// import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";

import { useAppSelector } from "@/app/hooks";
import { selectCurrentUser } from "@/features/auth/authSlice";
import {
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useLogoutMutation,
} from "./authApi";

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
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!displayUser) {
    return <Alert severity="error">Unable to load user profile.</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>

      {/* Profile Information Card */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Profile Information" />
        <CardContent>
          <Box
            component="form"
            onSubmit={handleProfileSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {profileSuccess && (
              <Alert severity="success">Profile updated successfully!</Alert>
            )}
            {profileError && (
              <Alert severity="error">
                {"data" in profileError &&
                profileError.data &&
                typeof profileError.data === "object" &&
                "message" in profileError.data
                  ? (profileError.data.message as string)
                  : "An error occurred while updating profile"}
              </Alert>
            )}
            <Box>
              {/* <Grid container spacing={2}> */}
              {/* <Grid size={{ xs: 12, sm: 6 }}> */}
              <TextField
                name="name"
                label="Full Name"
                defaultValue={displayUser.name}
                fullWidth
                required
                disabled={isUpdatingProfile}
              />
              {/* </Grid> */}
              {/* <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  defaultValue={displayUser.email}
                  fullWidth
                  required
                  disabled={isUpdatingProfile}
                />
              </Grid> */}
            </Box>
            <Button
              type="submit"
              variant="contained"
              disabled={isUpdatingProfile}
              startIcon={
                isUpdatingProfile ? <CircularProgress size={20} /> : null
              }
              sx={{ alignSelf: "flex-start" }}
            >
              {isUpdatingProfile ? "Updating..." : "Update Profile"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Change Password" />
        <CardContent>
          <Box
            component="form"
            onSubmit={handlePasswordSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {passwordSuccess && (
              <Alert severity="success">Password updated successfully!</Alert>
            )}
            {passwordError && (
              <Alert severity="error">
                {"data" in passwordError &&
                passwordError.data &&
                typeof passwordError.data === "object" &&
                "message" in passwordError.data
                  ? (passwordError.data.message as string)
                  : "An error occurred while updating password"}
              </Alert>
            )}
            <TextField
              name="current_password"
              label="Current Password"
              type="password"
              fullWidth
              required
              disabled={isUpdatingPassword}
            />
            <TextField
              name="new_password"
              label="New Password"
              type="password"
              fullWidth
              required
              disabled={isUpdatingPassword}
            />
            <TextField
              name="new_password_confirmation"
              label="Confirm New Password"
              type="password"
              fullWidth
              required
              disabled={isUpdatingPassword}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isUpdatingPassword}
              startIcon={
                isUpdatingPassword ? <CircularProgress size={20} /> : null
              }
              sx={{ alignSelf: "flex-start" }}
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Logout Section */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Account Actions
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            disabled={isLoggingOut}
            startIcon={isLoggingOut ? <CircularProgress size={20} /> : null}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};
