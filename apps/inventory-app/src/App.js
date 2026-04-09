import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
function AuthGuard({ children }) {
    const { user, loading } = useAuth();
    if (loading) {
        return (_jsx("div", { style: {
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.bg,
                color: colors.textMuted,
            }, children: "Cargando..." }));
    }
    if (!user)
        return _jsx(Navigate, { to: "/login", replace: true });
    return _jsx(_Fragment, { children: children });
}
function RoleGuard({ children, allowedRoles }) {
    const { user } = useAuth();
    if (!user || !allowedRoles.includes(user.role)) {
        return _jsx(Navigate, { to: "/inventario", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
function AppRoutes() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/registro", element: _jsx(RegisterPage, {}) }), _jsx(Route, { path: "/inventario", element: _jsx(AuthGuard, { children: _jsx(InventoryPage, {}) }) }), _jsx(Route, { path: "/lista", element: _jsx(AuthGuard, { children: _jsx(RoleGuard, { allowedRoles: ['admin', 'encargado'], children: _jsx(ShoppingListPage, {}) }) }) }), _jsx(Route, { path: "/compras", element: _jsx(AuthGuard, { children: _jsx(RoleGuard, { allowedRoles: ['admin', 'encargado'], children: _jsx(PurchasePage, {}) }) }) }), _jsx(Route, { path: "/productos", element: _jsx(AuthGuard, { children: _jsx(RoleGuard, { allowedRoles: ['admin'], children: _jsx(ProductsPage, {}) }) }) }), _jsx(Route, { path: "/productos/nuevo", element: _jsx(AuthGuard, { children: _jsx(RoleGuard, { allowedRoles: ['admin'], children: _jsx(ProductFormPage, {}) }) }) }), _jsx(Route, { path: "/productos/:id/editar", element: _jsx(AuthGuard, { children: _jsx(RoleGuard, { allowedRoles: ['admin'], children: _jsx(ProductFormPage, {}) }) }) }), _jsx(Route, { path: "/historial", element: _jsx(AuthGuard, { children: _jsx(RoleGuard, { allowedRoles: ['admin', 'encargado'], children: _jsx(HistoryPage, {}) }) }) }), _jsx(Route, { path: "/usuarios", element: _jsx(AuthGuard, { children: _jsx(RoleGuard, { allowedRoles: ['admin'], children: _jsx(UsersPage, {}) }) }) }), _jsx(Route, { path: "/usuarios/asignar-productos", element: _jsx(AuthGuard, { children: _jsx(RoleGuard, { allowedRoles: ['admin'], children: _jsx(ProductAssignmentPage, {}) }) }) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/inventario", replace: true }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/inventario", replace: true }) })] }));
}
export function App() {
    return (_jsx(AuthProvider, { children: _jsx(AppRoutes, {}) }));
}
