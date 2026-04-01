import type { PurchaseHistoryItemDto } from '@tbh/application';
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
        Últimas compras (7 días)
      </h2>

      {loading && (
        <p style={{ margin: 0, fontSize: fontSize.sm, color: colors.textMuted }}>Cargando...</p>
      )}

      {!loading && items.length === 0 && (
        <p style={{ margin: 0, fontSize: fontSize.sm, color: colors.textMuted }}>
          Sin compras registradas.
        </p>
      )}

      {!loading &&
        items.map((item) => (
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
              <span style={{ fontSize: fontSize.base, fontWeight: 500, color: colors.text }}>
                {item.productName}
              </span>
              {item.notes && (
                <span style={{ fontSize: fontSize.sm, color: colors.textMuted }}>{item.notes}</span>
              )}
              <span style={{ fontSize: fontSize.sm, color: colors.textLight }}>
                {formatDate(item.purchasedAt)}
              </span>
            </div>
            <span
              style={{
                fontSize: fontSize.base,
                fontWeight: 600,
                color: colors.primary,
                whiteSpace: 'nowrap',
              }}
            >
              +{item.quantity} {item.unitLabel}
            </span>
          </div>
        ))}
    </div>
  );
}
