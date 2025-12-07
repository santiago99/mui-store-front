import { useGetCategoryFiltersQuery } from "@/app/apiSlice";
import type { Filter } from "@/features/category/categoryApi";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
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
      return <FilterTextField key={filter.id} filter={filter} />;
    case "range":
      return <FilterRange key={filter.id} filter={filter} />;
    case "select":
      return <FilterSelect key={filter.id} filter={filter} />;
    case "checkboxes":
      return <FilterCheckboxes key={filter.id} filter={filter} />;
    case "single checkbox":
      return <FilterSingleCheckbox key={filter.id} filter={filter} />;
    default:
      return null;
  }
}

export default function FilterSidebar({ categoryId }: FilterSidebarProps) {
  const {
    data: filters,
    isLoading,
    isError,
  } = useGetCategoryFiltersQuery(categoryId!, {
    skip: !categoryId,
  });

  if (!categoryId) {
    return null;
  }

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

  // Sort filters by filterWeight (ascending)
  const sortedFilters = [...filters].sort(
    (a, b) => a.filterWeight - b.filterWeight
  );

  return (
    <div>
      <Separator className="my-2" />
      <div className="px-2 pb-1">
        <h6 className="text-lg font-semibold">Filters</h6>
      </div>
      <Card className="mb-2 rounded-none border-0">
        <CardContent className="p-2">
          {sortedFilters.map(renderFilter)}
        </CardContent>
      </Card>
    </div>
  );
}
