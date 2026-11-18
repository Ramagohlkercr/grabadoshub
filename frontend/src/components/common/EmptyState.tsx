import React from 'react';
import { PackageSearch } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No se encontraron productos',
  description = 'No hay resultados que coincidan con los filtros o el término de búsqueda aplicado.',
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-[#EAE8E2] my-6">
      <div className="p-4 rounded-2xl bg-[#F7F6F3] text-[#A66B50] mb-4">
        {icon || <PackageSearch className="w-10 h-10" />}
      </div>
      <h3 className="text-lg font-bold text-[#20201E] mb-1">{title}</h3>
      <p className="text-sm text-[#77756F] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-4 py-2.5 bg-[#A66B50] hover:bg-[#8F5940] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
