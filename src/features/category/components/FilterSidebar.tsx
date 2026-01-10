import { useGetProductsQuery, selectFiltersArray } from "@/app/apiSlice";
import type { Filter } from "@/features/category/categoryApi";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { useAppSelector } from "@/app/hooks";
import { selectFilters } from "@/features/category/filtersSlice";
import FilterTextField from "./FilterTextField";
import FilterRange from "./FilterRange";
import FilterSelect from "./FilterSelect";
import FilterCheckboxes from "./FilterCheckboxes";
import FilterSingleCheckbox from "./FilterSingleCheckbox";

interface FilterSidebarProps {
  categoryId: number | null;
}

function renderFilter(filter: Filter) {
  switch (filter.filterType) {
    case "textfield":
      return <FilterTextField filter={filter} />;
    case "range":
      return <FilterRange filter={filter} />;
    case "select":
      return <FilterSelect filter={filter} />;
    case "checkboxes":
      return <FilterCheckboxes filter={filter} />;
    case "single checkbox":
      return <FilterSingleCheckbox filter={filter} />;
    default:
      return null;
  }
}

export default function FilterSidebar({ categoryId }: FilterSidebarProps) {
  const currentFilters = useAppSelector(selectFilters);

  if (!categoryId) {
    return null;
  }

  // Construct query args matching ProductList
  const queryArgs = {
    category_id: categoryId,
    filters:
      Object.keys(currentFilters).length > 0 ? currentFilters : undefined,
    page: 1,
    perPage: 12,
  };

  // Use useGetProductsQuery to get loading/error states
  const { isLoading, isError } = useGetProductsQuery(queryArgs, {
    skip: !categoryId,
  });

  // Use selector to get filters from query cache
  const filters = useAppSelector(selectFiltersArray(queryArgs));

  if (isLoading) {
    return (
      <div className="p-2">
        <Skeleton className="h-6 w-[60%]" />
        <Skeleton className="h-10 w-full mt-2" />
        <Skeleton className="h-6 w-[60%] mt-2" />
        <Skeleton className="h-10 w-full mt-2" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-2">
        <Alert className="text-sm">Failed to load filters</Alert>
      </div>
    );
  }

  if (!filters || filters.length === 0) {
    return null;
  }

  return (
    <div>
      <Separator className="my-2" />
      <div className="px-2 pb-1">
        <h6 className="text-lg font-semibold">Filters</h6>
      </div>
      <Card className="mb-2 rounded-none border-0">
        <CardContent className="p-2">
          {filters.map((filter) => (
            <div key={filter.id} className="mb-6 last:mb-0">
              {renderFilter(filter)}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
