// import type { CategoryMinimal } from "@/features/category/categoryApi";

export interface Brand {
  id: number;
  slug: string;
  name: string;
}

export interface ProductField {
  id: number;
  name: string;
  type: string;
  value: string | number;
  options?: {
    prefix?: string;
    suffix?: string;
  };
}

export interface Product {
  id: string;
  sku: string;
  title: string;
  price: number;
  imageUrl: string;
  categoryId: number | null;
  description?: string;
  brand?: Brand;
  fields?: ProductField[];
  //category?: CategoryMinimal;
  //categoryAncestors?: CategoryMinimal[];
}
