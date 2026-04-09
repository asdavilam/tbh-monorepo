import { useRef, useState, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import type { IScannerControls } from '@zxing/browser';
import { DecodeHintType } from '@zxing/library';
import { colors, radius } from '../../../shared/theme';

interface BarcodeScannerButtonProps {
  onScan: (barcode: string) => void;
}

export function BarcodeScannerButton({ onScan }: BarcodeScannerButtonProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;
  // Prevents the callback from firing more than once per scan session
  const firedRef = useRef(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');

  // Runs AFTER React mounts the <video> element
  useEffect(() => {
    if (!scanning) return;

    let cancelled = false;
    firedRef.current = false;

    async function init() {
      // Release any previous stream so facingMode constraint is respected on re-scan
      BrowserMultiFormatReader.releaseAllStreams();

      try {
        const hints = new Map();
        hints.set(DecodeHintType.TRY_HARDER, true);
        const reader = new BrowserMultiFormatReader(hints);

        if (cancelled) return;

        const controls = await reader.decodeFromConstraints(
          { video: { facingMode: 'environment' } },
          videoRef.current!,
          (result) => {
            if (result && !firedRef.current) {
              firedRef.current = true;
              controls?.stop();
              BrowserMultiFormatReader.releaseAllStreams();
              controlsRef.current = null;
              setScanning(false);
              onScanRef.current(result.getText());
            }
          }
        );

        if (cancelled) {
          controls.stop();
          BrowserMultiFormatReader.releaseAllStreams();
        } else {
          controlsRef.current = controls;
        }
      } catch {
        setScanning(false);
        setError('No se pudo acceder a la cámara');
      }
    }

    init();

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      BrowserMultiFormatReader.releaseAllStreams();
      controlsRef.current = null;
    };
  }, [scanning]);

  return (
    <div>
      {scanning ? (
        <div
          style={{
            position: 'relative',
            borderRadius: radius.md,
            overflow: 'hidden',
            backgroundColor: '#000',
            aspectRatio: '4/3',
          }}
        >
          <video
            ref={videoRef}
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {/* Framing guide */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                width: '70%',
                height: '30%',
                border: `2px solid ${colors.primary}`,
                borderRadius: '8px',
                boxShadow: '0 0 0 2000px rgba(0,0,0,0.4)',
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => setScanning(false)}
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '999px',
              padding: '10px 24px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setError('');
            setScanning(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0 16px',
            height: '52px',
            backgroundColor: colors.surfaceLow,
            border: `1px solid ${colors.border}`,
            borderRadius: radius.sm,
            color: colors.primary,
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <line x1="7" y1="12" x2="17" y2="12" />
          </svg>
          Escanear
        </button>
      )}

      {error && (
        <p style={{ margin: '6px 0 0', fontSize: '12px', color: colors.danger }}>{error}</p>
      )}
    </div>
  );
}
