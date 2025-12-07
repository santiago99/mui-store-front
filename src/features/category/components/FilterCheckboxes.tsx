import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Filter } from "@/features/category/categoryApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setFilter, selectFilterValue } from "@/features/category/filtersSlice";

interface FilterCheckboxesProps {
  filter: Filter;
}

export default function FilterCheckboxes({ filter }: FilterCheckboxesProps) {
  const dispatch = useAppDispatch();
  const filterValue = useAppSelector(selectFilterValue(filter.id));
  const selectedValues = (filterValue as string[]) || [];
  const hasOptions = filter.filterOptions && filter.filterOptions.length > 0;

  const handleCheckedChange = (optionValue: string, checked: boolean) => {
    let newValues: string[];
    if (checked) {
      newValues = [...selectedValues, optionValue];
    } else {
      newValues = selectedValues.filter((v) => v !== optionValue);
    }

    dispatch(
      setFilter({
        filterId: filter.id,
        value: newValues,
      })
    );
  };

  return (
    <div className="mb-2">
      <Label className="text-sm font-medium mb-2 block">{filter.name}</Label>
      <div className="mt-1">
        {hasOptions ? (
          <div className="space-y-2">
            {filter.filterOptions!.map((option) => {
              const slug = option.value
                .toString()
                .toLowerCase()
                .replace(/ /g, "-");
              const id = `filter-${filter.id}-${slug}`;
              const isChecked = selectedValues.includes(option.value);
              return (
                <div
                  key={`${filter.id}-${slug}`}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={id}
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      handleCheckedChange(option.value, checked === true)
                    }
                  />
                  <Label
                    htmlFor={id}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.displayValue}{" "}
                    {option.count > 0 && `(${option.count})`}
                  </Label>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No options available</p>
        )}
      </div>
    </div>
  );
}
