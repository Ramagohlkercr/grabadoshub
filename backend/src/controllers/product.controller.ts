import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service.js';
import { sendCreated, sendError, sendNoContent, sendSuccess } from '../utils/response.util.js';
import { ProductQueryParams, CreateProductInput, UpdateProductInput } from '../schemas/product.schema.js';

export class ProductController {
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const queryParams = req.query as unknown as ProductQueryParams;
      const result = await ProductService.getProducts(queryParams);
      return sendSuccess(res, result, 'Productos obtenidos exitosamente');
    } catch (error) {
      return next(error);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const product = await ProductService.getProductById(id);

      if (!product) {
        return sendError(res, 404, `No se encontró ningún producto con el identificador: ${id}`);
      }

      return sendSuccess(res, product, 'Producto obtenido exitosamente');
    } catch (error) {
      return next(error);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const input = req.body as CreateProductInput;
      const product = await ProductService.createProduct(input);
      return sendCreated(res, product, 'Producto creado exitosamente');
    } catch (error) {
      return next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const input = req.body as UpdateProductInput;
      const updated = await ProductService.updateProduct(id, input);

      if (!updated) {
        return sendError(res, 404, `No se pudo actualizar: producto no encontrado con el identificador: ${id}`);
      }

      return sendSuccess(res, updated, 'Producto actualizado exitosamente');
    } catch (error) {
      return next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const deleted = await ProductService.deleteProduct(id);

      if (!deleted) {
        return sendError(res, 404, `No se pudo eliminar: producto no encontrado con el identificador: ${id}`);
      }

      return sendNoContent(res);
    } catch (error) {
      return next(error);
    }
  }

  static async getMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await ProductService.getMetrics();
      return sendSuccess(res, metrics, 'Métricas del catálogo obtenidas exitosamente');
    } catch (error) {
      return next(error);
    }
  }
}
