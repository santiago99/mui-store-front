import * as React from "react";
import { useTheme } from "@mui/material/styles";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTranslation } from "react-i18next";
import { useGetCategoriesTreeQuery } from "@/app/apiSlice";
import type { Category } from "@/features/category/categoryApi";
import CategoryTreeItem from "./CategoryTreeItem";

export interface CategoriesTreeProps {
  onClose: () => void;
  currentCategoryId?: string | number | null;
  currentCategoryAncestors?: Array<{ id: string | number }>;
}

export default function CategoriesTree({
  onClose,
  currentCategoryId,
  currentCategoryAncestors,
}: CategoriesTreeProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data: categories, isLoading, isError } = useGetCategoriesTreeQuery();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          px: 2,
          py: 1,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" component="div">
          {t("sidebar.categories")}
        </Typography>
        <IconButton onClick={onClose} sx={{ display: { sm: "none" } }}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </Box>
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        {isLoading ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t("sidebar.loadingCategories")}
            </Typography>
          </Box>
        ) : isError ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="error">
              {t("sidebar.errorLoadingCategories")}
            </Typography>
          </Box>
        ) : (
          <List>
            {categories?.map((category: Category) => (
              <CategoryTreeItem
                key={category.id}
                category={category}
                level={0}
                onClose={onClose}
                currentCategoryId={currentCategoryId}
                currentCategoryAncestors={currentCategoryAncestors}
              />
            ))}
          </List>
        )}
      </Box>
    </>
  );
}

