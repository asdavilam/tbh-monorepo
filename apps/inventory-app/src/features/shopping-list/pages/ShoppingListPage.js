import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { Layout } from '../../../shared/components/Layout';
import { colors, fontSize, radius, spacing } from '../../../shared/theme';
import { useShoppingList } from '../hooks/useShoppingList';
import { ShoppingListItem } from '../components/ShoppingListItem';
import { ManualItemForm } from '../components/ManualItemForm';
export function ShoppingListPage() {
  const { user } = useAuth();
  const {
    autoItems,
    manualItems,
    allProducts,
    loading,
    error,
    reload,
    addManualItem,
    removeManualItem,
    clearManualItems,
  } = useShoppingList(user);
  const autoProductIds = autoItems.map((i) => i.productId);
  const manualProductIds = manualItems.map((i) => i.productId);
  const existingIds = [...autoProductIds, ...manualProductIds];
  const totalItems = autoItems.length + manualItems.length;
  if (loading) {
    return _jsx(Layout, {
      title: 'Lista de Compras',
      children: _jsx('div', {
        style: { paddingTop: '48px', textAlign: 'center' },
        children: _jsx('p', {
          style: { color: colors.textMuted, fontSize: fontSize.base },
          children: 'Calculando lista...',
        }),
      }),
    });
  }
  if (error) {
    return _jsx(Layout, {
      title: 'Lista de Compras',
      children: _jsxs('div', {
        style: {
          backgroundColor: colors.dangerLight,
          borderRadius: radius.md,
          padding: '20px',
          textAlign: 'center',
        },
        children: [
          _jsx('p', {
            style: { color: colors.danger, margin: '0 0 12px', fontWeight: 600 },
            children: 'Error al generar la lista',
          }),
          _jsx('button', {
            onClick: reload,
            style: {
              padding: '10px 20px',
              backgroundColor: colors.danger,
              color: '#fff',
              border: 'none',
              borderRadius: radius.sm,
              cursor: 'pointer',
              minHeight: '44px',
              fontSize: fontSize.base,
              fontWeight: 600,
            },
            children: 'Reintentar',
          }),
        ],
      }),
    });
  }
  return _jsx(Layout, {
    title: 'Lista de Compras',
    children: _jsxs('div', {
      style: { display: 'flex', flexDirection: 'column', gap: '10px' },
      children: [
        totalItems > 0 &&
          _jsxs('div', {
            style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' },
            children: [
              _jsxs('span', {
                style: {
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: colors.textMuted,
                },
                children: [totalItems, ' ', totalItems === 1 ? 'producto' : 'productos'],
              }),
              autoItems.length > 0 &&
                _jsxs('span', {
                  style: {
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: colors.dangerLight,
                    color: colors.danger,
                    padding: '2px 8px',
                    borderRadius: '999px',
                  },
                  children: [autoItems.length, ' bajo stock'],
                }),
            ],
          }),
        totalItems === 0 &&
          _jsxs('div', {
            style: { textAlign: 'center', paddingTop: '64px' },
            children: [
              _jsx('div', {
                style: {
                  width: '64px',
                  height: '64px',
                  borderRadius: radius.md,
                  backgroundColor: `${colors.success}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: colors.success,
                },
                children: _jsxs('svg', {
                  width: '32',
                  height: '32',
                  viewBox: '0 0 24 24',
                  fill: 'none',
                  stroke: 'currentColor',
                  strokeWidth: '1.75',
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  'aria-hidden': 'true',
                  children: [
                    _jsx('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
                    _jsx('polyline', { points: '22 4 12 14.01 9 11.01' }),
                  ],
                }),
              }),
              _jsx('p', {
                style: {
                  fontSize: fontSize.lg,
                  fontWeight: 700,
                  color: colors.text,
                  marginBottom: '6px',
                },
                children: 'Todo est\u00E1 completo',
              }),
              _jsx('p', {
                style: { fontSize: fontSize.base, color: colors.textMuted },
                children: 'No hay productos por debajo del stock m\u00EDnimo.',
              }),
            ],
          }),
        autoItems.map((item) => _jsx(ShoppingListItem, { item: item }, item.productId)),
        manualItems.map((item, index) =>
          _jsxs(
            'div',
            {
              style: {
                backgroundColor: colors.surface,
                borderRadius: radius.md,
                padding: '18px 20px',
                border: `1px solid ${colors.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
              },
              children: [
                _jsxs('div', {
                  style: { flex: 1, minWidth: 0 },
                  children: [
                    _jsx('p', {
                      style: {
                        margin: '0 0 6px',
                        fontWeight: 700,
                        fontSize: fontSize.md,
                        color: colors.text,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.01em',
                      },
                      children: item.productName,
                    }),
                    _jsx('span', {
                      style: {
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: colors.surfaceLow,
                        color: colors.primary,
                        padding: '3px 10px',
                        borderRadius: '999px',
                      },
                      children: 'Manual',
                    }),
                  ],
                }),
                _jsxs('div', {
                  style: { textAlign: 'right', flexShrink: 0 },
                  children: [
                    _jsx('p', {
                      style: {
                        margin: '0 0 2px',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: colors.textMuted,
                      },
                      children: 'Comprar',
                    }),
                    _jsx('p', {
                      style: {
                        margin: 0,
                        fontSize: '28px',
                        fontWeight: 900,
                        color: colors.primary,
                        letterSpacing: '-0.03em',
                        lineHeight: 1,
                      },
                      children: item.quantity,
                    }),
                    _jsx('p', {
                      style: { margin: '2px 0 0', fontSize: '11px', color: colors.textMuted },
                      children: item.unitLabel,
                    }),
                  ],
                }),
                _jsx('button', {
                  onClick: () => removeManualItem(index),
                  'aria-label': 'Quitar',
                  style: {
                    padding: '8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: colors.textLight,
                    cursor: 'pointer',
                    minHeight: '44px',
                    minWidth: '44px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: radius.sm,
                  },
                  children: _jsxs('svg', {
                    width: '18',
                    height: '18',
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    strokeWidth: '2',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    'aria-hidden': 'true',
                    children: [
                      _jsx('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
                      _jsx('line', { x1: '6', y1: '6', x2: '18', y2: '18' }),
                    ],
                  }),
                }),
              ],
            },
            `manual-${index}`
          )
        ),
        _jsx(ManualItemForm, {
          allProducts: allProducts,
          existingProductIds: existingIds,
          onAdd: addManualItem,
        }),
        _jsxs('div', {
          style: { display: 'flex', gap: spacing.sm, marginTop: '4px' },
          children: [
            _jsx('button', {
              onClick: reload,
              style: {
                flex: 1,
                padding: '12px',
                backgroundColor: 'transparent',
                color: colors.primary,
                border: `2px solid ${colors.primary}`,
                borderRadius: radius.sm,
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                minHeight: '44px',
              },
              children: 'Actualizar lista',
            }),
            manualItems.length > 0 &&
              _jsx('button', {
                onClick: clearManualItems,
                style: {
                  padding: '12px 16px',
                  backgroundColor: 'transparent',
                  color: colors.textMuted,
                  border: `1px solid ${colors.border}`,
                  borderRadius: radius.sm,
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  minHeight: '44px',
                  whiteSpace: 'nowrap',
                },
                children: 'Limpiar manuales',
              }),
          ],
        }),
      ],
    }),
  });
}
