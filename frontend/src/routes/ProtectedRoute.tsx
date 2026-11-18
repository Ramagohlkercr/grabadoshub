import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSession } from '../services/authClient.js';

interface ProtectedRouteProps {
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole = 'admin' }) => {
  const { data: session, isPending } = useSession();
  const location = useLocation();

  if (isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F6F3] space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#20201E] flex items-center justify-center p-2.5 shadow-sm">
          <img src="/logo.svg" alt="GrabadosHub" className="w-full h-full animate-pulse" />
        </div>
        <div className="text-xs font-semibold text-[#77756F] flex items-center gap-2">
          <span className="w-3.5 h-3.5 border-2 border-[#A66B50] border-t-transparent rounded-full animate-spin" />
          <span>Verificando permisos y credenciales...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!session || !session.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is required and user does not have it, redirect to unauthorized
  if (requiredRole && session.user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
