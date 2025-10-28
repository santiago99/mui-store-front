import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Link as RouterLink } from "react-router-dom";

import type { Product } from "@/features/product/productApi";
import { useCart } from "@/features/cart/useCart";
import { useTranslation } from "react-i18next";

function formatPriceRub(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
}

export interface ProductCardProps {
  product: Product;
}

export default function ProductCard(props: ProductCardProps) {
  const { t } = useTranslation();
  const { product } = props;
  const { addItem, isAddingToCart } = useCart();

  const handleAddToCart = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await addItem(product, 1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardActionArea
        component={RouterLink}
        to={`/product/${product.id}`}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <CardMedia
          component="img"
          image={
            product.imageUrl.length > 0
              ? product.imageUrl
              : "/assets/no-photo.jpeg"
          }
          alt={product.title}
          sx={{ height: 200, objectFit: "cover" }}
        />
        <CardContent sx={{ flexGrow: 1, width: "100%" }}>
          <Stack spacing={1}>
            <Typography gutterBottom variant="subtitle1" component="div" noWrap>
              {product.title}
            </Typography>
            <Typography variant="h6" color="text.primary">
              {formatPriceRub(product.price)}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
      <CardActions
        sx={{ p: 1, pt: 0, gap: 1, justifyContent: "space-between" }}
      >
        <Button
          size="small"
          variant="text"
          component={RouterLink}
          to={`/product/${product.id}`}
        >
          {t("product.learnMore")}
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? t("product.adding") : t("product.addToCartSmall")}
        </Button>
      </CardActions>
    </Card>
  );
}
