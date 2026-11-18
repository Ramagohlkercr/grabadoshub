import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ProductService } from '../../services/productService.js';
import { useToast } from '../../hooks/useToast.js';
import { ArrowLeft, Save, Sparkles, AlertCircle, Image as ImageIcon } from 'lucide-react';

const productCategories = ['Ecocuero', 'Poliamida', 'Acrílico', 'Accesorios'] as const;

const productEditSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(120, 'El nombre no puede superar 120 caracteres'),
  description: z
    .string()
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .max(2000, 'La descripción no puede superar 2000 caracteres'),
  category: z.enum(productCategories, {
    errorMap: () => ({ message: 'Seleccione una categoría válida' }),
  }),
  price: z.coerce
    .number()
    .positive('El precio debe ser un número mayor a 0')
    .max(10000000, 'Precio máximo: 10.000.000'),
  stock: z.coerce
    .number()
    .int('El stock debe ser un número entero')
    .nonnegative('El stock no puede ser negativo'),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
  imageUrl: z.string().optional(),
});

type ProductEditFormData = z.infer<typeof productEditSchema>;

const PRESET_IMAGES = [
  { label: 'Cuaderno Ecocuero', url: '/assets/products/cuaderno-ecocuero.svg' },
  { label: 'Billetera Ecocuero', url: '/assets/products/billetera-ecocuero.svg' },
  { label: 'Posavasos Ecocuero', url: '/assets/products/posavasos-ecocuero.svg' },
  { label: 'Placa Poliamida', url: '/assets/products/placa-poliamida.svg' },
  { label: 'Llavero Poliamida', url: '/assets/products/llavero-poliamida.svg' },
  { label: 'Cartel Acrílico', url: '/assets/products/cartel-acrilico.svg' },
  { label: 'Trofeo Acrílico', url: '/assets/products/trofeo-acrilico.svg' },
  { label: 'Termo Acero Inox', url: '/assets/products/termo-accesorios.svg' },
  { label: 'Mate Térmico', url: '/assets/products/mate-accesorios.svg' },
  { label: 'Multiherramienta', url: '/assets/products/multiherramienta-accesorios.svg' },
];

export const ProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductEditFormData>({
    resolver: zodResolver(productEditSchema),
  });

  const selectedImageUrl = watch('imageUrl');

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      setIsLoading(true);
      try {
        const prod = await ProductService.getProductById(id);
        reset({
          name: prod.name,
          description: prod.description,
          category: prod.category,
          price: prod.price,
          stock: prod.stock,
          available: prod.available,
          featured: prod.featured,
          imageUrl: prod.imageUrl || '',
        });
      } catch (err: any) {
        setServerError(err?.message || 'Error al cargar el producto para edición');
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [id, reset]);

  const onSubmit = async (data: ProductEditFormData) => {
    if (!id) return;
    setIsSubmitting(true);
    setServerError(null);
    try {
      await ProductService.updateProduct(id, {
        ...data,
        name: data.name.trim(),
        description: data.description.trim(),
      });
      toast.success('Producto actualizado exitosamente');
      navigate('/admin/products');
    } catch (err: any) {
      setServerError(err?.message || 'Error al actualizar el producto');
      toast.error('Error al actualizar');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-60 bg-[#EAE8E2] rounded-xl" />
        <div className="h-96 bg-white rounded-3xl border border-[#EAE8E2]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EAE8E2]">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 rounded-xl text-[#77756F] hover:text-[#20201E] hover:bg-white border border-[#EAE8E2] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#20201E]">
              Editar Producto
            </h1>
            <p className="text-xs text-[#77756F]">
              Modificá las especificaciones, disponibilidad o precio en el catálogo
            </p>
          </div>
        </div>
      </div>

      {serverError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl border border-[#EAE8E2] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-[#20201E] mb-1.5" htmlFor="name">
            Nombre del Producto *
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className={`w-full px-4 py-2.5 text-sm bg-[#F7F6F3] border rounded-xl text-[#20201E] focus:outline-hidden transition-colors ${
              errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-[#EAE8E2] focus:border-[#A66B50]'
            }`}
          />
          {errors.name && (
            <p className="text-[11px] text-rose-600 font-medium mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Category & Price & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#20201E] mb-1.5" htmlFor="category">
              Categoría / Material *
            </label>
            <select
              id="category"
              {...register('category')}
              className="w-full px-3 py-2.5 text-sm bg-[#F7F6F3] border border-[#EAE8E2] focus:border-[#A66B50] rounded-xl text-[#20201E] focus:outline-hidden cursor-pointer"
            >
              {productCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-[11px] text-rose-600 font-medium mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#20201E] mb-1.5" htmlFor="price">
              Precio Unitario (ARS) *
            </label>
            <input
              id="price"
              type="number"
              step="100"
              {...register('price')}
              className={`w-full px-4 py-2.5 text-sm bg-[#F7F6F3] border rounded-xl text-[#20201E] focus:outline-hidden transition-colors ${
                errors.price ? 'border-rose-400 focus:border-rose-500' : 'border-[#EAE8E2] focus:border-[#A66B50]'
              }`}
            />
            {errors.price && (
              <p className="text-[11px] text-rose-600 font-medium mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#20201E] mb-1.5" htmlFor="stock">
              Stock Disponible *
            </label>
            <input
              id="stock"
              type="number"
              step="1"
              {...register('stock')}
              className={`w-full px-4 py-2.5 text-sm bg-[#F7F6F3] border rounded-xl text-[#20201E] focus:outline-hidden transition-colors ${
                errors.stock ? 'border-rose-400 focus:border-rose-500' : 'border-[#EAE8E2] focus:border-[#A66B50]'
              }`}
            />
            {errors.stock && (
              <p className="text-[11px] text-rose-600 font-medium mt-1">
                {errors.stock.message}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-[#20201E] mb-1.5" htmlFor="description">
            Descripción Detallada *
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('description')}
            className={`w-full px-4 py-2.5 text-sm bg-[#F7F6F3] border rounded-xl text-[#20201E] focus:outline-hidden transition-colors ${
              errors.description ? 'border-rose-400 focus:border-rose-500' : 'border-[#EAE8E2] focus:border-[#A66B50]'
            }`}
          />
          {errors.description && (
            <p className="text-[11px] text-rose-600 font-medium mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Image Selection with Presets */}
        <div className="space-y-3 pt-2 border-t border-[#EAE8E2]">
          <label className="block text-xs font-bold text-[#20201E]" htmlFor="imageUrl">
            Ilustración del Producto
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_IMAGES.map((preset) => (
              <button
                key={preset.url}
                type="button"
                onClick={() => setValue('imageUrl', preset.url)}
                className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                  selectedImageUrl === preset.url
                    ? 'bg-[#A66B50] text-white border-[#A66B50] font-bold'
                    : 'bg-[#F7F6F3] text-[#77756F] border-[#EAE8E2] hover:bg-[#EAE8E2]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              id="imageUrl"
              type="text"
              {...register('imageUrl')}
              className="flex-1 px-4 py-2 text-xs bg-[#F7F6F3] border border-[#EAE8E2] rounded-xl text-[#20201E] focus:outline-hidden"
            />
            {selectedImageUrl && (
              <div className="w-10 h-10 rounded-lg bg-[#F0EDE7] border border-[#EAE8E2] overflow-hidden shrink-0 flex items-center justify-center">
                <img src={selectedImageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Checkboxes: Available and Featured */}
        <div className="pt-2 border-t border-[#EAE8E2] flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('available')}
              className="w-4 h-4 rounded-md border-[#EAE8E2] text-[#A66B50] focus:ring-[#A66B50] accent-[#A66B50] cursor-pointer"
            />
            <span className="text-xs font-semibold text-[#20201E]">
              Disponible para catálogo
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('featured')}
              className="w-4 h-4 rounded-md border-[#EAE8E2] text-[#A66B50] focus:ring-[#A66B50] accent-[#A66B50] cursor-pointer"
            />
            <span className="text-xs font-semibold text-[#20201E] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#A66B50]" /> Marcar como Destacado
            </span>
          </label>
        </div>

        {/* Submit Row */}
        <div className="pt-4 border-t border-[#EAE8E2] flex items-center justify-end gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2.5 rounded-xl border border-[#EAE8E2] bg-white hover:bg-[#F7F6F3] text-xs font-semibold text-[#20201E] transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#A66B50] hover:bg-[#8F5940] text-xs font-bold text-white shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
