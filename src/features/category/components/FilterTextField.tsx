import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import type { Filter } from "@/features/category/categoryApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setFilter, selectFilterValue } from "@/features/category/filtersSlice";
import { useDebounce } from "@/hooks/useDebounce";
import FilterLabel from "./FilterLabel";

interface FilterTextFieldProps {
  filter: Filter;
}

export default function FilterTextField({ filter }: FilterTextFieldProps) {
  const dispatch = useAppDispatch();
  const filterValue = useAppSelector(selectFilterValue(filter.id));
  const currentValue = (filterValue as string) || "";
  const [localValue, setLocalValue] = useState(currentValue);
  const debouncedValue = useDebounce(localValue, 500);

  // Track if the change is user-initiated (from input) or external (from Redux)
  const isUserChangeRef = useRef(false);
  const lastSyncedValueRef = useRef(currentValue);

  // Sync local value with Redux state when it changes externally
  useEffect(() => {
    // Only sync if Redux state actually changed (external change)
    if (currentValue !== lastSyncedValueRef.current) {
      isUserChangeRef.current = false;
      setLocalValue(currentValue);
      lastSyncedValueRef.current = currentValue;
    }
  }, [currentValue]);

  // Update Redux state when debounced value changes (only for user-initiated changes)
  useEffect(() => {
    // Skip if this is not a user-initiated change
    if (!isUserChangeRef.current) {
      return;
    }

    if (debouncedValue !== currentValue) {
      dispatch(
        setFilter({
          filterId: filter.id,
          value: debouncedValue,
        })
      );
    }
  }, [debouncedValue, dispatch, filter.id, currentValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isUserChangeRef.current = true;
    setLocalValue(e.target.value);
  };

  return (
    <div className="mb-2">
      <FilterLabel filter={filter} />
      <Input
        className="w-full h-9 mt-1"
        placeholder={filter.name}
        value={localValue}
        onChange={handleChange}
      />
    </div>
  );
}
