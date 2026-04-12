import type { PurchaseHistoryItemDto } from '@tbh/application';
import { ENTRY_TYPE_LABELS } from '@tbh/domain';
import type { EntryType } from '@tbh/domain';
import { colors, fontSize, radius, spacing } from '../../../shared/theme';

interface Props {
  items: PurchaseHistoryItemDto[];
  loading: boolean;
}

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const ENTRY_TYPE_STYLE: Record<EntryType, { color: string; bg: string }> = {
  compra: { color: colors.primary, bg: colors.primaryLight },
  produccion: { color: colors.success, bg: colors.successLight },
};

export function PurchaseHistory({ items, loading }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
      <h2
        style={{
          margin: 0,
          fontSize: fontSize.base,
          fontWeight: 600,
          color: colors.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Últimas entradas (7 días)
      </h2>

      {loading && (
        <p style={{ margin: 0, fontSize: fontSize.sm, color: colors.textMuted }}>Cargando...</p>
      )}

      {!loading && items.length === 0 && (
        <p style={{ margin: 0, fontSize: fontSize.sm, color: colors.textMuted }}>
          Sin entradas registradas.
        </p>
      )}

      {!loading &&
        items.map((item) => {
          const typeStyle = ENTRY_TYPE_STYLE[item.entryType] ?? ENTRY_TYPE_STYLE.compra;
          return (
            <div
              key={item.id}
              style={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: radius.sm,
                padding: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: spacing.sm,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                {/* Nombre + badge de tipo */}
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}
                >
                  <span style={{ fontSize: fontSize.base, fontWeight: 600, color: colors.text }}>
                    {item.productName}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: typeStyle.color,
                      backgroundColor: typeStyle.bg,
                      padding: '2px 7px',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {ENTRY_TYPE_LABELS[item.entryType] ?? item.entryType}
                  </span>
                </div>

                {item.notes && (
                  <span style={{ fontSize: fontSize.sm, color: colors.textMuted }}>
                    {item.notes}
                  </span>
                )}
                <span style={{ fontSize: fontSize.sm, color: colors.textLight }}>
                  {formatDate(item.purchasedAt)}
                </span>
              </div>

              <span
                style={{
                  fontSize: fontSize.base,
                  fontWeight: 700,
                  color: colors.success,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                +{item.quantity} {item.unitLabel}
              </span>
            </div>
          );
        })}
    </div>
  );
}
