import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { Filter } from "@/features/category/categoryApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setFilter,
  clearFilter,
  selectFilterValue,
} from "@/features/category/filtersSlice";
import { useDebounce } from "@/hooks/useDebounce";

interface FilterRangeProps {
  filter: Filter;
}

export default function FilterRange({ filter }: FilterRangeProps) {
  const dispatch = useAppDispatch();
  const filterValue = useAppSelector(selectFilterValue(filter.id));
  const defaultMin = filter.min ?? 0;
  const defaultMax = filter.max ?? 100;

  const rangeValue = filterValue as { min: number; max: number } | undefined;
  const currentMin = rangeValue?.min ?? defaultMin;
  const currentMax = rangeValue?.max ?? defaultMax;

  const [localMin, setLocalMin] = useState(currentMin.toString());
  const [localMax, setLocalMax] = useState(currentMax.toString());

  const debouncedMin = useDebounce(localMin, 500);
  const debouncedMax = useDebounce(localMax, 500);

  // Track if the change is user-initiated (from input) or external (from Redux)
  const isUserChangeRef = useRef(false);
  const lastSyncedMinRef = useRef(currentMin);
  const lastSyncedMaxRef = useRef(currentMax);

  // Sync local values with Redux state when it changes externally
  useEffect(() => {
    // Only sync if Redux state actually changed (external change)
    if (
      currentMin !== lastSyncedMinRef.current ||
      currentMax !== lastSyncedMaxRef.current
    ) {
      isUserChangeRef.current = false;
      setLocalMin(currentMin.toString());
      setLocalMax(currentMax.toString());
      lastSyncedMinRef.current = currentMin;
      lastSyncedMaxRef.current = currentMax;
    }
  }, [currentMin, currentMax]);

  // Update Redux state when debounced values change (only for user-initiated changes)
  useEffect(() => {
    // Skip if this is not a user-initiated change
    if (!isUserChangeRef.current) {
      return;
    }

    const minNum = debouncedMin === "" ? defaultMin : Number(debouncedMin);
    const maxNum = debouncedMax === "" ? defaultMax : Number(debouncedMax);

    // Only update if values have actually changed from what's in Redux
    if (minNum !== currentMin || maxNum !== currentMax) {
      // If both values are at defaults and there's a current filter, clear it
      if (
        minNum === defaultMin &&
        maxNum === defaultMax &&
        rangeValue !== undefined
      ) {
        dispatch(clearFilter(filter.id));
      } else if (minNum !== defaultMin || maxNum !== defaultMax) {
        // Only set filter if at least one value is not at default
        dispatch(
          setFilter({
            filterId: filter.id,
            value: { min: minNum, max: maxNum },
          })
        );
      }
    }
  }, [
    debouncedMin,
    debouncedMax,
    dispatch,
    filter.id,
    currentMin,
    currentMax,
    defaultMin,
    defaultMax,
    rangeValue,
  ]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    isUserChangeRef.current = true;
    setLocalMin(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    isUserChangeRef.current = true;
    setLocalMax(value);
  };

  const handleSliderChange = (values: number[]) => {
    const [min, max] = values;
    isUserChangeRef.current = true;
    setLocalMin(min.toString());
    setLocalMax(max.toString());
  };

  // Convert local state to numbers for real-time slider updates
  const sliderMin = localMin === "" ? defaultMin : Number(localMin);
  const sliderMax = localMax === "" ? defaultMax : Number(localMax);

  return (
    <div className="mb-2">
      <Label className="text-sm font-medium mb-2 block">{filter.name}</Label>
      <div className="grid grid-cols-2 gap-2 mt-1">
        <div>
          <Label
            htmlFor={`${filter.id}-min`}
            className="text-xs text-muted-foreground"
          >
            Min
          </Label>
          <Input
            id={`${filter.id}-min`}
            className="w-full h-9"
            type="number"
            value={localMin}
            onChange={handleMinChange}
            min={defaultMin}
            max={defaultMax}
          />
        </div>
        <div>
          <Label
            htmlFor={`${filter.id}-max`}
            className="text-xs text-muted-foreground"
          >
            Max
          </Label>
          <Input
            id={`${filter.id}-max`}
            className="w-full h-9"
            type="number"
            value={localMax}
            onChange={handleMaxChange}
            min={defaultMin}
            max={defaultMax}
          />
        </div>
      </div>
      <div className="mt-3">
        <Slider
          value={[sliderMin, sliderMax]}
          min={defaultMin}
          max={defaultMax}
          step={1}
          onValueChange={handleSliderChange}
          className="w-full"
        />
      </div>
    </div>
  );
}
