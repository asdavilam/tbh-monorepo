import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { registerInventory } from '../../../shared/di';
import { colors, radius, fontSize, spacing, transition } from '../../../shared/theme';
const QUALITATIVE_OPTIONS = [
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
function humanizeError(err) {
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
function getDraftKey(productId) {
    const today = new Date().toISOString().slice(0, 10);
    return `tbh:draft:count:${productId}:${today}`;
}
function loadDraft(productId) {
    try {
        const raw = localStorage.getItem(getDraftKey(productId));
        return raw ? JSON.parse(raw) : null;
    }
    catch {
        return null;
    }
}
function saveDraft(productId, draft) {
    try {
        if (draft.finalCount || draft.qualitativeValue) {
            localStorage.setItem(getDraftKey(productId), JSON.stringify(draft));
        }
        else {
            localStorage.removeItem(getDraftKey(productId));
        }
    }
    catch {
        // localStorage no disponible, continuar sin persistencia
    }
}
function clearDraft(productId) {
    try {
        localStorage.removeItem(getDraftKey(productId));
    }
    catch {
        // ignore
    }
}
export function CountCard({ item, userId, index, onSaved, autoFocus = false }) {
    const draft = loadDraft(item.productId);
    const [finalCount, setFinalCount] = useState(draft?.finalCount ?? '');
    const [qualitativeValue, setQualitativeValue] = useState(draft?.qualitativeValue ?? null);
    const [savedRecord, setSavedRecord] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef(null);
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
    const liveDifference = !isQualitative && item.initialStock !== null && finalCount !== ''
        ? Number(finalCount) - item.initialStock
        : null;
    async function handleSave() {
        if (!canSave || saving)
            return;
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
        }
        catch (err) {
            setError(humanizeError(err));
        }
        finally {
            setSaving(false);
        }
    }
    function handleKeyDown(e) {
        if (e.key === 'Enter' && canSave) {
            e.preventDefault();
            handleSave();
        }
    }
    // Estado: guardado
    if (savedRecord) {
        return (_jsxs("div", { style: {
                backgroundColor: colors.surface,
                borderRadius: radius.md,
                padding: '20px',
                border: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: spacing.md,
            }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '14px' }, children: [_jsx("div", { style: {
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                backgroundColor: `${colors.success}18`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                color: colors.success,
                            }, children: _jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("polyline", { points: "20 6 9 17 4 12" }) }) }), _jsxs("div", { children: [_jsx("p", { style: {
                                        margin: 0,
                                        fontWeight: 700,
                                        fontSize: fontSize.md,
                                        color: colors.text,
                                        letterSpacing: '-0.01em',
                                    }, children: item.name }), _jsx("p", { style: { margin: '2px 0 0', fontSize: fontSize.sm, color: colors.textMuted }, children: item.unitLabel })] })] }), _jsxs("div", { style: { textAlign: 'right', flexShrink: 0 }, children: [_jsx("p", { style: {
                                margin: 0,
                                fontSize: '22px',
                                fontWeight: 900,
                                color: colors.success,
                                letterSpacing: '-0.02em',
                                lineHeight: 1,
                            }, children: isQualitative ? savedRecord.qualitativeValue : savedRecord.finalCount }), !isQualitative && (_jsxs("p", { style: {
                                margin: '2px 0 0',
                                fontSize: '11px',
                                color: colors.textMuted,
                                fontWeight: 500,
                            }, children: [item.unitLabel, savedRecord.difference !== null && (_jsxs("span", { style: {
                                        marginLeft: '6px',
                                        color: savedRecord.difference < 0 ? colors.danger : colors.success,
                                        fontWeight: 700,
                                    }, children: ["(", savedRecord.difference > 0 ? '+' : '', savedRecord.difference, ")"] }))] }))] })] }));
    }
    const isActive = autoFocus;
    return (_jsxs("div", { style: {
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
        }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }, children: [_jsx("div", { style: {
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
                        }, children: String(index + 1).padStart(2, '0') }), _jsx("div", { style: { minWidth: 0 }, children: _jsx("p", { style: {
                                margin: 0,
                                fontWeight: 700,
                                fontSize: fontSize.md,
                                color: colors.text,
                                letterSpacing: '-0.01em',
                                textTransform: 'uppercase',
                            }, children: item.name }) })] }), _jsx("div", { style: { flexShrink: 0 }, children: isQualitative ? (_jsx("div", { style: { display: 'flex', gap: '6px' }, children: QUALITATIVE_OPTIONS.map((opt) => (_jsx("button", { onClick: () => setQualitativeValue(opt.value), style: {
                            padding: '8px 12px',
                            minHeight: '44px',
                            border: `2px solid ${qualitativeValue === opt.value ? opt.color : colors.border}`,
                            borderRadius: radius.sm,
                            backgroundColor: qualitativeValue === opt.value ? `${opt.color}18` : 'transparent',
                            color: qualitativeValue === opt.value ? opt.color : colors.textMuted,
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: `all ${transition.fast}`,
                        }, children: opt.label }, opt.value))) })) : (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }, children: [item.unitType === 'fraction' && item.packageSize && (_jsx("div", { style: { display: 'flex', gap: '6px' }, children: FRACTION_OPTIONS.map((opt) => {
                                const val = String(opt.value * item.packageSize);
                                const active = finalCount === val;
                                return (_jsx("button", { type: "button", onClick: () => setFinalCount(val), style: {
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
                                    }, children: opt.label }, opt.label));
                            }) })), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '6px' }, children: [_jsx("input", { ref: inputRef, type: "number", min: "0", step: "any", value: finalCount, onChange: (e) => setFinalCount(e.target.value), onKeyDown: handleKeyDown, placeholder: "00", inputMode: "decimal", style: {
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
                                    } }), finalCount && liveDifference !== null && (_jsxs("span", { style: {
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        color: liveDifference < 0 ? colors.danger : colors.success,
                                    }, children: [liveDifference > 0 ? '+' : '', liveDifference] }))] }), item.unitType === 'fraction' && item.packageSize && finalCount && (_jsxs("span", { style: { fontSize: '11px', color: colors.textMuted, fontWeight: 600 }, children: ["= ", finalCount, " ", item.unitLabel] }))] })) }), error && (_jsx("div", { style: {
                    width: '100%',
                    backgroundColor: colors.dangerLight,
                    color: colors.danger,
                    padding: '10px 12px',
                    borderRadius: radius.sm,
                    fontSize: fontSize.sm,
                    fontWeight: 500,
                }, children: error })), (canSave || isQualitative) && (_jsx("button", { onClick: handleSave, disabled: !canSave || saving, style: {
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
                }, children: saving ? 'Guardando...' : 'Guardar conteo' }))] }));
}
