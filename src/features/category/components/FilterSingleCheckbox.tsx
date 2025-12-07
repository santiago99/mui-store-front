import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Filter } from "@/features/category/categoryApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setFilter, selectFilterValue } from "@/features/category/filtersSlice";

interface FilterSingleCheckboxProps {
  filter: Filter;
}

export default function FilterSingleCheckbox({
  filter,
}: FilterSingleCheckboxProps) {
  const dispatch = useAppDispatch();
  const filterValue = useAppSelector(selectFilterValue(filter.id));
  const isChecked = (filterValue as string) === "true";

  const handleCheckedChange = (checked: boolean) => {
    dispatch(
      setFilter({
        filterId: filter.id,
        value: checked ? "true" : "",
      })
    );
  };

  return (
    <div className="mb-2 flex items-center space-x-2">
      <Checkbox
        id={`filter-${filter.id}`}
        checked={isChecked}
        onCheckedChange={(checked) =>
          handleCheckedChange(checked === true)
        }
      />
      <Label
        htmlFor={`filter-${filter.id}`}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {filter.name}
      </Label>
    </div>
  );
}
