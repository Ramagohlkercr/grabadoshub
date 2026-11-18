import { apiClient } from './api.js';
import { Product, ProductMetrics, ProductsResponseData } from '../types/product.js';

export interface ProductFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  available?: string;
  featured?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProductPayload {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  available?: boolean;
  featured?: boolean;
  imageUrl?: string;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export const ProductService = {
  async getProducts(params: ProductFilterParams = {}): Promise<ProductsResponseData> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.search?.trim()) searchParams.set('search', params.search.trim());
    if (params.category && params.category !== 'all') searchParams.set('category', params.category);
    if (params.available && params.available !== 'all') searchParams.set('available', params.available);
    if (params.featured && params.featured !== 'all') searchParams.set('featured', params.featured);
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

    const queryString = searchParams.toString();
    const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;
    return apiClient<ProductsResponseData>(endpoint);
  },

  async getProductById(id: string): Promise<Product> {
    return apiClient<Product>(`/api/products/${id}`);
  },

  async createProduct(payload: CreateProductPayload): Promise<Product> {
    return apiClient<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateProduct(id: string, payload: UpdateProductPayload): Promise<Product> {
    return apiClient<Product>(`/api/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async deleteProduct(id: string): Promise<void> {
    return apiClient<void>(`/api/products/${id}`, {
      method: 'DELETE',
    });
  },

  async getMetrics(): Promise<ProductMetrics> {
    return apiClient<ProductMetrics>('/api/products/metrics');
  },
};
