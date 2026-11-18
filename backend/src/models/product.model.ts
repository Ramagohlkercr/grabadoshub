import { ObjectId } from 'mongodb';

export type ProductCategory = 'Ecocuero' | 'Poliamida' | 'Acrílico' | 'Accesorios';

export interface Product {
  _id?: ObjectId;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  stock: number;
  available: boolean;
  featured: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductResponse {
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

export function formatProduct(product: Product): ProductResponse {
  return {
    _id: product._id ? product._id.toString() : '',
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.price,
    stock: product.stock,
    available: product.available,
    featured: product.featured,
    imageUrl: product.imageUrl,
    createdAt: product.createdAt instanceof Date ? product.createdAt.toISOString() : String(product.createdAt),
    updatedAt: product.updatedAt instanceof Date ? product.updatedAt.toISOString() : String(product.updatedAt),
  };
}
