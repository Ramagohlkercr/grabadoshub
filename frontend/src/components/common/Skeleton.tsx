import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-[#EAE8E2]/70 rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-[#EAE8E2] p-4 flex flex-col gap-4">
      <Skeleton className="w-full h-48 rounded-xl" />
      <div className="flex items-center justify-between">
        <Skeleton className="w-20 h-5 rounded-full" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <Skeleton className="w-3/4 h-6" />
      <Skeleton className="w-full h-12" />
      <div className="flex items-center justify-between pt-2 border-t border-[#EAE8E2]/60">
        <Skeleton className="w-24 h-7" />
        <Skeleton className="w-20 h-9 rounded-xl" />
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC = () => {
  return (
    <tr className="border-b border-[#EAE8E2] animate-pulse">
      <td className="p-4"><Skeleton className="w-12 h-12 rounded-lg" /></td>
      <td className="p-4"><Skeleton className="w-40 h-5 mb-1.5" /><Skeleton className="w-24 h-4" /></td>
      <td className="p-4"><Skeleton className="w-20 h-6 rounded-full" /></td>
      <td className="p-4"><Skeleton className="w-16 h-5" /></td>
      <td className="p-4"><Skeleton className="w-14 h-5" /></td>
      <td className="p-4"><Skeleton className="w-20 h-6 rounded-full" /></td>
      <td className="p-4 text-right"><Skeleton className="w-20 h-8 ml-auto rounded-lg" /></td>
    </tr>
  );
};
