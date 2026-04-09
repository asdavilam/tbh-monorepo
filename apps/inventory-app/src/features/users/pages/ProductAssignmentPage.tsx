import { useState, useMemo } from 'react';
import type { UserResponseDto } from '@tbh/application';
import { PRODUCT_TYPE_LABELS } from '@tbh/domain';
import { useProductAssignment } from '../hooks/useProductAssignment';
import { Layout } from '../../../shared/components/Layout';
import { colors, fontSize, radius, spacing, transition } from '../../../shared/theme';

export function ProductAssignmentPage() {
  const { products, users, loading, error, assign } = useProductAssignment();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [filterUserId, setFilterUserId] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    if (filterUserId === 'all') return products;
    if (filterUserId === 'none') return products.filter((p) => p.assignedUserId === null);
    return products.filter((p) => p.assignedUserId === filterUserId);
  }, [products, filterUserId]);

  function getUserName(userId: string | null): string {
    if (!userId) return 'Sin asignar';
    return users.find((u) => u.id === userId)?.name ?? 'Sin asignar';
  }

  function toggleProduct(id: string) {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleAll() {
    if (selectedProductIds.size === filteredProducts.length) {
      setSelectedProductIds(new Set());
    } else {
      setSelectedProductIds(new Set(filteredProducts.map((p) => p.id)));
    }
  }

  async function handleAssign() {
    if (selectedProductIds.size === 0) return;
    const targetUserId = selectedUserId === '' ? null : selectedUserId;
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      await assign(Array.from(selectedProductIds), targetUserId);
      setSelectedProductIds(new Set());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'No se pudieron asignar los productos');
    } finally {
      setSaving(false);
    }
  }

  const allFilteredSelected =
    filteredProducts.length > 0 && selectedProductIds.size === filteredProducts.length;

  return (
    <Layout title="Asignar productos">
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        {/* Assignment controls */}
        <div
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: radius.md,
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: fontSize.sm,
              color: colors.textMuted,
              fontWeight: 500,
            }}
          >
            Selecciona los productos de la lista y asígnalos a un usuario de forma masiva.
          </p>

          {/* User selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.text }}>
              Asignar a
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: radius.sm,
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.surfaceLow,
                color: colors.text,
                fontSize: fontSize.base,
                fontWeight: 500,
                minHeight: '44px',
                cursor: 'pointer',
              }}
            >
              <option value="">Sin asignar</option>
              {users.map((u: UserResponseDto) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Assign button */}
          <button
            onClick={handleAssign}
            disabled={saving || selectedProductIds.size === 0}
            style={{
              backgroundColor: selectedProductIds.size === 0 ? colors.surfaceHigh : colors.primary,
              color: selectedProductIds.size === 0 ? colors.textMuted : '#fff',
              border: 'none',
              borderRadius: radius.md,
              padding: '14px 20px',
              fontSize: fontSize.sm,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: saving || selectedProductIds.size === 0 ? 'not-allowed' : 'pointer',
              minHeight: '48px',
              boxShadow: selectedProductIds.size > 0 ? `0 4px 14px ${colors.primary}33` : 'none',
              transition: `all ${transition.base}`,
            }}
          >
            {saving
              ? 'Asignando...'
              : selectedProductIds.size === 0
                ? 'Selecciona productos'
                : `Asignar ${selectedProductIds.size} producto${selectedProductIds.size !== 1 ? 's' : ''}`}
          </button>

          {saveError && (
            <div
              style={{
                backgroundColor: colors.dangerLight,
                color: colors.danger,
                padding: '10px 12px',
                borderRadius: radius.sm,
                fontSize: fontSize.sm,
                fontWeight: 500,
              }}
            >
              {saveError}
            </div>
          )}
          {saveSuccess && (
            <div
              style={{
                backgroundColor: colors.successLight,
                color: colors.success,
                padding: '10px 12px',
                borderRadius: radius.sm,
                fontSize: fontSize.sm,
                fontWeight: 500,
              }}
            >
              Productos asignados correctamente
            </div>
          )}
        </div>

        {/* Filter by current assignment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.text }}>
            Filtrar por asignación actual
          </label>
          <select
            value={filterUserId}
            onChange={(e) => {
              setFilterUserId(e.target.value);
              setSelectedProductIds(new Set());
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: radius.sm,
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.surfaceLow,
              color: colors.text,
              fontSize: fontSize.base,
              fontWeight: 500,
              minHeight: '44px',
              cursor: 'pointer',
            }}
          >
            <option value="all">Todos los productos</option>
            <option value="none">Sin asignar</option>
            {users.map((u: UserResponseDto) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

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

        {!loading && !error && filteredProducts.length === 0 && (
          <p style={{ color: colors.textMuted, fontSize: fontSize.base, margin: 0 }}>
            No hay productos para mostrar.
          </p>
        )}

        {/* Select all / deselect all */}
        {!loading && filteredProducts.length > 0 && (
          <button
            onClick={toggleAll}
            style={{
              backgroundColor: 'transparent',
              border: `1px solid ${colors.border}`,
              borderRadius: radius.sm,
              padding: '10px 14px',
              fontSize: fontSize.sm,
              fontWeight: 600,
              color: colors.primary,
              cursor: 'pointer',
              minHeight: '44px',
              textAlign: 'left',
            }}
          >
            {allFilteredSelected
              ? 'Deseleccionar todos'
              : `Seleccionar todos (${filteredProducts.length})`}
          </button>
        )}

        {/* Product list */}
        {filteredProducts.map((product) => {
          const isSelected = selectedProductIds.has(product.id);
          return (
            <button
              key={product.id}
              onClick={() => toggleProduct(product.id)}
              style={{
                width: '100%',
                backgroundColor: isSelected ? `${colors.primary}10` : colors.surface,
                border: `2px solid ${isSelected ? colors.primary : colors.border}`,
                borderRadius: radius.md,
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: `all ${transition.fast}`,
              }}
            >
              {/* Checkbox */}
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '6px',
                  border: `2px solid ${isSelected ? colors.primary : colors.border}`,
                  backgroundColor: isSelected ? colors.primary : 'transparent',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: `all ${transition.fast}`,
                }}
              >
                {isSelected && (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: fontSize.base,
                    color: colors.text,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.01em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {product.name}
                </div>
                <div
                  style={{
                    fontSize: fontSize.xs,
                    color: colors.textMuted,
                    marginTop: '2px',
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span>{PRODUCT_TYPE_LABELS[product.type]}</span>
                  <span>·</span>
                  <span
                    style={{
                      color: product.assignedUserId ? colors.primary : colors.textLight,
                      fontWeight: 500,
                    }}
                  >
                    {getUserName(product.assignedUserId)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </Layout>
  );
}
