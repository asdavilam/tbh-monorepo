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
      <Layout title="Lista de compras">
        <p style={{ color: colors.textMuted, textAlign: 'center', paddingTop: '40px' }}>
          Calculando lista...
        </p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Lista de compras">
        <div
          style={{
            backgroundColor: colors.dangerLight,
            borderRadius: radius.md,
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: colors.danger, margin: '0 0 12px' }}>Error al generar la lista</p>
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
            }}
          >
            Reintentar
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Lista de compras">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {totalItems === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: '48px', color: colors.textMuted }}>
            <p style={{ fontSize: '48px', margin: '0 0 8px' }}>✅</p>
            <p style={{ fontSize: fontSize.base, fontWeight: 500, color: colors.text }}>
              Todo está completo
            </p>
            <p style={{ fontSize: fontSize.sm }}>No hay productos por debajo del stock mínimo.</p>
          </div>
        ) : (
          <p style={{ fontSize: fontSize.sm, color: colors.textMuted, margin: 0 }}>
            {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en la lista
            {autoItems.length > 0 && (
              <span style={{ color: colors.danger }}> · {autoItems.length} bajo stock</span>
            )}
          </p>
        )}

        {/* Lista auto-generada */}
        {autoItems.map((item) => (
          <ShoppingListItem key={item.productId} item={item} />
        ))}

        {/* Items manuales */}
        {manualItems.map((item, index) => (
          <div
            key={`manual-${index}`}
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.md,
              padding: spacing.md,
              border: `1px solid ${colors.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: spacing.sm,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  margin: '0 0 4px',
                  fontWeight: 600,
                  fontSize: fontSize.lg,
                  color: colors.text,
                }}
              >
                {item.productName}
              </p>
              <span
                style={{
                  fontSize: fontSize.sm,
                  backgroundColor: colors.primaryLight,
                  color: colors.primary,
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontWeight: 500,
                }}
              >
                🟢 Manual
              </span>
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
                {item.quantity}
              </p>
              <p style={{ margin: 0, fontSize: fontSize.sm, color: colors.textMuted }}>
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
                fontSize: '18px',
                minHeight: '44px',
                minWidth: '44px',
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>
        ))}

        {/* Formulario para agregar manualmente */}
        <ManualItemForm
          allProducts={allProducts}
          existingProductIds={existingIds}
          onAdd={addManualItem}
        />

        {/* Acciones */}
        <div style={{ display: 'flex', gap: spacing.sm, marginTop: '4px' }}>
          <button
            onClick={reload}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: 'transparent',
              color: colors.primary,
              border: `1px solid ${colors.primary}`,
              borderRadius: radius.sm,
              fontSize: fontSize.base,
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
                fontSize: fontSize.base,
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
