import { useState, type FormEvent } from 'react';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { Layout } from '../../../shared/components/Layout';
import { colors, fontSize, radius, spacing } from '../../../shared/theme';
import { usePurchase } from '../hooks/usePurchase';
import { PurchaseHistory } from '../components/PurchaseHistory';

export function PurchasePage() {
  const { user } = useAuth();
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');

  const { products, history, saving, loadingHistory, success, error, submit } = usePurchase(user!);

  const selectedProduct = products.find((p) => p.id === productId);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!productId || !quantity) return;
    await submit(productId, Number(quantity), notes || undefined);
    setProductId('');
    setQuantity('');
    setNotes('');
  }

  return (
    <Layout title="Registrar compra">
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}
        >
          {success && (
            <div
              style={{
                backgroundColor: colors.successLight,
                border: `1px solid ${colors.success}`,
                borderRadius: radius.sm,
                padding: '12px',
                color: colors.success,
                fontSize: fontSize.base,
                fontWeight: 500,
              }}
            >
              Compra registrada correctamente
            </div>
          )}

          {/* Producto */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: fontSize.base, fontWeight: 500, color: colors.text }}>
              Producto
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
              style={{
                padding: '12px',
                border: `1px solid ${colors.border}`,
                borderRadius: radius.sm,
                fontSize: '16px',
                backgroundColor: colors.surface,
                minHeight: '44px',
                appearance: 'auto',
              }}
            >
              <option value="">Seleccionar producto...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cantidad */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: fontSize.base, fontWeight: 500, color: colors.text }}>
              Cantidad {selectedProduct ? `(${selectedProduct.unitLabel})` : ''}
            </label>
            <input
              type="number"
              min="0.01"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              placeholder="0"
              style={{
                padding: '12px',
                border: `1px solid ${colors.border}`,
                borderRadius: radius.sm,
                fontSize: '16px',
                minHeight: '44px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Notas (opcional) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: fontSize.base, fontWeight: 500, color: colors.text }}>
              Notas <span style={{ color: colors.textMuted, fontWeight: 400 }}>(opcional)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: compra de emergencia"
              style={{
                padding: '12px',
                border: `1px solid ${colors.border}`,
                borderRadius: radius.sm,
                fontSize: '16px',
                minHeight: '44px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
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
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            style={{
              backgroundColor: saving ? colors.border : colors.primary,
              color: saving ? colors.textMuted : '#fff',
              border: 'none',
              borderRadius: radius.sm,
              padding: '14px',
              fontSize: fontSize.md,
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              minHeight: '44px',
            }}
          >
            {saving ? 'Guardando...' : 'Registrar compra'}
          </button>
        </form>

        <hr style={{ border: 'none', borderTop: `1px solid ${colors.border}`, margin: 0 }} />

        <PurchaseHistory items={history} loading={loadingHistory} />
      </div>
    </Layout>
  );
}
