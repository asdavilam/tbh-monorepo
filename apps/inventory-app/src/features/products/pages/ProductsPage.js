import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_TYPE_LABELS, UNIT_TYPE_LABELS } from '@tbh/domain';
import { getAllUsers } from '../../../shared/di';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { Layout } from '../../../shared/components/Layout';
import { colors, fontSize, radius, spacing } from '../../../shared/theme';
export function ProductsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { products, loading, error, remove } = useProducts();
    const [users, setUsers] = useState([]);
    const [deletingId, setDeletingId] = useState(null);
    const [deleteError, setDeleteError] = useState('');
    useEffect(() => {
        if (!user)
            return;
        getAllUsers
            .execute(user.id)
            .then(setUsers)
            .catch(() => setUsers([]));
    }, [user?.id]);
    function getUserName(userId) {
        if (!userId)
            return 'Sin asignar';
        return users.find((u) => u.id === userId)?.name ?? 'Sin asignar';
    }
    async function handleDelete(id, name) {
        if (!window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`))
            return;
        setDeletingId(id);
        setDeleteError('');
        try {
            await remove(id);
        }
        catch {
            setDeleteError('No se pudo eliminar el producto');
        }
        finally {
            setDeletingId(null);
        }
    }
    return (_jsx(Layout, { title: "Productos", children: _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: spacing.md }, children: [_jsxs("button", { onClick: () => navigate('/productos/nuevo'), style: {
                        backgroundColor: colors.primary,
                        color: '#fff',
                        border: 'none',
                        borderRadius: radius.md,
                        padding: '14px 20px',
                        fontSize: '13px',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        minHeight: '48px',
                        alignSelf: 'flex-start',
                        boxShadow: `0 4px 14px ${colors.primary}33`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }, children: [_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [_jsx("line", { x1: "12", y1: "5", x2: "12", y2: "19" }), _jsx("line", { x1: "5", y1: "12", x2: "19", y2: "12" })] }), "Nuevo producto"] }), deleteError && (_jsx("div", { style: {
                        backgroundColor: colors.dangerLight,
                        color: colors.danger,
                        padding: '12px 14px',
                        borderRadius: radius.md,
                        fontSize: fontSize.sm,
                        fontWeight: 500,
                    }, children: deleteError })), loading && (_jsx("p", { style: { color: colors.textMuted, fontSize: fontSize.base, margin: 0 }, children: "Cargando productos..." })), error && !loading && (_jsx("div", { style: {
                        backgroundColor: colors.dangerLight,
                        color: colors.danger,
                        padding: '12px 14px',
                        borderRadius: radius.md,
                        fontSize: fontSize.base,
                        fontWeight: 500,
                    }, children: error })), !loading && !error && products.length === 0 && (_jsx("p", { style: { color: colors.textMuted, fontSize: fontSize.base, margin: 0 }, children: "No hay productos registrados." })), (() => {
                    const variantParentIds = new Set(products.filter((p) => p.parentProductId !== null).map((p) => p.parentProductId));
                    const rendered = new Set();
                    const nodes = [];
                    for (const product of products) {
                        if (rendered.has(product.id))
                            continue;
                        if (product.parentProductId)
                            continue; // variants rendered under parent
                        const isContainer = variantParentIds.has(product.id);
                        const children = isContainer
                            ? products.filter((p) => p.parentProductId === product.id)
                            : [];
                        nodes.push(_jsxs("div", { children: [_jsx(ProductCard, { product: product, getUserName: getUserName, onEdit: () => navigate(`/productos/${product.id}/editar`), onDelete: () => handleDelete(product.id, product.name), isDeleting: deletingId === product.id, isContainer: isContainer }), children.map((variant) => {
                                    rendered.add(variant.id);
                                    return (_jsx("div", { style: {
                                            paddingLeft: '16px',
                                            borderLeft: `3px solid ${colors.border}`,
                                            marginLeft: '12px',
                                            marginTop: '6px',
                                        }, children: _jsx(ProductCard, { product: variant, getUserName: getUserName, onEdit: () => navigate(`/productos/${variant.id}/editar`), onDelete: () => handleDelete(variant.id, variant.name), isDeleting: deletingId === variant.id, isContainer: false }) }, variant.id));
                                })] }, product.id));
                        rendered.add(product.id);
                    }
                    return nodes;
                })()] }) }));
}
function ProductCard({ product, getUserName, onEdit, onDelete, isDeleting, isContainer, }) {
    return (_jsxs("div", { style: {
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: radius.md,
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            opacity: isDeleting ? 0.6 : 1,
        }, children: [_jsxs("div", { style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '8px',
                }, children: [_jsx("span", { style: {
                            fontWeight: 700,
                            fontSize: fontSize.md,
                            color: colors.text,
                            flex: 1,
                            textTransform: 'uppercase',
                            letterSpacing: '-0.01em',
                        }, children: product.name }), _jsxs("div", { style: {
                            display: 'flex',
                            gap: '6px',
                            flexShrink: 0,
                            flexWrap: 'wrap',
                            justifyContent: 'flex-end',
                        }, children: [isContainer && (_jsx("span", { style: {
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    color: colors.primary,
                                    backgroundColor: `${colors.primary}15`,
                                    padding: '2px 8px',
                                    borderRadius: '999px',
                                    letterSpacing: '0.04em',
                                }, children: "GRUPO" })), _jsx("span", { style: {
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    color: colors.primary,
                                    backgroundColor: colors.surfaceLow,
                                    padding: '3px 10px',
                                    borderRadius: '999px',
                                    letterSpacing: '0.04em',
                                }, children: PRODUCT_TYPE_LABELS[product.type] })] })] }), _jsxs("div", { style: {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '4px 16px',
                    fontSize: fontSize.sm,
                    color: colors.textMuted,
                }, children: [_jsxs("span", { children: [_jsx("span", { style: { fontWeight: 600, color: colors.text }, children: "Unidad:" }), ' ', UNIT_TYPE_LABELS[product.unitType], " (", product.unitLabel, ")"] }), !isContainer && (_jsxs("span", { children: [_jsx("span", { style: { fontWeight: 600, color: colors.text }, children: "Stock m\u00EDn:" }), ' ', product.minStock !== null ? product.minStock : '—'] })), _jsxs("span", { style: { gridColumn: '1 / -1' }, children: [_jsx("span", { style: { fontWeight: 600, color: colors.text }, children: "Asignado a:" }), ' ', getUserName(product.assignedUserId)] })] }), _jsxs("div", { style: { display: 'flex', gap: '8px', marginTop: '2px' }, children: [_jsx("button", { onClick: onEdit, style: {
                            flex: 1,
                            backgroundColor: colors.surfaceLow,
                            color: colors.primary,
                            border: `1px solid ${colors.border}`,
                            borderRadius: radius.sm,
                            padding: '10px',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            minHeight: '44px',
                            letterSpacing: '0.04em',
                        }, children: "Editar" }), _jsx("button", { onClick: onDelete, disabled: isDeleting, style: {
                            flex: 1,
                            backgroundColor: colors.dangerLight,
                            color: colors.danger,
                            border: `1px solid ${colors.danger}44`,
                            borderRadius: radius.sm,
                            padding: '10px',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: isDeleting ? 'not-allowed' : 'pointer',
                            minHeight: '44px',
                            opacity: isDeleting ? 0.6 : 1,
                            letterSpacing: '0.04em',
                        }, children: isDeleting ? 'Eliminando...' : 'Eliminar' })] })] }));
}
