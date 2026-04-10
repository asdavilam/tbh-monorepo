import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const firedRef = useRef(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!scanning) return;

    let cancelled = false;
    firedRef.current = false;

    async function init() {
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
    <>
      {/* Botón de escanear — siempre en su lugar */}
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

      {error && (
        <p style={{ margin: '6px 0 0', fontSize: '12px', color: colors.danger }}>{error}</p>
      )}

      {/* Overlay de cámara — pantalla completa via portal */}
      {scanning &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              backgroundColor: '#000',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Video */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <video
                ref={videoRef}
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />

              {/* Marco de encuadre */}
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
                    width: '72%',
                    height: '28%',
                    border: `2px solid ${colors.primary}`,
                    borderRadius: '12px',
                    boxShadow: '0 0 0 2000px rgba(0,0,0,0.5)',
                  }}
                />
              </div>

              {/* Etiqueta */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, calc(-50% + 60px))',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.03em',
                  textAlign: 'center',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Apunta al código de barras
              </div>
            </div>

            {/* Botón cancelar */}
            <div
              style={{
                padding: '24px 24px 40px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <button
                type="button"
                onClick={() => setScanning(false)}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '999px',
                  padding: '14px 48px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  minHeight: '52px',
                  letterSpacing: '0.02em',
                }}
              >
                Cancelar
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
