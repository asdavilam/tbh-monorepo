import { useState } from 'react';
import type { InventoryRecordResponseDto } from '@tbh/application';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { Layout } from '../../../shared/components/Layout';
import { CountCard } from '../components/CountCard';
import { useInventoryToday } from '../hooks/useInventoryToday';
import { colors, fontSize, radius, spacing } from '../../../shared/theme';

export function InventoryPage() {
  const { user } = useAuth();

  if (!user) return null;

  const { items, loading, error, reload } = useInventoryToday(user);
  const [savedCount, setSavedCount] = useState(0);

  function handleSaved(_record: InventoryRecordResponseDto) {
    setSavedCount((n) => n + 1);
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
            padding: spacing.md,
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

  const total = items.length;
  const allDone = total > 0 && savedCount >= total;

  return (
    <Layout title="Inventario">
      <p
        style={{
          fontSize: fontSize.sm,
          color: colors.textMuted,
          marginBottom: spacing.md,
          textTransform: 'capitalize',
        }}
      >
        {today}
      </p>

      {total === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: '48px', color: colors.textMuted }}>
          <p style={{ fontSize: '48px', margin: '0 0 8px' }}>✅</p>
          <p style={{ fontSize: fontSize.base, fontWeight: 500, color: colors.text }}>
            No hay productos por contar hoy
          </p>
          <p style={{ fontSize: fontSize.sm }}>Regresa mañana o revisa la configuración.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Barra de progreso */}
          <div
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: radius.md,
              padding: spacing.md,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontSize: fontSize.sm, color: colors.textMuted }}>
                {allDone ? '¡Inventario completo!' : 'Progreso'}
              </span>
              <span
                style={{
                  fontSize: fontSize.sm,
                  fontWeight: 700,
                  color: allDone ? colors.success : colors.primary,
                }}
              >
                {savedCount} / {total}
              </span>
            </div>
            <div
              style={{
                height: '6px',
                backgroundColor: colors.bg,
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${(savedCount / total) * 100}%`,
                  backgroundColor: allDone ? colors.success : colors.primary,
                  borderRadius: '3px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Lista de productos */}
          {items.map((item) => (
            <CountCard key={item.productId} item={item} userId={user.id} onSaved={handleSaved} />
          ))}
        </div>
      )}
    </Layout>
  );
}
