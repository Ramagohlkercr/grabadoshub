import React from 'react';
import { useProducts } from '../hooks/useProducts.js';
import { ProductCard } from '../components/products/ProductCard.js';
import { ProductFilter } from '../components/products/ProductFilter.js';
import { ProductPagination } from '../components/products/ProductPagination.js';
import { ProductCardSkeleton } from '../components/common/Skeleton.js';
import { EmptyState } from '../components/common/EmptyState.js';
import { Sparkles, Layers, ShieldCheck, Flame, Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const {
    products,
    pagination,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    onlyAvailable,
    setOnlyAvailable,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    refetch,
  } = useProducts({ initialLimit: 12 });

  // Separate query for featured products
  const { products: featuredProducts, loading: loadingFeatured } = useProducts({
    initialLimit: 4,
    featuredOnly: true,
  });

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#20201E] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#363633]">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#A66B50_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#363633] text-[#A66B50] text-xs font-bold tracking-wider uppercase mb-6 border border-[#474744]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tecnología Láser CNC &amp; Fibra Óptica</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
            Precisión Milimétrica en Grabados Personalizados
          </h1>

          <p className="mt-5 text-sm sm:text-base text-[#D7D5CE] max-w-2xl leading-relaxed">
            Catálogo profesional para regalos corporativos, señalética de diseño e identificación técnica.
            Personalización indeleble sobre ecocuero, poliamida, acrílico óptico y accesorios de acero.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl pt-8 border-t border-[#363633]">
            <div className="p-3 bg-[#2A2A27] rounded-xl border border-[#3E3E3B]">
              <span className="block text-xl font-black text-[#A66B50]">&lt; 0.05 mm</span>
              <span className="text-[11px] text-[#A8A6A0] font-medium">Tolerancia focal</span>
            </div>
            <div className="p-3 bg-[#2A2A27] rounded-xl border border-[#3E3E3B]">
              <span className="block text-xl font-black text-[#64836D]">100%</span>
              <span className="text-[11px] text-[#A8A6A0] font-medium">Grabado indeleble</span>
            </div>
            <div className="p-3 bg-[#2A2A27] rounded-xl border border-[#3E3E3B]">
              <span className="block text-xl font-black text-white">4 Materiales</span>
              <span className="text-[11px] text-[#A8A6A0] font-medium">Líneas especializadas</span>
            </div>
            <div className="p-3 bg-[#2A2A27] rounded-xl border border-[#3E3E3B]">
              <span className="block text-xl font-black text-[#A66B50]">Control Total</span>
              <span className="text-[11px] text-[#A8A6A0] font-medium">Panel de gestión</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel / Grid */}
      {!loadingFeatured && featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-[#A66B50] uppercase tracking-wider block">
                Selección Destacada
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#20201E]">
                Piezas de Muestra &amp; Alta Demanda
              </h2>
            </div>
            <a
              href="#catalog"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#A66B50] hover:text-[#8F5940]"
            >
              <span>Ver catálogo completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* Main Catalog Section */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-bold text-[#A66B50] uppercase tracking-wider block">
            Explorador de Productos
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#20201E]">
            Catálogo Oficial de Grabados
          </h2>
          <p className="text-sm text-[#77756F] mt-1">
            Filtrá por categoría de material, buscá por palabras clave o verificá disponibilidad inmediata.
          </p>
        </div>

        {/* Filter Controls Component */}
        <ProductFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onlyAvailable={onlyAvailable}
          onAvailableChange={setOnlyAvailable}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          totalResults={pagination.total}
        />

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={refetch}
              className="text-xs font-bold underline hover:no-underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Products Grid or Skeletons or Empty State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title="No encontramos productos con estos criterios"
            description="Probá limpiando el buscador o seleccionando otra categoría en los filtros superiores."
            actionText="Restablecer filtros"
            onAction={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setOnlyAvailable(false);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <ProductPagination
          pagination={pagination}
          onPageChange={setCurrentPage}
        />
      </section>

      {/* Categories & Materials Technical Guide */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#A66B50] uppercase tracking-wider block">
            Guía de Materiales
          </span>
          <h2 className="text-2xl font-extrabold text-[#20201E]">
            Comportamiento y Acabado Según el Sustrato
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-[#EAE8E2] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold text-sm">
              EC
            </div>
            <h3 className="font-bold text-[#20201E]">Ecocuero</h3>
            <p className="text-xs text-[#77756F] leading-relaxed">
              El haz de CO2 sublima la microcapa superficial generando un contraste térmico en bajo relieve con tacto suave.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#EAE8E2] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm">
              PA
            </div>
            <h3 className="font-bold text-[#20201E]">Poliamida PA6</h3>
            <p className="text-xs text-[#77756F] leading-relaxed">
              Termoplástico técnico de alta densidad. El láser genera un marcado de alto contraste indeleble a químicos, solventes y calor.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#EAE8E2] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-900 flex items-center justify-center font-bold text-sm">
              AC
            </div>
            <h3 className="font-bold text-[#20201E]">Acrílico Óptico</h3>
            <p className="text-xs text-[#77756F] leading-relaxed">
              Grabado posterior invertido o por microburbujas rasterizadas. Permite iluminación perimetral por LEDs con difusión uniforme.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#EAE8E2] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold text-sm">
              AX
            </div>
            <h3 className="font-bold text-[#20201E]">Accesorios &amp; Inox</h3>
            <p className="text-xs text-[#77756F] leading-relaxed">
              Láser de fibra MOPA que remueve selectivamente el recubrimiento electrostático o recoce el acero inoxidable sin perforar el material.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
