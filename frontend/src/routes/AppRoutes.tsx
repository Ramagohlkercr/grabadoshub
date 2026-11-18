import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout.js';
import { AdminLayout } from '../layouts/AdminLayout.js';
import { ProtectedRoute } from './ProtectedRoute.js';

// Public Pages
import { HomePage } from '../pages/HomePage.js';
import { ProductDetailPage } from '../pages/ProductDetailPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { RegisterPage } from '../pages/RegisterPage.js';
import { UnauthorizedPage } from '../pages/UnauthorizedPage.js';
import { NotFoundPage } from '../pages/NotFoundPage.js';

// Admin Pages
import { DashboardPage } from '../pages/admin/DashboardPage.js';
import { ProductsListPage } from '../pages/admin/ProductsListPage.js';
import { ProductCreatePage } from '../pages/admin/ProductCreatePage.js';
import { ProductEditPage } from '../pages/admin/ProductEditPage.js';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Experience */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      {/* Admin Experience (Protected for ADMIN role) */}
      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsListPage />} />
          <Route path="products/new" element={<ProductCreatePage />} />
          <Route path="products/:id/edit" element={<ProductEditPage />} />
        </Route>
      </Route>

      {/* Wildcard 404 */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
