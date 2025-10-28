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
import { useLoginMutation, useLazyGetCurrentUserQuery } from "./authApi";
import { SignInContainer } from "@/theme/components/SignInContainer";
import { selectLocalCartItems } from "@/features/cart/cartSlice";
import { useTranslation } from "react-i18next";

interface LoginPageFormFields extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}
interface LoginPageFormElements extends HTMLFormElement {
  readonly elements: LoginPageFormFields;
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
          {t("auth.signIn")}
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
            <FormLabel htmlFor="email">{t("common.email")}</FormLabel>
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder={t("auth.yourEmail")}
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              disabled={isLoading}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">{t("common.password")}</FormLabel>
            <TextField
              name="password"
              placeholder={t("auth.passwordPlaceholder")}
              type="password"
              id="password"
              autoComplete="current-password"
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
            {isLoading ? t("auth.signingIn") : t("auth.signIn")}
          </Button>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Link component={RouterLink} to="/user/register" variant="body2">
              {t("auth.dontHaveAccount")}
            </Link>
            <br />
            <Link
              component={RouterLink}
              to="/user/forgot-password"
              variant="body2"
            >
              {t("auth.forgotPassword")}
            </Link>
          </Box>
        </Box>
      </Card>
    </SignInContainer>
  );
};
