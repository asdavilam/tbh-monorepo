import type { ShoppingListItemDto } from '@tbh/application';
import { colors, fontSize, radius } from '../../../shared/theme';

function getStockIndicator(currentStock: number) {
  if (currentStock <= 0) {
    return { color: colors.danger, bg: colors.dangerLight, label: 'Sin stock' };
  }
  return { color: colors.warning, bg: colors.warningLight, label: 'Bajo stock' };
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
        padding: '18px 20px',
        border: `1px solid ${colors.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: '0 0 8px',
            fontWeight: 700,
            fontSize: fontSize.md,
            color: colors.text,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
          }}
        >
          {item.productName}
        </p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              backgroundColor: indicator.bg,
              color: indicator.color,
              padding: '3px 10px',
              borderRadius: '999px',
            }}
          >
            {indicator.label}: {item.currentStock} {item.unitLabel}
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: colors.surfaceLow,
              color: colors.textMuted,
              padding: '3px 10px',
              borderRadius: '999px',
            }}
          >
            Mín: {item.minStock} {item.unitLabel}
          </span>
        </div>
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p
          style={{
            margin: '0 0 2px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: colors.textMuted,
          }}
        >
          Comprar
        </p>
        <p
          style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: 900,
            color: colors.primary,
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          {item.suggestedQuantity}
        </p>
        <p
          style={{ margin: '2px 0 0', fontSize: '11px', color: colors.textMuted, fontWeight: 500 }}
        >
          {item.unitLabel}
        </p>
      </div>
    </div>
  );
}
