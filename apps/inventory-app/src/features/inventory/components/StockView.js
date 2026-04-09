import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useEffect, useCallback } from 'react';
import { getCurrentStock, correctStock } from '../../../shared/di';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { colors, fontSize, radius, spacing, transition } from '../../../shared/theme';
const QUALITATIVE_OPTIONS = [
  { value: 'mucho', label: 'Mucho', color: colors.success },
  { value: 'poco', label: 'Poco', color: colors.warning },
  { value: 'nada', label: 'Nada', color: colors.danger },
];
function formatDate(iso) {
  if (!iso) return 'Sin conteo';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
function CorrectionForm({ item, onSaved, onCancel }) {
  const { user } = useAuth();
  const [finalCount, setFinalCount] = useState('');
  const [qualitativeValue, setQualitativeValue] = useState(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isQualitative = item.unitType === 'qualitative';
  const canSave = isQualitative ? qualitativeValue !== null : finalCount !== '';
  async function handleSave() {
    if (!user || !canSave || saving) return;
    setSaving(true);
    setError('');
    try {
      await correctStock.execute({
        userId: user.id,
        productId: item.productId,
        finalCount: isQualitative ? null : Number(finalCount),
        qualitativeValue: isQualitative ? qualitativeValue : null,
        notes: notes || undefined,
      });
      onSaved({
        currentStock: isQualitative ? item.currentStock : Number(finalCount),
        qualitativeValue: isQualitative ? qualitativeValue : item.qualitativeValue,
        lastCountDate: new Date().toISOString().split('T')[0],
        isLow: !isQualitative && item.minStock !== null && Number(finalCount) < item.minStock,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar la corrección');
    } finally {
      setSaving(false);
    }
  }
  return _jsxs('div', {
    style: {
      backgroundColor: colors.surfaceLow,
      border: `2px solid ${colors.primary}`,
      borderTop: 'none',
      borderRadius: `0 0 ${radius.md} ${radius.md}`,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    children: [
      _jsx('p', {
        style: {
          margin: 0,
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: colors.textMuted,
        },
        children: 'Cantidad real actual',
      }),
      isQualitative
        ? _jsx('div', {
            style: { display: 'flex', gap: '8px' },
            children: QUALITATIVE_OPTIONS.map((opt) =>
              _jsx(
                'button',
                {
                  onClick: () => setQualitativeValue(opt.value),
                  style: {
                    flex: 1,
                    padding: '10px 8px',
                    minHeight: '44px',
                    border: `2px solid ${qualitativeValue === opt.value ? opt.color : colors.border}`,
                    borderRadius: radius.sm,
                    backgroundColor:
                      qualitativeValue === opt.value ? `${opt.color}18` : colors.surface,
                    color: qualitativeValue === opt.value ? opt.color : colors.textMuted,
                    fontSize: fontSize.sm,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: `all ${transition.fast}`,
                  },
                  children: opt.label,
                },
                opt.value
              )
            ),
          })
        : _jsxs('div', {
            style: { display: 'flex', alignItems: 'center', gap: '10px' },
            children: [
              _jsx('input', {
                type: 'number',
                min: '0',
                step: 'any',
                value: finalCount,
                onChange: (e) => setFinalCount(e.target.value),
                placeholder: '0',
                inputMode: 'decimal',
                autoFocus: true,
                style: {
                  flex: 1,
                  height: '52px',
                  padding: '0 16px',
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: radius.sm,
                  fontSize: '20px',
                  fontWeight: 700,
                  color: colors.text,
                  outline: 'none',
                  boxSizing: 'border-box',
                },
              }),
              _jsx('span', {
                style: { fontSize: fontSize.sm, color: colors.textMuted, fontWeight: 600 },
                children: item.unitLabel,
              }),
            ],
          }),
      _jsx('input', {
        type: 'text',
        value: notes,
        onChange: (e) => setNotes(e.target.value),
        placeholder: 'Motivo de correcci\u00F3n (opcional)',
        style: {
          width: '100%',
          height: '44px',
          padding: '0 14px',
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: radius.sm,
          fontSize: fontSize.sm,
          color: colors.text,
          outline: 'none',
          boxSizing: 'border-box',
        },
      }),
      error &&
        _jsx('div', {
          style: {
            backgroundColor: colors.dangerLight,
            color: colors.danger,
            padding: '10px 12px',
            borderRadius: radius.sm,
            fontSize: fontSize.sm,
            fontWeight: 500,
          },
          children: error,
        }),
      _jsxs('div', {
        style: { display: 'flex', gap: '8px' },
        children: [
          _jsx('button', {
            onClick: onCancel,
            style: {
              flex: 1,
              height: '44px',
              backgroundColor: 'transparent',
              color: colors.textMuted,
              border: `1px solid ${colors.border}`,
              borderRadius: radius.sm,
              fontSize: fontSize.sm,
              fontWeight: 600,
              cursor: 'pointer',
            },
            children: 'Cancelar',
          }),
          _jsx('button', {
            onClick: handleSave,
            disabled: !canSave || saving,
            style: {
              flex: 2,
              height: '44px',
              backgroundColor: canSave && !saving ? colors.primary : colors.border,
              color: canSave && !saving ? '#fff' : colors.textMuted,
              border: 'none',
              borderRadius: radius.sm,
              fontSize: fontSize.sm,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: canSave && !saving ? 'pointer' : 'not-allowed',
              transition: `background-color ${transition.fast}`,
            },
            children: saving ? 'Guardando...' : 'Guardar corrección',
          }),
        ],
      }),
    ],
  });
}
function StockCard({ item, isAdmin: adminUser, expanded, onToggle, onSaved }) {
  const isQualitative = item.unitType === 'qualitative';
  const stockColor = item.isLow
    ? colors.danger
    : item.currentStock === null && !isQualitative
      ? colors.textLight
      : colors.success;
  const stockDisplay = isQualitative
    ? (item.qualitativeValue ?? '—')
    : item.currentStock !== null
      ? `${item.currentStock} ${item.unitLabel}`
      : '— sin conteo';
  const qualColor =
    item.qualitativeValue === 'mucho'
      ? colors.success
      : item.qualitativeValue === 'poco'
        ? colors.warning
        : item.qualitativeValue === 'nada'
          ? colors.danger
          : colors.textLight;
  return _jsxs('div', {
    children: [
      _jsxs('button', {
        type: 'button',
        onClick: adminUser ? onToggle : undefined,
        style: {
          width: '100%',
          padding: '14px 16px',
          backgroundColor: expanded ? colors.primaryLight : colors.surface,
          border: `${expanded ? 2 : 1}px solid ${expanded ? colors.primary : item.isLow ? colors.danger + '66' : colors.border}`,
          borderBottom: expanded ? 'none' : undefined,
          borderRadius: expanded ? `${radius.md} ${radius.md} 0 0` : radius.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: adminUser ? 'pointer' : 'default',
          textAlign: 'left',
          gap: '12px',
          minHeight: '60px',
          transition: `background-color ${transition.fast}`,
        },
        children: [
          _jsxs('div', {
            style: { flex: 1, minWidth: 0 },
            children: [
              _jsxs('div', {
                style: { display: 'flex', alignItems: 'center', gap: '8px' },
                children: [
                  _jsx('p', {
                    style: {
                      margin: 0,
                      fontWeight: 700,
                      fontSize: fontSize.md,
                      color: expanded ? colors.primary : colors.text,
                      letterSpacing: '-0.01em',
                      textTransform: 'uppercase',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    },
                    children: item.name,
                  }),
                  item.isLow &&
                    _jsx('span', {
                      style: {
                        fontSize: '10px',
                        fontWeight: 700,
                        backgroundColor: colors.dangerLight,
                        color: colors.danger,
                        padding: '2px 7px',
                        borderRadius: '999px',
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.04em',
                        flexShrink: 0,
                      },
                      children: 'BAJO',
                    }),
                ],
              }),
              _jsxs('p', {
                style: {
                  margin: '3px 0 0',
                  fontSize: '11px',
                  color: colors.textMuted,
                  fontWeight: 500,
                },
                children: [
                  '\u00DAltimo conteo: ',
                  formatDate(item.lastCountDate),
                  item.minStock !== null &&
                    !isQualitative &&
                    _jsxs('span', {
                      style: { marginLeft: '8px' },
                      children: ['\u00B7 M\u00EDn: ', item.minStock, ' ', item.unitLabel],
                    }),
                ],
              }),
            ],
          }),
          _jsxs('div', {
            style: {
              textAlign: 'right',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            },
            children: [
              _jsx('span', {
                style: {
                  fontSize: '20px',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  color: isQualitative ? qualColor : stockColor,
                },
                children: stockDisplay,
              }),
              adminUser &&
                _jsx('svg', {
                  width: '16',
                  height: '16',
                  viewBox: '0 0 24 24',
                  fill: 'none',
                  stroke: expanded ? colors.primary : colors.textMuted,
                  strokeWidth: '2.5',
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  'aria-hidden': 'true',
                  style: {
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: `transform ${transition.base}`,
                  },
                  children: _jsx('polyline', { points: '6 9 12 15 18 9' }),
                }),
            ],
          }),
        ],
      }),
      expanded &&
        adminUser &&
        _jsx(CorrectionForm, {
          item: item,
          onSaved: (updated) => {
            onSaved(updated);
            onToggle();
          },
          onCancel: onToggle,
        }),
    ],
  });
}
// ── Main StockView ────────────────────────────────────────────────────────────
export function StockView() {
  const { user } = useAuth();
  const adminUser = user?.role === 'admin' || user?.role === 'encargado';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const data = await getCurrentStock.execute(user.id);
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar stock');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);
  useEffect(() => {
    load();
  }, [load]);
  function handleToggle(productId) {
    setExpandedId((prev) => (prev === productId ? null : productId));
  }
  function handleSaved(productId, updated) {
    setItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, ...updated } : item))
    );
  }
  const lowCount = items.filter((i) => i.isLow && !i.isVariantContainer).length;
  if (loading) {
    return _jsx('p', {
      style: {
        color: colors.textMuted,
        fontSize: fontSize.base,
        margin: 0,
        paddingTop: '32px',
        textAlign: 'center',
      },
      children: 'Calculando stock...',
    });
  }
  if (error) {
    return _jsx('div', {
      style: {
        backgroundColor: colors.dangerLight,
        color: colors.danger,
        padding: '14px 16px',
        borderRadius: radius.md,
        fontSize: fontSize.base,
        fontWeight: 500,
      },
      children: error,
    });
  }
  return _jsxs('div', {
    style: { display: 'flex', flexDirection: 'column', gap: spacing.md },
    children: [
      _jsxs('div', {
        style: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
        children: [
          _jsxs('span', {
            style: {
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: colors.textMuted,
            },
            children: [items.length, ' productos'],
          }),
          lowCount > 0 &&
            _jsxs('span', {
              style: {
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor: colors.dangerLight,
                color: colors.danger,
                padding: '2px 8px',
                borderRadius: '999px',
              },
              children: [lowCount, ' bajo stock'],
            }),
          adminUser &&
            _jsx('span', {
              style: {
                fontSize: '11px',
                fontWeight: 600,
                color: colors.textMuted,
                backgroundColor: colors.surfaceLow,
                padding: '2px 8px',
                borderRadius: '999px',
              },
              children: 'Toca un producto para corregir',
            }),
        ],
      }),
      items.map((item) => {
        if (item.isVariantContainer) {
          return _jsx(
            'div',
            {
              children: _jsxs('div', {
                style: {
                  padding: '10px 16px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                },
                children: [
                  _jsx('span', {
                    style: {
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: colors.primary,
                    },
                    children: item.name,
                  }),
                  _jsxs('span', {
                    style: {
                      fontSize: fontSize.sm,
                      fontWeight: 700,
                      color: colors.textMuted,
                      backgroundColor: colors.surfaceLow,
                      padding: '2px 10px',
                      borderRadius: '999px',
                    },
                    children: [
                      'Total: ',
                      item.currentStock !== null ? `${item.currentStock} ${item.unitLabel}` : '—',
                    ],
                  }),
                ],
              }),
            },
            item.productId
          );
        }
        // Variant or standalone
        const isVariant = item.parentProductId !== null;
        return _jsx(
          'div',
          {
            style: isVariant
              ? { paddingLeft: '12px', borderLeft: `3px solid ${colors.border}`, marginLeft: '8px' }
              : undefined,
            children: _jsx(StockCard, {
              item: item,
              isAdmin: adminUser,
              expanded: expandedId === item.productId,
              onToggle: () => handleToggle(item.productId),
              onSaved: (updated) => handleSaved(item.productId, updated),
            }),
          },
          item.productId
        );
      }),
    ],
  });
}
