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
        {/* Botón nuevo producto */}
        <button
          onClick={() => navigate('/productos/nuevo')}
          style={{
            backgroundColor: colors.primary,
            color: '#fff',
            border: 'none',
            borderRadius: radius.sm,
            padding: '12px 16px',
            fontSize: fontSize.md,
            fontWeight: 600,
            cursor: 'pointer',
            minHeight: '44px',
            alignSelf: 'flex-start',
          }}
        >
          + Nuevo producto
        </button>

        {deleteError && (
          <p
            style={{
              margin: 0,
              fontSize: fontSize.sm,
              color: colors.danger,
              backgroundColor: colors.dangerLight,
              padding: '10px 12px',
              borderRadius: radius.sm,
            }}
          >
            {deleteError}
          </p>
        )}

        {loading && (
          <p style={{ color: colors.textMuted, fontSize: fontSize.base, margin: 0 }}>
            Cargando productos...
          </p>
        )}

        {error && !loading && (
          <p
            style={{
              margin: 0,
              fontSize: fontSize.base,
              color: colors.danger,
              backgroundColor: colors.dangerLight,
              padding: '10px 12px',
              borderRadius: radius.sm,
            }}
          >
            {error}
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p style={{ color: colors.textMuted, fontSize: fontSize.base, margin: 0 }}>
            No hay productos registrados.
          </p>
        )}

        {/* Lista de productos */}
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: radius.md,
              padding: spacing.md,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {/* Nombre y tipo */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              <span style={{ fontWeight: 600, fontSize: fontSize.md, color: colors.text, flex: 1 }}>
                {product.name}
              </span>
              <span
                style={{
                  fontSize: fontSize.sm,
                  color: colors.textMuted,
                  backgroundColor: colors.bg,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                }}
              >
                {PRODUCT_TYPE_LABELS[product.type]}
              </span>
            </div>

            {/* Detalles */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4px 12px',
                fontSize: fontSize.sm,
                color: colors.textMuted,
              }}
            >
              <span>
                <strong style={{ color: colors.text }}>Unidad:</strong>{' '}
                {UNIT_TYPE_LABELS[product.unitType]} ({product.unitLabel})
              </span>
              <span>
                <strong style={{ color: colors.text }}>Stock mín:</strong>{' '}
                {product.minStock !== null ? product.minStock : '—'}
              </span>
              <span style={{ gridColumn: '1 / -1' }}>
                <strong style={{ color: colors.text }}>Asignado a:</strong>{' '}
                {getUserName(product.assignedUserId)}
              </span>
            </div>

            {/* Acciones */}
            <div style={{ display: 'flex', gap: spacing.sm, marginTop: '4px' }}>
              <button
                onClick={() => navigate(`/productos/${product.id}/editar`)}
                style={{
                  flex: 1,
                  backgroundColor: colors.primaryLight,
                  color: colors.primary,
                  border: `1px solid ${colors.primary}`,
                  borderRadius: radius.sm,
                  padding: '8px',
                  fontSize: fontSize.base,
                  fontWeight: 500,
                  cursor: 'pointer',
                  minHeight: '44px',
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
                  border: `1px solid ${colors.danger}`,
                  borderRadius: radius.sm,
                  padding: '8px',
                  fontSize: fontSize.base,
                  fontWeight: 500,
                  cursor: deletingId === product.id ? 'not-allowed' : 'pointer',
                  minHeight: '44px',
                  opacity: deletingId === product.id ? 0.6 : 1,
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
