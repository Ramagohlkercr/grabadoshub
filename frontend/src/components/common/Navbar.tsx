import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession, signOut } from '../../services/authClient.js';
import { useToast } from '../../hooks/useToast.js';
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  Shield,
  Layers,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { data: session, isPending } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Sesión cerrada correctamente');
      navigate('/');
    } catch {
      toast.error('Error al cerrar sesión');
    }
  };

  const user = session?.user;
  const isAdmin = user?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#EAE8E2] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#A66B50] rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-[#20201E] flex items-center justify-center p-1.5 shadow-xs group-hover:scale-105 transition-transform">
              <img src="/logo.svg" alt="GrabadosHub Logo" className="w-full h-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-[#20201E] group-hover:text-[#A66B50] transition-colors">
                Grabados<span className="text-[#A66B50]">Hub</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-[#77756F] uppercase">
                Grabado Láser de Precisión
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Navegación principal">
            <Link
              to="/"
              className="text-sm font-medium text-[#20201E] hover:text-[#A66B50] transition-colors"
            >
              Catálogo
            </Link>
            <a
              href="/#categories"
              className="text-sm font-medium text-[#77756F] hover:text-[#20201E] transition-colors"
            >
              Categorías
            </a>
            <a
              href="/#tech"
              className="text-sm font-medium text-[#77756F] hover:text-[#20201E] transition-colors"
            >
              Tecnología Láser
            </a>
            <a
              href="/#about"
              className="text-sm font-medium text-[#77756F] hover:text-[#20201E] transition-colors"
            >
              Institucional
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isPending ? (
              <div className="w-24 h-9 bg-[#EAE8E2] rounded-xl animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#20201E] hover:bg-[#333330] rounded-xl shadow-xs transition-all"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#A66B50]" />
                    <span>Panel Admin</span>
                  </Link>
                )}

                <div className="flex items-center gap-2 pl-2 border-l border-[#EAE8E2]">
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#20201E] leading-tight">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-[#77756F] flex items-center justify-end gap-1">
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-sm bg-[#A66B50]/15 text-[#A66B50] font-bold">
                          <Shield className="w-2.5 h-2.5" /> ADMIN
                        </span>
                      ) : (
                        <span>CLIENTE</span>
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="p-2 text-[#77756F] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Cerrar sesión"
                    aria-label="Cerrar sesión"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-[#20201E] hover:text-[#A66B50] hover:bg-[#F7F6F3] rounded-xl transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Ingresar</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#A66B50] hover:bg-[#8F5940] rounded-xl shadow-xs transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Registrarse</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#20201E] hover:bg-[#F7F6F3] rounded-xl transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#EAE8E2] bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-[#20201E] hover:bg-[#F7F6F3] rounded-xl"
            >
              Catálogo
            </Link>
            <a
              href="/#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-[#77756F] hover:bg-[#F7F6F3] rounded-xl"
            >
              Categorías
            </a>
            <a
              href="/#tech"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-[#77756F] hover:bg-[#F7F6F3] rounded-xl"
            >
              Tecnología Láser
            </a>
          </nav>

          <div className="pt-3 border-t border-[#EAE8E2] flex flex-col gap-2">
            {user ? (
              <>
                <div className="px-3 py-1.5">
                  <p className="text-xs font-bold text-[#20201E]">{user.name}</p>
                  <p className="text-xs text-[#77756F]">{user.email}</p>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-white bg-[#20201E] rounded-xl"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#A66B50]" />
                    <span>Panel de Administración</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar sesión</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#20201E] bg-[#F7F6F3] rounded-xl"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Iniciar Sesión</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#A66B50] rounded-xl"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Registrarse</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
