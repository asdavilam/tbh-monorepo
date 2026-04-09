import { Component, type ReactNode, type ErrorInfo } from 'react';
import { colors, fontSize, radius } from '../theme';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[TBH] Error no capturado:', error, info);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

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
          <p style={{ fontSize: '32px', margin: '0 0 12px' }}>⚠️</p>
          <h2
            style={{
              fontSize: fontSize.xl,
              fontWeight: 700,
              color: colors.text,
              margin: '0 0 8px',
            }}
          >
            Error en la aplicación
          </h2>
          <p style={{ fontSize: fontSize.base, color: colors.textMuted, margin: '0 0 16px' }}>
            {error.message}
          </p>
          <pre
            style={{
              backgroundColor: colors.bg,
              borderRadius: radius.sm,
              padding: '12px',
              fontSize: '12px',
              color: colors.danger,
              overflow: 'auto',
              margin: 0,
            }}
          >
            {error.stack}
          </pre>
        </div>
      </div>
    );
  }
}
