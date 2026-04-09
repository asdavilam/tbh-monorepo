import type { InventoryHistoryItemDto } from '@tbh/application';
import { colors, fontSize, radius, spacing } from '../../../shared/theme';

interface Props {
  items: InventoryHistoryItemDto[];
  loading: boolean;
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

type DifferenceLevel = 'normal' | 'high' | 'error';

function getDifferenceLevel(
  difference: number | null,
  initialStock: number | null
): DifferenceLevel {
  if (difference === null || initialStock === null) return 'normal';
  if (difference < 0) return 'error';
  if (initialStock > 0 && difference / initialStock > 0.5) return 'high';
  return 'normal';
}

function DifferenceBadge({
  difference,
  initialStock,
}: {
  difference: number | null;
  initialStock: number | null;
}) {
  if (difference === null) {
    return <span style={{ color: colors.textMuted, fontSize: fontSize.sm }}>—</span>;
  }

  const level = getDifferenceLevel(difference, initialStock);

  const styles: Record<DifferenceLevel, { bg: string; color: string }> = {
    normal: { bg: colors.successLight, color: colors.success },
    high: { bg: colors.warningLight, color: colors.warning },
    error: { bg: colors.dangerLight, color: colors.danger },
  };

  const { bg, color } = styles[level];

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: radius.full,
        backgroundColor: bg,
        color,
        fontSize: '12px',
        fontWeight: 700,
        minWidth: '40px',
        textAlign: 'center',
      }}
    >
      {difference > 0 ? '+' : ''}
      {difference}
    </span>
  );
}

export function HistoryTable({ items, loading }: Props) {
  if (loading) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: spacing.xl,
          color: colors.textMuted,
          fontSize: fontSize.base,
        }}
      >
        Cargando historial...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: spacing.xl,
          color: colors.textMuted,
          fontSize: fontSize.base,
        }}
      >
        Sin registros para este producto.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: radius.md,
            padding: '16px 20px',
          }}
        >
          {/* Fecha */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <span style={{ fontWeight: 700, fontSize: fontSize.base, color: colors.text }}>
              {formatDate(item.date)}
            </span>
            <DifferenceBadge difference={item.difference} initialStock={item.initialStock} />
          </div>

          {item.qualitativeValue !== null ? (
            <div style={{ fontSize: fontSize.sm, color: colors.textMuted }}>
              Valor:{' '}
              <span style={{ color: colors.text, fontWeight: 600 }}>{item.qualitativeValue}</span>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px 16px',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: colors.textMuted,
                    marginBottom: '2px',
                  }}
                >
                  Inicial
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    color: colors.text,
                    lineHeight: 1,
                  }}
                >
                  {item.initialStock !== null ? item.initialStock : '—'}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: colors.textMuted,
                    marginBottom: '2px',
                  }}
                >
                  Final
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    color: colors.text,
                    lineHeight: 1,
                  }}
                >
                  {item.finalStock !== null ? item.finalStock : '—'}
                </div>
              </div>
            </div>
          )}

          {item.notes && (
            <p
              style={{
                margin: '10px 0 0',
                fontSize: fontSize.sm,
                color: colors.textMuted,
                fontStyle: 'italic',
              }}
            >
              {item.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
