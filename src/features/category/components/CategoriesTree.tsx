import { ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/app/hooks";
import { useGetCategoriesTreeQuery } from "@/app/apiSlice";
import { selectActiveCategoryId } from "@/features/navigation/navigationSlice";
import type { Category } from "@/features/category/categoryApi";
import { Button } from "@/components/ui/button";
import CategoryTreeItem from "./CategoryTreeItem";

export interface CategoriesTreeProps {
  onClose: () => void;
}

export default function CategoriesTree({ onClose }: CategoriesTreeProps) {
  const { t } = useTranslation();
  const navigation = useAppSelector((state) => state.navigation);
  const currentCategoryId = useAppSelector(selectActiveCategoryId);
  const ancestors = navigation.ancestors || [];
  const { data: categories, isLoading, isError } = useGetCategoriesTreeQuery();

  return (
    <>
      <div className="flex items-center justify-start px-4 py-2 border-b border-border">
        <h6 className="text-lg font-semibold flex-1">
          {t("sidebar.categories")}
        </h6>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="sm:hidden"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="p-4">
            <p className="text-sm text-muted-foreground">
              {t("sidebar.loadingCategories")}
            </p>
          </div>
        ) : isError ? (
          <div className="p-4">
            <p className="text-sm text-destructive">
              {t("sidebar.errorLoadingCategories")}
            </p>
          </div>
        ) : (
          <ul className="list-none">
            {categories?.map((category: Category) => (
              <CategoryTreeItem
                key={category.id}
                category={category}
                level={0}
                onClose={onClose}
                currentCategoryId={currentCategoryId}
                currentCategoryAncestors={ancestors}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
