export interface Category {
  id: string | number;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  parentId: string | number | null;
  depth: number;
  fullPath: string;
  //hasChildren: boolean;
  isLeaf: boolean;
  productsCount: number;
  children: Category[];
  createdAt: string;
  updatedAt: string;
}