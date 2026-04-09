import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { colors, fontSize } from '../theme';
export function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;
  return _jsxs('div', {
    role: 'alert',
    style: {
      backgroundColor: colors.warning,
      color: '#fff',
      textAlign: 'center',
      padding: '8px 16px',
      fontSize: fontSize.sm,
      fontWeight: 700,
      letterSpacing: '0.03em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      flexShrink: 0,
    },
    children: [
      _jsxs('svg', {
        width: '14',
        height: '14',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
        children: [
          _jsx('line', { x1: '1', y1: '1', x2: '23', y2: '23' }),
          _jsx('path', { d: 'M16.72 11.06A10.94 10.94 0 0 1 19 12.55' }),
          _jsx('path', { d: 'M5 12.55a10.94 10.94 0 0 1 5.17-2.39' }),
          _jsx('path', { d: 'M10.71 5.05A16 16 0 0 1 22.56 9' }),
          _jsx('path', { d: 'M1.42 9a15.91 15.91 0 0 1 4.7-2.88' }),
          _jsx('path', { d: 'M8.53 16.11a6 6 0 0 1 6.95 0' }),
          _jsx('line', { x1: '12', y1: '20', x2: '12.01', y2: '20' }),
        ],
      }),
      'Sin conexi\u00F3n \u2014 tus datos no se perder\u00E1n al volver internet',
    ],
  });
}
