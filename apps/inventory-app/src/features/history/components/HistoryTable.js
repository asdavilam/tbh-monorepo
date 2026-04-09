import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { colors, fontSize, radius, spacing } from '../../../shared/theme';
function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}
function getDifferenceLevel(difference, initialStock) {
  if (difference === null || initialStock === null) return 'normal';
  if (difference < 0) return 'error';
  if (initialStock > 0 && difference / initialStock > 0.5) return 'high';
  return 'normal';
}
function DifferenceBadge({ difference, initialStock }) {
  if (difference === null) {
    return _jsx('span', {
      style: { color: colors.textMuted, fontSize: fontSize.sm },
      children: '\u2014',
    });
  }
  const level = getDifferenceLevel(difference, initialStock);
  const styles = {
    normal: { bg: colors.successLight, color: colors.success },
    high: { bg: colors.warningLight, color: colors.warning },
    error: { bg: colors.dangerLight, color: colors.danger },
  };
  const { bg, color } = styles[level];
  return _jsxs('span', {
    style: {
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: radius.full,
      backgroundColor: bg,
      color,
      fontSize: '12px',
      fontWeight: 700,
      minWidth: '40px',
      textAlign: 'center',
    },
    children: [difference > 0 ? '+' : '', difference],
  });
}
export function HistoryTable({ items, loading }) {
  if (loading) {
    return _jsx('div', {
      style: {
        textAlign: 'center',
        padding: spacing.xl,
        color: colors.textMuted,
        fontSize: fontSize.base,
      },
      children: 'Cargando historial...',
    });
  }
  if (items.length === 0) {
    return _jsx('div', {
      style: {
        textAlign: 'center',
        padding: spacing.xl,
        color: colors.textMuted,
        fontSize: fontSize.base,
      },
      children: 'Sin registros para este producto.',
    });
  }
  return _jsx('div', {
    style: { display: 'flex', flexDirection: 'column', gap: '8px' },
    children: items.map((item) =>
      _jsxs(
        'div',
        {
          style: {
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: radius.md,
            padding: '16px 20px',
          },
          children: [
            _jsxs('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              },
              children: [
                _jsx('span', {
                  style: { fontWeight: 700, fontSize: fontSize.base, color: colors.text },
                  children: formatDate(item.date),
                }),
                _jsx(DifferenceBadge, {
                  difference: item.difference,
                  initialStock: item.initialStock,
                }),
              ],
            }),
            item.qualitativeValue !== null
              ? _jsxs('div', {
                  style: { fontSize: fontSize.sm, color: colors.textMuted },
                  children: [
                    'Valor:',
                    ' ',
                    _jsx('span', {
                      style: { color: colors.text, fontWeight: 600 },
                      children: item.qualitativeValue,
                    }),
                  ],
                })
              : _jsxs('div', {
                  style: {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px 16px',
                  },
                  children: [
                    _jsxs('div', {
                      children: [
                        _jsx('div', {
                          style: {
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: colors.textMuted,
                            marginBottom: '2px',
                          },
                          children: 'Inicial',
                        }),
                        _jsx('div', {
                          style: {
                            fontSize: '20px',
                            fontWeight: 900,
                            letterSpacing: '-0.02em',
                            color: colors.text,
                            lineHeight: 1,
                          },
                          children: item.initialStock !== null ? item.initialStock : '—',
                        }),
                      ],
                    }),
                    _jsxs('div', {
                      children: [
                        _jsx('div', {
                          style: {
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: colors.textMuted,
                            marginBottom: '2px',
                          },
                          children: 'Final',
                        }),
                        _jsx('div', {
                          style: {
                            fontSize: '20px',
                            fontWeight: 900,
                            letterSpacing: '-0.02em',
                            color: colors.text,
                            lineHeight: 1,
                          },
                          children: item.finalStock !== null ? item.finalStock : '—',
                        }),
                      ],
                    }),
                  ],
                }),
            item.notes &&
              _jsx('p', {
                style: {
                  margin: '10px 0 0',
                  fontSize: fontSize.sm,
                  color: colors.textMuted,
                  fontStyle: 'italic',
                },
                children: item.notes,
              }),
          ],
        },
        item.id
      )
    ),
  });
}
