import React, { useEffect, useState } from "react";
import {
  useNavigate,
  Link as RouterLink,
  useSearchParams,
} from "react-router-dom";

import Box from "@mui/material/Box";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import {
  Typography,
  FormControl,
  FormLabel,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
} from "@mui/material";

import { useResetPasswordMutation } from "./authApi";

interface ResetPasswordPageFormFields extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
  password_confirmation: HTMLInputElement;
}
interface ResetPasswordPageFormElements extends HTMLFormElement {
  readonly elements: ResetPasswordPageFormFields;
}

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

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
      <Alert severity="error" sx={{ mb: 2 }}>
        {errorMessage}
      </Alert>
    );
  }

  if (isSuccess) {
    successRender = (
      <Alert severity="success" sx={{ mb: 2 }}>
        Password has been successfully reset! You will be redirected to the
        login page shortly.
      </Alert>
    );
  }

  if (!token || !email) {
    return (
      <Card variant="outlined">
        <Alert severity="error">
          Invalid or missing reset token. Please request a new password reset.
        </Alert>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Link
            component={RouterLink}
            to="/user/forgot-password"
            variant="body2"
          >
            Request new password reset
          </Link>
        </Box>
      </Card>
    );
  }

  return (
    <Card variant="outlined">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Reset Password
      </Typography>
      <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
        Enter your new password below.
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 2,
        }}
      >
        {errorRender}
        {successRender}
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            id="email"
            type="email"
            name="email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            autoComplete="email"
            required
            fullWidth
            variant="outlined"
            disabled={isLoading || isSuccess}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">New Password</FormLabel>
          <TextField
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="new-password"
            required
            fullWidth
            variant="outlined"
            disabled={isLoading || isSuccess}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password_confirmation">
            Confirm New Password
          </FormLabel>
          <TextField
            name="password_confirmation"
            placeholder="••••••"
            type="password"
            id="password_confirmation"
            autoComplete="new-password"
            required
            fullWidth
            variant="outlined"
            disabled={isLoading || isSuccess}
          />
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading || isSuccess}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading
            ? "Resetting..."
            : isSuccess
              ? "Password Reset"
              : "Reset Password"}
        </Button>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Link component={RouterLink} to="/user/login" variant="body2">
            Back to Sign in
          </Link>
        </Box>
      </Box>
    </Card>
  );
};
