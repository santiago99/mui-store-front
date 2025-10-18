import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import { Link as RouterLink } from "react-router-dom";

import { useAppSelector } from "@/app/hooks";
import { useGetCategoryQuery } from "@/app/apiSlice";
import type { CategoryMinimal } from "@/features/category/categoryApi";

export default function Breadcrumb() {
  const navigation = useAppSelector((state) => state.navigation);

  let currentCategoryId = null;
  if (navigation.route === "category") {
    currentCategoryId = navigation.data.categoryId as number;
  } else if (navigation.route === "product") {
    currentCategoryId = navigation.data.productId as number;
  }

  // Get current category data if we're on a category page
  const { data: currentCategory } = useGetCategoryQuery(currentCategoryId!, {
    skip: !currentCategoryId,
  });

  // Don't show breadcrumb on frontpage
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

      {/* Current category (not clickable) */}
      <Typography color="text.primary" sx={{ fontWeight: 500 }}>
        {currentCategory.name}
      </Typography>
    </Breadcrumbs>
  );
}
