import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Divider,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

import { useCart } from "./useCart";
import { formatPriceRub } from "./cartUtils";
import { useTranslation } from "react-i18next";

export default function CartPage() {
  const { t } = useTranslation();
  const {
    items,
    count,
    total,
    isLoading,
    updateItemQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const handleQuantityChange = async (
    productId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
    try {
      await updateItemQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      await removeItem(productId);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  if (isLoading) {
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
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Button
            component={RouterLink}
            to="/"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            size="small"
          >
            {t("cart.continueShopping")}
          </Button>
          <Typography variant="h4" component="h1">
            {t("cart.shoppingCart")}
          </Typography>
        </Stack>

        {items.length > 0 && (
          <Typography variant="body1" color="text.secondary">
            {t("cart.itemsInCart", { count })}
          </Typography>
        )}
      </Box>

      {items.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <ShoppingCartIcon
            sx={{ fontSize: 120, color: "text.secondary", mb: 3 }}
          />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {t("cart.yourCartIsEmpty")}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t("cart.looksLikeEmpty")}
          </Typography>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            size="large"
          >
            {t("cart.startShopping")}
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Cart Items */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Stack spacing={2}>
              {items.map((item) => (
                <Card key={item.product_id} variant="outlined">
                  <CardContent>
                    <Grid container spacing={3} alignItems="center">
                      {/* Product Image */}
                      <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                        <CardMedia
                          component="img"
                          image={
                            item.product.imageUrl &&
                            item.product.imageUrl.length > 0
                              ? item.product.imageUrl
                              : "/assets/no-photo.jpeg"
                          }
                          alt={item.product.title}
                          sx={{
                            height: 120,
                            objectFit: "cover",
                            borderRadius: 1,
                          }}
                        />
                      </Grid>

                      {/* Product Details */}
                      <Grid size={{ xs: 12, sm: 6, md: 5, xl: 6 }}>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {item.product.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="primary"
                          fontWeight="bold"
                        >
                          {formatPriceRub(item.product.price)}
                        </Typography>
                      </Grid>

                      {/* Quantity Controls */}
                      <Grid size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          justifyContent="center"
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(
                                item.product_id,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                          >
                            <RemoveIcon />
                          </IconButton>

                          <TextField
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10);
                              if (!isNaN(value) && value > 0) {
                                handleQuantityChange(item.product_id, value);
                              }
                            }}
                            size="small"
                            sx={{ width: 80 }}
                            inputProps={{
                              min: 1,
                              style: { textAlign: "center" },
                            }}
                          />

                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(
                                item.product_id,
                                item.quantity + 1
                              )
                            }
                          >
                            <AddIcon />
                          </IconButton>

                          <IconButton
                            size="small"
                            onClick={() => handleRemoveItem(item.product_id)}
                            color="error"
                            sx={{ ml: 1 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            {/* Clear Cart Button */}
            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleClearCart}
                startIcon={<DeleteIcon />}
              >
                {t("cart.clearCart")}
              </Button>
            </Box>
          </Grid>

          {/* Cart Summary */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card variant="outlined" sx={{ position: "sticky", top: 20 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t("cart.orderSummary")}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="body1">
                    {t("common.items")} ({count}):
                  </Typography>
                  <Typography variant="body1">
                    {formatPriceRub(total)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="body1">{t("cart.shipping")}:</Typography>
                  <Typography variant="body1" color="text.secondary">
                    {t("cart.calculatedAtCheckout")}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6">{t("common.total")}:</Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatPriceRub(total)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled
                  sx={{ py: 1.5, mb: 2 }}
                >
                  {t("cart.checkoutComingSoon")}
                </Button>

                <Button
                  component={RouterLink}
                  to="/"
                  variant="outlined"
                  size="large"
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  {t("cart.continueShopping")}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
