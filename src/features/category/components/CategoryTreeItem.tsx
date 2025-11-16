import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Category } from "@/features/category/categoryApi";

type ListItemLinkProps = {
  to?: string;
  onClick?: () => void;
  component?: typeof RouterLink;
};

export interface CategoryTreeItemProps {
  category: Category;
  level: number;
  onClose: () => void;
  currentCategoryId?: string | number | null;
  currentCategoryAncestors?: Array<{ id: string | number }>;
}

export default function CategoryTreeItem({
  category,
  level,
  onClose,
  currentCategoryId,
  currentCategoryAncestors,
}: CategoryTreeItemProps) {
  const { t } = useTranslation();
  const isLeaf = category.isLeaf;
  const isActive =
    currentCategoryId &&
    currentCategoryId.toString() === category.id.toString();

  // Check if this category should be expanded based on ancestors
  const shouldBeExpanded =
    currentCategoryAncestors?.some(
      (ancestor) => ancestor.id.toString() === category.id.toString()
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

  const linkProps: ListItemLinkProps = {};
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
                  {category.productsCount} {t("sidebar.products")}
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

