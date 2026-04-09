import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './shared/contexts/AuthContext';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { InventoryPage } from './features/inventory/pages/InventoryPage';
import { ShoppingListPage } from './features/shopping-list/pages/ShoppingListPage';
import { PurchasePage } from './features/purchases/pages/PurchasePage';
import { ProductsPage } from './features/products/pages/ProductsPage';
import { ProductFormPage } from './features/products/pages/ProductFormPage';
import { HistoryPage } from './features/history/pages/HistoryPage';
import { UsersPage } from './features/users/pages/UsersPage';
import { ProductAssignmentPage } from './features/users/pages/ProductAssignmentPage';
import { colors } from './shared/theme';
import type { ReactNode } from 'react';

function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.bg,
          color: colors.textMuted,
        }}
      >
        Cargando...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

function RoleGuard({ children, allowedRoles }: { children: ReactNode; allowedRoles: string[] }) {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/inventario" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      <Route
        path="/inventario"
        element={
          <AuthGuard>
            <InventoryPage />
          </AuthGuard>
        }
      />

      <Route
        path="/lista"
        element={
          <AuthGuard>
            <RoleGuard allowedRoles={['admin', 'encargado']}>
              <ShoppingListPage />
            </RoleGuard>
          </AuthGuard>
        }
      />

      <Route
        path="/compras"
        element={
          <AuthGuard>
            <RoleGuard allowedRoles={['admin', 'encargado']}>
              <PurchasePage />
            </RoleGuard>
          </AuthGuard>
        }
      />

      <Route
        path="/productos"
        element={
          <AuthGuard>
            <RoleGuard allowedRoles={['admin']}>
              <ProductsPage />
            </RoleGuard>
          </AuthGuard>
        }
      />

      <Route
        path="/productos/nuevo"
        element={
          <AuthGuard>
            <RoleGuard allowedRoles={['admin']}>
              <ProductFormPage />
            </RoleGuard>
          </AuthGuard>
        }
      />

      <Route
        path="/productos/:id/editar"
        element={
          <AuthGuard>
            <RoleGuard allowedRoles={['admin']}>
              <ProductFormPage />
            </RoleGuard>
          </AuthGuard>
        }
      />

      <Route
        path="/historial"
        element={
          <AuthGuard>
            <RoleGuard allowedRoles={['admin', 'encargado']}>
              <HistoryPage />
            </RoleGuard>
          </AuthGuard>
        }
      />

      <Route
        path="/usuarios"
        element={
          <AuthGuard>
            <RoleGuard allowedRoles={['admin']}>
              <UsersPage />
            </RoleGuard>
          </AuthGuard>
        }
      />

      <Route
        path="/usuarios/asignar-productos"
        element={
          <AuthGuard>
            <RoleGuard allowedRoles={['admin']}>
              <ProductAssignmentPage />
            </RoleGuard>
          </AuthGuard>
        }
      />

      {/* Redirigir raíz a inventario */}
      <Route path="/" element={<Navigate to="/inventario" replace />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/inventario" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
