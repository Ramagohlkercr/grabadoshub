import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createProductSchema,
  productIdParamSchema,
  productQuerySchema,
  updateProductSchema,
} from '../schemas/product.schema.js';

const router = Router();

// Public: Get all products with filters, search, pagination
router.get(
  '/',
  validate({ query: productQuerySchema }),
  ProductController.getProducts
);

// Protected (Admin): Get catalog metrics for admin dashboard
router.get(
  '/metrics',
  authMiddleware,
  requireRole('admin'),
  ProductController.getMetrics
);

// Public: Get product by ID
router.get(
  '/:id',
  validate({ params: productIdParamSchema }),
  ProductController.getProductById
);

// Protected (Admin): Create new product
router.post(
  '/',
  authMiddleware,
  requireRole('admin'),
  validate({ body: createProductSchema }),
  ProductController.createProduct
);

// Protected (Admin): Update existing product (supports both PATCH and PUT per course rubric)
router.patch(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  validate({ params: productIdParamSchema, body: updateProductSchema }),
  ProductController.updateProduct
);

router.put(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  validate({ params: productIdParamSchema, body: updateProductSchema }),
  ProductController.updateProduct
);

// Protected (Admin): Delete product
router.delete(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  validate({ params: productIdParamSchema }),
  ProductController.deleteProduct
);

export default router;
