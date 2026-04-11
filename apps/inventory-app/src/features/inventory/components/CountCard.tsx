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
  onValueChange: (productId: string, hasValue: boolean) => void;
  triggerSave: number;
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

function getDraftKey(productId: string): string {
  const today = new Date().toISOString().slice(0, 10);
  return `tbh:draft:count:${productId}:${today}`;
}

interface CountDraft {
  finalCount: string;
  qualitativeValue: QualitativeValue | null;
}

function loadDraft(productId: string): CountDraft | null {
  try {
    const raw = localStorage.getItem(getDraftKey(productId));
    return raw ? (JSON.parse(raw) as CountDraft) : null;
  } catch {
    return null;
  }
}

function saveDraft(productId: string, draft: CountDraft) {
  try {
    if (draft.finalCount || draft.qualitativeValue) {
      localStorage.setItem(getDraftKey(productId), JSON.stringify(draft));
    } else {
      localStorage.removeItem(getDraftKey(productId));
    }
  } catch {
    // localStorage no disponible, continuar sin persistencia
  }
}

function clearDraft(productId: string) {
  try {
    localStorage.removeItem(getDraftKey(productId));
  } catch {
    // ignore
  }
}

export function CountCard({
  item,
  userId,
  index,
  onSaved,
  onValueChange,
  triggerSave,
  autoFocus = false,
}: CountCardProps) {
  const draft = loadDraft(item.productId);

  const [finalCount, setFinalCount] = useState(draft?.finalCount ?? '');
  const [qualitativeValue, setQualitativeValue] = useState<QualitativeValue | null>(
    draft?.qualitativeValue ?? null
  );
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

  // Persistir borrador al cambiar valores
  useEffect(() => {
    saveDraft(item.productId, { finalCount, qualitativeValue });
  }, [finalCount, qualitativeValue, item.productId]);

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
      clearDraft(item.productId);
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

  // Reportar al padre si este campo tiene valor (incluye estado inicial de borrador)
  useEffect(() => {
    const hasValue = isQualitative ? qualitativeValue !== null : finalCount !== '';
    onValueChange(item.productId, hasValue);
  }, [finalCount, qualitativeValue]); // intentionally omit onValueChange (stable ref)

  // Ref para evitar stale closures al reaccionar al triggerSave del padre
  const saveStateRef = useRef({ handleSave, canSave, savedRecord, saving });
  saveStateRef.current = { handleSave, canSave, savedRecord, saving };

  useEffect(() => {
    if (triggerSave === 0) return;
    const {
      handleSave: save,
      canSave: can,
      savedRecord: saved,
      saving: isSaving,
    } = saveStateRef.current;
    if (!saved && can && !isSaving) save();
  }, [triggerSave]); // saveStateRef always holds latest values — no other deps needed

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
              {item.unitLabel}
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
        position: 'relative',
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
      {/* Index badge — esquina superior derecha */}
      <span
        style={{
          position: 'absolute',
          top: '7px',
          left: '10px',
          fontSize: '10px',
          fontWeight: 800,
          color: isActive ? colors.primary : colors.textMuted,
          opacity: 0.7,
          letterSpacing: '0.02em',
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Left: info */}
      <div style={{ flex: 1, minWidth: 0 }}>
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

      {/* Indicador de guardando en la card */}
      {saving && (
        <p
          style={{
            width: '100%',
            margin: 0,
            fontSize: '12px',
            color: colors.textMuted,
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          Guardando...
        </p>
      )}
    </div>
  );
}
