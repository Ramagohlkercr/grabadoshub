import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/product.js';
import { ArrowRight, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isAvailable = product.available && product.stock > 0;

  // Material category color badge
  const categoryStyles: Record<string, string> = {
    Ecocuero: 'bg-amber-100/70 text-amber-900 border-amber-200/80',
    Poliamida: 'bg-slate-200/80 text-slate-800 border-slate-300',
    Acrílico: 'bg-sky-100/70 text-sky-900 border-sky-200/80',
    Accesorios: 'bg-stone-200/70 text-stone-800 border-stone-300',
  };

  const badgeClass = categoryStyles[product.category] || 'bg-stone-100 text-stone-800 border-stone-200';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <article className="group bg-white rounded-2xl border border-[#EAE8E2] hover:border-[#A66B50]/40 p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-md">
      <div>
        {/* Image Container with subtle zoom on hover */}
        <div className="relative aspect-4/3 w-full rounded-xl bg-[#F0EDE7] overflow-hidden border border-[#EAE8E2]/60 mb-4 flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="text-xs text-[#77756F]">GrabadosHub Laser Lab</div>
          )}

          {/* Featured pill */}
          {product.featured && (
            <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#20201E]/90 text-white text-[11px] font-bold shadow-xs backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-[#A66B50]" />
              Destacado
            </span>
          )}

          {/* Stock availability badge */}
          <span
            className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase shadow-xs ${
              isAvailable
                ? 'bg-[#64836D] text-white'
                : 'bg-[#77756F] text-white'
            }`}
          >
            {isAvailable ? (
              <>
                <CheckCircle2 className="w-3 h-3" /> En Stock
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3" /> Sin Stock
              </>
            )}
          </span>
        </div>

        {/* Category & Material */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md border ${badgeClass}`}>
            {product.category}
          </span>
          <span className="text-xs text-[#77756F]">
            {product.stock} un. disponibles
          </span>
        </div>

        {/* Name */}
        <h3 className="font-bold text-base text-[#20201E] group-hover:text-[#A66B50] transition-colors line-clamp-1 mb-1.5">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-[#77756F] line-clamp-2 leading-relaxed mb-4">
          {product.description}
        </p>
      </div>

      {/* Footer / Price & Details */}
      <div className="pt-3 border-t border-[#EAE8E2] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-semibold text-[#77756F] block uppercase tracking-wider">
            Precio unitario
          </span>
          <span className="text-lg font-extrabold text-[#20201E]">
            {formatPrice(product.price)}
          </span>
        </div>

        <Link
          to={`/products/${product._id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F6F3] group-hover:bg-[#A66B50] text-[#20201E] group-hover:text-white text-xs font-semibold transition-all"
        >
          <span>Ver detalle</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  );
};
