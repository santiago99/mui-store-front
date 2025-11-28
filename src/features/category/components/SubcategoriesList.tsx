import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/app/hooks";
import {
  selectCategoryChildren,
  selectCategoryFromCache,
} from "@/features/category/categoriesSlice";
import type { Category } from "@/features/category/categoryApi";
import { cn } from "@/lib/utils";

export interface SubcategoriesListProps {
  currentCategoryId: number | null;
}

export default function SubcategoriesList({
  currentCategoryId,
}: SubcategoriesListProps) {
  const { t } = useTranslation();

  const children = useAppSelector((state) =>
    selectCategoryChildren(state, currentCategoryId)
  );

  const category = useAppSelector((state) =>
    selectCategoryFromCache(state, currentCategoryId)
  );

  const siblings = useAppSelector((state) =>
    selectCategoryChildren(state, category ? category.parentId : null)
  );

  const hasChildren = children.length > 0;
  const categoriesToDisplay = hasChildren ? children : siblings;

  if (categoriesToDisplay.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="px-4 py-2 border-b border-border">
        <h6 className="text-lg font-semibold">
          {hasChildren
            ? t("sidebar.subcategories")
            : t("sidebar.relatedCategories")}
        </h6>
      </div>
      <ul className="list-none p-0 m-0">
        {categoriesToDisplay.map((category: Category) => {
          const isActive =
            currentCategoryId &&
            currentCategoryId.toString() === category.id.toString();

          return (
            <li key={category.id} className="p-0">
              <RouterLink
                to={`/category/${category.id}`}
                className={cn(
                  "block px-4 py-2 no-underline transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-accent/50"
                )}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{category.name}</span>
                  {category.productsCount && category.productsCount > 0 && (
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {category.productsCount} {t("sidebar.products")}
                    </span>
                  )}
                </div>
              </RouterLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
