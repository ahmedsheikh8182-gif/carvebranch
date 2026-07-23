import { useState, useEffect } from 'react';

// Shows only on the initial hard page load.
// Component never remounts during SPA navigation, so no extra logic needed.

export function LoadingScreen() {
  const [phase, setPhase] = useState<'visible' | 'hiding' | 'gone'>('visible');

  useEffect(() => {
    const hideTimer  = setTimeout(() => setPhase('hiding'), 1600);
    const removeTimer = setTimeout(() => setPhase('gone'),  2400);
    return () => { clearTimeout(hideTimer); clearTimeout(removeTimer); };
  }, []);

  if (phase === 'gone') return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#1A1A1A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '0',
        opacity: phase === 'hiding' ? 0 : 1,
        transition: 'opacity 800ms cubic-bezier(0.22, 1, 0.36, 1)',
        pointerEvents: phase === 'hiding' ? 'none' : 'auto',
      }}
    >
      <div className="carve-loading-content">
        <span className="carve-loading-wordmark">CARVE</span>
        <div className="carve-loading-line" />
        <span className="carve-loading-sub">LUXURY REFINED</span>
      </div>
    </div>
  );
}
