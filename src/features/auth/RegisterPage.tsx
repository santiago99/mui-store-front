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
          {t("auth.signUp")}
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
            <FormLabel htmlFor="name">{t("auth.fullName")}</FormLabel>
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
            <FormLabel htmlFor="email">{t("common.email")}</FormLabel>
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder={t("auth.yourEmail")}
              autoComplete="email"
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
              autoComplete="new-password"
              required
              fullWidth
              variant="outlined"
              disabled={isLoading}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password_confirmation">
              {t("common.confirmPassword")}
            </FormLabel>
            <TextField
              name="password_confirmation"
              placeholder={t("auth.passwordPlaceholder")}
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
            {isLoading ? t("auth.creatingAccount") : t("auth.signUp")}
          </Button>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Link component={RouterLink} to="/user/login" variant="body2">
              {t("auth.alreadyHaveAccount")}
            </Link>
          </Box>
        </Box>
      </Card>
    </SignInContainer>
  );
};
