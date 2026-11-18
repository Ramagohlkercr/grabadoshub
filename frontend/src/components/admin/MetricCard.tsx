import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  variant?: 'default' | 'positive' | 'accent' | 'warning';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  description,
  icon: Icon,
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'text-[#20201E] bg-[#F7F6F3]',
    positive: 'text-[#64836D] bg-[#64836D]/10',
    accent: 'text-[#A66B50] bg-[#A66B50]/10',
    warning: 'text-amber-700 bg-amber-50',
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EAE8E2] p-5 shadow-xs flex items-start justify-between gap-4">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-[#77756F] uppercase tracking-wider block">
          {label}
        </span>
        <span className="text-2xl sm:text-3xl font-extrabold text-[#20201E]">
          {value}
        </span>
        {description && (
          <p className="text-[11px] text-[#77756F]">
            {description}
          </p>
        )}
      </div>

      <div className={`p-3 rounded-xl shrink-0 ${variantStyles[variant]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
