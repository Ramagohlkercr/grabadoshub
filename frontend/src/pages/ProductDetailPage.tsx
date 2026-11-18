import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types/product.js';
import { ProductService } from '../services/productService.js';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  Clock,
  Printer,
  ChevronRight,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await ProductService.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-8">
        <div className="h-6 w-48 bg-[#EAE8E2] rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-4/3 bg-[#EAE8E2] rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-[#EAE8E2] rounded-md" />
            <div className="h-6 w-1/4 bg-[#EAE8E2] rounded-md" />
            <div className="h-24 bg-[#EAE8E2] rounded-md" />
            <div className="h-12 w-1/2 bg-[#EAE8E2] rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-600 inline-block mb-2">
          <XCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-[#20201E]">Producto no encontrado</h2>
        <p className="text-sm text-[#77756F]">
          {error || 'El producto solicitado no existe o fue eliminado del catálogo.'}
        </p>
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#A66B50] text-white text-sm font-semibold rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Catálogo</span>
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = product.available && product.stock > 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Category specific technical recommendations
  const categoryTechSpecs: Record<string, { laser: string; depth: string; finish: string }> = {
    Ecocuero: {
      laser: 'Láser CO2 sellado (10.6 µm)',
      depth: '0.2 a 0.4 mm (bajo relieve térmico)',
      finish: 'Tostado de contraste oscuro mate',
    },
    Poliamida: {
      laser: 'Láser CO2 / Fibra Óptica',
      depth: '0.15 a 0.3 mm (grabado permanente)',
      finish: 'Alto contraste resistente a abrasivos y aceites',
    },
    Acrílico: {
      laser: 'Láser CO2 de alta frecuencia',
      depth: '0.3 a 0.8 mm (vector o raster)',
      finish: 'Esmerilado blanco óptico de máxima difusión',
    },
    Accesorios: {
      laser: 'Láser Fibra MOPA (1064 nm)',
      depth: '0.05 a 0.1 mm (remoción o recocido térmico)',
      finish: 'Acero inoxidable expuesto o marcado oscuro',
    },
  };

  const tech = categoryTechSpecs[product.category] || categoryTechSpecs.Ecocuero;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#77756F]" aria-label="Ruta de navegación">
        <Link to="/" className="hover:text-[#20201E] transition-colors">
          Inicio
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/?category=${product.category}`} className="hover:text-[#20201E] transition-colors">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#20201E] truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl border border-[#EAE8E2] p-6 sm:p-10 shadow-xs">
        {/* Left: Image Container */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 w-full rounded-2xl bg-[#F0EDE7] border border-[#EAE8E2] overflow-hidden flex items-center justify-center p-4">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-sm font-semibold text-[#77756F]">GrabadosHub Lab</div>
            )}

            {product.featured && (
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#20201E] text-white text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#A66B50]" />
                Destacado
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-[#77756F] px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#64836D]" /> Garantía de precisión CNC
            </span>
            <span>ID: {product._id}</span>
          </div>
        </div>

        {/* Right: Product Details & Specifications */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category and stock badges */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#F7F6F3] text-[#20201E] border border-[#EAE8E2]">
                {product.category}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                  isAvailable
                    ? 'bg-[#64836D]/15 text-[#64836D]'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {isAvailable ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {isAvailable ? `En Stock (${product.stock} disponibles)` : 'Sin Stock'}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#20201E] tracking-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="pt-1">
              <span className="text-xs text-[#77756F] uppercase tracking-wider font-semibold block">
                Precio final unitario
              </span>
              <span className="text-3xl font-extrabold text-[#A66B50]">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Description */}
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#77756F] mb-1.5">
                Descripción del producto
              </h3>
              <p className="text-sm text-[#20201E] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Technical Laser Specifications */}
            <div className="pt-4 border-t border-[#EAE8E2] space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#20201E] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#A66B50]" />
                Especificaciones de Grabado Láser
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-[#F7F6F3] rounded-xl border border-[#EAE8E2]">
                  <span className="text-[#77756F] block text-[11px]">Tecnología Empleada</span>
                  <span className="font-semibold text-[#20201E]">{tech.laser}</span>
                </div>
                <div className="p-3 bg-[#F7F6F3] rounded-xl border border-[#EAE8E2]">
                  <span className="text-[#77756F] block text-[11px]">Profundidad Focal</span>
                  <span className="font-semibold text-[#20201E]">{tech.depth}</span>
                </div>
                <div className="p-3 bg-[#F7F6F3] rounded-xl border border-[#EAE8E2]">
                  <span className="text-[#77756F] block text-[11px]">Acabado de Superficie</span>
                  <span className="font-semibold text-[#20201E]">{tech.finish}</span>
                </div>
                <div className="p-3 bg-[#F7F6F3] rounded-xl border border-[#EAE8E2]">
                  <span className="text-[#77756F] block text-[11px]">Tiempo de Producción</span>
                  <span className="font-semibold text-[#20201E]">24 a 48 hs hábiles</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-[#EAE8E2] flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#EAE8E2] bg-white hover:bg-[#F7F6F3] text-sm font-semibold text-[#20201E] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Catálogo</span>
            </Link>

            <button
              type="button"
              onClick={() => alert(`Solicitud de cotización para "${product.name}". En producción se conecta con el módulo de cotizaciones.`)}
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#A66B50] hover:bg-[#8F5940] text-sm font-bold text-white shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Solicitar Grabado Personalizado</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
