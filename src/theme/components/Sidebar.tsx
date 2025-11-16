import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { useGetCategoryQuery, useGetProductQuery } from "@/app/apiSlice";
import { useAppSelector } from "@/app/hooks";
import FilterSidebar from "@/features/category/components/FilterSidebar";
import CategoriesTree from "@/features/category/components/CategoriesTree";
import { layoutMath } from "../themePrimitives";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigation = useAppSelector((state) => state.navigation);

  let currentCategoryId = null;
  let currentProductId = null;

  if (navigation.route === "category") {
    currentCategoryId = navigation.data.categoryId as number;
  } else if (navigation.route === "product") {
    currentProductId = navigation.data.productId as string;
  }

  // Get product data if we're on a product page
  const { data: product } = useGetProductQuery(currentProductId!, {
    skip: !currentProductId,
  });

  // If we have a product, get its category ID
  if (product) {
    currentCategoryId = product.categoryId as number;
  }

  // Get current category data if we're on a category page or have a product
  const { data: currentCategory } = useGetCategoryQuery(currentCategoryId!, {
    skip: !currentCategoryId,
  });

  // Extract ancestors for auto-expansion
  const currentCategoryAncestors = currentCategory?.ancestors || [];

  // Mobile drawer content (categories tree only, no FilterSidebar)
  const mobileDrawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CategoriesTree
        onClose={onClose}
        currentCategoryId={currentCategoryId}
        currentCategoryAncestors={currentCategoryAncestors}
      />
    </Box>
  );

  // Desktop sidebar content (categories tree + FilterSidebar)
  const desktopSidebarContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CategoriesTree
        onClose={onClose}
        currentCategoryId={currentCategoryId}
        currentCategoryAncestors={currentCategoryAncestors}
      />
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <FilterSidebar
          categoryId={currentCategoryId ? (currentCategoryId as number) : null}
        />
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: layoutMath.sidebarWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile only drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: layoutMath.sidebarWidth,
          },
        }}
      >
        {mobileDrawerContent}
      </Drawer>
      {/* Desktop sidebar - HTML block instead of Drawer */}
      <Box
        component="aside"
        sx={{
          display: { xs: "none", sm: "block" },
          width: layoutMath.sidebarWidth,
          boxSizing: "border-box",
          borderColor: "divider",
          backgroundColor: "background.paper",
          zIndex: (theme) => theme.zIndex.drawer,
        }}
      >
        {desktopSidebarContent}
      </Box>
    </Box>
  );
}
