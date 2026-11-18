import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import { useSession, signOut } from '../services/authClient.js';

export const UnauthorizedPage: React.FC = () => {
  const { data: session } = useSession();
  const navigate = useNavigate();

  const handleSwitchAccount = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-[#EAE8E2] p-8 sm:p-10 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center p-3.5 mx-auto">
          <ShieldAlert className="w-full h-full" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
            Error 403 — Acceso Denegado
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#20201E]">
            Permisos Insuficientes
          </h1>
          <p className="text-sm text-[#77756F] max-w-md mx-auto leading-relaxed">
            El área que intentás acceder está reservada exclusivamente para usuarios con el rol{' '}
            <strong className="text-[#20201E]">ADMIN</strong>. Tu cuenta actual (
            <span className="font-semibold text-[#20201E]">{session?.user?.email || 'Visitante'}</span>
            ) tiene el rol de cliente/usuario regular.
          </p>
        </div>

        <div className="p-4 bg-[#F7F6F3] rounded-2xl border border-[#EAE8E2] text-xs text-[#77756F] text-left space-y-1">
          <p className="font-semibold text-[#20201E]">¿Por qué ocurre esto?</p>
          <p>
            El sistema de GrabadosHub aplica control de acceso basado en roles tanto en el frontend como en los controladores del backend REST. Las acciones de administración no están permitidas para cuentas estándar.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#EAE8E2] bg-white hover:bg-[#F7F6F3] text-sm font-semibold text-[#20201E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Catálogo</span>
          </Link>

          <button
            type="button"
            onClick={handleSwitchAccount}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#A66B50] hover:bg-[#8F5940] text-sm font-semibold text-white shadow-xs transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Iniciar con Cuenta Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
