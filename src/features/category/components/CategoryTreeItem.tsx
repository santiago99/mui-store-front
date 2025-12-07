import * as React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/app/hooks";
import { selectIsActive } from "@/features/navigation/navigationSlice";
import type { Category } from "@/features/category/categoryApi";
import { cn } from "@/lib/utils";

export interface CategoryTreeItemProps {
  category: Category;
  level: number;
  onClose: () => void;
  currentCategoryId?: number | null;
  currentCategoryAncestors?: Array<{ id: number }>;
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
  const isActive = useAppSelector(selectIsActive(category.id));

  // Check if this category should be expanded based on ancestors
  const shouldBeExpanded =
    currentCategoryAncestors?.some((ancestor) => ancestor.id === category.id) ||
    false;

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

  const paddingLeft = `${1 + level}rem`; // Convert MUI spacing (pl: 2 + level * 2 = 16px base + 16px per level = 1rem + level * 1rem)

  const buttonContent = (
    <>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm font-medium">{category.name}</span>
        {category.productsCount && category.productsCount > 0 && (
          <span className="text-xs text-muted-foreground">
            {category.productsCount} {t("sidebar.products")}
          </span>
        )}
      </div>
      {!isLeaf && (
        <div className="ml-2 flex-shrink-0">
          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      )}
    </>
  );

  const buttonClasses = cn(
    "w-full flex items-center gap-2 py-2 px-2 text-left transition-colors",
    "hover:bg-accent hover:text-accent-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    isActive && "bg-accent text-accent-foreground"
  );

  return (
    <li className="list-none">
      {isLeaf ? (
        <RouterLink
          to={`/category/${category.id}`}
          onClick={onClose}
          className={buttonClasses}
          style={{ paddingLeft }}
        >
          {buttonContent}
        </RouterLink>
      ) : (
        <button
          onClick={handleClick}
          className={buttonClasses}
          style={{ paddingLeft }}
        >
          {buttonContent}
        </button>
      )}
      {!isLeaf && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            open ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <ul className="list-none">
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
          </ul>
        </div>
      )}
    </li>
  );
}
