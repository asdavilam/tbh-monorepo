import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { colors, fontSize, radius, spacing } from '../../../shared/theme';
function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}
export function PurchaseHistory({ items, loading }) {
  return _jsxs('div', {
    style: { display: 'flex', flexDirection: 'column', gap: spacing.sm },
    children: [
      _jsx('h2', {
        style: {
          margin: 0,
          fontSize: fontSize.base,
          fontWeight: 600,
          color: colors.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
        children: '\u00DAltimas compras (7 d\u00EDas)',
      }),
      loading &&
        _jsx('p', {
          style: { margin: 0, fontSize: fontSize.sm, color: colors.textMuted },
          children: 'Cargando...',
        }),
      !loading &&
        items.length === 0 &&
        _jsx('p', {
          style: { margin: 0, fontSize: fontSize.sm, color: colors.textMuted },
          children: 'Sin compras registradas.',
        }),
      !loading &&
        items.map((item) =>
          _jsxs(
            'div',
            {
              style: {
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: radius.sm,
                padding: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: spacing.sm,
              },
              children: [
                _jsxs('div', {
                  style: { display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 },
                  children: [
                    _jsx('span', {
                      style: { fontSize: fontSize.base, fontWeight: 500, color: colors.text },
                      children: item.productName,
                    }),
                    item.notes &&
                      _jsx('span', {
                        style: { fontSize: fontSize.sm, color: colors.textMuted },
                        children: item.notes,
                      }),
                    _jsx('span', {
                      style: { fontSize: fontSize.sm, color: colors.textLight },
                      children: formatDate(item.purchasedAt),
                    }),
                  ],
                }),
                _jsxs('span', {
                  style: {
                    fontSize: fontSize.base,
                    fontWeight: 600,
                    color: colors.primary,
                    whiteSpace: 'nowrap',
                  },
                  children: ['+', item.quantity, ' ', item.unitLabel],
                }),
              ],
            },
            item.id
          )
        ),
    ],
  });
}
