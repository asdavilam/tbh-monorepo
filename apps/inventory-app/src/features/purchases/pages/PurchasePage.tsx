import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';

const PURCHASE_DRAFT_KEY = 'tbh:draft:purchase';

interface PurchaseDraft {
  productId: string;
  quantity: string;
  packageCount: number;
  notes: string;
}

function loadPurchaseDraft(): PurchaseDraft | null {
  try {
    const raw = localStorage.getItem(PURCHASE_DRAFT_KEY);
    return raw ? (JSON.parse(raw) as PurchaseDraft) : null;
  } catch {
    return null;
  }
}

function clearPurchaseDraft() {
  try {
    localStorage.removeItem(PURCHASE_DRAFT_KEY);
  } catch {
    // ignore
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

export function PurchasePage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [productId, setProductId] = useState(() => loadPurchaseDraft()?.productId ?? '');
  const [quantity, setQuantity] = useState(() => loadPurchaseDraft()?.quantity ?? '');
  const [packageCount, setPackageCount] = useState(() => loadPurchaseDraft()?.packageCount ?? 1);
  const [notes, setNotes] = useState(() => loadPurchaseDraft()?.notes ?? '');
  const [barcodeError, setBarcodeError] = useState('');

  // Shopping list state
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

  // Carga ítems manuales del usuario desde localStorage
  useEffect(() => {
    if (!user) return;
    const manual = loadManualItems(user.id);
    setManualItems(manual);
    if (manual.length > 0) setListOpen(true);
  }, [user]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  // Persistir borrador mientras el usuario llena el formulario
  useEffect(() => {
    if (!productId) {
      clearPurchaseDraft();
      return;
    }
    try {
      localStorage.setItem(
        PURCHASE_DRAFT_KEY,
        JSON.stringify({ productId, quantity, packageCount, notes })
      );
    } catch {
      // localStorage no disponible, continuar sin persistencia
    }
  }, [productId, quantity, packageCount, notes]);

  const selectedCardRef = useRef<HTMLDivElement>(null);

  const { products, history, saving, loadingHistory, success, error, submit } = usePurchase(user!);

  const filtered = search.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()))
    : products;

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
    await submit(productId, finalQty, notes || undefined);
    clearPurchaseDraft();
    setProductId('');
    setQuantity('');
    setPackageCount(1);
    setNotes('');
  }

  return (
    <Layout title="Registrar Compra">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* ── Success banner ── */}
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
            Compra registrada correctamente
          </div>
        )}

        {/* ── Shopping list panel ── */}
        {!listLoading && (
          <div
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${listItems.length > 0 || manualItems.length > 0 ? colors.danger + '55' : colors.border}`,
              borderRadius: radius.md,
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <button
              type="button"
              onClick={() => setListOpen((v) => !v)}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color:
                      listItems.length > 0 || manualItems.length > 0
                        ? colors.danger
                        : colors.success,
                  }}
                >
                  {listItems.length + manualItems.length > 0
                    ? `${listItems.length + manualItems.length} productos por comprar`
                    : 'Stock completo'}
                </span>
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
                  transform: listOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: `transform ${transition.base}`,
                  flexShrink: 0,
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Items */}
            {listOpen && (listItems.length > 0 || manualItems.length > 0) && (
              <div style={{ borderTop: `1px solid ${colors.border}` }}>
                {/* Auto items (bajo stock) */}
                {listItems.map((item) => (
                  <button
                    key={`auto-${item.productId}`}
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setProductId(item.productId);
                      setQuantity('');
                      setPackageCount(1);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 16px',
                      backgroundColor:
                        productId === item.productId ? colors.primaryLight : 'transparent',
                      border: 'none',
                      borderBottom: `1px solid ${colors.border}`,
                      cursor: 'pointer',
                      gap: '12px',
                      textAlign: 'left',
                      minHeight: '48px',
                      transition: `background-color ${transition.fast}`,
                    }}
                  >
                    <span
                      style={{
                        flex: 1,
                        fontWeight: 600,
                        fontSize: fontSize.sm,
                        color: productId === item.productId ? colors.primary : colors.text,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
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

                {/* Manual items */}
                {manualItems.map((item, idx) => (
                  <button
                    key={`manual-${idx}`}
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setProductId(item.productId);
                      setQuantity('');
                      setPackageCount(1);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 16px',
                      backgroundColor:
                        productId === item.productId ? colors.primaryLight : 'transparent',
                      border: 'none',
                      borderBottom: `1px solid ${colors.border}`,
                      cursor: 'pointer',
                      gap: '12px',
                      textAlign: 'left',
                      minHeight: '48px',
                      transition: `background-color ${transition.fast}`,
                    }}
                  >
                    <span
                      style={{
                        flex: 1,
                        fontWeight: 600,
                        fontSize: fontSize.sm,
                        color: productId === item.productId ? colors.primary : colors.text,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
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
              </div>
            )}

            {listOpen && listItems.length === 0 && manualItems.length === 0 && (
              <div
                style={{
                  borderTop: `1px solid ${colors.border}`,
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

        {/* ── Search + Scan ── */}
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
                  fontSize: '18px',
                  lineHeight: 1,
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

        {/* ── Product list ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.length === 0 && (
            <p
              style={{
                textAlign: 'center',
                color: colors.textMuted,
                fontSize: fontSize.sm,
                padding: '32px 0',
                margin: 0,
              }}
            >
              No se encontraron productos
            </p>
          )}

          {filtered.map((product) => {
            const isSelected = productId === product.id;
            const productHasPackage = Boolean(product.packageUnit && product.packageSize);
            const calcQty = productHasPackage ? packageCount * product.packageSize! : null;

            return (
              <div key={product.id} ref={isSelected ? selectedCardRef : undefined}>
                {/* ── Product card (tap to select) ── */}
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
                  <div style={{ minWidth: 0 }}>
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

                {/* ── Expanded inline form ── */}
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
                          EMPAQUES COMPRADOS
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

                        {/* Quick count buttons */}
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
                                backgroundColor:
                                  packageCount === n ? colors.primaryLight : colors.surface,
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

                        {/* Stepper for larger amounts */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <button
                            type="button"
                            onClick={() => setPackageCount((c) => Math.max(1, c - 1))}
                            style={stepperBtn}
                            aria-label="Reducir cantidad"
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
                            aria-label="Aumentar cantidad"
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
                            {packageCount} {product.packageUnit} × {product.packageSize}{' '}
                            {product.unitLabel}
                          </span>
                          <span
                            style={{ fontSize: '18px', fontWeight: 900, color: colors.primary }}
                          >
                            = {calcQty} {product.unitLabel}
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Quantity — manual mode */
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
                        NOTAS{' '}
                        <span style={{ fontWeight: 400, textTransform: 'none' }}>(opcional)</span>
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ej: compra de emergencia"
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
                      disabled={saving || (!productHasPackage && !quantity)}
                      style={{
                        width: '100%',
                        height: '48px',
                        backgroundColor:
                          saving || (!productHasPackage && !quantity)
                            ? colors.border
                            : colors.primary,
                        color:
                          saving || (!productHasPackage && !quantity) ? colors.textMuted : '#fff',
                        border: 'none',
                        borderRadius: radius.sm,
                        fontSize: '14px',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        cursor:
                          saving || (!productHasPackage && !quantity) ? 'not-allowed' : 'pointer',
                        boxShadow:
                          saving || (!productHasPackage && !quantity)
                            ? 'none'
                            : `0 4px 12px ${colors.primary}33`,
                        transition: `background-color ${transition.fast}`,
                      }}
                    >
                      {saving ? 'Guardando...' : 'Registrar Compra'}
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ height: '1px', backgroundColor: colors.border }} />

        <PurchaseHistory items={history} loading={loadingHistory} />
      </div>
    </Layout>
  );
}

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
