import { Heart, ShoppingBag, Search, Package, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { FadeUp } from '@/components/motion/Motion';

type EmptyVariant = 'wishlist' | 'cart' | 'search' | 'orders';

interface EmptyStateConfig {
  icon: React.ReactNode;
  headline: string;
  subtext: string;
  cta: string;
  href: string;
}

const CONFIGS: Record<EmptyVariant, EmptyStateConfig> = {
  wishlist: {
    icon: <Heart size={52} strokeWidth={0.7} color="#E8E4DE" />,
    headline: 'Nothing saved — yet.',
    subtext: 'The pieces that speak to you belong here. Explore the collection and save what calls to you.',
    cta: 'Explore the Collection',
    href: '/products',
  },
  cart: {
    icon: <ShoppingBag size={52} strokeWidth={0.7} color="#E8E4DE" />,
    headline: 'Your Bag Awaits.',
    subtext: 'Nothing has been chosen — yet. The collection is yours to explore.',
    cta: 'The Collection',
    href: '/products',
  },
  search: {
    icon: <Search size={52} strokeWidth={0.7} color="#E8E4DE" />,
    headline: 'Nothing emerged.',
    subtext: 'Your search returned no pieces. Try a different word, or begin with a wider eye.',
    cta: 'Discover All',
    href: '/products',
  },
  orders: {
    icon: <Package size={52} strokeWidth={0.7} color="#E8E4DE" />,
    headline: 'Your history begins here.',
    subtext: 'Your first order will be remembered here — each piece, each story, each season.',
    cta: 'Begin Your Edit',
    href: '/products',
  },
};

interface EmptyStateProps {
  variant: EmptyVariant;
  query?: string;          // for 'search' variant
  className?: string;
  onCtaClick?: () => void; // for cases where CTA should be a button (e.g. search overlay)
}

export function EmptyState({ variant, className = '', onCtaClick }: EmptyStateProps) {
  const cfg = CONFIGS[variant];

  return (
    <FadeUp className={`flex flex-col items-center justify-center text-center py-20 ${className}`}>
      <div className="mb-6">{cfg.icon}</div>
      <div className="w-12 h-px bg-border mb-8" />
      <h2 className="font-serif italic text-[32px] md:text-[36px] mb-4 text-foreground">
        {cfg.headline}
      </h2>
      <p className="font-sans font-light text-[13px] text-muted-foreground leading-relaxed max-w-xs mb-10">
        {cfg.subtext}
      </p>
      {onCtaClick ? (
        <button
          onClick={onCtaClick}
          className="inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.25em] border-b border-foreground pb-px hover:opacity-60 transition-opacity"
        >
          {cfg.cta}
          <ArrowRight size={12} strokeWidth={1} />
        </button>
      ) : (
        <Link
          href={cfg.href}
          className="inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.25em] border-b border-foreground pb-px hover:opacity-60 transition-opacity"
        >
          {cfg.cta}
          <ArrowRight size={12} strokeWidth={1} />
        </Link>
      )}
    </FadeUp>
  );
}
