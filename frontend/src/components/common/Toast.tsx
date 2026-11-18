import React from 'react';
import { useToast } from '../../hooks/useToast.js';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Notificaciones"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        let borderClass = 'border-[#EAE8E2]';
        let bgClass = 'bg-white';
        let Icon = Info;
        let iconColor = 'text-[#77756F]';

        if (toast.type === 'success') {
          borderClass = 'border-[#64836D]/30';
          bgClass = 'bg-[#FFFFFF]';
          Icon = CheckCircle2;
          iconColor = 'text-[#64836D]';
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-200';
          bgClass = 'bg-[#FFFFFF]';
          Icon = AlertCircle;
          iconColor = 'text-rose-600';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border ${borderClass} ${bgClass} transition-all duration-200 animate-in slide-in-from-bottom-2`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-sm font-medium text-[#20201E]">
              {toast.message}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-[#77756F] hover:text-[#20201E] p-1 rounded-md transition-colors"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
