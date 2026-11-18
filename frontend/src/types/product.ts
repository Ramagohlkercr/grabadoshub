export type ProductCategory = 'Ecocuero' | 'Poliamida' | 'Acrílico' | 'Accesorios';

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  stock: number;
  available: boolean;
  featured: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export interface ProductsResponseData {
  products: Product[];
  pagination: PaginationMeta;
}

export interface CategoryMetric {
  category: string;
  count: number;
}

export interface ProductMetrics {
  total: number;
  available: number;
  outOfStock: number;
  categoriesCount: number;
  categoryStats: CategoryMetric[];
  recentProducts: Product[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Array<{ field?: string; message: string }>;
}
