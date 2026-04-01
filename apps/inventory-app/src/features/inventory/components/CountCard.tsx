import { useState } from 'react';
import type { InventoryItemDto, InventoryRecordResponseDto } from '@tbh/application';
import type { QualitativeValue } from '@tbh/domain';
import { registerInventory } from '../../../shared/di';
import { colors, radius, fontSize, spacing } from '../../../shared/theme';

interface CountCardProps {
  item: InventoryItemDto;
  userId: string;
  onSaved: (record: InventoryRecordResponseDto) => void;
}

const QUALITATIVE_OPTIONS: { value: QualitativeValue; label: string; color: string }[] = [
  { value: 'mucho', label: 'Mucho', color: colors.success },
  { value: 'poco', label: 'Poco', color: colors.warning },
  { value: 'nada', label: 'Nada', color: colors.danger },
];

const TYPE_LABELS: Record<string, string> = {
  raw_material: 'Materia prima',
  disposable: 'Desechable',
  basic: 'Básico',
};

function DifferenceDisplay({ difference }: { difference: number }) {
  const isNegative = difference < 0;
  const isZero = difference === 0;
  const color = isNegative ? colors.danger : isZero ? colors.textMuted : colors.success;
  const sign = difference > 0 ? '+' : '';
  const label = isNegative ? 'faltante' : isZero ? 'sin cambio' : 'consumo';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: isNegative ? colors.dangerLight : isZero ? colors.bg : colors.successLight,
        borderRadius: radius.sm,
        padding: `${spacing.xs} ${spacing.sm}`,
      }}
    >
      <span style={{ fontSize: fontSize.sm, color: colors.textMuted }}>Diferencia</span>
      <span style={{ fontSize: fontSize.base, fontWeight: 700, color }}>
        {sign}
        {difference} — {label}
      </span>
    </div>
  );
}

export function CountCard({ item, userId, onSaved }: CountCardProps) {
  const [finalCount, setFinalCount] = useState('');
  const [qualitativeValue, setQualitativeValue] = useState<QualitativeValue | null>(null);
  const [savedRecord, setSavedRecord] = useState<InventoryRecordResponseDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isQualitative = item.unitType === 'qualitative';
  const canSave = isQualitative ? qualitativeValue !== null : finalCount !== '';

  // Diferencia en tiempo real (solo para productos numéricos con stock inicial conocido)
  const liveDifference: number | null =
    !isQualitative && item.initialStock !== null && finalCount !== ''
      ? Number(finalCount) - item.initialStock
      : null;

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    setError('');
    try {
      const record = await registerInventory.execute({
        productId: item.productId,
        userId,
        date: new Date(),
        finalCount: isQualitative ? null : Number(finalCount),
        qualitativeValue: isQualitative ? qualitativeValue : null,
      });
      onSaved(record);
      setSavedRecord(record);
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  }

  // Estado: guardado
  if (savedRecord) {
    return (
      <div
        style={{
          backgroundColor: colors.successLight,
          border: `1px solid ${colors.success}`,
          borderRadius: radius.md,
          padding: spacing.md,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            marginBottom: spacing.xs,
          }}
        >
          <span style={{ fontSize: '18px' }}>✅</span>
          <p style={{ margin: 0, fontWeight: 600, fontSize: fontSize.base, color: colors.text }}>
            {item.name}
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            gap: spacing.sm,
            fontSize: fontSize.sm,
            color: colors.textMuted,
            flexWrap: 'wrap',
          }}
        >
          {!isQualitative && savedRecord.initialStock !== null && (
            <span>
              Inicial: {savedRecord.initialStock} {item.unitLabel}
            </span>
          )}
          <span>
            Final:{' '}
            {isQualitative
              ? savedRecord.qualitativeValue
              : `${savedRecord.finalCount} ${item.unitLabel}`}
          </span>
          {savedRecord.difference !== null && (
            <span
              style={{
                fontWeight: 600,
                color: savedRecord.difference < 0 ? colors.danger : colors.success,
              }}
            >
              Diferencia: {savedRecord.difference > 0 ? '+' : ''}
              {savedRecord.difference}
            </span>
          )}
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
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: fontSize.lg, color: colors.text }}>
            {item.name}
          </p>
          <p
            style={{ margin: 0, fontSize: fontSize.sm, color: colors.textMuted, marginTop: '2px' }}
          >
            {isQualitative ? 'Cualitativo' : item.unitLabel}
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
            whiteSpace: 'nowrap',
          }}
        >
          {TYPE_LABELS[item.type] ?? item.type}
        </span>
      </div>

      {/* Stock inicial (solo productos numéricos) */}
      {!isQualitative && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.bg,
            borderRadius: radius.sm,
            padding: `${spacing.xs} ${spacing.sm}`,
          }}
        >
          <span style={{ fontSize: fontSize.sm, color: colors.textMuted }}>Stock inicial</span>
          <span style={{ fontSize: fontSize.base, fontWeight: 600, color: colors.text }}>
            {item.initialStock !== null
              ? `${item.initialStock} ${item.unitLabel}`
              : '— sin historial'}
          </span>
        </div>
      )}

      {/* Input de conteo final */}
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
        <div>
          <label
            style={{
              display: 'block',
              fontSize: fontSize.sm,
              color: colors.textMuted,
              marginBottom: '4px',
            }}
          >
            Stock final
          </label>
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
            <span
              style={{ fontSize: fontSize.base, color: colors.textMuted, whiteSpace: 'nowrap' }}
            >
              {item.unitLabel}
            </span>
          </div>
        </div>
      )}

      {/* Diferencia en tiempo real */}
      {liveDifference !== null && <DifferenceDisplay difference={liveDifference} />}

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
