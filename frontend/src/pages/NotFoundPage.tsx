import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-[#F0EDE7] text-[#A66B50] flex items-center justify-center p-3.5 mx-auto">
          <Compass className="w-full h-full" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#A66B50] uppercase tracking-wider">
            Error 404
          </span>
          <h1 className="text-3xl font-extrabold text-[#20201E]">Página No Encontrada</h1>
          <p className="text-sm text-[#77756F]">
            La dirección a la que intentás ingresar no existe o fue movida.
          </p>
        </div>
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#20201E] text-white text-sm font-semibold hover:bg-[#333330] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Página Principal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
