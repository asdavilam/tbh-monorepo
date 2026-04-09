import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { colors, radius } from '../../../shared/theme';
export function LoginPage() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signIn(email, password);
            navigate('/inventario');
        }
        catch {
            setError('Correo o contraseña incorrectos');
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsx("div", { style: {
            minHeight: '100vh',
            backgroundColor: colors.bg,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 20px',
        }, children: _jsxs("div", { style: {
                width: '100%',
                maxWidth: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }, children: [_jsxs("div", { style: { textAlign: 'center', marginBottom: '40px' }, children: [_jsx("div", { style: {
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '140px',
                                height: '140px',
                                backgroundColor: colors.primary,
                                borderRadius: radius.lg,
                                marginBottom: '16px',
                                boxShadow: `0 8px 24px ${colors.primary}33`,
                                overflow: 'hidden',
                            }, children: _jsx("img", { src: "/isologo.png", alt: "Trailer Burger Hall", style: { width: '72px', height: '72px', objectFit: 'contain' } }) }), _jsx("h1", { style: {
                                fontSize: '22px',
                                fontWeight: 900,
                                color: colors.primary,
                                letterSpacing: '-0.02em',
                                textTransform: 'uppercase',
                                marginBottom: '4px',
                            }, children: "Trailer Burger Hall" }), _jsx("p", { style: { fontSize: '13px', color: colors.textMuted, fontWeight: 500 }, children: "Sistema de Inventario" })] }), _jsxs("div", { style: {
                        width: '100%',
                        backgroundColor: colors.surface,
                        borderRadius: radius.lg,
                        padding: '32px 28px',
                        boxShadow: '0 4px 24px rgba(80, 60, 40, 0.08)',
                        border: `1px solid ${colors.border}`,
                    }, children: [error && (_jsxs("div", { style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: colors.dangerLight,
                                color: colors.danger,
                                padding: '12px 14px',
                                borderRadius: radius.md,
                                fontSize: '13px',
                                fontWeight: 500,
                                marginBottom: '20px',
                            }, children: [_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }), _jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })] }), error] })), _jsxs("form", { onSubmit: handleSubmit, style: { display: 'flex', flexDirection: 'column', gap: '20px' }, children: [_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "email", style: {
                                                fontSize: '10px',
                                                fontWeight: 700,
                                                color: colors.textMuted,
                                                letterSpacing: '0.1em',
                                                textTransform: 'uppercase',
                                            }, children: "Correo Electr\u00F3nico" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, autoFocus: true, autoComplete: "email", placeholder: "manager@trailerburger.com", style: {
                                                width: '100%',
                                                height: '52px',
                                                padding: '0 16px',
                                                backgroundColor: colors.surfaceLow,
                                                border: '2px solid transparent',
                                                borderRadius: radius.md,
                                                fontSize: '16px',
                                                color: colors.text,
                                                fontWeight: 500,
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                            } })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "password", style: {
                                                fontSize: '10px',
                                                fontWeight: 700,
                                                color: colors.textMuted,
                                                letterSpacing: '0.1em',
                                                textTransform: 'uppercase',
                                            }, children: "Contrase\u00F1a" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, autoComplete: "current-password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", style: {
                                                width: '100%',
                                                height: '52px',
                                                padding: '0 16px',
                                                backgroundColor: colors.surfaceLow,
                                                border: '2px solid transparent',
                                                borderRadius: radius.md,
                                                fontSize: '16px',
                                                color: colors.text,
                                                fontWeight: 500,
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                            } })] }), _jsxs("button", { type: "submit", disabled: loading, style: {
                                        width: '100%',
                                        height: '52px',
                                        backgroundColor: loading ? colors.textLight : colors.primary,
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: radius.md,
                                        fontSize: '15px',
                                        fontWeight: 700,
                                        letterSpacing: '0.06em',
                                        textTransform: 'uppercase',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        boxShadow: loading ? 'none' : `0 4px 16px ${colors.primary}33`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                    }, children: [loading ? 'Entrando...' : 'Entrar al Sistema', !loading && (_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [_jsx("line", { x1: "5", y1: "12", x2: "19", y2: "12" }), _jsx("polyline", { points: "12 5 19 12 12 19" })] }))] })] })] }), _jsx("p", { style: {
                        marginTop: '32px',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        color: colors.textLight,
                        textTransform: 'uppercase',
                    }, children: "Inventory System v1.0" })] }) }));
}
