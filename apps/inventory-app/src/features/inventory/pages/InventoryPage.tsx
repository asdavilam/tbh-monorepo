import type { InventoryRecordResponseDto } from '@tbh/application';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { Layout } from '../../../shared/components/Layout';
import { CountCard } from '../components/CountCard';
import { useInventoryToday } from '../hooks/useInventoryToday';
import { colors, fontSize, radius } from '../../../shared/theme';

export function InventoryPage() {
  const { user } = useAuth();

  if (!user) return null;

  const { products, loading, error, reload } = useInventoryToday(user);
  const savedIds = new Set<string>();

  function handleSaved(record: InventoryRecordResponseDto) {
    savedIds.add(record.productId);
  }

  const today = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  if (loading) {
    return (
      <Layout title="Inventario">
        <p style={{ color: colors.textMuted, textAlign: 'center', paddingTop: '40px' }}>
          Cargando productos...
        </p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Inventario">
        <div
          style={{
            backgroundColor: colors.dangerLight,
            borderRadius: radius.md,
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: colors.danger, margin: 0 }}>Error al cargar productos</p>
          <button
            onClick={reload}
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
    <Layout title="Inventario">
      <p
        style={{
          fontSize: fontSize.sm,
          color: colors.textMuted,
          marginBottom: '16px',
          textTransform: 'capitalize',
        }}
      >
        {today}
      </p>

      {products.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            paddingTop: '48px',
            color: colors.textMuted,
          }}
        >
          <p style={{ fontSize: '48px', margin: '0 0 8px' }}>✅</p>
          <p style={{ fontSize: fontSize.base, fontWeight: 500, color: colors.text }}>
            No hay productos por contar hoy
          </p>
          <p style={{ fontSize: fontSize.sm }}>Regresa mañana o revisa la configuración.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: fontSize.sm, color: colors.textMuted, margin: 0 }}>
            {products.length} {products.length === 1 ? 'producto' : 'productos'} por contar
          </p>
          {products.map((product) => (
            <CountCard key={product.id} product={product} userId={user.id} onSaved={handleSaved} />
          ))}
        </div>
      )}
    </Layout>
  );
}
