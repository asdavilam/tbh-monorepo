import React, { useState, useEffect, useCallback } from 'react';
import type { StockItemDto } from '@tbh/application';
import type { QualitativeValue, ProductCategory } from '@tbh/domain';
import { PRODUCT_CATEGORY_LABELS } from '@tbh/domain';
import { getCurrentStock, correctStock } from '../../../shared/di';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { colors, fontSize, radius, spacing, transition } from '../../../shared/theme';

const QUALITATIVE_OPTIONS: { value: QualitativeValue; label: string; color: string }[] = [
  { value: 'mucho', label: 'Mucho', color: colors.success },
  { value: 'poco', label: 'Poco', color: colors.warning },
  { value: 'nada', label: 'Nada', color: colors.danger },
];

function formatDate(iso: string | null): string {
  if (!iso) return 'Sin conteo';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

// ── Inline correction form ────────────────────────────────────────────────────

interface CorrectionFormProps {
  item: StockItemDto;
  onSaved: (updated: Partial<StockItemDto>) => void;
  onCancel: () => void;
}

function CorrectionForm({ item, onSaved, onCancel }: CorrectionFormProps) {
  const { user } = useAuth();
  const [finalCount, setFinalCount] = useState('');
  const [qualitativeValue, setQualitativeValue] = useState<QualitativeValue | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isQualitative = item.unitType === 'qualitative';
  const canSave = isQualitative ? qualitativeValue !== null : finalCount !== '';

  async function handleSave() {
    if (!user || !canSave || saving) return;
    setSaving(true);
    setError('');
    try {
      await correctStock.execute({
        userId: user.id,
        productId: item.productId,
        finalCount: isQualitative ? null : Number(finalCount),
        qualitativeValue: isQualitative ? qualitativeValue : null,
        notes: notes || undefined,
      });
      onSaved({
        currentStock: isQualitative ? item.currentStock : Number(finalCount),
        qualitativeValue: isQualitative ? qualitativeValue : item.qualitativeValue,
        lastCountDate: new Date().toISOString().split('T')[0],
        isLow: !isQualitative && item.minStock !== null && Number(finalCount) < item.minStock,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar la corrección');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        backgroundColor: colors.surfaceLow,
        border: `2px solid ${colors.primary}`,
        borderTop: 'none',
        borderRadius: `0 0 ${radius.md} ${radius.md}`,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: colors.textMuted,
        }}
      >
        Cantidad real actual
      </p>

      {isQualitative ? (
        <div style={{ display: 'flex', gap: '8px' }}>
          {QUALITATIVE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setQualitativeValue(opt.value)}
              style={{
                flex: 1,
                padding: '10px 8px',
                minHeight: '44px',
                border: `2px solid ${qualitativeValue === opt.value ? opt.color : colors.border}`,
                borderRadius: radius.sm,
                backgroundColor: qualitativeValue === opt.value ? `${opt.color}18` : colors.surface,
                color: qualitativeValue === opt.value ? opt.color : colors.textMuted,
                fontSize: fontSize.sm,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="number"
            min="0"
            step="any"
            value={finalCount}
            onChange={(e) => setFinalCount(e.target.value)}
            placeholder="0"
            inputMode="decimal"
            autoFocus
            style={{
              flex: 1,
              height: '52px',
              padding: '0 16px',
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: radius.sm,
              fontSize: '20px',
              fontWeight: 700,
              color: colors.text,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <span style={{ fontSize: fontSize.sm, color: colors.textMuted, fontWeight: 600 }}>
            {item.unitLabel}
          </span>
        </div>
      )}

      {/* Notes */}
      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Motivo de corrección (opcional)"
        style={{
          width: '100%',
          height: '44px',
          padding: '0 14px',
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: radius.sm,
          fontSize: fontSize.sm,
          color: colors.text,
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />

      {error && (
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
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            height: '44px',
            backgroundColor: 'transparent',
            color: colors.textMuted,
            border: `1px solid ${colors.border}`,
            borderRadius: radius.sm,
            fontSize: fontSize.sm,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave || saving}
          style={{
            flex: 2,
            height: '44px',
            backgroundColor: canSave && !saving ? colors.primary : colors.border,
            color: canSave && !saving ? '#fff' : colors.textMuted,
            border: 'none',
            borderRadius: radius.sm,
            fontSize: fontSize.sm,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: canSave && !saving ? 'pointer' : 'not-allowed',
            transition: `background-color ${transition.fast}`,
          }}
        >
          {saving ? 'Guardando...' : 'Guardar corrección'}
        </button>
      </div>
    </div>
  );
}

// ── Stock card ────────────────────────────────────────────────────────────────

interface StockCardProps {
  item: StockItemDto;
  isAdmin: boolean;
  expanded: boolean;
  onToggle: () => void;
  onSaved: (updated: Partial<StockItemDto>) => void;
}

function StockCard({ item, isAdmin: adminUser, expanded, onToggle, onSaved }: StockCardProps) {
  const isQualitative = item.unitType === 'qualitative';

  const stockColor = item.isLow
    ? colors.danger
    : item.currentStock === null && !isQualitative
      ? colors.textLight
      : colors.success;

  const stockDisplay = isQualitative
    ? (item.qualitativeValue ?? '—')
    : item.currentStock !== null
      ? `${item.currentStock} ${item.unitLabel}`
      : '— sin conteo';

  const qualColor =
    item.qualitativeValue === 'mucho'
      ? colors.success
      : item.qualitativeValue === 'poco'
        ? colors.warning
        : item.qualitativeValue === 'nada'
          ? colors.danger
          : colors.textLight;

  return (
    <div>
      <button
        type="button"
        onClick={adminUser ? onToggle : undefined}
        style={{
          width: '100%',
          padding: '14px 16px',
          backgroundColor: expanded ? colors.primaryLight : colors.surface,
          border: `${expanded ? 2 : 1}px solid ${expanded ? colors.primary : item.isLow ? colors.danger + '66' : colors.border}`,
          borderBottom: expanded ? 'none' : undefined,
          borderRadius: expanded ? `${radius.md} ${radius.md} 0 0` : radius.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: adminUser ? 'pointer' : 'default',
          textAlign: 'left',
          gap: '12px',
          minHeight: '60px',
          transition: `background-color ${transition.fast}`,
        }}
      >
        {/* Left */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: fontSize.md,
                color: expanded ? colors.primary : colors.text,
                letterSpacing: '-0.01em',
                textTransform: 'uppercase',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.name}
            </p>
            {item.isLow && (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  backgroundColor: colors.dangerLight,
                  color: colors.danger,
                  padding: '2px 7px',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.04em',
                  flexShrink: 0,
                }}
              >
                BAJO
              </span>
            )}
          </div>
          <p
            style={{
              margin: '3px 0 0',
              fontSize: '11px',
              color: colors.textMuted,
              fontWeight: 500,
            }}
          >
            Último conteo: {formatDate(item.lastCountDate)}
            {item.minStock !== null && !isQualitative && (
              <span style={{ marginLeft: '8px' }}>
                · Mín: {item.minStock} {item.unitLabel}
              </span>
            )}
          </p>
        </div>

        {/* Right: stock value */}
        <div
          style={{
            textAlign: 'right',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span
            style={{
              fontSize: '20px',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: isQualitative ? qualColor : stockColor,
            }}
          >
            {stockDisplay}
          </span>
          {adminUser && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={expanded ? colors.primary : colors.textMuted}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: `transform ${transition.base}`,
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          )}
        </div>
      </button>

      {expanded && adminUser && (
        <CorrectionForm
          item={item}
          onSaved={(updated) => {
            onSaved(updated);
            onToggle();
          }}
          onCancel={onToggle}
        />
      )}
    </div>
  );
}

// ── Main StockView ────────────────────────────────────────────────────────────

export function StockView() {
  const { user } = useAuth();
  const adminUser = user?.role === 'admin' || user?.role === 'encargado';

  const [items, setItems] = useState<StockItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const data = await getCurrentStock.execute(user.id);
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar stock');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  function handleToggle(productId: string) {
    setExpandedId((prev) => (prev === productId ? null : productId));
  }

  function handleSaved(productId: string, updated: Partial<StockItemDto>) {
    setItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, ...updated } : item))
    );
  }

  const lowCount = items.filter((i) => i.isLow && !i.isVariantContainer).length;

  if (loading) {
    return (
      <p
        style={{
          color: colors.textMuted,
          fontSize: fontSize.base,
          margin: 0,
          paddingTop: '32px',
          textAlign: 'center',
        }}
      >
        Calculando stock...
      </p>
    );
  }

  if (error) {
    return (
      <div
        style={{
          backgroundColor: colors.dangerLight,
          color: colors.danger,
          padding: '14px 16px',
          borderRadius: radius.md,
          fontSize: fontSize.base,
          fontWeight: 500,
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      {/* Summary badges */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: colors.textMuted,
          }}
        >
          {items.length} productos
        </span>
        {lowCount > 0 && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: colors.dangerLight,
              color: colors.danger,
              padding: '2px 8px',
              borderRadius: '999px',
            }}
          >
            {lowCount} bajo stock
          </span>
        )}
        {adminUser && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: colors.textMuted,
              backgroundColor: colors.surfaceLow,
              padding: '2px 8px',
              borderRadius: '999px',
            }}
          >
            Toca un producto para corregir
          </span>
        )}
      </div>

      {(() => {
        function renderItems(groupItems: typeof items) {
          return groupItems.map((item) => {
            if (item.isVariantContainer) {
              return (
                <div key={item.productId}>
                  <div
                    style={{
                      padding: '10px 16px 6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: colors.primary,
                      }}
                    >
                      {item.name}
                    </span>
                    <span
                      style={{
                        fontSize: fontSize.sm,
                        fontWeight: 700,
                        color: colors.textMuted,
                        backgroundColor: colors.surfaceLow,
                        padding: '2px 10px',
                        borderRadius: '999px',
                      }}
                    >
                      Total:{' '}
                      {item.currentStock !== null ? `${item.currentStock} ${item.unitLabel}` : '—'}
                    </span>
                  </div>
                </div>
              );
            }
            const isVariant = item.parentProductId !== null;
            return (
              <div
                key={item.productId}
                style={
                  isVariant
                    ? {
                        paddingLeft: '12px',
                        borderLeft: `3px solid ${colors.border}`,
                        marginLeft: '8px',
                      }
                    : undefined
                }
              >
                <StockCard
                  item={item}
                  isAdmin={adminUser}
                  expanded={expandedId === item.productId}
                  onToggle={() => handleToggle(item.productId)}
                  onSaved={(updated) => handleSaved(item.productId, updated)}
                />
              </div>
            );
          });
        }

        // Only show category groups when at least one non-variant item has a category
        const hasCategories = items.some((i) => i.category && !i.parentProductId);
        if (!hasCategories) return renderItems(items);

        // Variants should group with their container regardless of their own category field
        // (variants may have null category if they were created before inheritance was fixed)
        const containerCategoryById = new Map(
          items
            .filter((i) => i.isVariantContainer)
            .map((i) => [i.productId, i.category?.trim() || ''])
        );
        const effectiveCategory = (item: StockItemDto): string => {
          if (item.parentProductId) {
            return containerCategoryById.get(item.parentProductId) ?? item.category?.trim() ?? '';
          }
          return item.category?.trim() || '';
        };

        const map = new Map<string, typeof items>();
        for (const item of items) {
          const key = effectiveCategory(item);
          if (!map.has(key)) map.set(key, []);
          map.get(key)!.push(item);
        }
        const groups = Array.from(map.entries())
          .filter(([k]) => k !== '')
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([label, groupItems]) => ({ label, groupItems }));
        const uncategorized = map.get('');
        if (uncategorized?.length)
          groups.push({ label: 'Sin categoría', groupItems: uncategorized });

        return groups.map(({ label, groupItems }) => (
          <React.Fragment key={label}>
            <div
              style={{
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: colors.textMuted,
                padding: '12px 2px 6px',
                borderBottom: `1px solid ${colors.border}`,
                marginBottom: '4px',
              }}
            >
              {PRODUCT_CATEGORY_LABELS[label as ProductCategory] ?? label}
            </div>
            {renderItems(groupItems)}
          </React.Fragment>
        ));
      })()}
    </div>
  );
}
