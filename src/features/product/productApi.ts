// import type { CategoryMinimal } from "@/features/category/categoryApi";

export interface ProductField {
  id: number;
  name: string;
  type: string;
  value: string | number;
}

export interface Product {
  id: string;
  sku: string;
  title: string;
  price: number;
  imageUrl: string;
  categoryId: number | null;
  description?: string;
  brand?: { id: number; slug: string; name: string };
  fields?: ProductField[];
  //category?: CategoryMinimal;
  //categoryAncestors?: CategoryMinimal[];
}
