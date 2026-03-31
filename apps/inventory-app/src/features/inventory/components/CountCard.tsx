import { useState } from 'react';
import type { ProductResponseDto, InventoryRecordResponseDto } from '@tbh/application';
import type { QualitativeValue } from '@tbh/domain';
import { registerInventory } from '../../../shared/di';
import { colors, radius, fontSize, spacing } from '../../../shared/theme';

interface CountCardProps {
  product: ProductResponseDto;
  userId: string;
  onSaved: (record: InventoryRecordResponseDto) => void;
}

const QUALITATIVE_OPTIONS: { value: QualitativeValue; label: string; color: string }[] = [
  { value: 'mucho', label: 'Mucho', color: colors.success },
  { value: 'poco', label: 'Poco', color: colors.warning },
  { value: 'nada', label: 'Nada', color: colors.danger },
];

export function CountCard({ product, userId, onSaved }: CountCardProps) {
  const [finalCount, setFinalCount] = useState('');
  const [qualitativeValue, setQualitativeValue] = useState<QualitativeValue | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isQualitative = product.unitType === 'qualitative';
  const canSave = isQualitative ? qualitativeValue !== null : finalCount !== '';

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    setError('');
    try {
      const record = await registerInventory.execute({
        productId: product.id,
        userId,
        date: new Date(),
        finalCount: isQualitative ? null : Number(finalCount),
        qualitativeValue: isQualitative ? qualitativeValue : null,
      });
      onSaved(record);
      setSaved(true);
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  }

  if (saved) {
    return (
      <div
        style={{
          backgroundColor: colors.successLight,
          border: `1px solid ${colors.success}`,
          borderRadius: radius.md,
          padding: spacing.md,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm,
        }}
      >
        <span style={{ fontSize: '20px' }}>✅</span>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: fontSize.base, color: colors.text }}>
            {product.name}
          </p>
          <p style={{ margin: 0, fontSize: fontSize.sm, color: colors.textMuted }}>
            {isQualitative ? qualitativeValue : `${finalCount} ${product.unitLabel}`} — guardado
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: fontSize.lg, color: colors.text }}>
            {product.name}
          </p>
          <p
            style={{ margin: 0, fontSize: fontSize.sm, color: colors.textMuted, marginTop: '2px' }}
          >
            {product.unitType === 'qualitative' ? 'Cualitativo' : product.unitLabel}
          </p>
        </div>
        <span
          style={{
            fontSize: '11px',
            backgroundColor: colors.primaryLight,
            color: colors.primary,
            padding: '3px 8px',
            borderRadius: '20px',
            fontWeight: 500,
          }}
        >
          {product.type === 'raw_material'
            ? 'Materia prima'
            : product.type === 'disposable'
              ? 'Desechable'
              : 'Básico'}
        </span>
      </div>

      {/* Input */}
      {isQualitative ? (
        <div style={{ display: 'flex', gap: spacing.sm }}>
          {QUALITATIVE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setQualitativeValue(opt.value)}
              style={{
                flex: 1,
                padding: '10px 4px',
                minHeight: '44px',
                border: `2px solid ${qualitativeValue === opt.value ? opt.color : colors.border}`,
                borderRadius: radius.sm,
                backgroundColor: qualitativeValue === opt.value ? opt.color + '20' : 'transparent',
                color: qualitativeValue === opt.value ? opt.color : colors.textMuted,
                fontSize: fontSize.base,
                fontWeight: qualitativeValue === opt.value ? 700 : 400,
                cursor: 'pointer',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <input
            type="number"
            min="0"
            step="any"
            value={finalCount}
            onChange={(e) => setFinalCount(e.target.value)}
            placeholder="0"
            style={{
              flex: 1,
              padding: '12px',
              border: `1px solid ${colors.border}`,
              borderRadius: radius.sm,
              fontSize: '16px',
              outline: 'none',
              minHeight: '44px',
              boxSizing: 'border-box',
            }}
          />
          <span style={{ fontSize: fontSize.base, color: colors.textMuted, whiteSpace: 'nowrap' }}>
            {product.unitLabel}
          </span>
        </div>
      )}

      {error && <p style={{ margin: 0, fontSize: fontSize.sm, color: colors.danger }}>{error}</p>}

      <button
        onClick={handleSave}
        disabled={!canSave || saving}
        style={{
          backgroundColor: canSave && !saving ? colors.primary : colors.border,
          color: canSave && !saving ? '#fff' : colors.textMuted,
          border: 'none',
          borderRadius: radius.sm,
          padding: '12px',
          fontSize: fontSize.base,
          fontWeight: 600,
          cursor: canSave && !saving ? 'pointer' : 'not-allowed',
          minHeight: '44px',
        }}
      >
        {saving ? 'Guardando...' : 'Guardar conteo'}
      </button>
    </div>
  );
}
