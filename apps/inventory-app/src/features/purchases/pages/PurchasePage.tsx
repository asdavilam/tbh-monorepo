import React, { useState, useRef, useEffect, useCallback, useMemo, type FormEvent } from 'react';
import { PRODUCT_CATEGORY_LABELS } from '@tbh/domain';
import type { ProductCategory } from '@tbh/domain';

// ── Draft persistence ─────────────────────────────────────────────────────────

const DRAFT_KEY = 'tbh:draft:purchase';

interface Draft {
  productId: string;
  quantity: string;
  packageCount: number;
  notes: string;
}

function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

import type { ShoppingListItemDto } from '@tbh/application';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { Layout } from '../../../shared/components/Layout';
import { colors, fontSize, radius, transition } from '../../../shared/theme';
import { usePurchase } from '../hooks/usePurchase';
import { PurchaseHistory } from '../components/PurchaseHistory';
import { BarcodeScannerButton } from '../../products/components/BarcodeScannerButton';
import { generateShoppingList } from '../../../shared/di';
import { loadManualItems } from '../../../shared/shoppingListStorage';
import type { ManualItem } from '../../shopping-list/hooks/useShoppingList';

const QUICK_COUNTS = [1, 2, 3, 4, 5];

// ── Faltantes panel ────────────────────────────────────────────────────────────

interface FaltantesPanelProps {
  buyItems: ShoppingListItemDto[];
  manualItems: ManualItem[];
  productionItems: ShoppingListItemDto[];
  open: boolean;
  onToggle: () => void;
  selectedProductId: string;
  onSelect: (id: string) => void;
}

function FaltantesPanel({
  buyItems,
  manualItems,
  productionItems,
  open,
  onToggle,
  selectedProductId,
  onSelect,
}: FaltantesPanelProps) {
  const buyCount = buyItems.length + manualItems.length;
  const prodCount = productionItems.length;
  const totalCount = buyCount + prodCount;

  return (
    <div
      style={{
        backgroundColor: colors.surface,
        border: `1px solid ${buyCount > 0 ? colors.danger + '55' : colors.border}`,
        borderRadius: radius.md,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          gap: '8px',
          minHeight: '48px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: buyCount > 0 ? colors.danger : colors.textMuted,
            }}
          >
            Faltantes
          </span>
          {totalCount > 0 && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: colors.textMuted,
              }}
            >
              {buyCount > 0 && `${buyCount} por comprar`}
              {buyCount > 0 && prodCount > 0 && ' · '}
              {prodCount > 0 && `${prodCount} por producir`}
            </span>
          )}
          {totalCount === 0 && (
            <span style={{ fontSize: '11px', fontWeight: 500, color: colors.success }}>
              Stock completo
            </span>
          )}
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke={colors.textMuted}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: `transform ${transition.base}`,
            flexShrink: 0,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div style={{ borderTop: `1px solid ${colors.border}` }}>
          {/* Por comprar */}
          {(buyItems.length > 0 || manualItems.length > 0) && (
            <>
              <div style={sectionLabel}>— por comprar —</div>
              {buyItems.map((item) => (
                <button
                  key={`auto-${item.productId}`}
                  type="button"
                  onClick={() => onSelect(item.productId)}
                  style={itemBtn(selectedProductId === item.productId)}
                >
                  <span style={itemName(selectedProductId === item.productId)}>
                    {item.productName}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: colors.danger,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {item.currentStock} / {item.minStock} {item.unitLabel}
                  </span>
                </button>
              ))}
              {manualItems.map((item, idx) => (
                <button
                  key={`manual-${idx}`}
                  type="button"
                  onClick={() => onSelect(item.productId)}
                  style={itemBtn(selectedProductId === item.productId)}
                >
                  <span style={itemName(selectedProductId === item.productId)}>
                    {item.productName}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: colors.warning,
                      backgroundColor: colors.warningLight,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    Manual
                  </span>
                </button>
              ))}
            </>
          )}

          {/* Por producir */}
          {productionItems.length > 0 && (
            <>
              <div
                style={{
                  ...sectionLabel,
                  borderTop: buyCount > 0 ? `1px solid ${colors.border}` : undefined,
                }}
              >
                — por producir —
              </div>
              {productionItems.map((item) => (
                <button
                  key={`prod-${item.productId}`}
                  type="button"
                  onClick={() => onSelect(item.productId)}
                  style={itemBtn(selectedProductId === item.productId)}
                >
                  <span style={itemName(selectedProductId === item.productId)}>
                    {item.productName}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: colors.danger,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {item.currentStock} / {item.minStock} {item.unitLabel}
                  </span>
                </button>
              ))}
            </>
          )}

          {totalCount === 0 && (
            <div
              style={{
                padding: '14px 16px',
                color: colors.success,
                fontSize: fontSize.sm,
                fontWeight: 500,
              }}
            >
              Todos los productos están sobre el stock mínimo.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const sectionLabel: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: colors.textMuted,
  padding: '8px 16px 4px',
  backgroundColor: colors.surfaceLow,
};

function itemBtn(selected: boolean): React.CSSProperties {
  return {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    backgroundColor: selected ? colors.primaryLight : 'transparent',
    border: 'none',
    borderBottom: `1px solid ${colors.border}`,
    cursor: 'pointer',
    gap: '12px',
    textAlign: 'left',
    minHeight: '48px',
    transition: `background-color ${transition.fast}`,
  };
}

function itemName(selected: boolean): React.CSSProperties {
  return {
    flex: 1,
    fontWeight: 600,
    fontSize: fontSize.sm,
    color: selected ? colors.primary : colors.text,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function PurchasePage() {
  const { user } = useAuth();

  // Form state (persisted as draft)
  const [search, setSearch] = useState('');
  const [productId, setProductId] = useState(() => loadDraft()?.productId ?? '');
  const [quantity, setQuantity] = useState(() => loadDraft()?.quantity ?? '');
  const [packageCount, setPackageCount] = useState(() => loadDraft()?.packageCount ?? 1);
  const [notes, setNotes] = useState(() => loadDraft()?.notes ?? '');
  const [barcodeError, setBarcodeError] = useState('');
  const [lastWasProduction, setLastWasProduction] = useState(false);

  // Shopping list
  const [listItems, setListItems] = useState<ShoppingListItemDto[]>([]);
  const [manualItems, setManualItems] = useState<ManualItem[]>([]);
  const [listOpen, setListOpen] = useState(false);
  const [listLoading, setListLoading] = useState(true);

  const loadList = useCallback(async () => {
    setListLoading(true);
    try {
      const items = await generateShoppingList.execute();
      setListItems(items);
      if (items.length > 0) setListOpen(true);
    } catch {
      setListItems([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const manual = loadManualItems(user.id);
    setManualItems(manual);
    if (manual.length > 0) setListOpen(true);
  }, [user]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === 'visible') loadList();
    }
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [loadList]);

  // Draft persistence
  useEffect(() => {
    if (!productId) {
      clearDraft();
      return;
    }
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ productId, quantity, packageCount, notes }));
    } catch {
      /* ignore */
    }
  }, [productId, quantity, packageCount, notes]);

  const selectedCardRef = useRef<HTMLDivElement>(null);
  const { products, history, saving, loadingHistory, success, error, submit } = usePurchase(user!);

  // Separar la lista de faltantes en compras vs producción según isProduction del producto
  const buyListItems = useMemo(
    () =>
      listItems.filter((i) => {
        const p = products.find((p) => p.id === i.productId);
        return !p?.isProduction;
      }),
    [listItems, products]
  );

  const productionItems = useMemo(
    () =>
      listItems.filter((i) => {
        const p = products.find((p) => p.id === i.productId);
        return p?.isProduction === true;
      }),
    [listItems, products]
  );

  // Manual items filtrados a no-producción
  const buyManualItems = useMemo(
    () =>
      manualItems.filter((i) => {
        const p = products.find((p) => p.id === i.productId);
        return !p?.isProduction;
      }),
    [manualItems, products]
  );

  // Filtrado por búsqueda — muestra todos los productos
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [search, products]);

  const selectedProduct = products.find((p) => p.id === productId);
  const hasPackage = Boolean(selectedProduct?.packageUnit && selectedProduct?.packageSize);
  const calculatedQty = hasPackage ? packageCount * selectedProduct!.packageSize! : null;

  useEffect(() => {
    if (productId && selectedCardRef.current) {
      selectedCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [productId]);

  function handleSelectProduct(id: string) {
    setBarcodeError('');
    setProductId((prev) => (prev === id ? '' : id));
    setQuantity('');
    setPackageCount(1);
  }

  function handleBarcodeScan(barcode: string) {
    setBarcodeError('');
    const product = products.find((p) => p.barcode === barcode);
    if (product) {
      setProductId(product.id);
      setSearch('');
      setQuantity('');
      setPackageCount(1);
    } else {
      setBarcodeError(
        `Código "${barcode}" no encontrado. Verifica que el producto tenga barcode registrado.`
      );
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!productId) return;
    const finalQty = hasPackage ? calculatedQty! : Number(quantity);
    if (!finalQty || finalQty <= 0) return;
    const product = products.find((p) => p.id === productId);
    const entryType = product?.isProduction ? 'produccion' : 'compra';
    setLastWasProduction(product?.isProduction ?? false);
    await submit(productId, finalQty, notes || undefined, entryType);
    clearDraft();
    setProductId('');
    setQuantity('');
    setPackageCount(1);
    setNotes('');
  }

  // ── Category helper ─────────────────────────────────────────────────────────
  const categoryByProductId = useMemo(
    () => new Map(products.map((p) => [p.id, p.category])),
    [products]
  );

  function effectiveCategoryKey(p: (typeof filtered)[number]): string {
    return (
      p.category?.trim() ||
      (p.parentProductId ? (categoryByProductId.get(p.parentProductId)?.trim() ?? '') : '') ||
      ''
    );
  }

  // ── Render product card ─────────────────────────────────────────────────────
  function renderCard(product: (typeof filtered)[number]) {
    const isSelected = productId === product.id;
    const productHasPackage = Boolean(product.packageUnit && product.packageSize);
    const calcQty = productHasPackage ? packageCount * product.packageSize! : null;
    const canSubmit = productHasPackage ? true : Boolean(quantity);
    const isProduction = product.isProduction;

    const actionLabel = saving
      ? 'Guardando...'
      : isProduction
        ? 'Registrar producción'
        : 'Registrar compra';

    return (
      <div key={product.id} ref={isSelected ? selectedCardRef : undefined}>
        {/* Product card header */}
        <button
          type="button"
          onClick={() => handleSelectProduct(product.id)}
          aria-expanded={isSelected}
          style={{
            width: '100%',
            padding: '14px 16px',
            backgroundColor: isSelected ? colors.primaryLight : colors.surface,
            border: `${isSelected ? 2 : 1}px solid ${isSelected ? colors.primary : colors.border}`,
            borderBottom: isSelected ? 'none' : undefined,
            borderRadius: isSelected ? `${radius.md} ${radius.md} 0 0` : radius.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            textAlign: 'left',
            transition: `background-color ${transition.fast}, border-color ${transition.fast}`,
            minHeight: '56px',
            gap: '12px',
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <p
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: fontSize.md,
                  color: isSelected ? colors.primary : colors.text,
                  letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {product.name}
              </p>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: isProduction ? colors.success : colors.primary,
                  backgroundColor: isProduction ? colors.successLight : colors.primaryLight,
                  padding: '2px 7px',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {isProduction ? 'Producción' : 'Compra'}
              </span>
            </div>
            <p
              style={{
                margin: '2px 0 0',
                fontSize: fontSize.xs,
                color: colors.textMuted,
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {product.unitLabel || product.unitType}
              {product.packageUnit ? ` · ${product.packageUnit}` : ''}
            </p>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isSelected ? colors.primary : colors.textMuted}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{
              flexShrink: 0,
              transform: isSelected ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: `transform ${transition.base}`,
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Expanded inline form */}
        {isSelected && (
          <form
            onSubmit={handleSubmit}
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
            {/* Quantity — package mode */}
            {productHasPackage ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>
                  {isProduction ? 'EMPAQUES PRODUCIDOS' : 'EMPAQUES COMPRADOS'}
                  <span
                    style={{
                      fontWeight: 400,
                      textTransform: 'none',
                      marginLeft: '6px',
                      color: colors.textMuted,
                    }}
                  >
                    ({product.packageUnit})
                  </span>
                </label>

                {/* Quick count */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {QUICK_COUNTS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPackageCount(n)}
                      style={{
                        flex: 1,
                        height: '48px',
                        borderRadius: radius.sm,
                        border: `2px solid ${packageCount === n ? colors.primary : colors.border}`,
                        backgroundColor: packageCount === n ? colors.primaryLight : colors.surface,
                        color: packageCount === n ? colors.primary : colors.text,
                        fontSize: '18px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: `all ${transition.fast}`,
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                {/* Stepper */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setPackageCount((c) => Math.max(1, c - 1))}
                    style={stepperBtn}
                    aria-label="Reducir"
                  >
                    −
                  </button>
                  <span
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontSize: '28px',
                      fontWeight: 900,
                      color: colors.text,
                    }}
                  >
                    {packageCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPackageCount((c) => c + 1)}
                    style={stepperBtn}
                    aria-label="Aumentar"
                  >
                    +
                  </button>
                </div>

                {/* Conversion preview */}
                <div
                  style={{
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`,
                    borderRadius: radius.sm,
                    padding: '10px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '13px', color: colors.textMuted }}>
                    {packageCount} {product.packageUnit} × {product.packageSize} {product.unitLabel}
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 900, color: colors.primary }}>
                    = {calcQty} {product.unitLabel}
                  </span>
                </div>
              </div>
            ) : (
              /* Quantity — manual */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>
                  CANTIDAD
                  {product.unitLabel && (
                    <span
                      style={{
                        fontWeight: 400,
                        textTransform: 'none',
                        marginLeft: '6px',
                        color: colors.textMuted,
                      }}
                    >
                      ({product.unitLabel})
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  placeholder="0"
                  inputMode="decimal"
                  style={inputStyle}
                />
              </div>
            )}

            {/* Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={labelStyle}>
                NOTAS <span style={{ fontWeight: 400, textTransform: 'none' }}>(opcional)</span>
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isProduction ? 'Ej: lote de la tarde' : 'Ej: compra de emergencia'}
                style={inputStyle}
              />
            </div>

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

            <button
              type="submit"
              disabled={saving || !canSubmit}
              style={{
                width: '100%',
                height: '52px',
                backgroundColor: saving || !canSubmit ? colors.border : colors.primary,
                color: saving || !canSubmit ? colors.textMuted : '#fff',
                border: 'none',
                borderRadius: radius.sm,
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: saving || !canSubmit ? 'not-allowed' : 'pointer',
                boxShadow: saving || !canSubmit ? 'none' : `0 4px 12px ${colors.primary}33`,
                transition: `background-color ${transition.fast}`,
              }}
            >
              {actionLabel}
            </button>
          </form>
        )}
      </div>
    );
  }

  // ── Product list with category grouping (search results) ──────────────────
  function renderSearchResults() {
    if (filtered.length === 0) {
      return (
        <p
          style={{
            textAlign: 'center',
            color: colors.textMuted,
            fontSize: fontSize.sm,
            padding: '32px 0',
            margin: 0,
          }}
        >
          {`Sin resultados para "${search}".`}
        </p>
      );
    }

    const hasCategories = filtered.some((p) => effectiveCategoryKey(p) !== '');
    if (!hasCategories) return filtered.map(renderCard);

    const map = new Map<string, typeof filtered>();
    for (const p of filtered) {
      const key = effectiveCategoryKey(p);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    const groups = Array.from(map.entries())
      .filter(([k]) => k !== '')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, items]) => ({ key, items }));
    const uncategorized = map.get('');
    if (uncategorized?.length) groups.push({ key: 'uncategorized', items: uncategorized });

    return groups.map(({ key, items }) => (
      <React.Fragment key={key}>
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
          {key === 'uncategorized'
            ? 'Sin categoría'
            : (PRODUCT_CATEGORY_LABELS[key as ProductCategory] ?? key)}
        </div>
        {items.map(renderCard)}
      </React.Fragment>
    ));
  }

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <Layout title="Entradas">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Success banner */}
        {success && (
          <div
            style={{
              backgroundColor: colors.successLight,
              border: `1px solid ${colors.success}`,
              borderRadius: radius.md,
              padding: '14px 16px',
              color: colors.success,
              fontSize: fontSize.base,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
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
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {lastWasProduction
              ? 'Producción registrada correctamente'
              : 'Compra registrada correctamente'}
          </div>
        )}

        {/* Faltantes panel */}
        {!listLoading && (
          <FaltantesPanel
            buyItems={buyListItems}
            manualItems={buyManualItems}
            productionItems={productionItems}
            open={listOpen}
            onToggle={() => setListOpen((v) => !v)}
            selectedProductId={productId}
            onSelect={(id) => {
              setSearch('');
              setBarcodeError('');
              setProductId(id);
              setQuantity('');
              setPackageCount(1);
            }}
          />
        )}

        {/* Search + Scan */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.textMuted}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setBarcodeError('');
              }}
              placeholder="Buscar producto..."
              aria-label="Buscar producto"
              style={{
                width: '100%',
                height: '52px',
                paddingLeft: '42px',
                paddingRight: search ? '40px' : '14px',
                backgroundColor: colors.surfaceLow,
                border: `1px solid ${colors.border}`,
                borderRadius: radius.md,
                fontSize: fontSize.md,
                color: colors.text,
                fontWeight: 500,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Limpiar búsqueda"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: colors.textMuted,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '32px',
                  minHeight: '32px',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          <BarcodeScannerButton onScan={handleBarcodeScan} />
        </div>

        {barcodeError && (
          <div
            style={{
              backgroundColor: colors.dangerLight,
              color: colors.danger,
              padding: '10px 14px',
              borderRadius: radius.sm,
              fontSize: fontSize.sm,
              fontWeight: 500,
            }}
          >
            {barcodeError}
          </div>
        )}

        {/* Search results (only when searching) */}
        {search && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {renderSearchResults()}
          </div>
        )}

        {/* Selected product inline form (when selected via panel and not searching) */}
        {!search && productId && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {renderCard(products.find((p) => p.id === productId)!)}
          </div>
        )}

        {!search && !productId && (
          <p
            style={{
              margin: 0,
              fontSize: fontSize.sm,
              color: colors.textMuted,
              textAlign: 'center',
              padding: '8px 0',
            }}
          >
            Selecciona un producto de Faltantes o usa el buscador.
          </p>
        )}

        <div style={{ height: '1px', backgroundColor: colors.border }} />

        <PurchaseHistory items={history} loading={loadingHistory} />
      </div>
    </Layout>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: colors.textMuted,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '52px',
  padding: '0 16px',
  backgroundColor: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: radius.md,
  fontSize: '16px',
  color: colors.text,
  fontWeight: 500,
  outline: 'none',
  boxSizing: 'border-box',
};

const stepperBtn: React.CSSProperties = {
  width: '52px',
  height: '52px',
  borderRadius: radius.md,
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.surface,
  color: colors.text,
  fontSize: '24px',
  fontWeight: 300,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};
