import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Stack,
  Button,
  Card,
  CardContent,
  CardMedia,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectIsDrawerOpen, closeDrawer } from "./cartSlice";
import { useCart } from "./useCart";
import { formatPriceRub } from "./cartUtils";
import { useTranslation } from "react-i18next";

interface CartDrawerProps {
  onNavigateToCart?: () => void;
}

export default function CartDrawer({ onNavigateToCart }: CartDrawerProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsDrawerOpen);
  const { items, count, total, isLoading, updateItemQuantity, removeItem } =
    useCart();

  const handleClose = () => {
    dispatch(closeDrawer());
  };

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

  const handleViewCart = () => {
    handleClose();
    onNavigateToCart?.();
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: 400 },
          maxWidth: "100vw",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" component="h2">
              {t("cart.shoppingCart")} ({count})
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : items.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <ShoppingCartIcon
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {t("cart.yourCartIsEmpty")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("cart.addSomeItems")}
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {items.map((item) => (
                <Card key={item.product_id} variant="outlined">
                  <CardContent sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2}>
                      {/* Product Image */}
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
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 1,
                        }}
                      />

                      {/* Product Details */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="subtitle2"
                          component="h3"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            mb: 1,
                          }}
                        >
                          {item.product.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="primary"
                          fontWeight="bold"
                          sx={{ mb: 1 }}
                        >
                          {formatPriceRub(item.product.price)}
                        </Typography>

                        {/* Quantity Controls */}
                        <Stack direction="row" alignItems="center" spacing={1}>
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
                            <RemoveIcon fontSize="small" />
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
                            sx={{ width: 60 }}
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
                            <AddIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            onClick={() => handleRemoveItem(item.product_id)}
                            color="error"
                            sx={{ ml: "auto" }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>

        {/* Footer */}
        {items.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
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
                  sx={{ py: 1.5 }}
                >
                  {t("cart.checkoutComingSoon")}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={handleViewCart}
                  sx={{ py: 1.5 }}
                >
                  {t("cart.viewCart")}
                </Button>
              </Stack>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}
