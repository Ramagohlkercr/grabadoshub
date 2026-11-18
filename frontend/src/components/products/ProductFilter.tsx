import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { ProductCategory } from '../../types/product.js';

interface ProductFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onlyAvailable: boolean;
  onAvailableChange: (available: boolean) => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  totalResults: number;
}

const CATEGORIES: Array<{ id: string; label: string }> = [
  { id: 'all', label: 'Todas las Categorías' },
  { id: 'Ecocuero', label: 'Ecocuero' },
  { id: 'Poliamida', label: 'Poliamida' },
  { id: 'Acrílico', label: 'Acrílico' },
  { id: 'Accesorios', label: 'Accesorios' },
];

export const ProductFilter: React.FC<ProductFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onlyAvailable,
  onAvailableChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  totalResults,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#EAE8E2] p-5 shadow-xs space-y-5">
      {/* Search Bar & Sort Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#77756F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, material o descripción (ej: cuaderno, placa, termo)..."
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-[#F7F6F3] border border-[#EAE8E2] focus:border-[#A66B50] rounded-xl text-[#20201E] placeholder:text-[#77756F] focus:outline-hidden transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#77756F] hover:text-[#20201E] p-0.5 rounded-md"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="sort-select" className="text-xs font-semibold text-[#77756F] flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ordenar:</span>
          </label>
          <select
            id="sort-select"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newOrder] = e.target.value.split('-');
              onSortByChange(newSortBy);
              onSortOrderChange(newOrder as 'asc' | 'desc');
            }}
            className="text-xs font-medium bg-[#F7F6F3] border border-[#EAE8E2] focus:border-[#A66B50] rounded-xl py-2 px-3 text-[#20201E] focus:outline-hidden cursor-pointer"
          >
            <option value="createdAt-desc">Más recientes</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
            <option value="name-asc">Nombre (A-Z)</option>
            <option value="stock-desc">Mayor disponibilidad</option>
          </select>
        </div>
      </div>

      {/* Category Pills & Availability Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-[#EAE8E2]/80">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filtro de categorías">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#20201E] text-white shadow-xs'
                    : 'bg-[#F7F6F3] text-[#77756F] hover:text-[#20201E] hover:bg-[#EAE8E2]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Availability Toggle & Counter */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => onAvailableChange(e.target.checked)}
              className="w-4 h-4 rounded-md border-[#EAE8E2] text-[#A66B50] focus:ring-[#A66B50] accent-[#A66B50] cursor-pointer"
            />
            <span className="text-xs font-medium text-[#20201E]">
              Solo en stock
            </span>
          </label>

          <span className="text-xs text-[#77756F] font-medium bg-[#F7F6F3] px-2.5 py-1 rounded-lg border border-[#EAE8E2]">
            {totalResults} {totalResults === 1 ? 'producto' : 'productos'}
          </span>
        </div>
      </div>
    </div>
  );
};
