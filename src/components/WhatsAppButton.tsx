import { motion } from 'framer-motion';
import { luxuryEase } from '@/lib/animations';

// ── Configuration ──────────────────────────────────────────────
const WHATSAPP_NUMBER  = '+923000000000';   // Replace with actual number
const WHATSAPP_MESSAGE = 'Hello, I have a question about Carve.';
const SHOW_LABEL       = true;
// ───────────────────────────────────────────────────────────────

// WhatsApp SVG icon (official path, minimal)
function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.524 5.843L.053 23.447a.498.498 0 00.6.6l5.604-1.471A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.86 0-3.601-.51-5.09-1.395l-.365-.222-3.324.873.872-3.325-.222-.365A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  );
}

export function WhatsAppButton() {
  const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
  const href = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodedMessage}`;

  return (
    <motion.div
      className="fixed bottom-8 right-6 z-[500]"
      initial={{ opacity: 0, scale: 0.8, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.85, ease: luxuryEase, delay: 2.5 }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group flex items-center gap-3 bg-foreground text-background hover:bg-foreground/90 transition-colors duration-300 shadow-lg"
        style={{ boxShadow: '0 8px 32px rgba(26,26,26,0.18)' }}
      >
        <span className="flex items-center justify-center w-12 h-12 shrink-0">
          <WhatsAppIcon size={18} />
        </span>
        {SHOW_LABEL && (
          <span className="font-sans text-[9px] uppercase tracking-[0.22em] pr-5 hidden md:block">
            Chat with us
          </span>
        )}
      </a>
    </motion.div>
  );
}
