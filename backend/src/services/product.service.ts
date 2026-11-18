import { Filter, ObjectId, Sort } from 'mongodb';
import { getDb } from '../config/database.js';
import { Product, ProductResponse, formatProduct } from '../models/product.model.js';
import { CreateProductInput, ProductQueryParams, UpdateProductInput } from '../schemas/product.schema.js';

export class ProductService {
  private static get collection() {
    return getDb().collection<Product>('products');
  }

  static async getProducts(queryParams: ProductQueryParams) {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      available,
      featured,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = queryParams;

    const filter: Filter<Product> = {};

    // Category filter
    if (category && category !== 'all') {
      filter.category = category as Product['category'];
    }

    // Availability filter
    if (available && available !== 'all') {
      filter.available = available === 'true';
    }

    // Featured filter
    if (featured && featured !== 'all') {
      filter.featured = featured === 'true';
    }

    // Search query (sanitized regex for name and description)
    if (search && search.trim() !== '') {
      const sanitized = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: sanitized, $options: 'i' } },
        { description: { $regex: sanitized, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort: Sort = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    const total = await this.collection.countDocuments(filter);
    const rawProducts = await this.collection
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    const products: ProductResponse[] = rawProducts.map(formatProduct);
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
      },
    };
  }

  static async getProductById(id: string): Promise<ProductResponse | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const product = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!product) return null;
    return formatProduct(product);
  }

  static async createProduct(input: CreateProductInput): Promise<ProductResponse> {
    const now = new Date();
    const newProduct: Product = {
      name: input.name.trim(),
      description: input.description.trim(),
      category: input.category,
      price: input.price,
      stock: input.stock,
      available: input.available !== undefined ? input.available : input.stock > 0,
      featured: input.featured ?? false,
      imageUrl: input.imageUrl?.trim() || '',
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.collection.insertOne(newProduct as any);
    newProduct._id = result.insertedId;
    return formatProduct(newProduct);
  }

  static async updateProduct(id: string, input: UpdateProductInput): Promise<ProductResponse | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const updateDoc: Partial<Product> & { updatedAt: Date } = {
      ...input,
      updatedAt: new Date(),
    };

    // If stock was updated and available wasn't explicitly provided, sync availability
    if (input.stock !== undefined && input.available === undefined) {
      updateDoc.available = input.stock > 0;
    }

    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateDoc },
      { returnDocument: 'after' }
    );

    if (!result) return null;
    return formatProduct(result);
  }

  static async deleteProduct(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) {
      return false;
    }

    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  static async getMetrics() {
    const total = await this.collection.countDocuments();
    const available = await this.collection.countDocuments({ available: true, stock: { $gt: 0 } });
    const outOfStock = await this.collection.countDocuments({
      $or: [{ available: false }, { stock: 0 }],
    });

    // Category breakdown
    const categoryStats = await this.collection
      .aggregate<{ _id: string; count: number }>([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    const categoriesCount = categoryStats.length;

    // Recent products (last 5)
    const recentRaw = await this.collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    return {
      total,
      available,
      outOfStock,
      categoriesCount,
      categoryStats: categoryStats.map((item) => ({
        category: item._id,
        count: item.count,
      })),
      recentProducts: recentRaw.map(formatProduct),
    };
  }
}
