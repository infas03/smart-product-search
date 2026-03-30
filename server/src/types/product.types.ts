export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Home",
  "Sports",
  "Beauty",
  "Books",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  tags: string[];
  price: number;
  stock: number;
  rating: number;
}

export interface ScoredProduct extends Product {
  score: number;
}

export interface CategoryGroup {
  category: ProductCategory;
  products: ScoredProduct[];
}

export interface MegaMenuResponse {
  query: string;
  topResults: ScoredProduct[];
  categoryGroups: CategoryGroup[];
  totalResults: number;
}
