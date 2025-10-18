export interface CategoryMinimal {
  id: string | number;
  name: string;
  slug: string;
}
export interface Category extends CategoryMinimal {
  description: string | null;
  isActive: boolean;
  parentId: string | number | null;
  isLeaf: boolean;
  productsCount?: number;
  children?: Category[];
  ancestors?: CategoryMinimal[];
  createdAt: string;
  updatedAt: string;
}
