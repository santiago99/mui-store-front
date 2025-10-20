import React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";

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

import { useAppSelector } from "@/app/hooks";
import { selectAuthData } from "@/features/auth/authSlice";
import { useRegisterMutation, useLazyGetCurrentUserQuery } from "./authApi";

import { SignInContainer } from "@/theme/components/SignInContainer";

interface RegisterPageFormFields extends HTMLFormControlsCollection {
  name: HTMLInputElement;
  email: HTMLInputElement;
  password: HTMLInputElement;
  password_confirmation: HTMLInputElement;
}
interface RegisterPageFormElements extends HTMLFormElement {
  readonly elements: RegisterPageFormFields;
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

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { status: authStatus } = useAppSelector(selectAuthData);
  const [register, { isLoading, error }] = useRegisterMutation();
  const [getCurrentUser] = useLazyGetCurrentUserQuery();

  React.useEffect(() => {
    if (authStatus === "authorized") {
      navigate("/");
    }
  }, [authStatus, navigate]);

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
      navigate("/");
    } catch (err) {
      // Error is handled by the mutation hook
      console.error("Registration failed:", err);
    }
  };

  let errorsRender = null;

  if (error) {
    let errorMessage = "An error occurred during registration";
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
      <Alert severity="error" sx={{ mb: 2 }}>
        {errorMessage}
      </Alert>
    );
  }

  return (
    <SignInContainer>
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Sign up
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
          {errorsRender}
          <FormControl>
            <FormLabel htmlFor="name">Full Name</FormLabel>
            <TextField
              id="name"
              type="text"
              name="name"
              placeholder="John Doe"
              autoComplete="name"
              autoFocus
              required
              fullWidth
              variant="outlined"
              disabled={isLoading}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              required
              fullWidth
              variant="outlined"
              disabled={isLoading}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="new-password"
              required
              fullWidth
              variant="outlined"
              disabled={isLoading}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password_confirmation">
              Confirm Password
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
              disabled={isLoading}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Link component={RouterLink} to="/user/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Box>
        </Box>
      </Card>
    </SignInContainer>
  );
};
