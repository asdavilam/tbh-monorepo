import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BottomNav } from './BottomNav';
import { OfflineBanner } from './OfflineBanner';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme';
export function Layout({ children, title }) {
    const { user } = useAuth();
    return (_jsxs("div", { style: {
            minHeight: '100vh',
            backgroundColor: colors.bg,
            display: 'flex',
            flexDirection: 'column',
        }, children: [_jsx("div", { style: {
                    position: 'fixed',
                    top: '56px',
                    left: 0,
                    right: 0,
                    zIndex: 39,
                }, children: _jsx(OfflineBanner, {}) }), _jsx("header", { style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 40,
                    backgroundColor: 'rgba(253, 252, 251, 0.85)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderBottom: `1px solid ${colors.border}`,
                }, children: _jsxs("div", { style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0 20px',
                        height: '56px',
                    }, children: [_jsx("span", { style: {
                                fontWeight: 900,
                                fontSize: '16px',
                                color: colors.primary,
                                letterSpacing: '-0.02em',
                                textTransform: 'uppercase',
                            }, children: title ?? 'TRAILER BURGER HALL' }), user && (_jsx("span", { style: {
                                fontSize: '11px',
                                fontWeight: 700,
                                color: colors.primary,
                                backgroundColor: colors.surfaceLow,
                                padding: '4px 10px',
                                borderRadius: '999px',
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase',
                            }, children: user.name.split(' ')[0] }))] }) }), _jsx("main", { style: {
                    flex: 1,
                    paddingTop: '72px',
                    paddingBottom: '96px',
                    maxWidth: '640px',
                    width: '100%',
                    margin: '0 auto',
                    boxSizing: 'border-box',
                    padding: '72px 16px 96px',
                }, children: children }), _jsx(BottomNav, {})] }));
}
