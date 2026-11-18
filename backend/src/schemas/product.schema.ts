import { z } from 'zod';

export const productCategories = ['Ecocuero', 'Poliamida', 'Acrílico', 'Accesorios'] as const;

export const createProductSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(120, 'El nombre no puede superar los 120 caracteres'),
  description: z
    .string({ required_error: 'La descripción es obligatoria' })
    .trim()
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .max(2000, 'La descripción no puede superar los 2000 caracteres'),
  category: z.enum(productCategories, {
    errorMap: () => ({
      message: 'Categoría inválida. Debe ser Ecocuero, Poliamida, Acrílico o Accesorios',
    }),
  }),
  price: z
    .number({ required_error: 'El precio es obligatorio' })
    .positive('El precio debe ser un número positivo mayor a 0')
    .max(10000000, 'El precio no puede superar 10.000.000'),
  stock: z
    .number({ required_error: 'El stock es obligatorio' })
    .int('El stock debe ser un número entero')
    .nonnegative('El stock no puede ser negativo'),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
  imageUrl: z
    .string()
    .trim()
    .refine((val) => val === '' || val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/'), {
      message: 'La URL de la imagen debe ser válida o una ruta relativa del catálogo',
    })
    .optional(),
});

export const updateProductSchema = createProductSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debe proporcionar al menos un campo para actualizar',
  });

export const productIdParamSchema = z.object({
  id: z
    .string({ required_error: 'El ID del producto es obligatorio' })
    .regex(/^[0-9a-fA-F]{24}$/, 'ID de producto inválido. Debe ser un identificador ObjectId de 24 caracteres hexadecimales'),
});

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  search: z.string().trim().optional(),
  category: z.enum([...productCategories, 'all']).optional(),
  available: z.enum(['true', 'false', 'all']).optional(),
  featured: z.enum(['true', 'false', 'all']).optional(),
  sortBy: z.enum(['name', 'price', 'createdAt', 'stock']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryParams = z.infer<typeof productQuerySchema>;
