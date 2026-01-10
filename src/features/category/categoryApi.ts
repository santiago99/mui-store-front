export interface CategoryMinimal {
  id: number;
  name: string;
  slug: string;
}
export interface Category extends CategoryMinimal {
  description: string | null;
  isActive: boolean;
  parentId: number | null;
  isLeaf: boolean;
  productsCount?: number;
  children?: Category[];
  ancestors?: CategoryMinimal[];
  createdAt: string;
  updatedAt: string;
}

export interface FieldOptions {
  prefix?: string;
  suffix?: string;
}
export interface FilterOption {
  value: string;
  displayValue: string;
  count: number;
}

export interface Filter {
  id: number;
  name: string;
  slug: string;
  type: string;
  filterType:
    | "textfield"
    | "range"
    | "select"
    | "checkboxes"
    | "single checkbox";
  filterWeight: number;
  options: FieldOptions | null;
  filterOptions?: FilterOption[] | null;
  min?: number;
  max?: number;
}
