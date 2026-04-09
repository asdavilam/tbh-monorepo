import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback } from 'react';
const PURCHASE_DRAFT_KEY = 'tbh:draft:purchase';
function loadPurchaseDraft() {
    try {
        const raw = localStorage.getItem(PURCHASE_DRAFT_KEY);
        return raw ? JSON.parse(raw) : null;
    }
    catch {
        return null;
    }
}
function clearPurchaseDraft() {
    try {
        localStorage.removeItem(PURCHASE_DRAFT_KEY);
    }
    catch {
        // ignore
    }
}
import { useAuth } from '../../../shared/contexts/AuthContext';
import { Layout } from '../../../shared/components/Layout';
import { colors, fontSize, radius, transition } from '../../../shared/theme';
import { usePurchase } from '../hooks/usePurchase';
import { PurchaseHistory } from '../components/PurchaseHistory';
import { BarcodeScannerButton } from '../../products/components/BarcodeScannerButton';
import { generateShoppingList } from '../../../shared/di';
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
    const [listItems, setListItems] = useState([]);
    const [listOpen, setListOpen] = useState(false);
    const [listLoading, setListLoading] = useState(true);
    const loadList = useCallback(async () => {
        setListLoading(true);
        try {
            const items = await generateShoppingList.execute();
            setListItems(items);
            if (items.length > 0)
                setListOpen(true);
        }
        catch {
            setListItems([]);
        }
        finally {
            setListLoading(false);
        }
    }, []);
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
            localStorage.setItem(PURCHASE_DRAFT_KEY, JSON.stringify({ productId, quantity, packageCount, notes }));
        }
        catch {
            // localStorage no disponible, continuar sin persistencia
        }
    }, [productId, quantity, packageCount, notes]);
    const selectedCardRef = useRef(null);
    const { products, history, saving, loadingHistory, success, error, submit } = usePurchase(user);
    const filtered = search.trim()
        ? products.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()))
        : products;
    const selectedProduct = products.find((p) => p.id === productId);
    const hasPackage = Boolean(selectedProduct?.packageUnit && selectedProduct?.packageSize);
    const calculatedQty = hasPackage ? packageCount * selectedProduct.packageSize : null;
    useEffect(() => {
        if (productId && selectedCardRef.current) {
            selectedCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [productId]);
    function handleSelectProduct(id) {
        setBarcodeError('');
        setProductId((prev) => (prev === id ? '' : id));
        setQuantity('');
        setPackageCount(1);
    }
    function handleBarcodeScan(barcode) {
        setBarcodeError('');
        const product = products.find((p) => p.barcode === barcode);
        if (product) {
            setProductId(product.id);
            setSearch('');
            setQuantity('');
            setPackageCount(1);
        }
        else {
            setBarcodeError(`Código "${barcode}" no encontrado. Verifica que el producto tenga barcode registrado.`);
        }
    }
    async function handleSubmit(e) {
        e.preventDefault();
        if (!productId)
            return;
        const finalQty = hasPackage ? calculatedQty : Number(quantity);
        if (!finalQty || finalQty <= 0)
            return;
        await submit(productId, finalQty, notes || undefined);
        clearPurchaseDraft();
        setProductId('');
        setQuantity('');
        setPackageCount(1);
        setNotes('');
    }
    return (_jsx(Layout, { title: "Registrar Compra", children: _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '20px' }, children: [success && (_jsxs("div", { style: {
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
                    }, children: [_jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("polyline", { points: "20 6 9 17 4 12" }) }), "Compra registrada correctamente"] })), !listLoading && (_jsxs("div", { style: {
                        backgroundColor: colors.surface,
                        border: `1px solid ${listItems.length > 0 ? colors.danger + '55' : colors.border}`,
                        borderRadius: radius.md,
                        overflow: 'hidden',
                    }, children: [_jsxs("button", { type: "button", onClick: () => setListOpen((v) => !v), style: {
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
                            }, children: [_jsx("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: _jsx("span", { style: {
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            letterSpacing: '0.08em',
                                            textTransform: 'uppercase',
                                            color: listItems.length > 0 ? colors.danger : colors.success,
                                        }, children: listItems.length > 0
                                            ? `${listItems.length} productos por comprar`
                                            : 'Stock completo' }) }), _jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: colors.textMuted, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", style: {
                                        transform: listOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: `transform ${transition.base}`,
                                        flexShrink: 0,
                                    }, children: _jsx("polyline", { points: "6 9 12 15 18 9" }) })] }), listOpen && listItems.length > 0 && (_jsx("div", { style: { borderTop: `1px solid ${colors.border}` }, children: listItems.map((item) => (_jsxs("button", { type: "button", onClick: () => {
                                    setSearch('');
                                    setProductId(item.productId);
                                    setQuantity('');
                                    setPackageCount(1);
                                }, style: {
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '10px 16px',
                                    backgroundColor: productId === item.productId ? colors.primaryLight : 'transparent',
                                    border: 'none',
                                    borderBottom: `1px solid ${colors.border}`,
                                    cursor: 'pointer',
                                    gap: '12px',
                                    textAlign: 'left',
                                    minHeight: '48px',
                                    transition: `background-color ${transition.fast}`,
                                }, children: [_jsx("span", { style: {
                                            flex: 1,
                                            fontWeight: 600,
                                            fontSize: fontSize.sm,
                                            color: productId === item.productId ? colors.primary : colors.text,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }, children: item.productName }), _jsxs("span", { style: {
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            color: colors.danger,
                                            whiteSpace: 'nowrap',
                                            flexShrink: 0,
                                        }, children: [item.currentStock, " / ", item.minStock, " ", item.unitLabel] })] }, item.productId))) })), listOpen && listItems.length === 0 && (_jsx("div", { style: {
                                borderTop: `1px solid ${colors.border}`,
                                padding: '14px 16px',
                                color: colors.success,
                                fontSize: fontSize.sm,
                                fontWeight: 500,
                            }, children: "Todos los productos est\u00E1n sobre el stock m\u00EDnimo." }))] })), _jsxs("div", { style: { display: 'flex', gap: '8px', alignItems: 'flex-start' }, children: [_jsxs("div", { style: { position: 'relative', flex: 1 }, children: [_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: colors.textMuted, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", style: {
                                        position: 'absolute',
                                        left: '14px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        pointerEvents: 'none',
                                    }, children: [_jsx("circle", { cx: "11", cy: "11", r: "8" }), _jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })] }), _jsx("input", { type: "text", value: search, onChange: (e) => {
                                        setSearch(e.target.value);
                                        setBarcodeError('');
                                    }, placeholder: "Buscar producto...", "aria-label": "Buscar producto", style: {
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
                                    } }), search && (_jsx("button", { type: "button", onClick: () => setSearch(''), "aria-label": "Limpiar b\u00FAsqueda", style: {
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
                                    }, children: _jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [_jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), _jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })] }) }))] }), _jsx(BarcodeScannerButton, { onScan: handleBarcodeScan })] }), barcodeError && (_jsx("div", { style: {
                        backgroundColor: colors.dangerLight,
                        color: colors.danger,
                        padding: '10px 14px',
                        borderRadius: radius.sm,
                        fontSize: fontSize.sm,
                        fontWeight: 500,
                    }, children: barcodeError })), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: [filtered.length === 0 && (_jsx("p", { style: {
                                textAlign: 'center',
                                color: colors.textMuted,
                                fontSize: fontSize.sm,
                                padding: '32px 0',
                                margin: 0,
                            }, children: "No se encontraron productos" })), filtered.map((product) => {
                            const isSelected = productId === product.id;
                            const productHasPackage = Boolean(product.packageUnit && product.packageSize);
                            const calcQty = productHasPackage ? packageCount * product.packageSize : null;
                            return (_jsxs("div", { ref: isSelected ? selectedCardRef : undefined, children: [_jsxs("button", { type: "button", onClick: () => handleSelectProduct(product.id), "aria-expanded": isSelected, style: {
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
                                        }, children: [_jsxs("div", { style: { minWidth: 0 }, children: [_jsx("p", { style: {
                                                            margin: 0,
                                                            fontWeight: 700,
                                                            fontSize: fontSize.md,
                                                            color: isSelected ? colors.primary : colors.text,
                                                            letterSpacing: '-0.01em',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }, children: product.name }), _jsxs("p", { style: {
                                                            margin: '2px 0 0',
                                                            fontSize: fontSize.xs,
                                                            color: colors.textMuted,
                                                            fontWeight: 600,
                                                            letterSpacing: '0.06em',
                                                            textTransform: 'uppercase',
                                                        }, children: [product.unitLabel || product.unitType, product.packageUnit ? ` · ${product.packageUnit}` : ''] })] }), _jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: isSelected ? colors.primary : colors.textMuted, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", style: {
                                                    flexShrink: 0,
                                                    transform: isSelected ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    transition: `transform ${transition.base}`,
                                                }, children: _jsx("polyline", { points: "6 9 12 15 18 9" }) })] }), isSelected && (_jsxs("form", { onSubmit: handleSubmit, style: {
                                            backgroundColor: colors.surfaceLow,
                                            border: `2px solid ${colors.primary}`,
                                            borderTop: 'none',
                                            borderRadius: `0 0 ${radius.md} ${radius.md}`,
                                            padding: '16px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px',
                                        }, children: [productHasPackage ? (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: [_jsxs("label", { style: labelStyle, children: ["EMPAQUES COMPRADOS", _jsxs("span", { style: {
                                                                    fontWeight: 400,
                                                                    textTransform: 'none',
                                                                    marginLeft: '6px',
                                                                    color: colors.textMuted,
                                                                }, children: ["(", product.packageUnit, ")"] })] }), _jsx("div", { style: { display: 'flex', gap: '8px' }, children: QUICK_COUNTS.map((n) => (_jsx("button", { type: "button", onClick: () => setPackageCount(n), style: {
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
                                                            }, children: n }, n))) }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '12px' }, children: [_jsx("button", { type: "button", onClick: () => setPackageCount((c) => Math.max(1, c - 1)), style: stepperBtn, "aria-label": "Reducir cantidad", children: "\u2212" }), _jsx("span", { style: {
                                                                    flex: 1,
                                                                    textAlign: 'center',
                                                                    fontSize: '28px',
                                                                    fontWeight: 900,
                                                                    color: colors.text,
                                                                }, children: packageCount }), _jsx("button", { type: "button", onClick: () => setPackageCount((c) => c + 1), style: stepperBtn, "aria-label": "Aumentar cantidad", children: "+" })] }), _jsxs("div", { style: {
                                                            backgroundColor: colors.surface,
                                                            border: `1px solid ${colors.border}`,
                                                            borderRadius: radius.sm,
                                                            padding: '10px 14px',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                        }, children: [_jsxs("span", { style: { fontSize: '13px', color: colors.textMuted }, children: [packageCount, " ", product.packageUnit, " \u00D7 ", product.packageSize, ' ', product.unitLabel] }), _jsxs("span", { style: { fontSize: '18px', fontWeight: 900, color: colors.primary }, children: ["= ", calcQty, " ", product.unitLabel] })] })] })) : (
                                            /* Quantity — manual mode */
                                            _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: [_jsxs("label", { style: labelStyle, children: ["CANTIDAD", product.unitLabel && (_jsxs("span", { style: {
                                                                    fontWeight: 400,
                                                                    textTransform: 'none',
                                                                    marginLeft: '6px',
                                                                    color: colors.textMuted,
                                                                }, children: ["(", product.unitLabel, ")"] }))] }), _jsx("input", { type: "number", min: "0.01", step: "any", value: quantity, onChange: (e) => setQuantity(e.target.value), required: true, placeholder: "0", inputMode: "decimal", autoFocus: true, style: inputStyle })] })), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: [_jsxs("label", { style: labelStyle, children: ["NOTAS", ' ', _jsx("span", { style: { fontWeight: 400, textTransform: 'none' }, children: "(opcional)" })] }), _jsx("input", { type: "text", value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "Ej: compra de emergencia", style: inputStyle })] }), error && (_jsx("div", { style: {
                                                    backgroundColor: colors.dangerLight,
                                                    color: colors.danger,
                                                    padding: '10px 12px',
                                                    borderRadius: radius.sm,
                                                    fontSize: fontSize.sm,
                                                    fontWeight: 500,
                                                }, children: error })), _jsx("button", { type: "submit", disabled: saving || (!productHasPackage && !quantity), style: {
                                                    width: '100%',
                                                    height: '48px',
                                                    backgroundColor: saving || (!productHasPackage && !quantity)
                                                        ? colors.border
                                                        : colors.primary,
                                                    color: saving || (!productHasPackage && !quantity) ? colors.textMuted : '#fff',
                                                    border: 'none',
                                                    borderRadius: radius.sm,
                                                    fontSize: '14px',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.06em',
                                                    textTransform: 'uppercase',
                                                    cursor: saving || (!productHasPackage && !quantity) ? 'not-allowed' : 'pointer',
                                                    boxShadow: saving || (!productHasPackage && !quantity)
                                                        ? 'none'
                                                        : `0 4px 12px ${colors.primary}33`,
                                                    transition: `background-color ${transition.fast}`,
                                                }, children: saving ? 'Guardando...' : 'Registrar Compra' })] }))] }, product.id));
                        })] }), _jsx("div", { style: { height: '1px', backgroundColor: colors.border } }), _jsx(PurchaseHistory, { items: history, loading: loadingHistory })] }) }));
}
const labelStyle = {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: colors.textMuted,
};
const inputStyle = {
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
const stepperBtn = {
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
