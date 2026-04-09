import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Component } from 'react';
import { colors, fontSize, radius } from '../theme';
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error('[TBH] Error no capturado:', error, info);
  }
  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return _jsx('div', {
      style: {
        minHeight: '100vh',
        backgroundColor: colors.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      },
      children: _jsxs('div', {
        style: {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          padding: '32px 24px',
          maxWidth: '480px',
          width: '100%',
          border: `1px solid ${colors.border}`,
        },
        children: [
          _jsx('p', { style: { fontSize: '32px', margin: '0 0 12px' }, children: '\u26A0\uFE0F' }),
          _jsx('h2', {
            style: {
              fontSize: fontSize.xl,
              fontWeight: 700,
              color: colors.text,
              margin: '0 0 8px',
            },
            children: 'Error en la aplicaci\u00F3n',
          }),
          _jsx('p', {
            style: { fontSize: fontSize.base, color: colors.textMuted, margin: '0 0 16px' },
            children: error.message,
          }),
          _jsx('pre', {
            style: {
              backgroundColor: colors.bg,
              borderRadius: radius.sm,
              padding: '12px',
              fontSize: '12px',
              color: colors.danger,
              overflow: 'auto',
              margin: 0,
            },
            children: error.stack,
          }),
        ],
      }),
    });
  }
}
