import React, { useEffect, useRef } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#EAE8E2] p-6 transition-all duration-200 animate-in fade-in zoom-in-95"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${variant === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-[#A66B50]/10 text-[#A66B50]'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 id="modal-title" className="text-lg font-bold text-[#20201E]">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#77756F] hover:text-[#20201E] p-1.5 rounded-lg hover:bg-[#F7F6F3] transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-3 text-sm text-[#77756F] leading-relaxed">
          {description}
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-[#20201E] bg-[#F7F6F3] hover:bg-[#EAE8E2] rounded-xl transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-xs transition-all disabled:opacity-50 ${
              variant === 'danger'
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-[#A66B50] hover:bg-[#8F5940]'
            }`}
          >
            {isLoading ? 'Procesando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
