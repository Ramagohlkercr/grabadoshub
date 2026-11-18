import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from '../components/products/ProductCard.js';
import { ProductFilter } from '../components/products/ProductFilter.js';
import { EmptyState } from '../components/common/EmptyState.js';
import { LoginPage } from '../pages/LoginPage.js';
import { UnauthorizedPage } from '../pages/UnauthorizedPage.js';
import { ToastProvider } from '../hooks/useToast.js';
import { Product } from '../types/product.js';

const mockProduct: Product = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Cuaderno Ecocuero Grabado',
  description: 'Cuaderno de alta gama con grabado láser térmico en relieve suave.',
  category: 'Ecocuero',
  price: 18500,
  stock: 15,
  available: true,
  featured: true,
  imageUrl: '/assets/products/cuaderno-ecocuero.svg',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('GrabadosHub Frontend Component & Page Suite', () => {
  it('ProductCard renders product title, category, stock badge and formatted price', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );

    expect(screen.getByText('Cuaderno Ecocuero Grabado')).toBeInTheDocument();
    expect(screen.getByText('Ecocuero')).toBeInTheDocument();
    expect(screen.getByText('En Stock')).toBeInTheDocument();
    expect(screen.getByText('Destacado')).toBeInTheDocument();
    expect(screen.getByText(/18\.500/)).toBeInTheDocument();
  });

  it('ProductCard displays Sin Stock when stock is 0 or unavailable', () => {
    const outOfStockProduct: Product = {
      ...mockProduct,
      stock: 0,
      available: false,
      featured: false,
    };

    render(
      <BrowserRouter>
        <ProductCard product={outOfStockProduct} />
      </BrowserRouter>
    );

    expect(screen.getByText('Sin Stock')).toBeInTheDocument();
  });

  it('ProductFilter renders search bar, category pills and triggers callbacks', () => {
    const onSearchChange = vi.fn();
    const onCategoryChange = vi.fn();
    const onAvailableChange = vi.fn();

    render(
      <ProductFilter
        searchTerm=""
        onSearchChange={onSearchChange}
        selectedCategory="all"
        onCategoryChange={onCategoryChange}
        onlyAvailable={false}
        onAvailableChange={onAvailableChange}
        sortBy="createdAt"
        onSortByChange={() => {}}
        sortOrder="desc"
        onSortOrderChange={() => {}}
        totalResults={12}
      />
    );

    expect(screen.getByPlaceholderText(/Buscar por nombre/i)).toBeInTheDocument();
    expect(screen.getByText('12 productos')).toBeInTheDocument();

    // Click on a category tab
    const poliamidaButton = screen.getByRole('tab', { name: 'Poliamida' });
    fireEvent.click(poliamidaButton);
    expect(onCategoryChange).toHaveBeenCalledWith('Poliamida');

    // Toggle available checkbox
    const checkbox = screen.getByLabelText(/Solo en stock/i);
    fireEvent.click(checkbox);
    expect(onAvailableChange).toHaveBeenCalledWith(true);
  });

  it('EmptyState renders message and action button', () => {
    const onAction = vi.fn();
    render(
      <EmptyState
        title="Catálogo Vacío"
        description="No encontramos resultados."
        actionText="Restablecer"
        onAction={onAction}
      />
    );

    expect(screen.getByText('Catálogo Vacío')).toBeInTheDocument();
    expect(screen.getByText('No encontramos resultados.')).toBeInTheDocument();

    const actionBtn = screen.getByRole('button', { name: 'Restablecer' });
    fireEvent.click(actionBtn);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('LoginPage renders email and password fields, and credentials auto-fillers', () => {
    render(
      <BrowserRouter>
        <ToastProvider>
          <LoginPage />
        </ToastProvider>
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar a la plataforma/i })).toBeInTheDocument();

    // Auto-filler buttons
    expect(screen.getByRole('button', { name: /Cargar Admin/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cargar User/i })).toBeInTheDocument();

    // Test clicking Cargar Admin fills the inputs
    const adminFillBtn = screen.getByRole('button', { name: /Cargar Admin/i });
    fireEvent.click(adminFillBtn);

    const emailInput = screen.getByLabelText(/Correo Electrónico/i) as HTMLInputElement;
    expect(emailInput.value).toBe('admin@grabadoshub.com');
  });

  it('UnauthorizedPage renders 403 status and explanation', () => {
    render(
      <BrowserRouter>
        <UnauthorizedPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Error 403 — Acceso Denegado/i)).toBeInTheDocument();
    expect(screen.getByText(/Permisos Insuficientes/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Volver al Catálogo/i })).toBeInTheDocument();
  });
});
