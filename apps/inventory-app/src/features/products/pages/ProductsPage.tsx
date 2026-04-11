import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_TYPE_LABELS, UNIT_TYPE_LABELS, PRODUCT_CATEGORY_LABELS } from '@tbh/domain';
import type { ProductCategory } from '@tbh/domain';
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
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) return;
    getAllUsers
      .execute(user.id)
      .then(setUsers)
      .catch(() => setUsers([]));
  }, [user?.id]);

  function getUserNames(userIds: string[]): string {
    if (userIds.length === 0) return 'Sin asignar';
    return userIds.map((id) => users.find((u) => u.id === id)?.name ?? 'Desconocido').join(', ');
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

        {/* Search bar */}
        <div style={{ position: 'relative' }}>
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
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: colors.textMuted,
              pointerEvents: 'none',
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Buscar producto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              backgroundColor: colors.surfaceLow,
              border: `1px solid ${colors.border}`,
              borderRadius: radius.md,
              padding: '12px 14px 12px 42px',
              fontSize: fontSize.base,
              color: colors.text,
              outline: 'none',
              minHeight: '48px',
            }}
          />
        </div>

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
        {!loading &&
          !error &&
          products.length > 0 &&
          searchQuery.trim() &&
          (() => {
            const q = searchQuery.trim().toLowerCase();
            const anyMatch = products.some((p) => p.name.toLowerCase().includes(q));
            return !anyMatch ? (
              <p style={{ color: colors.textMuted, fontSize: fontSize.base, margin: 0 }}>
                Sin resultados para "{searchQuery}".
              </p>
            ) : null;
          })()}

        {/* Product list — grouped by category, containers first, variants indented */}
        {(() => {
          const q = searchQuery.trim().toLowerCase();
          const filtered = q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products;

          function renderGroup(groupProducts: typeof filtered) {
            const variantParentIds = new Set(
              groupProducts.filter((p) => p.parentProductId !== null).map((p) => p.parentProductId!)
            );
            const rendered = new Set<string>();
            const nodes: React.ReactNode[] = [];

            for (const product of groupProducts) {
              if (rendered.has(product.id)) continue;
              if (product.parentProductId) continue;

              const isContainer = variantParentIds.has(product.id);
              const children = isContainer
                ? groupProducts.filter((p) => p.parentProductId === product.id)
                : [];

              nodes.push(
                <div key={product.id}>
                  <ProductCard
                    product={product}
                    getUserNames={getUserNames}
                    onEdit={() => navigate(`/productos/${product.id}/editar`)}
                    onDelete={() => handleDelete(product.id, product.name)}
                    isDeleting={deletingId === product.id}
                    isContainer={isContainer}
                  />
                  {children.map((variant) => {
                    rendered.add(variant.id);
                    return (
                      <div
                        key={variant.id}
                        style={{
                          paddingLeft: '16px',
                          borderLeft: `3px solid ${colors.border}`,
                          marginLeft: '12px',
                          marginTop: '6px',
                        }}
                      >
                        <ProductCard
                          product={variant}
                          getUserNames={getUserNames}
                          onEdit={() => navigate(`/productos/${variant.id}/editar`)}
                          onDelete={() => handleDelete(variant.id, variant.name)}
                          isDeleting={deletingId === variant.id}
                          isContainer={false}
                        />
                      </div>
                    );
                  })}
                </div>
              );
              rendered.add(product.id);
            }
            return nodes;
          }

          const hasCategories = filtered.some((p) => p.category);
          if (!hasCategories) return renderGroup(filtered);

          // Agrupar por categoría
          const map = new Map<string, typeof filtered>();
          for (const p of filtered) {
            const key = p.category?.trim() || '';
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(p);
          }
          const groups = Array.from(map.entries())
            .filter(([k]) => k !== '')
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([label, items]) => ({ label, items }));
          const uncategorized = map.get('');
          if (uncategorized?.length) groups.push({ label: 'Sin categoría', items: uncategorized });

          return groups.map(({ label, items }) => (
            <div key={label}>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: colors.textMuted,
                  padding: '12px 2px 6px',
                  borderBottom: `1px solid ${colors.border}`,
                  marginBottom: '8px',
                }}
              >
                {PRODUCT_CATEGORY_LABELS[label as ProductCategory] ?? label}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {renderGroup(items)}
              </div>
            </div>
          ));
        })()}
      </div>
    </Layout>
  );
}

// ── Product card component ────────────────────────────────────────────────────

interface ProductCardProps {
  product: import('@tbh/application').ProductResponseDto;
  getUserNames: (ids: string[]) => string;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  isContainer: boolean;
}

function ProductCard({
  product,
  getUserNames,
  onEdit,
  onDelete,
  isDeleting,
  isContainer,
}: ProductCardProps) {
  return (
    <div
      style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: radius.md,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        opacity: isDeleting ? 0.6 : 1,
      }}
    >
      {/* Name + badges */}
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
        <div
          style={{
            display: 'flex',
            gap: '6px',
            flexShrink: 0,
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          }}
        >
          {isContainer && (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: colors.primary,
                backgroundColor: `${colors.primary}15`,
                padding: '2px 8px',
                borderRadius: '999px',
                letterSpacing: '0.04em',
              }}
            >
              GRUPO
            </span>
          )}
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: colors.primary,
              backgroundColor: colors.surfaceLow,
              padding: '3px 10px',
              borderRadius: '999px',
              letterSpacing: '0.04em',
            }}
          >
            {PRODUCT_TYPE_LABELS[product.type]}
          </span>
        </div>
      </div>

      {/* Details */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4px 16px',
          fontSize: fontSize.sm,
          color: colors.textMuted,
        }}
      >
        <span>
          <span style={{ fontWeight: 600, color: colors.text }}>Unidad:</span>{' '}
          {UNIT_TYPE_LABELS[product.unitType]} ({product.unitLabel})
        </span>
        {!isContainer && (
          <span>
            <span style={{ fontWeight: 600, color: colors.text }}>Stock mín:</span>{' '}
            {product.minStock !== null ? product.minStock : '—'}
          </span>
        )}
        <span style={{ gridColumn: '1 / -1' }}>
          <span style={{ fontWeight: 600, color: colors.text }}>Asignado a:</span>{' '}
          {getUserNames(product.assignedUserIds)}
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
        <button
          onClick={onEdit}
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
          onClick={onDelete}
          disabled={isDeleting}
          style={{
            flex: 1,
            backgroundColor: colors.dangerLight,
            color: colors.danger,
            border: `1px solid ${colors.danger}44`,
            borderRadius: radius.sm,
            padding: '10px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: isDeleting ? 'not-allowed' : 'pointer',
            minHeight: '44px',
            opacity: isDeleting ? 0.6 : 1,
            letterSpacing: '0.04em',
          }}
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </div>
  );
}
