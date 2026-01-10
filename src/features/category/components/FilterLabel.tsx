import { Label } from "@/components/ui/label";
import type { Filter } from "@/features/category/categoryApi";

interface FilterLabelProps {
  filter: Filter;
  className?: string;
}

export default function FilterLabel({
  filter,
  className = "text-sm font-medium mb-2 block",
}: FilterLabelProps) {
  return (
    <Label className={className}>
      {filter.name}
      {filter.options?.suffix && ` (${filter.options.suffix})`}
    </Label>
  );
}

