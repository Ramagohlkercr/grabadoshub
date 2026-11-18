import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts.js';
import { ProductService } from '../../services/productService.js';
import { useToast } from '../../hooks/useToast.js';
import { Product } from '../../types/product.js';
import { Modal } from '../../components/common/Modal.js';
import { TableRowSkeleton } from '../../components/common/Skeleton.js';
import { EmptyState } from '../../components/common/EmptyState.js';
import { ProductPagination } from '../../components/products/ProductPagination.js';
import {
  PlusCircle,
  Search,
  X,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const ProductsListPage: React.FC = () => {
  const {
    products,
    pagination,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    onlyAvailable,
    setOnlyAvailable,
    currentPage,
    setCurrentPage,
    refetch,
  } = useProducts({ initialLimit: 10 });

  const toast = useToast();

  // Deletion modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await ProductService.deleteProduct(productToDelete._id);
      toast.success(`Producto "${productToDelete.name}" eliminado correctamente`);
      setProductToDelete(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.message || 'Error al eliminar el producto');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE8E2]">
        <div>
          <h1 className="text-2xl font-black text-[#20201E]">
            Gestión de Productos
          </h1>
          <p className="text-xs text-[#77756F] mt-1">
            Administrá el catálogo, modificá precios, controlá inventario o agregá nuevos ítems.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#A66B50] hover:bg-[#8F5940] text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Crear Nuevo Producto</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#EAE8E2] p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#77756F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o material..."
            className="w-full pl-10 pr-9 py-2 text-xs bg-[#F7F6F3] border border-[#EAE8E2] focus:border-[#A66B50] rounded-xl text-[#20201E] placeholder:text-[#77756F] focus:outline-hidden"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#77756F] hover:text-[#20201E]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs font-medium bg-[#F7F6F3] border border-[#EAE8E2] focus:border-[#A66B50] rounded-xl py-2 px-3 text-[#20201E] focus:outline-hidden cursor-pointer"
        >
          <option value="all">Todas las categorías</option>
          <option value="Ecocuero">Ecocuero</option>
          <option value="Poliamida">Poliamida</option>
          <option value="Acrílico">Acrílico</option>
          <option value="Accesorios">Accesorios</option>
        </select>

        {/* Availability Toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none px-2">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
            className="w-4 h-4 rounded-md border-[#EAE8E2] text-[#A66B50] focus:ring-[#A66B50] accent-[#A66B50] cursor-pointer"
          />
          <span className="text-xs font-medium text-[#20201E]">
            Solo disponibles
          </span>
        </label>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
          {error}
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#EAE8E2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EAE8E2] bg-[#F7F6F3]/70 text-[11px] font-bold uppercase tracking-wider text-[#77756F]">
                <th className="p-4 w-16">Vista</th>
                <th className="p-4">Producto &amp; Descripción</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Precio</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE8E2] text-xs">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} />)
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <EmptyState
                      title="No se encontraron productos"
                      description="Modificá los filtros de búsqueda o creá un nuevo producto."
                      actionText="Crear nuevo producto"
                      onAction={() => {}}
                    />
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const isAvailable = prod.available && prod.stock > 0;
                  return (
                    <tr key={prod._id} className="hover:bg-[#F7F6F3]/50 transition-colors">
                      {/* Image Thumbnail */}
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-xl bg-[#F0EDE7] border border-[#EAE8E2] overflow-hidden flex items-center justify-center shrink-0">
                          {prod.imageUrl ? (
                            <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-[#77756F]">GH</span>
                          )}
                        </div>
                      </td>

                      {/* Name & Description */}
                      <td className="p-4 max-w-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#20201E] truncate">{prod.name}</span>
                          {prod.featured && (
                            <span title="Destacado">
                              <Sparkles className="w-3.5 h-3.5 text-[#A66B50] shrink-0" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#77756F] truncate mt-0.5">
                          {prod.description}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="p-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md font-semibold text-[11px] bg-[#F7F6F3] border border-[#EAE8E2] text-[#20201E]">
                          {prod.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="p-4 font-bold text-[#20201E] whitespace-nowrap">
                        {formatPrice(prod.price)}
                      </td>

                      {/* Stock */}
                      <td className="p-4 font-medium text-[#77756F] whitespace-nowrap">
                        {prod.stock} un.
                      </td>

                      {/* Availability */}
                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                            isAvailable
                              ? 'bg-[#64836D]/15 text-[#64836D]'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {isAvailable ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {isAvailable ? 'Disponible' : 'Sin Stock'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/products/${prod._id}`}
                            target="_blank"
                            className="p-1.5 text-[#77756F] hover:text-[#20201E] hover:bg-[#F7F6F3] rounded-lg transition-colors"
                            title="Ver en catálogo público"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <Link
                            to={`/admin/products/${prod._id}/edit`}
                            className="p-1.5 text-[#77756F] hover:text-[#A66B50] hover:bg-[#A66B50]/10 rounded-lg transition-colors"
                            title="Editar producto"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setProductToDelete(prod)}
                            className="p-1.5 text-[#77756F] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination in table footer */}
        <div className="px-4 py-2 border-t border-[#EAE8E2]">
          <ProductPagination pagination={pagination} onPageChange={setCurrentPage} />
        </div>
      </div>

      {/* Confirmation Modal for Deletion */}
      <Modal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
        title="¿Eliminar producto del catálogo?"
        description={`Esta acción eliminará permanentemente "${productToDelete?.name}" de la base de datos MongoDB. Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar producto"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
