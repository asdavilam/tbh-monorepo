import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { supabaseConfigured } from './shared/supabase';
import { colors, fontSize, radius } from './shared/theme';
import './index.css';

function ConfigError() {
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
        _jsx('p', { style: { fontSize: '32px', margin: '0 0 12px' }, children: '\uD83D\uDD27' }),
        _jsx('h2', {
          style: { fontSize: fontSize.xl, fontWeight: 700, color: colors.text, margin: '0 0 8px' },
          children: 'Configura las variables de entorno',
        }),
        _jsx('p', {
          style: { fontSize: fontSize.base, color: colors.textMuted, margin: '0 0 16px' },
          children: 'La aplicaci\u00F3n necesita credenciales de Supabase para funcionar.',
        }),
        _jsx('pre', {
          style: {
            backgroundColor: colors.bg,
            borderRadius: radius.sm,
            padding: '16px',
            fontSize: '13px',
            color: colors.text,
            overflow: 'auto',
            margin: 0,
            lineHeight: 1.6,
          },
          children: `# apps/inventory-app/.env\nVITE_SUPABASE_URL=https://xxxx.supabase.co\nVITE_SUPABASE_ANON_KEY=eyJhbGci...`,
        }),
        _jsx('p', {
          style: {
            fontSize: fontSize.sm,
            color: colors.textMuted,
            marginTop: '16px',
            marginBottom: 0,
          },
          children: 'Encuentra estas claves en tu proyecto de Supabase \u2192 Settings \u2192 API.',
        }),
      ],
    }),
  });
}
ReactDOM.createRoot(document.getElementById('root')).render(
  _jsx(React.StrictMode, {
    children: _jsx(ErrorBoundary, {
      children: supabaseConfigured
        ? _jsx(BrowserRouter, { children: _jsx(App, {}) })
        : _jsx(ConfigError, {}),
    }),
  })
);
