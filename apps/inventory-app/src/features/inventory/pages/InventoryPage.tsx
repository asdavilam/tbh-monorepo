import React, { useState, useCallback, useMemo } from 'react';
import { PRODUCT_CATEGORY_LABELS } from '@tbh/domain';
import type { ProductCategory } from '@tbh/domain';
import type { InventoryItemDto, InventoryRecordResponseDto } from '@tbh/application';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { Layout } from '../../../shared/components/Layout';
import { CountCard } from '../components/CountCard';
import { StockView } from '../components/StockView';
import { useInventoryToday } from '../hooks/useInventoryToday';
import { colors, radius, fontSize, transition, spacing } from '../../../shared/theme';

type Tab = 'conteo' | 'stock';

// ── Category header ───────────────────────────────────────────────────────────

function CategoryHeader({ label }: { label: string }) {
  return (
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
      {label}
    </div>
  );
}

// ── Variant group header ──────────────────────────────────────────────────────

function VariantGroupHeader({
  parentName,
  savedCount,
  total,
}: {
  parentName: string;
  savedCount: number;
  total: number;
}) {
  const done = savedCount >= total;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 4px 4px',
        marginTop: spacing.sm,
      }}
    >
      <span
        style={{
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: done ? colors.success : colors.primary,
        }}
      >
        {parentName}
      </span>
      <span
        style={{
          fontSize: '11px',
          fontWeight: 700,
          color: done ? colors.success : colors.textMuted,
          backgroundColor: done ? `${colors.success}18` : colors.surfaceLow,
          padding: '2px 8px',
          borderRadius: '999px',
        }}
      >
        {savedCount}/{total}
      </span>
    </div>
  );
}

// ── Completed inventory summary ───────────────────────────────────────────────

function SummaryRow({
  item,
  record,
}: {
  item: InventoryItemDto;
  record: InventoryRecordResponseDto;
}) {
  const isQualitative = item.unitType === 'qualitative';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 4px',
        borderBottom: `1px solid ${colors.border}`,
        gap: spacing.md,
      }}
    >
      <span
        style={{
          fontSize: fontSize.sm,
          fontWeight: 600,
          color: colors.text,
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {item.name}
      </span>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <span
          style={{
            fontSize: fontSize.base,
            fontWeight: 800,
            color: colors.success,
            letterSpacing: '-0.01em',
          }}
        >
          {isQualitative ? record.qualitativeValue : record.finalCount}
        </span>
        {!isQualitative && (
          <span
            style={{
              fontSize: '11px',
              color: colors.textMuted,
              fontWeight: 500,
              marginLeft: '4px',
            }}
          >
            {item.unitLabel}
          </span>
        )}
        {!isQualitative && record.difference !== null && (
          <span
            style={{
              marginLeft: '6px',
              fontSize: '11px',
              fontWeight: 700,
              color: record.difference < 0 ? colors.danger : colors.success,
            }}
          >
            ({record.difference > 0 ? '+' : ''}
            {record.difference})
          </span>
        )}
      </div>
    </div>
  );
}

function CompletedView({
  items,
  savedRecords,
  today,
  canSeeStock,
  onViewStock,
}: {
  items: InventoryItemDto[];
  savedRecords: Map<string, InventoryRecordResponseDto>;
  today: string;
  canSeeStock: boolean;
  onViewStock: () => void;
}) {
  const hasCategories = items.some((item) => item.category);

  const renderSummaryItems = (subset: InventoryItemDto[]) =>
    subset.map((item) => {
      const record = savedRecords.get(item.productId);
      if (!record) return null;
      return <SummaryRow key={item.productId} item={item} record={record} />;
    });

  let summaryContent: React.ReactNode;
  if (!hasCategories) {
    summaryContent = renderSummaryItems(items);
  } else {
    const map = new Map<string, InventoryItemDto[]>();
    for (const item of items) {
      const key = item.category?.trim() || '';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    const groups = Array.from(map.entries())
      .filter(([k]) => k !== '')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, groupItems]) => ({ label, groupItems }));
    const uncategorized = map.get('');
    if (uncategorized?.length) groups.push({ label: 'Sin categoría', groupItems: uncategorized });

    summaryContent = groups.map(({ label, groupItems }) => (
      <React.Fragment key={label}>
        <CategoryHeader label={PRODUCT_CATEGORY_LABELS[label as ProductCategory] ?? label} />
        {renderSummaryItems(groupItems)}
      </React.Fragment>
    ));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Success banner */}
      <div
        style={{
          backgroundColor: `${colors.success}10`,
          border: `1px solid ${colors.success}40`,
          borderRadius: radius.md,
          padding: '24px 20px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            backgroundColor: `${colors.success}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
            color: colors.success,
          }}
        >
          <svg
            width="28"
            height="28"
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
        <p
          style={{
            margin: '0 0 4px',
            fontSize: fontSize.lg,
            fontWeight: 800,
            color: colors.text,
            letterSpacing: '-0.01em',
          }}
        >
          ¡Conteo completado!
        </p>
        <p style={{ margin: 0, fontSize: fontSize.sm, color: colors.textMuted, fontWeight: 500 }}>
          {today} · {items.length} productos
        </p>
      </div>

      {/* Summary list */}
      <div
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          border: `1px solid ${colors.border}`,
          padding: '4px 16px 0',
        }}
      >
        {summaryContent}
      </div>

      {/* CTA para ver stock — solo admin/encargado */}
      {canSeeStock && (
        <button
          onClick={onViewStock}
          style={{
            width: '100%',
            backgroundColor: colors.primary,
            color: '#fff',
            border: 'none',
            borderRadius: radius.md,
            padding: '16px',
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            minHeight: '52px',
            marginTop: '4px',
            boxShadow: `0 4px 14px ${colors.primary}33`,
          }}
        >
          Ver stock actual
        </button>
      )}
    </div>
  );
}

// ── Render items grouped by parent ────────────────────────────────────────────

function renderInventoryItems(
  items: InventoryItemDto[],
  userId: string,
  onSaved: (record: InventoryRecordResponseDto) => void,
  onValueChange: (productId: string, hasValue: boolean) => void,
  triggerSave: number,
  savedIds: Set<string>,
  missingIds: Set<string>
) {
  const result: React.ReactNode[] = [];
  const rendered = new Set<string>();
  let globalIndex = 0;

  // Group variants by parent
  const byParent = new Map<string, InventoryItemDto[]>();
  for (const item of items) {
    if (item.parentProductId) {
      const list = byParent.get(item.parentProductId) ?? [];
      list.push(item);
      byParent.set(item.parentProductId, list);
    }
  }

  for (const item of items) {
    if (rendered.has(item.productId)) continue;

    if (!item.parentProductId) {
      // Standalone product
      result.push(
        <CountCard
          key={item.productId}
          item={item}
          userId={userId}
          index={globalIndex++}
          onSaved={onSaved}
          onValueChange={onValueChange}
          triggerSave={triggerSave}
          autoFocus={globalIndex === 1}
          highlightMissing={missingIds.has(item.productId)}
        />
      );
      rendered.add(item.productId);
    } else if (!rendered.has(item.parentProductId ?? '')) {
      // First variant of a group — render header then all variants
      const variants = byParent.get(item.parentProductId!) ?? [];
      const savedInGroup = variants.filter((v) => savedIds.has(v.productId)).length;

      result.push(
        <VariantGroupHeader
          key={`header-${item.parentProductId}`}
          parentName={item.parentName!}
          savedCount={savedInGroup}
          total={variants.length}
        />
      );

      for (const variant of variants) {
        result.push(
          <CountCard
            key={variant.productId}
            item={variant}
            userId={userId}
            index={globalIndex++}
            onSaved={onSaved}
            onValueChange={onValueChange}
            triggerSave={triggerSave}
            autoFocus={false}
            highlightMissing={missingIds.has(variant.productId)}
          />
        );
        rendered.add(variant.productId);
      }
      rendered.add(item.parentProductId!);
    }
  }

  return result;
}

export function InventoryPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('conteo');

  if (!user) return null;

  const canSeeStock = user.role === 'admin' || user.role === 'encargado';
  const { items, loading, error, reload } = useInventoryToday(user);

  // Registros ya guardados hoy (cargados desde DB al abrir la pantalla)
  const existingSavedIds = useMemo(
    () => new Set(items.filter((i) => i.existingRecord).map((i) => i.productId)),
    [items]
  );
  const existingSavedRecords = useMemo(() => {
    const map = new Map<string, InventoryRecordResponseDto>();
    for (const item of items) {
      if (item.existingRecord) map.set(item.productId, item.existingRecord);
    }
    return map;
  }, [items]);

  // Registros guardados durante esta sesión (sin persistir en DB todavía)
  const [newlySavedIds, setNewlySavedIds] = useState<Set<string>>(new Set());
  const [newlySavedRecords, setNewlySavedRecords] = useState<
    Map<string, InventoryRecordResponseDto>
  >(new Map());

  // Combinados: pre-existentes + nuevos de esta sesión
  const savedIds = useMemo(
    () => new Set([...existingSavedIds, ...newlySavedIds]),
    [existingSavedIds, newlySavedIds]
  );
  const savedRecords = useMemo(
    () => new Map([...existingSavedRecords, ...newlySavedRecords]),
    [existingSavedRecords, newlySavedRecords]
  );

  const [filledIds, setFilledIds] = useState<Set<string>>(new Set());
  const [saveTrigger, setSaveTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMissingHighlight, setShowMissingHighlight] = useState(false);
  const savedCount = savedIds.size;

  // IDs pendientes sin valor — computado aquí (antes de cualquier return condicional) para respetar Rules of Hooks
  const missingIds = useMemo(() => {
    if (!showMissingHighlight) return new Set<string>();
    return new Set(
      items
        .filter((i) => !savedIds.has(i.productId) && !filledIds.has(i.productId))
        .map((i) => i.productId)
    );
  }, [showMissingHighlight, items, savedIds, filledIds]);

  function handleSaved(record: InventoryRecordResponseDto) {
    setNewlySavedIds((prev) => new Set([...prev, record.productId]));
    setNewlySavedRecords((prev) => new Map([...prev, [record.productId, record]]));
  }

  const handleValueChange = useCallback((productId: string, hasValue: boolean) => {
    setFilledIds((prev) => {
      const next = new Set(prev);
      if (hasValue) next.add(productId);
      else next.delete(productId);
      return next;
    });
    // Limpiar highlight cuando el usuario empieza a llenar un campo
    if (hasValue) setShowMissingHighlight(false);
  }, []);

  const today = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const tabBar = canSeeStock ? (
    <div
      style={{
        display: 'flex',
        backgroundColor: colors.surfaceLow,
        borderRadius: radius.md,
        padding: '4px',
        marginBottom: '16px',
      }}
    >
      {(['conteo', 'stock'] as Tab[]).map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          style={{
            flex: 1,
            height: '38px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: tab === t ? colors.surface : 'transparent',
            color: tab === t ? colors.primary : colors.textMuted,
            fontSize: fontSize.sm,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            boxShadow: tab === t ? '0 1px 4px rgba(80,60,40,0.10)' : 'none',
            transition: `all ${transition.fast}`,
          }}
        >
          {t === 'conteo' ? 'Conteo diario' : 'Stock actual'}
        </button>
      ))}
    </div>
  ) : null;

  // Stock tab — admin y encargado
  if (tab === 'stock' && canSeeStock) {
    return (
      <Layout title="Inventario">
        {tabBar}
        <StockView />
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout title="Inventario">
        {tabBar}
        <div style={{ paddingTop: '48px', textAlign: 'center' }}>
          <p style={{ color: colors.textMuted, fontSize: fontSize.base }}>Cargando productos...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Inventario">
        {tabBar}
        <div
          style={{
            backgroundColor: colors.dangerLight,
            borderRadius: radius.md,
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: colors.danger, margin: '0 0 12px', fontWeight: 600 }}>
            Error al cargar productos
          </p>
          <button
            onClick={reload}
            style={{
              padding: '10px 20px',
              backgroundColor: colors.danger,
              color: '#fff',
              border: 'none',
              borderRadius: radius.sm,
              cursor: 'pointer',
              minHeight: '44px',
              fontWeight: 600,
              fontSize: fontSize.base,
            }}
          >
            Reintentar
          </button>
        </div>
      </Layout>
    );
  }

  const total = items.length;
  const allDone = total > 0 && savedCount >= total;
  const progressPct = total > 0 ? (savedCount / total) * 100 : 0;
  const pendingItems = items.filter((item) => !savedIds.has(item.productId));
  const allPendingFilled =
    pendingItems.length > 0 && pendingItems.every((item) => filledIds.has(item.productId));

  // Campos llenados (con valor ingresado, incluyendo ya guardados)
  const filledCount = filledIds.size + savedCount;
  // Productos con stock inicial bajo mínimo (urgencia de compra)
  const lowStockCount = items.filter(
    (item) =>
      item.initialStock !== null && item.minStock !== null && item.initialStock < item.minStock
  ).length;

  return (
    <Layout title="Inventario">
      {tabBar}
      <p
        style={{
          fontSize: '11px',
          fontWeight: 700,
          color: colors.textMuted,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}
      >
        {today}
      </p>

      {total === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: '64px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: radius.md,
              backgroundColor: `${colors.success}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: colors.success,
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <p
            style={{
              fontSize: fontSize.lg,
              fontWeight: 700,
              color: colors.text,
              marginBottom: '6px',
            }}
          >
            No hay productos por contar hoy
          </p>
          <p style={{ fontSize: fontSize.base, color: colors.textMuted }}>
            Regresa mañana o revisa la configuración.
          </p>
        </div>
      ) : allDone ? (
        <CompletedView
          items={items}
          savedRecords={savedRecords}
          today={today}
          canSeeStock={canSeeStock}
          onViewStock={() => setTab('stock')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Bento stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginBottom: '8px',
            }}
          >
            {/* Card 1: Llenados — live counter a medida que el usuario ingresa valores */}
            <div
              style={{
                backgroundColor: colors.surfaceLow,
                borderRadius: radius.md,
                padding: '16px',
                borderLeft: `4px solid ${colors.primary}`,
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: colors.textMuted,
                }}
              >
                Llenados
              </span>
              <div>
                <span
                  style={{
                    fontSize: '40px',
                    fontWeight: 900,
                    letterSpacing: '-0.04em',
                    color: colors.primary,
                    lineHeight: 1,
                  }}
                >
                  {String(Math.min(filledCount, total)).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: colors.textMuted,
                    marginLeft: '4px',
                  }}
                >
                  / {total}
                </span>
              </div>
            </div>

            {/* Card 2: Bajo mínimo — urgencia de compra basada en stock inicial */}
            <div
              style={{
                backgroundColor: lowStockCount > 0 ? `${colors.warning}10` : colors.surfaceLow,
                borderRadius: radius.md,
                padding: '16px',
                borderLeft: `4px solid ${lowStockCount > 0 ? colors.warning : colors.border}`,
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: lowStockCount > 0 ? colors.warning : colors.textMuted,
                }}
              >
                Bajo mínimo
              </span>
              <span
                style={{
                  fontSize: '40px',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  color: lowStockCount > 0 ? colors.warning : colors.textMuted,
                  lineHeight: 1,
                }}
              >
                {String(lowStockCount).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: '4px',
              backgroundColor: colors.surfaceHigh,
              borderRadius: '2px',
              overflow: 'hidden',
              marginBottom: '4px',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progressPct}%`,
                backgroundColor: allDone ? colors.success : colors.primary,
                borderRadius: '2px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>

          {/* Barra de búsqueda */}
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

          {/* Checklist — agrupado por categoría, con variantes bajo su padre */}
          {(() => {
            const q = searchQuery.trim().toLowerCase();
            const filteredItems = q
              ? items.filter(
                  (item) =>
                    item.name.toLowerCase().includes(q) ||
                    (item.parentName?.toLowerCase().includes(q) ?? false)
                )
              : items;

            if (filteredItems.length === 0 && q) {
              return (
                <p style={{ color: colors.textMuted, fontSize: fontSize.base, margin: 0 }}>
                  Sin resultados para "{searchQuery}".
                </p>
              );
            }

            const hasCategories = filteredItems.some((item) => item.category);
            if (!hasCategories) {
              return renderInventoryItems(
                filteredItems,
                user.id,
                handleSaved,
                handleValueChange,
                saveTrigger,
                savedIds,
                missingIds
              );
            }

            // Agrupar por categoría manteniendo el orden dentro de cada grupo
            const map = new Map<string, InventoryItemDto[]>();
            for (const item of filteredItems) {
              const key = item.category?.trim() || '';
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
                <CategoryHeader
                  label={PRODUCT_CATEGORY_LABELS[label as ProductCategory] ?? label}
                />
                {renderInventoryItems(
                  groupItems,
                  user.id,
                  handleSaved,
                  handleValueChange,
                  saveTrigger,
                  savedIds,
                  missingIds
                )}
              </React.Fragment>
            ));
          })()}

          {/* Botón global de guardar */}
          {!allDone && (
            <button
              onClick={() => {
                if (allPendingFilled) {
                  setSaveTrigger((t) => t + 1);
                  setShowMissingHighlight(false);
                } else {
                  setShowMissingHighlight(true);
                }
              }}
              style={{
                width: '100%',
                backgroundColor: allPendingFilled ? colors.primary : colors.border,
                color: allPendingFilled ? '#fff' : colors.textMuted,
                border: 'none',
                borderRadius: radius.md,
                padding: '16px',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                minHeight: '52px',
                marginTop: '4px',
                boxShadow: allPendingFilled ? `0 4px 14px ${colors.primary}33` : 'none',
                transition: `background-color ${transition.fast}, box-shadow ${transition.fast}`,
              }}
            >
              {allPendingFilled
                ? 'Guardar conteo'
                : `Faltan ${pendingItems.filter((i) => !filledIds.has(i.productId)).length} campos`}
            </button>
          )}
        </div>
      )}
    </Layout>
  );
}
