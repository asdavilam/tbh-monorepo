import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { colors, fontSize, radius } from '../../../shared/theme';
function getStockIndicator(currentStock) {
  if (currentStock <= 0) {
    return { color: colors.danger, bg: colors.dangerLight, label: 'Sin stock' };
  }
  return { color: colors.warning, bg: colors.warningLight, label: 'Bajo stock' };
}
export function ShoppingListItem({ item }) {
  const indicator = getStockIndicator(item.currentStock);
  return _jsxs('div', {
    style: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: '18px 20px',
      border: `1px solid ${colors.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '16px',
    },
    children: [
      _jsxs('div', {
        style: { flex: 1, minWidth: 0 },
        children: [
          _jsx('p', {
            style: {
              margin: '0 0 8px',
              fontWeight: 700,
              fontSize: fontSize.md,
              color: colors.text,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
            },
            children: item.productName,
          }),
          _jsxs('div', {
            style: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
            children: [
              _jsxs('span', {
                style: {
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  backgroundColor: indicator.bg,
                  color: indicator.color,
                  padding: '3px 10px',
                  borderRadius: '999px',
                },
                children: [indicator.label, ': ', item.currentStock, ' ', item.unitLabel],
              }),
              _jsxs('span', {
                style: {
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: colors.surfaceLow,
                  color: colors.textMuted,
                  padding: '3px 10px',
                  borderRadius: '999px',
                },
                children: ['M\u00EDn: ', item.minStock, ' ', item.unitLabel],
              }),
            ],
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
            children: item.suggestedQuantity,
          }),
          _jsx('p', {
            style: {
              margin: '2px 0 0',
              fontSize: '11px',
              color: colors.textMuted,
              fontWeight: 500,
            },
            children: item.unitLabel,
          }),
        ],
      }),
    ],
  });
}
