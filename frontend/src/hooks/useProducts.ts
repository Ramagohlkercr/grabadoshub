import { useState, useEffect, useCallback, useRef } from 'react';
import { Product, PaginationMeta } from '../types/product.js';
import { ProductService, ProductFilterParams } from '../services/productService.js';

interface UseProductsOptions {
  initialCategory?: string;
  initialLimit?: number;
  featuredOnly?: boolean;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: options.initialLimit || 12,
    total: 0,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(options.initialCategory || 'all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search term by 350ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: ProductFilterParams = {
        page: currentPage,
        limit: options.initialLimit || 12,
        search: debouncedSearch,
        category: selectedCategory,
        available: onlyAvailable ? 'true' : 'all',
        sortBy,
        sortOrder,
      };

      if (options.featuredOnly) {
        params.featured = 'true';
      }

      const res = await ProductService.getProducts(params);
      setProducts(res.products);
      setPagination(res.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    debouncedSearch,
    selectedCategory,
    onlyAvailable,
    sortBy,
    sortOrder,
    options.initialLimit,
    options.featuredOnly,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleAvailableChange = (avail: boolean) => {
    setOnlyAvailable(avail);
    setCurrentPage(1);
  };

  return {
    products,
    pagination,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory: handleCategoryChange,
    onlyAvailable,
    setOnlyAvailable: handleAvailableChange,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    refetch: fetchProducts,
  };
}
