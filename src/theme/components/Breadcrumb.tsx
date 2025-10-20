import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import { Link as RouterLink } from "react-router-dom";

import { useAppSelector } from "@/app/hooks";
import { useGetCategoryQuery, useGetProductQuery } from "@/app/apiSlice";
import type { CategoryMinimal } from "@/features/category/categoryApi";

export default function Breadcrumb() {
  const navigation = useAppSelector((state) => state.navigation);

  let currentCategoryId = null;
  let currentProductId = null;
  let currentProduct = null;
  let currentCategory = null;

  if (navigation.route === "category") {
    currentCategoryId = navigation.data.categoryId as number;
  } else if (navigation.route === "product") {
    currentProductId = navigation.data.productId as number;
  }

  // Get product data if we're on a product page
  const { data: product } = useGetProductQuery(currentProductId!, {
    skip: !currentProductId,
  });

  // If we have a product, get its category ID
  if (product) {
    currentProduct = product;
    currentCategoryId = product.categoryId as number;
  }

  // Get current category data if we're on a category page or have a product
  const { data: category } = useGetCategoryQuery(currentCategoryId!, {
    skip: !currentCategoryId,
  });

  if (category) {
    currentCategory = category;
  }

  // Don't show breadcrumb if we cant get category data
  if (!currentCategoryId || !currentCategory) {
    return null;
  }

  const ancestors = currentCategory.ancestors || [];

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ my: 2 }}
    >
      {/* Home link */}
      <Link
        component={RouterLink}
        to="/"
        sx={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          color: "text.secondary",
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
      </Link>

      {/* Ancestor categories */}
      {ancestors.map((ancestor: CategoryMinimal) => (
        <Link
          key={ancestor.id}
          component={RouterLink}
          to={`/category/${ancestor.id}`}
          sx={{
            textDecoration: "none",
            color: "text.secondary",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          {ancestor.name}
        </Link>
      ))}

      {/* Current category (clickable if on product page) */}
      {currentProduct ? (
        <Link
          component={RouterLink}
          to={`/category/${currentCategory.id}`}
          sx={{
            textDecoration: "none",
            color: "text.secondary",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          {currentCategory.name}
        </Link>
      ) : (
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>
          {currentCategory.name}
        </Typography>
      )}

      {/* Product name (only shown on product page) */}
      {currentProduct && (
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>
          {currentProduct.title}
        </Typography>
      )}
    </Breadcrumbs>
  );
}
