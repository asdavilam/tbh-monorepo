import { useState } from 'react';
import type { InventoryRecordResponseDto } from '@tbh/application';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { Layout } from '../../../shared/components/Layout';
import { CountCard } from '../components/CountCard';
import { useInventoryToday } from '../hooks/useInventoryToday';
import { colors, radius, fontSize } from '../../../shared/theme';

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
        <div style={{ paddingTop: '48px', textAlign: 'center' }}>
          <p style={{ color: colors.textMuted, fontSize: fontSize.base }}>Cargando productos...</p>
        </div>
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
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: colors.danger, margin: '0 0 12px', fontWeight: 600 }}>
            Error al cargar productos
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
              fontWeight: 600,
              fontSize: fontSize.base,
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
  const pending = total - savedCount;
  const progressPct = total > 0 ? (savedCount / total) * 100 : 0;

  return (
    <Layout title="Inventario">
      <p
        style={{
          fontSize: '11px',
          fontWeight: 700,
          color: colors.textMuted,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}
      >
        {today}
      </p>

      {total === 0 ? (
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
            No hay productos por contar hoy
          </p>
          <p style={{ fontSize: fontSize.base, color: colors.textMuted }}>
            Regresa mañana o revisa la configuración.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Bento stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                backgroundColor: colors.surfaceLow,
                borderRadius: radius.md,
                padding: '16px',
                borderLeft: `4px solid ${colors.primary}`,
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: colors.textMuted,
                }}
              >
                Por completar
              </span>
              <span
                style={{
                  fontSize: '40px',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  color: colors.text,
                  lineHeight: 1,
                }}
              >
                {String(pending).padStart(2, '0')}
              </span>
            </div>
            <div
              style={{
                backgroundColor: colors.surfaceLow,
                borderRadius: radius.md,
                padding: '16px',
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: colors.textMuted,
                }}
              >
                {allDone ? '¡Completo!' : 'Guardados'}
              </span>
              <span
                style={{
                  fontSize: '40px',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  color: allDone ? colors.success : colors.primary,
                  lineHeight: 1,
                }}
              >
                {String(savedCount).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: '4px',
              backgroundColor: colors.surfaceHigh,
              borderRadius: '2px',
              overflow: 'hidden',
              marginBottom: '4px',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progressPct}%`,
                backgroundColor: allDone ? colors.success : colors.primary,
                borderRadius: '2px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>

          {/* Checklist */}
          {items.map((item, index) => (
            <CountCard
              key={item.productId}
              item={item}
              userId={user.id}
              index={index}
              onSaved={handleSaved}
              autoFocus={index === 0}
            />
          ))}
        </div>
      )}
    </Layout>
  );
}
