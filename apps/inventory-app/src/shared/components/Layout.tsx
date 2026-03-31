import type { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
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
      {/* Header */}
      <header
        style={{
          backgroundColor: colors.surface,
          borderBottom: `1px solid ${colors.border}`,
          padding: '0 16px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '18px', color: colors.text }}>
          {title ?? 'TBH Inventario'}
        </span>
        {user && <span style={{ fontSize: '13px', color: colors.textMuted }}>{user.name}</span>}
      </header>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: '16px',
          paddingBottom: '80px', // espacio para BottomNav
          maxWidth: '640px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
