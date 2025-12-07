import { useAppSelector } from "@/app/hooks";
import FilterSidebar from "@/features/category/components/FilterSidebar";
import SubcategoriesList from "@/features/category/components/SubcategoriesList";
import { layoutMath } from "../themePrimitives";

export default function Sidebar() {
  const navigation = useAppSelector((state) => state.navigation);

  const currentCategoryId = navigation.data.categoryId as number | null;
  // Hide sidebar on all routes except category and product pages
  if (
    !["category", "product"].includes(navigation.route) ||
    !currentCategoryId
  ) {
    return null;
  }

  // Desktop sidebar content (SubcategoriesList + FilterSidebar only on category pages)
  return (
    <nav
      className="hidden sm:block flex-shrink-0"
      style={{ width: `${layoutMath.sidebarWidth}px` }}
    >
      {/* Desktop sidebar - HTML block instead of Drawer */}
      <aside
        className="h-full bg-background border-r border-border"
        style={{
          width: `${layoutMath.sidebarWidth}px`,
          boxSizing: "border-box",
          zIndex: 1200,
        }}
      >
        <div className="h-full flex flex-col">
          <SubcategoriesList currentCategoryId={currentCategoryId} />
          {navigation.route === "category" && currentCategoryId && (
            <div className="hidden sm:block">
              <FilterSidebar categoryId={currentCategoryId} />
            </div>
          )}
        </div>
      </aside>
    </nav>
  );
}
