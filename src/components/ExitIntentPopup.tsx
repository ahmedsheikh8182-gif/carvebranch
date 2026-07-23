import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { luxuryEase } from '@/lib/animations';

// ── Configuration ──────────────────────────────────────────────
const ENABLE_EXIT_INTENT = true;
const MOBILE_DELAY_MS    = 30_000;  // 30 seconds on mobile
const SESSION_KEY        = 'carve_exit_dismissed';
// ───────────────────────────────────────────────────────────────

export function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const shouldShow = useCallback(() => {
    if (!ENABLE_EXIT_INTENT) return false;
    if (sessionStorage.getItem(SESSION_KEY)) return false;
    return true;
  }, []);

  const show = useCallback(() => {
    if (shouldShow()) setVisible(true);
  }, [shouldShow]);

  const dismiss = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, '1');
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!ENABLE_EXIT_INTENT) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    // Desktop: detect cursor moving toward top of viewport
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 20) show();
    };

    // Mobile: time-based trigger
    const mobileTimer = setTimeout(() => {
      if (window.innerWidth < 768) show();
    }, MOBILE_DELAY_MS);

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(mobileTimer);
    };
  }, [show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    try {
      const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
      await fetch(`${base}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Silently succeed — UX matters more than the network call here
    } finally {
      setLoading(false);
      setSubmitted(true);
      sessionStorage.setItem(SESSION_KEY, '1');
      setTimeout(dismiss, 3200);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[9000] bg-foreground/40"
            style={{ backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: luxuryEase }}
            onClick={dismiss}
            aria-hidden
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-intent-heading"
            className="fixed z-[9001] inset-0 flex items-center justify-center p-6 pointer-events-none"
          >
            <motion.div
              className="bg-background border border-border max-w-md w-full p-10 md:p-14 relative pointer-events-auto"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.75, ease: luxuryEase }}
            >
              {/* Close */}
              <button
                onClick={dismiss}
                aria-label="Close"
                className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} strokeWidth={1} />
              </button>

              {/* Gold rule */}
              <div className="w-8 h-px bg-[#C9A96E] mb-8" />

              {!submitted ? (
                <>
                  <h2
                    id="exit-intent-heading"
                    className="font-serif italic text-[30px] md:text-[36px] leading-tight mb-4"
                  >
                    Before you go.
                  </h2>
                  <p className="font-sans font-light text-[13px] text-muted-foreground leading-relaxed mb-8">
                    Join the Inner Circle for first-order privilege — complimentary gift wrapping, early access to new arrivals, and editorial despatches from the atelier.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full border-b border-border bg-transparent py-3 font-sans text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/50"
                      style={{ caretColor: '#C9A96E' }}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-foreground text-background font-sans text-[10px] uppercase tracking-[0.25em] h-12 hover:bg-foreground/90 transition-colors disabled:opacity-50 luxury-button"
                    >
                      {loading ? 'Joining…' : 'Join the Inner Circle'}
                    </button>
                  </form>

                  <button
                    onClick={dismiss}
                    className="mt-6 block w-full text-center font-sans text-[10px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.15em]"
                  >
                    Continue browsing
                  </button>
                </>
              ) : (
                <div className="text-center py-4">
                  <h2 className="font-serif italic text-[28px] mb-4">You're part of the Inner Circle.</h2>
                  <p className="font-sans font-light text-[13px] text-muted-foreground">
                    Expect your first despatch from the atelier soon.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
