import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { Layout } from '../../../shared/components/Layout';
import { CountCard } from '../components/CountCard';
import { StockView } from '../components/StockView';
import { useInventoryToday } from '../hooks/useInventoryToday';
import { colors, radius, fontSize, transition, spacing } from '../../../shared/theme';
// ── Variant group header ──────────────────────────────────────────────────────
function VariantGroupHeader({ parentName, savedCount, total }) {
  const done = savedCount >= total;
  return _jsxs('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 4px 4px',
      marginTop: spacing.sm,
    },
    children: [
      _jsx('span', {
        style: {
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: done ? colors.success : colors.primary,
        },
        children: parentName,
      }),
      _jsxs('span', {
        style: {
          fontSize: '11px',
          fontWeight: 700,
          color: done ? colors.success : colors.textMuted,
          backgroundColor: done ? `${colors.success}18` : colors.surfaceLow,
          padding: '2px 8px',
          borderRadius: '999px',
        },
        children: [savedCount, '/', total],
      }),
    ],
  });
}
// ── Render items grouped by parent ────────────────────────────────────────────
function renderInventoryItems(items, userId, onSaved, savedIds) {
  const result = [];
  const rendered = new Set();
  let globalIndex = 0;
  // Group variants by parent
  const byParent = new Map();
  for (const item of items) {
    if (item.parentProductId) {
      const list = byParent.get(item.parentProductId) ?? [];
      list.push(item);
      byParent.set(item.parentProductId, list);
    }
  }
  for (const item of items) {
    if (rendered.has(item.productId)) continue;
    if (!item.parentProductId) {
      // Standalone product
      result.push(
        _jsx(
          CountCard,
          {
            item: item,
            userId: userId,
            index: globalIndex++,
            onSaved: onSaved,
            autoFocus: globalIndex === 1,
          },
          item.productId
        )
      );
      rendered.add(item.productId);
    } else if (!rendered.has(item.parentProductId ?? '')) {
      // First variant of a group — render header then all variants
      const variants = byParent.get(item.parentProductId) ?? [];
      const savedInGroup = variants.filter((v) => savedIds.has(v.productId)).length;
      result.push(
        _jsx(
          VariantGroupHeader,
          { parentName: item.parentName, savedCount: savedInGroup, total: variants.length },
          `header-${item.parentProductId}`
        )
      );
      for (const variant of variants) {
        result.push(
          _jsx(
            CountCard,
            {
              item: variant,
              userId: userId,
              index: globalIndex++,
              onSaved: onSaved,
              autoFocus: false,
            },
            variant.productId
          )
        );
        rendered.add(variant.productId);
      }
      rendered.add(item.parentProductId);
    }
  }
  return result;
}
export function InventoryPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('conteo');
  if (!user) return null;
  const canSeeStock = user.role === 'admin' || user.role === 'encargado';
  const { items, loading, error, reload } = useInventoryToday(user);
  const [savedIds, setSavedIds] = useState(new Set());
  const savedCount = savedIds.size;
  function handleSaved(record) {
    setSavedIds((prev) => new Set([...prev, record.productId]));
  }
  const today = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const tabBar = canSeeStock
    ? _jsx('div', {
        style: {
          display: 'flex',
          backgroundColor: colors.surfaceLow,
          borderRadius: radius.md,
          padding: '4px',
          marginBottom: '16px',
        },
        children: ['conteo', 'stock'].map((t) =>
          _jsx(
            'button',
            {
              onClick: () => setTab(t),
              style: {
                flex: 1,
                height: '38px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: tab === t ? colors.surface : 'transparent',
                color: tab === t ? colors.primary : colors.textMuted,
                fontSize: fontSize.sm,
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                boxShadow: tab === t ? '0 1px 4px rgba(80,60,40,0.10)' : 'none',
                transition: `all ${transition.fast}`,
              },
              children: t === 'conteo' ? 'Conteo diario' : 'Stock actual',
            },
            t
          )
        ),
      })
    : null;
  // Stock tab — admin y encargado
  if (tab === 'stock' && canSeeStock) {
    return _jsxs(Layout, { title: 'Inventario', children: [tabBar, _jsx(StockView, {})] });
  }
  if (loading) {
    return _jsxs(Layout, {
      title: 'Inventario',
      children: [
        tabBar,
        _jsx('div', {
          style: { paddingTop: '48px', textAlign: 'center' },
          children: _jsx('p', {
            style: { color: colors.textMuted, fontSize: fontSize.base },
            children: 'Cargando productos...',
          }),
        }),
      ],
    });
  }
  if (error) {
    return _jsxs(Layout, {
      title: 'Inventario',
      children: [
        tabBar,
        _jsxs('div', {
          style: {
            backgroundColor: colors.dangerLight,
            borderRadius: radius.md,
            padding: '20px',
            textAlign: 'center',
          },
          children: [
            _jsx('p', {
              style: { color: colors.danger, margin: '0 0 12px', fontWeight: 600 },
              children: 'Error al cargar productos',
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
                fontWeight: 600,
                fontSize: fontSize.base,
              },
              children: 'Reintentar',
            }),
          ],
        }),
      ],
    });
  }
  const total = items.length;
  const allDone = total > 0 && savedCount >= total;
  const pending = total - savedCount;
  const progressPct = total > 0 ? (savedCount / total) * 100 : 0;
  return _jsxs(Layout, {
    title: 'Inventario',
    children: [
      tabBar,
      _jsx('p', {
        style: {
          fontSize: '11px',
          fontWeight: 700,
          color: colors.textMuted,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '16px',
        },
        children: today,
      }),
      total === 0
        ? _jsxs('div', {
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
                children: 'No hay productos por contar hoy',
              }),
              _jsx('p', {
                style: { fontSize: fontSize.base, color: colors.textMuted },
                children: 'Regresa ma\u00F1ana o revisa la configuraci\u00F3n.',
              }),
            ],
          })
        : _jsxs('div', {
            style: { display: 'flex', flexDirection: 'column', gap: '12px' },
            children: [
              _jsxs('div', {
                style: {
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  marginBottom: '8px',
                },
                children: [
                  _jsxs('div', {
                    style: {
                      backgroundColor: colors.surfaceLow,
                      borderRadius: radius.md,
                      padding: '16px',
                      borderLeft: `4px solid ${colors.primary}`,
                      minHeight: '100px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    },
                    children: [
                      _jsx('span', {
                        style: {
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: colors.textMuted,
                        },
                        children: 'Por completar',
                      }),
                      _jsx('span', {
                        style: {
                          fontSize: '40px',
                          fontWeight: 900,
                          letterSpacing: '-0.04em',
                          color: colors.text,
                          lineHeight: 1,
                        },
                        children: String(pending).padStart(2, '0'),
                      }),
                    ],
                  }),
                  _jsxs('div', {
                    style: {
                      backgroundColor: colors.surfaceLow,
                      borderRadius: radius.md,
                      padding: '16px',
                      minHeight: '100px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    },
                    children: [
                      _jsx('span', {
                        style: {
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: colors.textMuted,
                        },
                        children: allDone ? '¡Completo!' : 'Guardados',
                      }),
                      _jsx('span', {
                        style: {
                          fontSize: '40px',
                          fontWeight: 900,
                          letterSpacing: '-0.04em',
                          color: allDone ? colors.success : colors.primary,
                          lineHeight: 1,
                        },
                        children: String(savedCount).padStart(2, '0'),
                      }),
                    ],
                  }),
                ],
              }),
              _jsx('div', {
                style: {
                  height: '4px',
                  backgroundColor: colors.surfaceHigh,
                  borderRadius: '2px',
                  overflow: 'hidden',
                  marginBottom: '4px',
                },
                children: _jsx('div', {
                  style: {
                    height: '100%',
                    width: `${progressPct}%`,
                    backgroundColor: allDone ? colors.success : colors.primary,
                    borderRadius: '2px',
                    transition: 'width 0.4s ease',
                  },
                }),
              }),
              renderInventoryItems(items, user.id, handleSaved, savedIds),
            ],
          }),
    ],
  });
}
