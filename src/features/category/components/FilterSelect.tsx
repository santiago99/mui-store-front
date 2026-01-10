import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Filter } from "@/features/category/categoryApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setFilter, selectFilterValue } from "@/features/category/filtersSlice";
import FilterLabel from "./FilterLabel";

interface FilterSelectProps {
  filter: Filter;
}

export default function FilterSelect({ filter }: FilterSelectProps) {
  const dispatch = useAppDispatch();
  const filterValue = useAppSelector(selectFilterValue(filter.id));
  const currentValue = (filterValue as string) || "";
  const hasOptions = filter.filterOptions && filter.filterOptions.length > 0;

  const handleValueChange = (value: string) => {
    dispatch(
      setFilter({
        filterId: filter.id,
        value: value || "",
      })
    );
  };

  return (
    <div className="mb-2">
      <FilterLabel filter={filter} />
      <Select
        disabled={!hasOptions}
        value={currentValue}
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-full h-9 mt-1">
          <SelectValue placeholder={filter.name} />
        </SelectTrigger>
        <SelectContent>
          {hasOptions ? (
            filter.filterOptions!.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.displayValue} {option.count > 0 && `(${option.count})`}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="-">
              <em>No options available</em>
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
