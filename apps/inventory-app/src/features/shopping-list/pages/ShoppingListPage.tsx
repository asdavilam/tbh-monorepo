import { useAuth } from '../../../shared/contexts/AuthContext';
import { Layout } from '../../../shared/components/Layout';
import { colors, fontSize, radius, spacing } from '../../../shared/theme';
import { useShoppingList } from '../hooks/useShoppingList';
import { ShoppingListItem } from '../components/ShoppingListItem';
import { ManualItemForm } from '../components/ManualItemForm';

export function ShoppingListPage() {
  const { user } = useAuth();
  const {
    autoItems,
    manualItems,
    allProducts,
    loading,
    error,
    reload,
    addManualItem,
    removeManualItem,
    clearManualItems,
  } = useShoppingList(user!);

  const autoProductIds = autoItems.map((i) => i.productId);
  const manualProductIds = manualItems.map((i) => i.productId);
  const existingIds = [...autoProductIds, ...manualProductIds];
  const totalItems = autoItems.length + manualItems.length;

  if (loading) {
    return (
      <Layout title="Lista de Compras">
        <div style={{ paddingTop: '48px', textAlign: 'center' }}>
          <p style={{ color: colors.textMuted, fontSize: fontSize.base }}>Calculando lista...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Lista de Compras">
        <div
          style={{
            backgroundColor: colors.dangerLight,
            borderRadius: radius.md,
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: colors.danger, margin: '0 0 12px', fontWeight: 600 }}>
            Error al generar la lista
          </p>
          <button
            onClick={reload}
            style={{
              padding: '10px 20px',
              backgroundColor: colors.danger,
              color: '#fff',
              border: 'none',
              borderRadius: radius.sm,
              cursor: 'pointer',
              minHeight: '44px',
              fontSize: fontSize.base,
              fontWeight: 600,
            }}
          >
            Reintentar
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Lista de Compras">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Header badge */}
        {totalItems > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: colors.textMuted,
              }}
            >
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </span>
            {autoItems.length > 0 && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: colors.dangerLight,
                  color: colors.danger,
                  padding: '2px 8px',
                  borderRadius: '999px',
                }}
              >
                {autoItems.length} bajo stock
              </span>
            )}
          </div>
        )}

        {totalItems === 0 && (
          <div style={{ textAlign: 'center', paddingTop: '64px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: radius.md,
                backgroundColor: `${colors.success}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: colors.success,
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <p
              style={{
                fontSize: fontSize.lg,
                fontWeight: 700,
                color: colors.text,
                marginBottom: '6px',
              }}
            >
              Todo está completo
            </p>
            <p style={{ fontSize: fontSize.base, color: colors.textMuted }}>
              No hay productos por debajo del stock mínimo.
            </p>
          </div>
        )}

        {/* Auto-generated items */}
        {autoItems.map((item) => (
          <ShoppingListItem key={item.productId} item={item} />
        ))}

        {/* Manual items */}
        {manualItems.map((item, index) => (
          <div
            key={`manual-${index}`}
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.md,
              padding: '18px 20px',
              border: `1px solid ${colors.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  margin: '0 0 6px',
                  fontWeight: 700,
                  fontSize: fontSize.md,
                  color: colors.text,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                }}
              >
                {item.productName}
              </p>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: colors.surfaceLow,
                  color: colors.primary,
                  padding: '3px 10px',
                  borderRadius: '999px',
                }}
              >
                Manual
              </span>
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
                {item.quantity}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: colors.textMuted }}>
                {item.unitLabel}
              </p>
            </div>
            <button
              onClick={() => removeManualItem(index)}
              aria-label="Quitar"
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                color: colors.textLight,
                cursor: 'pointer',
                minHeight: '44px',
                minWidth: '44px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: radius.sm,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}

        {/* Add manual item form */}
        <ManualItemForm
          allProducts={allProducts}
          existingProductIds={existingIds}
          onAdd={addManualItem}
        />

        {/* Actions */}
        <div style={{ display: 'flex', gap: spacing.sm, marginTop: '4px' }}>
          <button
            onClick={reload}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: 'transparent',
              color: colors.primary,
              border: `2px solid ${colors.primary}`,
              borderRadius: radius.sm,
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            Actualizar lista
          </button>
          {manualItems.length > 0 && (
            <button
              onClick={clearManualItems}
              style={{
                padding: '12px 16px',
                backgroundColor: 'transparent',
                color: colors.textMuted,
                border: `1px solid ${colors.border}`,
                borderRadius: radius.sm,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: '44px',
                whiteSpace: 'nowrap',
              }}
            >
              Limpiar manuales
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
