import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

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

import { useRequestPasswordResetMutation } from "./authApi";

interface ForgotPasswordPageFormFields extends HTMLFormControlsCollection {
  email: HTMLInputElement;
}
interface ForgotPasswordPageFormElements extends HTMLFormElement {
  readonly elements: ForgotPasswordPageFormFields;
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
      <Alert severity="error" sx={{ mb: 2 }}>
        {errorMessage}
      </Alert>
    );
  }

  if (isSuccess) {
    successRender = (
      <Alert severity="success" sx={{ mb: 2 }}>
        Password reset link has been sent to {email}. Please check your email
        and follow the instructions to reset your password.
      </Alert>
    );
  }

  return (
    <Card variant="outlined">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Forgot Password
      </Typography>
      <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
        Enter your email address and we'll send you a link to reset your
        password.
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
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
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
            ? "Sending..."
            : isSuccess
              ? "Email Sent"
              : "Send Reset Link"}
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
