import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { colors, fontSize, radius, spacing } from '../../../shared/theme';
export function ManualItemForm({ allProducts, existingProductIds, onAdd }) {
    const [open, setOpen] = useState(false);
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    const available = allProducts.filter((p) => p.unitType !== 'qualitative' && !existingProductIds.includes(p.id));
    const selected = available.find((p) => p.id === productId);
    function handleSubmit(e) {
        e.preventDefault();
        if (!selected || !quantity)
            return;
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
        return (_jsx("button", { onClick: () => setOpen(true), style: {
                width: '100%',
                padding: '12px',
                backgroundColor: 'transparent',
                color: colors.primary,
                border: `1px dashed ${colors.primary}`,
                borderRadius: radius.sm,
                fontSize: fontSize.base,
                cursor: 'pointer',
                minHeight: '44px',
            }, children: "+ Agregar producto manualmente" }));
    }
    return (_jsxs("form", { onSubmit: handleSubmit, style: {
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            padding: spacing.md,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.sm,
        }, children: [_jsx("p", { style: { margin: 0, fontWeight: 600, fontSize: fontSize.base, color: colors.text }, children: "Agregar producto" }), _jsxs("select", { value: productId, onChange: (e) => setProductId(e.target.value), required: true, style: {
                    padding: '12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: radius.sm,
                    fontSize: '16px',
                    backgroundColor: colors.surface,
                    minHeight: '44px',
                    appearance: 'auto',
                }, children: [_jsx("option", { value: "", children: "Seleccionar producto..." }), available.map((p) => (_jsxs("option", { value: p.id, children: [p.name, " (", p.unitLabel, ")"] }, p.id)))] }), _jsx("input", { type: "number", min: "0.01", step: "any", value: quantity, onChange: (e) => setQuantity(e.target.value), required: true, placeholder: selected ? `Cantidad (${selected.unitLabel})` : 'Cantidad', style: {
                    padding: '12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: radius.sm,
                    fontSize: '16px',
                    minHeight: '44px',
                    boxSizing: 'border-box',
                } }), _jsxs("div", { style: { display: 'flex', gap: spacing.sm }, children: [_jsx("button", { type: "submit", style: {
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
                        }, children: "Agregar" }), _jsx("button", { type: "button", onClick: () => {
                            setOpen(false);
                            setProductId('');
                            setQuantity('');
                        }, style: {
                            padding: '12px 16px',
                            backgroundColor: 'transparent',
                            color: colors.textMuted,
                            border: `1px solid ${colors.border}`,
                            borderRadius: radius.sm,
                            fontSize: fontSize.base,
                            cursor: 'pointer',
                            minHeight: '44px',
                        }, children: "Cancelar" })] })] }));
}
