import { useState, useEffect } from 'react';
import type { ShoppingListItemDto } from '@tbh/application';
import { generateShoppingList } from '../../../shared/di';
import { Layout } from '../../../shared/components/Layout';
import { colors, fontSize, radius, spacing } from '../../../shared/theme';

export function ShoppingListPage() {
  const [items, setItems] = useState<ShoppingListItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const list = await generateShoppingList.execute();
      setItems(list);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

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
          <p style={{ color: colors.danger, margin: 0 }}>Error al generar la lista</p>
          <button
            onClick={load}
            style={{
              marginTop: '12px',
              padding: '10px 20px',
              backgroundColor: colors.danger,
              color: '#fff',
              border: 'none',
              borderRadius: radius.sm,
              cursor: 'pointer',
              minHeight: '44px',
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
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: '48px', color: colors.textMuted }}>
          <p style={{ fontSize: '48px', margin: '0 0 8px' }}>✅</p>
          <p style={{ fontSize: fontSize.base, fontWeight: 500, color: colors.text }}>
            Todo está completo
          </p>
          <p style={{ fontSize: fontSize.sm }}>No hay productos por debajo del stock mínimo.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: fontSize.sm, color: colors.textMuted, margin: 0 }}>
            {items.length} {items.length === 1 ? 'producto' : 'productos'} necesitan reposición
          </p>

          {items.map((item) => (
            <div
              key={item.productId}
              style={{
                backgroundColor: colors.surface,
                borderRadius: radius.md,
                padding: spacing.md,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <p
                  style={{ margin: 0, fontWeight: 600, fontSize: fontSize.lg, color: colors.text }}
                >
                  {item.productName}
                </p>
                <span
                  style={{
                    fontSize: fontSize['2xl'],
                    fontWeight: 800,
                    color: colors.primary,
                  }}
                >
                  {item.suggestedQuantity} {item.unitLabel}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: spacing.sm,
                  marginTop: spacing.sm,
                }}
              >
                <span
                  style={{
                    fontSize: fontSize.sm,
                    backgroundColor: colors.dangerLight,
                    color: colors.danger,
                    padding: '3px 8px',
                    borderRadius: '20px',
                  }}
                >
                  Stock actual: {item.currentStock} {item.unitLabel}
                </span>
                <span
                  style={{
                    fontSize: fontSize.sm,
                    backgroundColor: colors.bg,
                    color: colors.textMuted,
                    padding: '3px 8px',
                    borderRadius: '20px',
                  }}
                >
                  Mínimo: {item.minStock} {item.unitLabel}
                </span>
              </div>
            </div>
          ))}

          <button
            onClick={load}
            style={{
              marginTop: '8px',
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
        </div>
      )}
    </Layout>
  );
}
