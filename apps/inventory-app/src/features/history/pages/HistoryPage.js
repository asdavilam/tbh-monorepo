import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { Layout } from '../../../shared/components/Layout';
import { colors, fontSize, radius, minTapTarget } from '../../../shared/theme';
import { useInventoryHistory } from '../hooks/useInventoryHistory';
import { HistoryTable } from '../components/HistoryTable';
export function HistoryPage() {
  const { user } = useAuth();
  const {
    products,
    history,
    loadingProducts,
    loadingHistory,
    error,
    selectedProductId,
    selectProduct,
  } = useInventoryHistory(user);
  return _jsx(Layout, {
    title: 'Historial',
    children: _jsxs('div', {
      style: { display: 'flex', flexDirection: 'column', gap: '16px' },
      children: [
        _jsxs('div', {
          style: { display: 'flex', flexDirection: 'column', gap: '6px' },
          children: [
            _jsx('label', {
              htmlFor: 'product-select',
              style: {
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: colors.textMuted,
              },
              children: 'Selecciona un producto',
            }),
            _jsxs('div', {
              style: { position: 'relative' },
              children: [
                _jsxs('select', {
                  id: 'product-select',
                  value: selectedProductId,
                  onChange: (e) => selectProduct(e.target.value),
                  disabled: loadingProducts,
                  style: {
                    width: '100%',
                    padding: '0 16px',
                    height: minTapTarget,
                    fontSize: fontSize.md,
                    border: `2px solid ${selectedProductId ? colors.primary : colors.border}`,
                    borderRadius: radius.md,
                    backgroundColor: colors.surfaceLow,
                    color: selectedProductId ? colors.text : colors.textMuted,
                    appearance: 'none',
                    cursor: loadingProducts ? 'not-allowed' : 'pointer',
                    fontWeight: selectedProductId ? 600 : 400,
                    outline: 'none',
                  },
                  children: [
                    _jsx('option', {
                      value: '',
                      children: loadingProducts ? 'Cargando productos...' : '— Elige un producto —',
                    }),
                    products.map((p) =>
                      _jsxs(
                        'option',
                        { value: p.id, children: [p.name, ' (', p.unitLabel, ')'] },
                        p.id
                      )
                    ),
                  ],
                }),
                _jsx('svg', {
                  width: '16',
                  height: '16',
                  viewBox: '0 0 24 24',
                  fill: 'none',
                  stroke: colors.textMuted,
                  strokeWidth: '2',
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  'aria-hidden': 'true',
                  style: {
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  },
                  children: _jsx('polyline', { points: '6 9 12 15 18 9' }),
                }),
              ],
            }),
          ],
        }),
        error &&
          _jsx('div', {
            style: {
              backgroundColor: colors.dangerLight,
              color: colors.danger,
              padding: '12px 16px',
              borderRadius: radius.md,
              fontSize: fontSize.base,
              fontWeight: 500,
            },
            children: error,
          }),
        selectedProductId
          ? _jsxs(_Fragment, {
              children: [
                !loadingHistory &&
                  !error &&
                  _jsxs('p', {
                    style: {
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: colors.textMuted,
                      margin: 0,
                    },
                    children: [
                      history.length,
                      ' registro',
                      history.length !== 1 ? 's' : '',
                      ' encontrado',
                      history.length !== 1 ? 's' : '',
                    ],
                  }),
                _jsx(HistoryTable, { items: history, loading: loadingHistory }),
              ],
            })
          : !loadingProducts &&
            _jsx('div', {
              style: {
                textAlign: 'center',
                padding: '48px 0',
                color: colors.textMuted,
                fontSize: fontSize.base,
              },
              children: 'Selecciona un producto para ver su historial.',
            }),
      ],
    }),
  });
}
