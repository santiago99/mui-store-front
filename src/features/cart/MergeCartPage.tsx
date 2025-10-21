import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ShoppingCart as ShoppingCartIcon } from "@mui/icons-material";

import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { selectIsAuthenticated } from "@/features/auth/authSlice";
import { selectLocalCartItems } from "./cartSlice";
import { useMergeCartMutation } from "./cartApi";
import { clearLocalCart } from "./cartSlice";
import { formatCartItemsForMerge } from "./cartUtils";

export default function MergeCartPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const localCartItems = useAppSelector(selectLocalCartItems);
  const [mergeCart, { isLoading, error }] = useMergeCartMutation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/user/login");
    }
  }, [isAuthenticated, navigate]);

  // Redirect if no local cart items
  useEffect(() => {
    if (isAuthenticated && localCartItems.length === 0) {
      navigate("/");
    }
  }, [isAuthenticated, localCartItems.length, navigate]);

  const handleMerge = async () => {
    try {
      const itemsToMerge = formatCartItemsForMerge(localCartItems);
      await mergeCart({ items: itemsToMerge }).unwrap();
      dispatch(clearLocalCart());
      navigate("/");
    } catch (error) {
      console.error("Failed to merge cart:", error);
    }
  };

  const handleKeepServerCart = () => {
    dispatch(clearLocalCart());
    navigate("/");
  };

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Show loading while checking local cart
  if (localCartItems.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        <Card variant="outlined">
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3} alignItems="center" textAlign="center">
              <ShoppingCartIcon sx={{ fontSize: 80, color: "primary.main" }} />

              <Typography variant="h4" component="h1" gutterBottom>
                Merge Your Cart
              </Typography>

              <Typography variant="body1" color="text.secondary">
                You have items in your cart from before you logged in. Would you
                like to merge them with your account's cart?
              </Typography>

              <Box sx={{ width: "100%", py: 2 }}>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  Items in your local cart:
                </Typography>
                <Typography variant="h6" color="primary">
                  {localCartItems.length}{" "}
                  {localCartItems.length === 1 ? "item" : "items"}
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ width: "100%" }}>
                  Failed to merge cart. Please try again.
                </Alert>
              )}

              <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                <Button
                  variant="outlined"
                  onClick={handleKeepServerCart}
                  disabled={isLoading}
                  sx={{ flex: 1 }}
                >
                  Keep Server Cart
                </Button>
                <Button
                  variant="contained"
                  onClick={handleMerge}
                  disabled={isLoading}
                  sx={{ flex: 1 }}
                  startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                  {isLoading ? "Merging..." : "Merge Cart"}
                </Button>
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                <strong>Merge:</strong> Add your local cart items to your
                account's cart
                <br />
                <strong>Keep Server Cart:</strong> Discard local items and keep
                only your account's cart
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
