import { useAuth } from '../../../shared/contexts/AuthContext';
import { Layout } from '../../../shared/components/Layout';
import { colors, fontSize, spacing, radius, minTapTarget } from '../../../shared/theme';
import { useInventoryHistory } from '../hooks/useInventoryHistory';
import { HistoryTable } from '../components/HistoryTable';

export function HistoryPage() {
  const { user } = useAuth();
  const {
    products,
    history,
    loadingProducts,
    loadingHistory,
    error,
    selectedProductId,
    selectProduct,
  } = useInventoryHistory(user!);

  return (
    <Layout title="Historial de inventario">
      <div style={{ padding: spacing.md, paddingBottom: '80px' }}>
        {/* Selector de producto */}
        <div style={{ marginBottom: spacing.md }}>
          <label
            htmlFor="product-select"
            style={{
              display: 'block',
              fontSize: fontSize.sm,
              color: colors.textMuted,
              marginBottom: spacing.xs,
              fontWeight: 500,
            }}
          >
            Selecciona un producto
          </label>
          <select
            id="product-select"
            value={selectedProductId}
            onChange={(e) => selectProduct(e.target.value)}
            disabled={loadingProducts}
            style={{
              width: '100%',
              padding: `0 ${spacing.md}`,
              height: minTapTarget,
              fontSize: fontSize.md,
              border: `1px solid ${colors.border}`,
              borderRadius: radius.md,
              backgroundColor: colors.surface,
              color: selectedProductId ? colors.text : colors.textMuted,
              appearance: 'none',
              cursor: loadingProducts ? 'not-allowed' : 'pointer',
            }}
          >
            <option value="">
              {loadingProducts ? 'Cargando productos...' : '— Elige un producto —'}
            </option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.unitLabel})
              </option>
            ))}
          </select>
        </div>

        {/* Error global */}
        {error && (
          <div
            style={{
              backgroundColor: colors.dangerLight,
              color: colors.danger,
              padding: spacing.md,
              borderRadius: radius.md,
              fontSize: fontSize.base,
              marginBottom: spacing.md,
            }}
          >
            {error}
          </div>
        )}

        {/* Historial */}
        {selectedProductId ? (
          <>
            <div
              style={{
                fontSize: fontSize.sm,
                color: colors.textMuted,
                marginBottom: spacing.sm,
              }}
            >
              {!loadingHistory && !error && (
                <>
                  {history.length} registro{history.length !== 1 ? 's' : ''} encontrado
                  {history.length !== 1 ? 's' : ''}
                </>
              )}
            </div>
            <HistoryTable items={history} loading={loadingHistory} />
          </>
        ) : (
          !loadingProducts && (
            <div
              style={{
                textAlign: 'center',
                padding: spacing.xl,
                color: colors.textMuted,
                fontSize: fontSize.base,
              }}
            >
              Selecciona un producto para ver su historial.
            </div>
          )
        )}
      </div>
    </Layout>
  );
}
