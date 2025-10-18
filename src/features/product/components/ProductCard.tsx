import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Link as RouterLink } from "react-router-dom";

import type { Product } from "@/features/product/productApi";

function formatPriceRub(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
}

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard(props: ProductCardProps) {
  const { product, onAddToCart } = props;

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
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
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={1}>
          <Typography gutterBottom variant="subtitle1" component="div" noWrap>
            {product.title}
          </Typography>
          <Typography variant="h6" color="text.primary">
            {formatPriceRub(product.price)}
          </Typography>
        </Stack>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button
          size="small"
          variant="outlined"
          component={RouterLink}
          to={`/product/${product.id}`}
        >
          Learn more
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={() => onAddToCart?.(product)}
        >
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
}
