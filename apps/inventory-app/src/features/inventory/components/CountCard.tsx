import { useState, useRef, useEffect } from 'react';
import type { InventoryItemDto, InventoryRecordResponseDto } from '@tbh/application';
import type { QualitativeValue } from '@tbh/domain';
import { registerInventory } from '../../../shared/di';
import { colors, radius, fontSize, spacing, transition } from '../../../shared/theme';

interface CountCardProps {
  item: InventoryItemDto;
  userId: string;
  index: number;
  onSaved: (record: InventoryRecordResponseDto) => void;
  autoFocus?: boolean;
}

const QUALITATIVE_OPTIONS: { value: QualitativeValue; label: string; color: string }[] = [
  { value: 'mucho', label: 'Mucho', color: colors.success },
  { value: 'poco', label: 'Poco', color: colors.warning },
  { value: 'nada', label: 'Nada', color: colors.danger },
];

const FRACTION_OPTIONS = [
  { label: '1/4', value: 0.25 },
  { label: '1/2', value: 0.5 },
  { label: '3/4', value: 0.75 },
  { label: '1', value: 1 },
];

function humanizeError(err: unknown): string {
  const msg = String(err).toLowerCase();
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('failed to fetch')) {
    return 'Sin conexión. Revisa tu internet e intenta de nuevo.';
  }
  if (msg.includes('unauthorized') || msg.includes('403') || msg.includes('401')) {
    return 'No tienes permiso para registrar este producto.';
  }
  if (msg.includes('timeout')) {
    return 'La solicitud tardó demasiado. Intenta de nuevo.';
  }
  return 'No se pudo guardar. Intenta de nuevo.';
}

export function CountCard({ item, userId, index, onSaved, autoFocus = false }: CountCardProps) {
  const [finalCount, setFinalCount] = useState('');
  const [qualitativeValue, setQualitativeValue] = useState<QualitativeValue | null>(null);
  const [savedRecord, setSavedRecord] = useState<InventoryRecordResponseDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isQualitative = item.unitType === 'qualitative';
  const canSave = isQualitative ? qualitativeValue !== null : finalCount !== '';

  useEffect(() => {
    if (autoFocus && !isQualitative && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, isQualitative]);

  const liveDifference: number | null =
    !isQualitative && item.initialStock !== null && finalCount !== ''
      ? Number(finalCount) - item.initialStock
      : null;

  async function handleSave() {
    if (!canSave || saving) return;
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
      setError(humanizeError(err));
    } finally {
      setSaving(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && canSave) {
      e.preventDefault();
      handleSave();
    }
  }

  // Estado: guardado
  if (savedRecord) {
    return (
      <div
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          padding: '20px',
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.md,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Check badge */}
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: `${colors.success}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: colors.success,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: fontSize.md,
                color: colors.text,
                letterSpacing: '-0.01em',
              }}
            >
              {item.name}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: fontSize.sm, color: colors.textMuted }}>
              {!isQualitative && savedRecord.initialStock !== null
                ? `Inicial: ${savedRecord.initialStock} ${item.unitLabel}`
                : ''}
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: 900,
              color: colors.success,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            {isQualitative ? savedRecord.qualitativeValue : savedRecord.finalCount}
          </p>
          {!isQualitative && (
            <p
              style={{
                margin: '2px 0 0',
                fontSize: '11px',
                color: colors.textMuted,
                fontWeight: 500,
              }}
            >
              {item.unitLabel}
              {savedRecord.difference !== null && (
                <span
                  style={{
                    marginLeft: '6px',
                    color: savedRecord.difference < 0 ? colors.danger : colors.success,
                    fontWeight: 700,
                  }}
                >
                  ({savedRecord.difference > 0 ? '+' : ''}
                  {savedRecord.difference})
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    );
  }

  const isActive = autoFocus;

  return (
    <div
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: '20px',
        border: isActive ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
        boxShadow: isActive ? `0 4px 16px ${colors.primary}18` : '0 1px 4px rgba(80,60,40,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
        flexWrap: 'wrap',
      }}
    >
      {/* Left: info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
        {/* Index badge */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            border: isActive ? `2px solid ${colors.primary}` : `2px solid ${colors.border}`,
            backgroundColor: isActive ? `${colors.primary}10` : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: isActive ? colors.primary : colors.textMuted,
            fontSize: '12px',
            fontWeight: 800,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: fontSize.md,
              color: colors.text,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
            }}
          >
            {item.name}
          </p>
          {!isQualitative && (
            <p
              style={{
                margin: '2px 0 0',
                fontSize: '10px',
                fontWeight: 700,
                color: colors.textMuted,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              INICIAL:{' '}
              {item.initialStock !== null
                ? `${item.initialStock} ${item.unitLabel}`
                : '— sin historial'}
            </p>
          )}
        </div>
      </div>

      {/* Right: input */}
      <div style={{ flexShrink: 0 }}>
        {isQualitative ? (
          <div style={{ display: 'flex', gap: '6px' }}>
            {QUALITATIVE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setQualitativeValue(opt.value)}
                style={{
                  padding: '8px 12px',
                  minHeight: '44px',
                  border: `2px solid ${qualitativeValue === opt.value ? opt.color : colors.border}`,
                  borderRadius: radius.sm,
                  backgroundColor:
                    qualitativeValue === opt.value ? `${opt.color}18` : 'transparent',
                  color: qualitativeValue === opt.value ? opt.color : colors.textMuted,
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: `all ${transition.fast}`,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}
          >
            {/* Botones de fracción — solo cuando el producto tiene packageSize */}
            {item.unitType === 'fraction' && item.packageSize && (
              <div style={{ display: 'flex', gap: '6px' }}>
                {FRACTION_OPTIONS.map((opt) => {
                  const val = String(opt.value * item.packageSize!);
                  const active = finalCount === val;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setFinalCount(val)}
                      style={{
                        padding: '6px 10px',
                        minHeight: '40px',
                        minWidth: '44px',
                        borderRadius: radius.sm,
                        border: `2px solid ${active ? colors.primary : colors.border}`,
                        backgroundColor: active ? colors.primaryLight : 'transparent',
                        color: active ? colors.primary : colors.textMuted,
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
            {/* Input numérico */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                ref={inputRef}
                type="number"
                min="0"
                step="any"
                value={finalCount}
                onChange={(e) => setFinalCount(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="00"
                inputMode="decimal"
                style={{
                  width: '80px',
                  backgroundColor: isActive ? colors.surfaceHigh : colors.surfaceLow,
                  border: 0,
                  textAlign: 'right',
                  fontWeight: 900,
                  fontSize: '24px',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  color: finalCount ? colors.success : colors.text,
                  outline: 'none',
                  minHeight: '48px',
                  boxSizing: 'border-box',
                }}
              />
              {finalCount && liveDifference !== null && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: liveDifference < 0 ? colors.danger : colors.success,
                  }}
                >
                  {liveDifference > 0 ? '+' : ''}
                  {liveDifference}
                </span>
              )}
            </div>
            {/* Etiqueta de conversión cuando se usa fracción */}
            {item.unitType === 'fraction' && item.packageSize && finalCount && (
              <span style={{ fontSize: '11px', color: colors.textMuted, fontWeight: 600 }}>
                = {finalCount} {item.unitLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            width: '100%',
            backgroundColor: colors.dangerLight,
            color: colors.danger,
            padding: '10px 12px',
            borderRadius: radius.sm,
            fontSize: fontSize.sm,
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}

      {/* Save button — only show if not saved */}
      {(canSave || isQualitative) && (
        <button
          onClick={handleSave}
          disabled={!canSave || saving}
          style={{
            width: '100%',
            backgroundColor: canSave && !saving ? colors.primary : colors.border,
            color: canSave && !saving ? '#fff' : colors.textMuted,
            border: 'none',
            borderRadius: radius.sm,
            padding: '13px',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: canSave && !saving ? 'pointer' : 'not-allowed',
            minHeight: '48px',
            transition: `background-color ${transition.fast}`,
          }}
        >
          {saving ? 'Guardando...' : 'Guardar conteo'}
        </button>
      )}
    </div>
  );
}
