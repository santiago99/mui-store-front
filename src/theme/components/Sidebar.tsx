import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link as RouterLink } from "react-router-dom";
//import Link from "@mui/material/Link";

import {
  useGetCategoriesTreeQuery, /* , useGetCategoryQuery  */
  useGetCategoryQuery,
} from "@/app/apiSlice";
import type { Category } from "@/features/category/categoryApi";
import { Toolbar } from "@mui/material";
import { useAppSelector } from "@/app/hooks";

const drawerWidth = 280;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface CategoryTreeItemProps {
  category: Category;
  level: number;
  onClose: () => void;
  currentCategoryId?: string | number | null;
  currentCategoryAncestors?: Array<{ id: string | number }>;
}

function CategoryTreeItem({
  category,
  level,
  onClose,
  currentCategoryId,
  currentCategoryAncestors,
}: CategoryTreeItemProps) {
  const isLeaf = category.isLeaf;
  const isActive =
    currentCategoryId &&
    currentCategoryId.toString() === category.id.toString();

  // Check if this category should be expanded based on ancestors
  const shouldBeExpanded = currentCategoryAncestors?.some(
    ancestor => ancestor.id.toString() === category.id.toString()
  ) || false;

  const [open, setOpen] = React.useState(shouldBeExpanded);

  // Update open state when ancestors change
  React.useEffect(() => {
    setOpen(shouldBeExpanded);
  }, [shouldBeExpanded]);

  const handleClick = () => {
    if (!isLeaf) {
      setOpen(!open);
    }
  };


  const linkProps: { [key: string]: any } = {}
  if (isLeaf) {
    linkProps.to = `/category/${category.id}`;
    linkProps.onClick = onClose;
    linkProps.component = RouterLink;
  } else {
    linkProps.onClick = handleClick;
  }

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={handleClick}
          sx={{
            pl: 2 + level * 2,
            py: 0.5,
            backgroundColor: isActive ? "action.selected" : "transparent",
            "&:hover": {
              backgroundColor: isActive ? "action.selected" : "action.hover",
            },
          }}
          {...linkProps}
        >
          <ListItemText
            primary={category.name}
            secondary={
              category.productsCount && category.productsCount > 0 ? (
                <Typography variant="caption" color="text.secondary">
                  {category.productsCount} товаров
                </Typography>
              ) : null
            }
          />
          {!isLeaf && (open ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
        </ListItemButton>
      </ListItem>
      {!isLeaf && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {category.children!.map((child: Category) => (
              <CategoryTreeItem
                key={child.id}
                category={child}
                level={level + 1}
                onClose={onClose}
                currentCategoryId={currentCategoryId}
                currentCategoryAncestors={currentCategoryAncestors}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const theme = useTheme();
  const { data: categories, isLoading, isError } = useGetCategoriesTreeQuery();
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

  // Extract ancestors for auto-expansion
  const currentCategoryAncestors = currentCategory?.ancestors || [];

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" component="div">
          Категории
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
              Загрузка категорий...
            </Typography>
          </Box>
        ) : isError ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="error">
              Ошибка загрузки категорий
            </Typography>
          </Box>
        ) : (
          <List>
            {categories?.map((category) => (
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
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile only drawer  */}
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
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
      {/* Drawer for bigger screens */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        <Toolbar />
        {drawer}
      </Drawer>
    </Box>
  );
}
