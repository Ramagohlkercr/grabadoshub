import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar.js';
import { ToastContainer } from '../components/common/Toast.js';
import { Menu, X } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F7F6F3]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="w-64 max-w-[80%] bg-white h-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <AdminSidebar />
          </div>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="p-4 text-white hover:text-stone-300 self-start"
            aria-label="Cerrar barra lateral"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-[#EAE8E2] sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 text-[#20201E] hover:bg-[#F7F6F3] rounded-xl"
            aria-label="Abrir panel lateral"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-[#20201E]">
              Grabados<span className="text-[#A66B50]">Hub</span> Admin
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};
