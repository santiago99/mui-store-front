import { useParams, Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import Link from "@mui/material/Link";

import { useGetProductQuery } from "@/app/apiSlice";
import { useCart } from "@/features/cart/useCart";
import { useTranslation } from "react-i18next";

function formatPriceRub(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductPage() {
  const { t } = useTranslation();
  const { productId } = useParams();
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductQuery(productId! as string);

  const [quantity, setQuantity] = useState(1);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const { addItem, isAddingToCart } = useCart();

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addItem(product, quantity);
      setShowSuccessSnackbar(true);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{t("product.failedToLoadProduct")}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardMedia
              component="img"
              image={
                product?.imageUrl && product.imageUrl.length > 0
                  ? product.imageUrl
                  : "/assets/no-photo.jpeg"
              }
              alt={product?.title || "Product image"}
              sx={{
                height: { xs: 300, md: 500 },
                objectFit: "cover",
              }}
            />
          </Card>
        </Grid>

        {/* Product Details and Add to Cart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={3}>
            {/* Product Title */}
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {isLoading ? (
                  <Skeleton variant="text" width="100%" height={48} />
                ) : (
                  product?.title
                )}
              </Typography>

              {/* Category Chip */}
              {/* {product?.category && (
                <Chip
                  label={product.category.name}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
              )} */}
            </Box>

            {/* Price */}
            <Box>
              <Typography variant="h3" color="primary" fontWeight="bold">
                {isLoading ? (
                  <Skeleton variant="text" width={200} height={48} />
                ) : product?.price ? (
                  formatPriceRub(product.price)
                ) : (
                  ""
                )}
              </Typography>
            </Box>

            <Divider />

            {/* Add to Cart Form */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t("product.addToCart")}
                </Typography>

                <Stack spacing={2} sx={{ mt: 2 }}>
                  {/* Quantity Input */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      {t("common.quantity")}
                    </Typography>
                    <TextField
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      inputProps={{ min: 1 }}
                      size="small"
                      sx={{ width: 120 }}
                      disabled={isLoading}
                    />
                  </Box>

                  {/* Add to Cart Button */}
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleAddToCart}
                    disabled={isLoading || isAddingToCart}
                    sx={{ py: 1.5 }}
                  >
                    {isAddingToCart
                      ? t("product.adding")
                      : t("product.addToCart")}
                  </Button>

                  {/* Buy Now Button */}
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    disabled={isLoading}
                    sx={{ py: 1.5 }}
                  >
                    {t("product.buyNow")}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Product Description and Properties - Full Width */}
      <Box sx={{ mt: 4 }}>
        <Stack spacing={4}>
          {/* Product Description */}
          {(!isLoading && product?.description) || isLoading ? (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t("common.description")}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {isLoading ? (
                    <Skeleton variant="text" width="100%" height={60} />
                  ) : (
                    product?.description || ""
                  )}
                </Typography>
              </CardContent>
            </Card>
          ) : null}

          {/* Additional Information */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t("product.additionalInformation")}
              </Typography>
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    SKU:
                  </Typography>
                  <Typography variant="body2">
                    {isLoading ? <Skeleton width={60} /> : product?.sku || "—"}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Brand:
                  </Typography>
                  <Typography variant="body2">
                    {isLoading ? (
                      <Skeleton width={100} />
                    ) : product?.brand ? (
                      <Link
                        component={RouterLink}
                        to={`/brands/${product.brand.slug}`}
                        underline="hover"
                      >
                        {product.brand.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </Typography>
                </Box>
                {product?.fields && product.fields.length > 0 && (
                  <>
                    <Divider />
                    {product.fields.map((field) => (
                      <Box
                        key={field.id}
                        display="flex"
                        justifyContent="space-between"
                      >
                        <Typography variant="body2" color="text.secondary">
                          {field.name}:
                        </Typography>
                        <Typography variant="body2">
                          {field.type === "integer"
                            ? typeof field.value === "number"
                              ? field.value
                              : parseInt(field.value as string, 10)
                            : String(field.value)}
                        </Typography>
                      </Box>
                    ))}
                  </>
                )}
                {/* <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Category:
                  </Typography>
                  <Typography variant="body2">
                    {isLoading ? (
                      <Skeleton width={100} />
                    ) : (
                      product?.category?.name || "N/A"
                    )}
                  </Typography>
                </Box> */}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSuccessSnackbar(false)}
        message={t("product.productAddedToCart")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Container>
  );
}
