import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Link } from 'wouter';

// ── Configuration ──────────────────────────────────────────────
export const ANNOUNCEMENT_TEXT  = "The Silk Edit has arrived — explore the new collection.";
export const ANNOUNCEMENT_LINK  = "/collections";
export const ANNOUNCEMENT_SHOW  = true;  // Set false to hide globally
// ───────────────────────────────────────────────────────────────

const SESSION_KEY = 'carve_announcement_dismissed';

interface AnnouncementBarProps {
  onHeightChange?: (height: number) => void;
}

export function AnnouncementBar({ onHeightChange }: AnnouncementBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ANNOUNCEMENT_SHOW) return;
    const dismissed = sessionStorage.getItem(SESSION_KEY);
    if (!dismissed) {
      setVisible(true);
      onHeightChange?.(40);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(SESSION_KEY, '1');
    setVisible(false);
    onHeightChange?.(0);
  };

  if (!visible || !ANNOUNCEMENT_SHOW) return null;

  return (
    <div className="w-full bg-foreground text-background relative flex items-center justify-center h-10 shrink-0">
      <Link
        href={ANNOUNCEMENT_LINK}
        className="font-sans text-[9px] uppercase tracking-[0.28em] hover:opacity-70 transition-opacity px-10 text-center block py-0 leading-none"
      >
        {ANNOUNCEMENT_TEXT}
      </Link>
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity p-1"
      >
        <X size={11} strokeWidth={1.5} />
      </button>
    </div>
  );
}
