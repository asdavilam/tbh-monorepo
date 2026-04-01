import type { ShoppingListItemDto } from '@tbh/application';
import { colors, fontSize, radius, spacing } from '../../../shared/theme';

function getStockIndicator(currentStock: number) {
  if (currentStock <= 0) {
    return { icon: '🔴', label: 'Sin stock', color: colors.danger, bg: colors.dangerLight };
  }
  return { icon: '🟡', label: 'Bajo stock', color: colors.warning, bg: colors.warningLight };
}

interface Props {
  item: ShoppingListItemDto;
}

export function ShoppingListItem({ item }: Props) {
  const indicator = getStockIndicator(item.currentStock);

  return (
    <div
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.md,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: spacing.sm,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: '0 0 8px',
              fontWeight: 600,
              fontSize: fontSize.lg,
              color: colors.text,
            }}
          >
            {item.productName}
          </p>
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: fontSize.sm,
                backgroundColor: indicator.bg,
                color: indicator.color,
                padding: '3px 10px',
                borderRadius: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 500,
              }}
            >
              {indicator.icon} {item.currentStock} {item.unitLabel}
            </span>
            <span
              style={{
                fontSize: fontSize.sm,
                backgroundColor: colors.bg,
                color: colors.textMuted,
                padding: '3px 10px',
                borderRadius: '20px',
              }}
            >
              Mín: {item.minStock} {item.unitLabel}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ margin: '0 0 2px', fontSize: fontSize.sm, color: colors.textMuted }}>
            Comprar
          </p>
          <p
            style={{
              margin: 0,
              fontSize: fontSize['2xl'],
              fontWeight: 800,
              color: colors.primary,
              lineHeight: 1,
            }}
          >
            {item.suggestedQuantity}
          </p>
          <p style={{ margin: 0, fontSize: fontSize.sm, color: colors.textMuted }}>
            {item.unitLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
