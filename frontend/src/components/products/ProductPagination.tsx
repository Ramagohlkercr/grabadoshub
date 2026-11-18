import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '../../types/product.js';

interface ProductPaginationProps {
  pagination: PaginationMeta;
  onPageChange: (newPage: number) => void;
}

export const ProductPagination: React.FC<ProductPaginationProps> = ({
  pagination,
  onPageChange,
}) => {
  const { page, totalPages, total, hasPrevPage, hasNextPage } = pagination;

  if (totalPages <= 1) return null;

  // Build array of pages to show
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <nav
      className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-[#EAE8E2]"
      aria-label="Paginación del catálogo"
    >
      <div className="text-xs text-[#77756F]">
        Página <span className="font-bold text-[#20201E]">{page}</span> de{' '}
        <span className="font-bold text-[#20201E]">{totalPages}</span> —{' '}
        <span>{total} productos en total</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#EAE8E2] bg-white text-[#20201E] hover:bg-[#F7F6F3] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        {getPageNumbers().map((num) => {
          const isActive = num === page;
          return (
            <button
              key={num}
              type="button"
              onClick={() => onPageChange(num)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-xl transition-all ${
                isActive
                  ? 'bg-[#A66B50] text-white shadow-xs'
                  : 'bg-white border border-[#EAE8E2] text-[#20201E] hover:bg-[#F7F6F3]'
              }`}
            >
              {num}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#EAE8E2] bg-white text-[#20201E] hover:bg-[#F7F6F3] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Página siguiente"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};
