import { useState, type FormEvent } from 'react';
import type { ProductResponseDto } from '@tbh/application';
import type { ManualItem } from '../hooks/useShoppingList';
import { colors, fontSize, radius, spacing } from '../../../shared/theme';

interface Props {
  allProducts: ProductResponseDto[];
  existingProductIds: string[];
  onAdd: (item: ManualItem) => void;
}

export function ManualItemForm({ allProducts, existingProductIds, onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');

  const available = allProducts.filter(
    (p) => p.unitType !== 'qualitative' && !existingProductIds.includes(p.id)
  );
  const selected = available.find((p) => p.id === productId);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selected || !quantity) return;
    onAdd({
      productId: selected.id,
      productName: selected.name,
      unitLabel: selected.unitLabel,
      quantity: Number(quantity),
    });
    setProductId('');
    setQuantity('');
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: 'transparent',
          color: colors.primary,
          border: `1px dashed ${colors.primary}`,
          borderRadius: radius.sm,
          fontSize: fontSize.base,
          cursor: 'pointer',
          minHeight: '44px',
        }}
      >
        + Agregar producto manualmente
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.md,
        border: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.sm,
      }}
    >
      <p style={{ margin: 0, fontWeight: 600, fontSize: fontSize.base, color: colors.text }}>
        Agregar producto
      </p>

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
        {available.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.unitLabel})
          </option>
        ))}
      </select>

      <input
        type="number"
        min="0.01"
        step="any"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
        placeholder={selected ? `Cantidad (${selected.unitLabel})` : 'Cantidad'}
        style={{
          padding: '12px',
          border: `1px solid ${colors.border}`,
          borderRadius: radius.sm,
          fontSize: '16px',
          minHeight: '44px',
          boxSizing: 'border-box',
        }}
      />

      <div style={{ display: 'flex', gap: spacing.sm }}>
        <button
          type="submit"
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: colors.primary,
            color: '#fff',
            border: 'none',
            borderRadius: radius.sm,
            fontSize: fontSize.base,
            fontWeight: 600,
            cursor: 'pointer',
            minHeight: '44px',
          }}
        >
          Agregar
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setProductId('');
            setQuantity('');
          }}
          style={{
            padding: '12px 16px',
            backgroundColor: 'transparent',
            color: colors.textMuted,
            border: `1px solid ${colors.border}`,
            borderRadius: radius.sm,
            fontSize: fontSize.base,
            cursor: 'pointer',
            minHeight: '44px',
          }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
