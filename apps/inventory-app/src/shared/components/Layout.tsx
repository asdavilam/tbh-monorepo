import type { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { OfflineBanner } from './OfflineBanner';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const { user } = useAuth();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.bg,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Offline banner — fijo justo debajo del header */}
      <div
        style={{
          position: 'fixed',
          top: '56px',
          left: 0,
          right: 0,
          zIndex: 39,
        }}
      >
        <OfflineBanner />
      </div>

      {/* Header */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          backgroundColor: 'rgba(253, 252, 251, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 20px',
            height: '56px',
          }}
        >
          <span
            style={{
              fontWeight: 900,
              fontSize: '16px',
              color: colors.primary,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
          >
            {title ?? 'TRAILER BURGER HALL'}
          </span>
          {user && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: colors.primary,
                backgroundColor: colors.surfaceLow,
                padding: '4px 10px',
                borderRadius: '999px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {user.name.split(' ')[0]}
            </span>
          )}
        </div>
      </header>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          paddingTop: '72px',
          paddingBottom: '96px',
          maxWidth: '640px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
          padding: '72px 16px 96px',
        }}
      >
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
