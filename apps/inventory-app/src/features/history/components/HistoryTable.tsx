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

  const styles: Record<DifferenceLevel, { bg: string; color: string; label: string }> = {
    normal: { bg: colors.successLight, color: colors.success, label: `${difference}` },
    high: { bg: colors.warningLight, color: colors.warning, label: `${difference}` },
    error: { bg: colors.dangerLight, color: colors.danger, label: `${difference}` },
  };

  const { bg, color, label } = styles[level];

  return (
    <span
      style={{
        display: 'inline-block',
        padding: `2px ${spacing.xs}`,
        borderRadius: radius.sm,
        backgroundColor: bg,
        color,
        fontSize: fontSize.sm,
        fontWeight: 600,
        minWidth: '36px',
        textAlign: 'center',
      }}
    >
      {label}
    </span>
  );
}

function DifferenceIndicator({
  difference,
  initialStock,
}: {
  difference: number | null;
  initialStock: number | null;
}) {
  if (difference === null) return null;
  const level = getDifferenceLevel(difference, initialStock);
  const icons: Record<DifferenceLevel, string> = { normal: '🟢', high: '🟡', error: '🔴' };
  return <span style={{ marginRight: spacing.xs }}>{icons[level]}</span>;
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
    <div style={{ overflowX: 'auto' }}>
      {/* Vista móvil: cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: radius.md,
              padding: spacing.md,
            }}
          >
            {/* Fecha y estado */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing.sm,
              }}
            >
              <span style={{ fontWeight: 600, fontSize: fontSize.base, color: colors.text }}>
                {formatDate(item.date)}
              </span>
              <DifferenceIndicator difference={item.difference} initialStock={item.initialStock} />
            </div>

            {/* Valor cualitativo */}
            {item.qualitativeValue !== null ? (
              <div style={{ color: colors.textMuted, fontSize: fontSize.sm }}>
                Valor:{' '}
                <span style={{ color: colors.text, fontWeight: 500 }}>{item.qualitativeValue}</span>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: spacing.sm,
                  marginTop: spacing.xs,
                }}
              >
                <div>
                  <div style={{ fontSize: fontSize.sm, color: colors.textMuted }}>
                    Stock inicial
                  </div>
                  <div style={{ fontSize: fontSize.md, fontWeight: 500, color: colors.text }}>
                    {item.initialStock !== null ? item.initialStock : '—'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: fontSize.sm, color: colors.textMuted }}>Stock final</div>
                  <div style={{ fontSize: fontSize.md, fontWeight: 500, color: colors.text }}>
                    {item.finalStock !== null ? item.finalStock : '—'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: fontSize.sm, color: colors.textMuted }}>Diferencia</div>
                  <DifferenceBadge difference={item.difference} initialStock={item.initialStock} />
                </div>
              </div>
            )}

            {/* Notas */}
            {item.notes && (
              <div
                style={{
                  marginTop: spacing.sm,
                  fontSize: fontSize.sm,
                  color: colors.textMuted,
                  fontStyle: 'italic',
                }}
              >
                {item.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Leyenda */}
      <div
        style={{
          marginTop: spacing.md,
          display: 'flex',
          gap: spacing.md,
          flexWrap: 'wrap',
          fontSize: fontSize.sm,
          color: colors.textMuted,
        }}
      >
        <span>🟢 Consumo normal</span>
        <span>🟡 Consumo alto (revisar)</span>
        <span>🔴 Posible error o inconsistencia</span>
      </div>
    </div>
  );
}
