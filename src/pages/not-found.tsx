import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { luxuryEase } from "@/lib/animations";

export default function NotFound() {
  return (
    <Layout>
      <div className="w-full flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center">

        {/* Large 404 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: luxuryEase }}
          className="relative select-none"
        >
          <span
            className="font-serif font-light leading-none text-foreground/[0.06] block"
            style={{ fontSize: 'clamp(120px, 22vw, 220px)' }}
            aria-hidden="true"
          >
            404
          </span>
          {/* Centered content over the number */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.0, ease: luxuryEase, delay: 0.4 }}
              className="w-10 h-px bg-[#C9A96E] mb-6"
              style={{ transformOrigin: 'left' }}
            />
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: luxuryEase, delay: 0.6 }}
              className="font-sans text-[9px] uppercase tracking-[0.35em] text-muted-foreground mb-4 block"
            >
              Page Not Found
            </motion.span>
          </div>
        </motion.div>

        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: luxuryEase, delay: 0.7 }}
          className="max-w-sm"
        >
          <h1 className="font-serif italic text-[28px] md:text-[36px] mb-4 leading-tight">
            The page you sought<br />has moved on.
          </h1>
          <p className="font-sans font-light text-[13px] text-muted-foreground leading-relaxed mb-12">
            It may have been archived, renamed, or simply let go — as all things in fashion eventually are.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-foreground text-background font-sans text-[10px] uppercase tracking-[0.25em] px-10 py-4 hover:bg-foreground/90 transition-colors luxury-button"
            >
              Return Home
            </Link>
            <Link
              href="/products"
              className="border border-border text-foreground font-sans text-[10px] uppercase tracking-[0.25em] px-10 py-4 hover:bg-secondary transition-colors"
            >
              The Collection
            </Link>
          </div>
        </motion.div>

        {/* Bottom rule */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, ease: luxuryEase, delay: 1.0 }}
          className="mt-16 flex flex-col items-center gap-3"
        >
          <div className="w-px h-10 bg-border" />
          <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
            Carve — Luxury Refined
          </span>
        </motion.div>

      </div>
    </Layout>
  );
}
