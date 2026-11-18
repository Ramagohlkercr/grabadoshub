import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cpu, Award, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FFFFFF] border-t border-[#EAE8E2] mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#20201E] flex items-center justify-center p-1.5 shadow-xs">
                <img src="/logo.svg" alt="GrabadosHub" className="w-full h-full" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[#20201E]">
                Grabados<span className="text-[#A66B50]">Hub</span>
              </span>
            </div>
            <p className="text-xs text-[#77756F] leading-relaxed">
              Catálogo y sistema de administración de productos con grabado láser personalizado.
            </p>
            <div className="pt-2 text-[11px] text-[#77756F]">
              <span className="font-semibold text-[#20201E]">UAI</span> • Metodologías y Desarrollos Web
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#20201E] mb-4">
              Materiales &amp; Catálogo
            </h4>
            <ul className="space-y-2.5 text-xs text-[#77756F]">
              <li>
                <Link to="/?category=Ecocuero" className="hover:text-[#A66B50] transition-colors">
                  Ecocuero Premium
                </Link>
              </li>
              <li>
                <Link to="/?category=Poliamida" className="hover:text-[#A66B50] transition-colors">
                  Poliamida Técnica PA6
                </Link>
              </li>
              <li>
                <Link to="/?category=Acrílico" className="hover:text-[#A66B50] transition-colors">
                  Acrílico Cristal Óptico
                </Link>
              </li>
              <li>
                <Link to="/?category=Accesorios" className="hover:text-[#A66B50] transition-colors">
                  Accesorios &amp; Acero Inox
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology & Guarantees */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#20201E] mb-4">
              Tecnología &amp; Calidad
            </h4>
            <ul className="space-y-2.5 text-xs text-[#77756F]">
              <li className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-[#A66B50]" />
                <span>Láser Fibra &amp; CO2 de Precisión</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#64836D]" />
                <span>Tolerancias inferiores a 0.05 mm</span>
              </li>
              <li className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-[#A66B50]" />
                <span>Grabado permanente indeleble</span>
              </li>
            </ul>
          </div>

          {/* System & Architecture */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#20201E] mb-4">
              Stack de Producción
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['React 18', 'TypeScript', 'Node.js', 'Express', 'Better Auth', 'MongoDB', 'Zod', 'Vite', 'Tailwind'].map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-[10px] font-semibold bg-[#F7F6F3] text-[#77756F] rounded-md border border-[#EAE8E2]"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[#EAE8E2]">
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#A66B50] hover:text-[#8F5940]"
              >
                <span>Acceso Administrativo</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#EAE8E2] flex flex-col sm:flex-row items-center justify-between text-xs text-[#77756F] gap-4">
          <p>© {new Date().getFullYear()} GrabadosHub — TP 2 Metodologías y Desarrollos Web (UAI)</p>
          <p className="flex items-center gap-1">
            Desarrollado con React, Express y MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
};
