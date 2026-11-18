import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../../services/authClient.js';
import { ProductService } from '../../services/productService.js';
import { ProductMetrics } from '../../types/product.js';
import { MetricCard } from '../../components/admin/MetricCard.js';
import { Skeleton } from '../../components/common/Skeleton.js';
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  Layers,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  Edit,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { data: session } = useSession();
  const [metrics, setMetrics] = useState<ProductMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      setLoading(true);
      try {
        const data = await ProductService.getMetrics();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las métricas');
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-8">
      {/* Top Greeting & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE8E2]">
        <div>
          <h1 className="text-2xl font-black text-[#20201E]">
            Hola, {session?.user?.name || 'Administrador'} 👋
          </h1>
          <p className="text-xs text-[#77756F] mt-1">
            Resumen en tiempo real del catálogo, disponibilidad de productos y control de stock.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#A66B50] hover:bg-[#8F5940] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nuevo Producto</span>
          </Link>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#EAE8E2] bg-white hover:bg-[#F7F6F3] text-xs font-semibold text-[#20201E] transition-colors"
          >
            <span>Ver Catálogo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
          {error}
        </div>
      )}

      {/* Metrics Row */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : metrics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Productos"
            value={metrics.total}
            description="Registrados en el catálogo"
            icon={Package}
            variant="default"
          />
          <MetricCard
            label="Disponibles"
            value={metrics.available}
            description="Listos para grabado"
            icon={CheckCircle2}
            variant="positive"
          />
          <MetricCard
            label="Sin Stock"
            value={metrics.outOfStock}
            description="Requieren reposición"
            icon={AlertTriangle}
            variant="warning"
          />
          <MetricCard
            label="Categorías"
            value={metrics.categoriesCount}
            description="Líneas de materiales"
            icon={Layers}
            variant="accent"
          />
        </div>
      ) : null}

      {/* Two Column Section: Category Distribution & Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EAE8E2] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE8E2]">
            <h3 className="font-bold text-sm text-[#20201E]">
              Distribución por Categoría
            </h3>
            <span className="text-[11px] font-semibold text-[#77756F]">
              Datos reales de MongoDB
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 rounded-xl" />
              <Skeleton className="h-10 rounded-xl" />
              <Skeleton className="h-10 rounded-xl" />
            </div>
          ) : metrics?.categoryStats && metrics.categoryStats.length > 0 ? (
            <div className="space-y-3">
              {metrics.categoryStats.map((item) => {
                const percentage = metrics.total > 0 ? Math.round((item.count / metrics.total) * 100) : 0;
                return (
                  <div key={item.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#20201E]">{item.category}</span>
                      <span className="text-[#77756F] font-medium">{item.count} un. ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-[#F7F6F3] rounded-full overflow-hidden border border-[#EAE8E2]/60">
                      <div
                        className="h-full bg-[#A66B50] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-[#77756F]">No hay productos registrados aún.</p>
          )}
        </div>

        {/* Recently Added Products */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EAE8E2] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE8E2]">
            <h3 className="font-bold text-sm text-[#20201E]">
              Productos Recientes
            </h3>
            <Link
              to="/admin/products"
              className="text-xs font-semibold text-[#A66B50] hover:text-[#8F5940] flex items-center gap-1"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
            </div>
          ) : metrics?.recentProducts && metrics.recentProducts.length > 0 ? (
            <div className="divide-y divide-[#EAE8E2]">
              {metrics.recentProducts.map((prod) => (
                <div key={prod._id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#F0EDE7] border border-[#EAE8E2] shrink-0 overflow-hidden flex items-center justify-center">
                      {prod.imageUrl ? (
                        <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[9px] text-[#77756F]">GH</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#20201E] truncate">{prod.name}</p>
                      <p className="text-[10px] text-[#77756F]">
                        {prod.category} • {formatPrice(prod.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        prod.available && prod.stock > 0
                          ? 'bg-[#64836D]/15 text-[#64836D]'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {prod.available && prod.stock > 0 ? `${prod.stock} un.` : 'Agotado'}
                    </span>
                    <Link
                      to={`/admin/products/${prod._id}/edit`}
                      className="p-1.5 text-[#77756F] hover:text-[#20201E] hover:bg-[#F7F6F3] rounded-lg transition-colors"
                      title="Editar producto"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#77756F]">No hay productos recientes.</p>
          )}
        </div>
      </div>
    </div>
  );
};
