export interface Category {
  id: string | number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  parent_id: string | number | null;
  depth: number;
  full_path: string;
  has_children: boolean;
  is_leaf: boolean;
  products_count: number;
  children: Category[];
  created_at: string;
  updated_at: string;
}