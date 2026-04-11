import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { supabaseConfigured } from './shared/supabase';
import { colors, fontSize, radius } from './shared/theme';
import './index.css';

function ConfigError() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          padding: '32px 24px',
          maxWidth: '480px',
          width: '100%',
          border: `1px solid ${colors.border}`,
        }}
      >
        <p style={{ fontSize: '32px', margin: '0 0 12px' }}>🔧</p>
        <h2
          style={{ fontSize: fontSize.xl, fontWeight: 700, color: colors.text, margin: '0 0 8px' }}
        >
          Configura las variables de entorno
        </h2>
        <p style={{ fontSize: fontSize.base, color: colors.textMuted, margin: '0 0 16px' }}>
          La aplicación necesita credenciales de Supabase para funcionar.
        </p>
        <pre
          style={{
            backgroundColor: colors.bg,
            borderRadius: radius.sm,
            padding: '16px',
            fontSize: '13px',
            color: colors.text,
            overflow: 'auto',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {`# apps/inventory-app/.env\nVITE_SUPABASE_URL=https://xxxx.supabase.co\nVITE_SUPABASE_ANON_KEY=eyJhbGci...`}
        </pre>
        <p
          style={{
            fontSize: fontSize.sm,
            color: colors.textMuted,
            marginTop: '16px',
            marginBottom: 0,
          }}
        >
          Encuentra estas claves en tu proyecto de Supabase → Settings → API.
        </p>
      </div>
    </div>
  );
}

// Reload the page when a new service worker takes control (handles iOS PWA updates)
if ('serviceWorker' in navigator) {
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      {supabaseConfigured ? (
        <BrowserRouter>
          <App />
        </BrowserRouter>
      ) : (
        <ConfigError />
      )}
    </ErrorBoundary>
  </React.StrictMode>
);
