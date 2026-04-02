import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_TYPE_LABELS, UNIT_TYPE_LABELS } from '@tbh/domain';
import type { UserResponseDto } from '@tbh/application';
import { getAllUsers } from '../../../shared/di';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { Layout } from '../../../shared/components/Layout';
import { colors, fontSize, radius, spacing } from '../../../shared/theme';

export function ProductsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, loading, error, remove } = useProducts();
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (!user) return;
    getAllUsers
      .execute(user.id)
      .then(setUsers)
      .catch(() => setUsers([]));
  }, [user?.id]);

  function getUserName(userId: string | null): string {
    if (!userId) return 'Sin asignar';
    return users.find((u) => u.id === userId)?.name ?? 'Sin asignar';
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(id);
    setDeleteError('');
    try {
      await remove(id);
    } catch {
      setDeleteError('No se pudo eliminar el producto');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Layout title="Productos">
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        {/* New product button */}
        <button
          onClick={() => navigate('/productos/nuevo')}
          style={{
            backgroundColor: colors.primary,
            color: '#fff',
            border: 'none',
            borderRadius: radius.md,
            padding: '14px 20px',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            minHeight: '48px',
            alignSelf: 'flex-start',
            boxShadow: `0 4px 14px ${colors.primary}33`,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuevo producto
        </button>

        {deleteError && (
          <div
            style={{
              backgroundColor: colors.dangerLight,
              color: colors.danger,
              padding: '12px 14px',
              borderRadius: radius.md,
              fontSize: fontSize.sm,
              fontWeight: 500,
            }}
          >
            {deleteError}
          </div>
        )}

        {loading && (
          <p style={{ color: colors.textMuted, fontSize: fontSize.base, margin: 0 }}>
            Cargando productos...
          </p>
        )}

        {error && !loading && (
          <div
            style={{
              backgroundColor: colors.dangerLight,
              color: colors.danger,
              padding: '12px 14px',
              borderRadius: radius.md,
              fontSize: fontSize.base,
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p style={{ color: colors.textMuted, fontSize: fontSize.base, margin: 0 }}>
            No hay productos registrados.
          </p>
        )}

        {/* Product list */}
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: radius.md,
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {/* Name + type */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: fontSize.md,
                  color: colors.text,
                  flex: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                }}
              >
                {product.name}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: colors.primary,
                  backgroundColor: colors.surfaceLow,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.04em',
                }}
              >
                {PRODUCT_TYPE_LABELS[product.type]}
              </span>
            </div>

            {/* Details */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px 16px',
                fontSize: fontSize.sm,
                color: colors.textMuted,
              }}
            >
              <span>
                <span style={{ fontWeight: 600, color: colors.text }}>Unidad:</span>{' '}
                {UNIT_TYPE_LABELS[product.unitType]} ({product.unitLabel})
              </span>
              <span>
                <span style={{ fontWeight: 600, color: colors.text }}>Stock mín:</span>{' '}
                {product.minStock !== null ? product.minStock : '—'}
              </span>
              <span style={{ gridColumn: '1 / -1' }}>
                <span style={{ fontWeight: 600, color: colors.text }}>Asignado a:</span>{' '}
                {getUserName(product.assignedUserId)}
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
              <button
                onClick={() => navigate(`/productos/${product.id}/editar`)}
                style={{
                  flex: 1,
                  backgroundColor: colors.surfaceLow,
                  color: colors.primary,
                  border: `1px solid ${colors.border}`,
                  borderRadius: radius.sm,
                  padding: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  minHeight: '44px',
                  letterSpacing: '0.04em',
                }}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(product.id, product.name)}
                disabled={deletingId === product.id}
                style={{
                  flex: 1,
                  backgroundColor: colors.dangerLight,
                  color: colors.danger,
                  border: `1px solid ${colors.danger}44`,
                  borderRadius: radius.sm,
                  padding: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: deletingId === product.id ? 'not-allowed' : 'pointer',
                  minHeight: '44px',
                  opacity: deletingId === product.id ? 0.6 : 1,
                  letterSpacing: '0.04em',
                }}
              >
                {deletingId === product.id ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
