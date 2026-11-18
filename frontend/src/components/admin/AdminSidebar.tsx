import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSession, signOut } from '../../services/authClient.js';
import { useToast } from '../../hooks/useToast.js';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ExternalLink,
  LogOut,
  Shield,
  Layers,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Sesión cerrada');
      navigate('/');
    } catch {
      toast.error('Error al cerrar sesión');
    }
  };

  const navItems = [
    {
      to: '/admin/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/admin/products',
      label: 'Productos',
      icon: Package,
    },
    {
      to: '/admin/products/new',
      label: 'Nuevo Producto',
      icon: PlusCircle,
    },
  ];

  return (
    <aside className="w-64 bg-[#FFFFFF] border-r border-[#EAE8E2] flex flex-col justify-between shrink-0 min-h-screen">
      <div className="p-5 space-y-6">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus:outline-hidden rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-[#20201E] flex items-center justify-center p-1.5 shadow-xs">
            <img src="/logo.svg" alt="GrabadosHub" className="w-full h-full" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-[#20201E]">
              Grabados<span className="text-[#A66B50]">Hub</span>
            </span>
            <span className="text-[10px] font-bold tracking-wider text-[#A66B50] uppercase flex items-center gap-1">
              <Shield className="w-2.5 h-2.5" /> Panel Admin
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="space-y-1.5" aria-label="Navegación del panel">
          <span className="text-[10px] font-bold text-[#77756F] uppercase tracking-wider px-3 mb-2 block">
            Gestión de Catálogo
          </span>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#20201E] text-white shadow-xs'
                      : 'text-[#77756F] hover:text-[#20201E] hover:bg-[#F7F6F3]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* View Public Site */}
        <div className="pt-2 border-t border-[#EAE8E2]">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-[#77756F] hover:text-[#20201E] hover:bg-[#F7F6F3] rounded-xl transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Catálogo Público</span>
            </span>
          </Link>
        </div>
      </div>

      {/* User Session Footer */}
      <div className="p-4 border-t border-[#EAE8E2] bg-[#F7F6F3]/50 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#A66B50] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
            {session?.user?.name ? session.user.name.charAt(0) : 'A'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-bold text-[#20201E] truncate">
              {session?.user?.name || 'Administrador'}
            </p>
            <p className="text-[10px] text-[#77756F] truncate">
              {session?.user?.email || 'admin@grabadoshub.com'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
