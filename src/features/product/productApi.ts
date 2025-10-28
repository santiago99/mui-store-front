// import type { CategoryMinimal } from "@/features/category/categoryApi";

export interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  categoryId: string | number;
  //category?: CategoryMinimal;
  //categoryAncestors?: CategoryMinimal[];
}
