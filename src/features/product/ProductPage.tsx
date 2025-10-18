import { useParams } from "react-router-dom";
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
// import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";

import { useGetProductQuery } from "@/app/apiSlice";
//import type { Product } from "@/features/product/productApi";

function formatPriceRub(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductPage() {
  const { productId } = useParams();
  const productIdNumber = parseInt(productId!, 10);
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductQuery(productIdNumber);

  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log("Adding to cart:", { product, quantity });
  };

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          Failed to load product. Please try again later.
        </Alert>
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
                  Add to Cart
                </Typography>

                <Stack spacing={2} sx={{ mt: 2 }}>
                  {/* Quantity Input */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Quantity
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
                    disabled={isLoading}
                    sx={{ py: 1.5 }}
                  >
                    {isLoading ? "Loading..." : "Add to Cart"}
                  </Button>

                  {/* Buy Now Button */}
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    disabled={isLoading}
                    sx={{ py: 1.5 }}
                  >
                    Buy Now
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Product Description and Properties - Full Width */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {/* Product Description */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {isLoading ? (
                    <Skeleton variant="text" width="100%" height={60} />
                  ) : (
                    "Product description will be displayed here. This is a placeholder for the actual product description that would come from the API."
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Additional Information */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Additional Information
                </Typography>
                <Stack spacing={2}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Product ID:
                    </Typography>
                    <Typography variant="body2">
                      {isLoading ? <Skeleton width={60} /> : product?.id}
                    </Typography>
                  </Box>
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
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
