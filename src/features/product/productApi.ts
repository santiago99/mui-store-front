// import type { CategoryMinimal } from "@/features/category/categoryApi";


export interface Product {
  id: string | number;
  title: string;
  price: number;
  imageUrl: string;
  categoryId: string | number;
  //category?: CategoryMinimal;
  //categoryAncestors?: CategoryMinimal[];
}

