import React, { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { SEOMeta } from "@/components/SEOMeta";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import {
  useGetNewArrivals,
  useGetBestSellers,
  useListCollections,
  useSubscribeNewsletter,
} from "@workspace/api-client-react";
import { useRecommendations } from "@/hooks/useRecommendations";
import {
  MoveRight,
  Instagram,
  Truck,
  RotateCcw,
  Shield,
  Award,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeUp as FadeIn, Stagger, StaggerItem, AnimatedText } from "@/components/motion/Motion";

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "28%"]);

  // Personalised recommendations — only shown when browsing history exists
  const { products: pickedForYou, hasHistory } = useRecommendations(undefined, 4);

  const { data: newArrivalsData } = useGetNewArrivals();
  const newArrivals = Array.isArray(newArrivalsData)
    ? newArrivalsData
    : (newArrivalsData as any)?.data || [];

  const { data: bestSellersData } = useGetBestSellers();
  const bestSellers = Array.isArray(bestSellersData)
    ? bestSellersData
    : (bestSellersData as any)?.data || [];

  const { data: collectionsRes } = useListCollections({ query: { enabled: true } });
  const collections = collectionsRes?.data || collectionsRes || [];

  const subscribe = useSubscribeNewsletter();
  const [subscribed, setSubscribed] = useState(false);

  return (
    <Layout transparentNav={true}>
      <SEOMeta
        title="Carve — Luxury Pakistani Women's Fashion"
        description="Discover Carve — Pakistan's foremost luxury women's fashion house. Curated garments in heritage cloth, artisan tailoring, and considered design."
        url="/"
      />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Carve",
        url: "https://carve.pk",
        logo: "https://carve.pk/logo.png",
        description: "Pakistan's foremost luxury women's fashion house — heritage cloth, artisan tailoring, considered design.",
        sameAs: [
          "https://instagram.com/carve.pk",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+92-300-0000000",
          contactType: "customer service",
          availableLanguage: ["English", "Urdu"],
        },
      }} />
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes scrollDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* 1. HERO */}
      <section ref={heroRef} className="relative w-full h-[100dvh] bg-[#0D0D0D] overflow-hidden flex flex-col items-center justify-center text-center px-4">
        {/* Parallax background layers */}
        <motion.div className="absolute inset-0 scale-[1.15]" style={{ y: heroY }}>
          <div className="absolute inset-0 bg-[#0D0D0D]" />
          {/* Breathing gold orb */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(201,169,110,0.10)_0%,transparent_60%)] animate-[breathe_10s_ease-in-out_infinite_alternate]" />
          {/* Film-grain noise */}
          <div 
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </motion.div>

        <div className="relative z-10 flex flex-col items-center w-full max-w-5xl">
          {/* Eyebrow — slides up from behind overflow clip */}
          <AnimatedText delay={120} className="font-sans text-[10px] uppercase tracking-[0.45em] text-white/50 mb-12">
            The Fall / Winter Collection
          </AnimatedText>

          {/* Headline — each line revealed independently */}
          <h1 className="font-serif italic font-normal text-white leading-[1.0] flex flex-col items-center w-full text-center">
            <AnimatedText delay={260} className="block text-[clamp(64px,9vw,120px)]">The Art Of</AnimatedText>
            <AnimatedText delay={400} className="block text-[clamp(64px,9vw,120px)]">Quiet Luxury,</AnimatedText>
            <AnimatedText delay={540} className="block md:translate-x-[60px] translate-x-[30px] text-[clamp(64px,9vw,120px)]">Refined.</AnimatedText>
          </h1>

          {/* Gold rule draws in */}
          <motion.div
            className="w-[80px] h-px bg-[#C9A96E] my-10 mx-auto"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.78 }}
            style={{ transformOrigin: "left" }}
          />

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.92 }}
          >
            <Link
              href="/products"
              className="inline-block font-sans text-[10px] uppercase tracking-[0.3em] text-white border border-white/20 px-12 py-5 hover:bg-white hover:text-black hover:border-white transition-all duration-700 ease-out"
            >
              Explore The Collection
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 cursor-pointer group" 
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="font-sans text-[8px] uppercase tracking-[0.4em] text-white/40 group-hover:text-white transition-colors duration-500">
            Scroll
          </span>
          <div className="w-[1px] h-16 bg-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[50%] bg-white animate-[scrollPulse_2.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* 2. EDITORIAL QUOTE */}
      <section className="w-full bg-secondary py-[120px] px-6 md:px-12 flex justify-center text-center">
        <div className="max-w-[900px] w-full flex flex-col items-center">
          <FadeIn>
            <div className="w-[60px] h-[1px] bg-primary mx-auto mb-12" />
          </FadeIn>
          <FadeIn delay={100}>
            <p className="font-serif italic text-[40px] md:text-[56px] leading-[1.3] text-foreground">
              "Luxury is not worn. It is inhabited — felt in the weight of the cloth, known in the precision of the cut."
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="w-[60px] h-[1px] bg-primary mx-auto mt-12 mb-8" />
          </FadeIn>
          <FadeIn delay={300}>
            <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              The Atelier
            </span>
          </FadeIn>
        </div>
      </section>

      {/* 3. NEW ARRIVALS */}
      <section className="w-full max-w-[1400px] mx-auto py-32 px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <FadeIn>
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-primary mb-4 block">
                Arrived · This Season
              </span>
            </FadeIn>
            <FadeIn delay={100}>
              <h2 className="font-serif text-[48px] md:text-[60px] text-foreground leading-none">
                New Arrivals
              </h2>
            </FadeIn>
          </div>
          <FadeIn delay={200}>
            <Link
              href="/products?filter=new-arrivals"
              className="group flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.2em] text-foreground pb-1 relative"
            >
              <span>The Full Edit</span>
              <MoveRight size={14} strokeWidth={1} className="transition-transform group-hover:translate-x-1" />
              <div className="absolute bottom-0 left-0 w-0 h-px bg-foreground transition-all duration-500 group-hover:w-full" />
            </Link>
          </FadeIn>
        </div>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8" staggerDelay={0.08}>
          {newArrivals.slice(0, 4).map((product: any) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* 4. CAMPAIGN BANNER */}
      <section className="w-full h-[85vh] relative flex items-center px-6 md:px-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1610] to-[#0A0A0A]" />
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />
        
        <div className="relative z-10 max-w-2xl pl-0 md:pl-10">
          <FadeIn>
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-primary mb-6 block">
              The Atelier
            </span>
          </FadeIn>
          <FadeIn delay={100}>
            <h2 className="font-serif italic text-[56px] md:text-[72px] text-white leading-[1.1] mb-8">
              Stillness in <br/> every seam.
            </h2>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="font-sans font-light text-[14px] text-white/60 max-w-[40ch] leading-[1.8] mb-12">
              Each piece passes through the hands of artisans who have spent a lifetime perfecting their silence — the art of letting cloth speak for itself.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <Link
              href="/about"
              className="inline-block font-sans text-[10px] uppercase tracking-[0.3em] text-white border border-white/20 px-12 py-5 hover:bg-white hover:text-black hover:border-white transition-all duration-700 ease-out"
            >
              Enter The Atelier
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 5. BEST SELLERS */}
      <section className="w-full bg-background py-32 px-6 md:px-12 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <FadeIn>
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-primary mb-4 block">
                  Signature
                </span>
              </FadeIn>
              <FadeIn delay={100}>
                <h2 className="font-serif text-[48px] md:text-[60px] text-foreground leading-none">
                  The Icons
                </h2>
              </FadeIn>
            </div>
            <FadeIn delay={200}>
              <Link
                href="/products?filter=best-sellers"
                className="group flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.2em] text-foreground pb-1 relative"
              >
                <span>The Full Edit</span>
                <MoveRight size={14} strokeWidth={1} className="transition-transform group-hover:translate-x-1" />
                <div className="absolute bottom-0 left-0 w-0 h-px bg-foreground transition-all duration-500 group-hover:w-full" />
              </Link>
            </FadeIn>
          </div>

          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8" staggerDelay={0.08}>
            {bestSellers.slice(0, 4).map((product: any) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 5b. PICKED FOR YOU — personalised, only shown when browsing history exists */}
      {hasHistory && pickedForYou.length > 0 && (
        <section className="w-full bg-secondary py-32 px-6 md:px-12">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <FadeIn>
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-primary mb-4 block">
                    Chosen For You
                  </span>
                </FadeIn>
                <FadeIn delay={100}>
                  <h2 className="font-serif text-[48px] md:text-[60px] text-foreground leading-none">
                    Picked For You
                  </h2>
                </FadeIn>
              </div>
              <FadeIn delay={200}>
                <p className="font-sans font-light text-[13px] text-muted-foreground max-w-[32ch] text-right hidden md:block">
                  Curated from your recent discoveries.
                </p>
              </FadeIn>
            </div>

            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8" staggerDelay={0.08}>
              {pickedForYou.map((product: any) => (
                <StaggerItem key={product.id}>
                  <ProductCard product={product} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* 6. SEASON COLLECTION */}
      <section className="w-full bg-background py-32 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-24">
            <FadeIn>
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-primary mb-4 block">
                Considered
              </span>
            </FadeIn>
            <FadeIn delay={100}>
              <h2 className="font-serif text-[48px] md:text-[60px] text-foreground leading-none">
                The Edit
              </h2>
            </FadeIn>
          </div>

          <div className="flex flex-col gap-32">
            {collections.slice(0, 3).map((collection: any, idx: number) => {
              const isEven = idx % 2 === 0;
              const gradients = [
                "from-[#FAFAF8] to-[#E8E4DE]",
                "from-[#1A1A1A] to-[#2D2D2D]",
                "from-[#F5F3EF] to-[#E8E4DE]",
              ];
              const textColors = [
                "text-muted/10",
                "text-white/5",
                "text-muted/10",
              ];
              
              return (
                <div key={collection.id || idx} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 lg:gap-24`}>
                  <FadeIn delay={100} className="w-full md:w-[55%]">
                    <Link href={`/collections/${collection.slug || collection.id}`}>
                      <div className={`relative w-full aspect-[4/5] bg-gradient-to-br ${gradients[idx % gradients.length]} flex items-center justify-center overflow-hidden group`}>
                        <span className={`font-serif italic text-[150px] md:text-[200px] ${textColors[idx % textColors.length]} transition-transform duration-1000 group-hover:scale-110`}>
                            C
                          </span>
                      </div>
                    </Link>
                  </FadeIn>
                  <div className="w-full md:w-[45%] flex flex-col justify-center text-center md:text-left">
                    <FadeIn delay={200}>
                      <h3 className="font-serif italic text-[40px] md:text-[56px] text-foreground mb-6 leading-[1.1]">
                        {collection.name}
                      </h3>
                    </FadeIn>
                    <FadeIn delay={300}>
                      <p className="font-sans font-light text-[14px] text-muted-foreground leading-[1.8] max-w-[40ch] mb-10 mx-auto md:mx-0">
                        {collection.description || "Each piece selected for the precision of its making, the integrity of its cloth, and the quiet authority it commands."}
                      </p>
                    </FadeIn>
                    <FadeIn delay={400}>
                      <Link
                        href={`/collections/${collection.slug || collection.id}`}
                        className="group inline-flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.2em] text-foreground pb-1 relative"
                      >
                        <span>Discover</span>
                        <MoveRight size={14} strokeWidth={1} className="transition-transform group-hover:translate-x-1" />
                        <div className="absolute bottom-0 left-0 w-0 h-px bg-foreground transition-all duration-500 group-hover:w-full" />
                      </Link>
                    </FadeIn>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. BRAND STORY */}
      <section className="w-full bg-background pb-32 pt-16 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-stretch gap-0">
          <FadeIn className="w-full md:w-[55%] min-h-[500px] md:min-h-[800px] relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FAFAF8] via-[#F5F3EF] to-[#E8E4DE] flex items-center justify-center overflow-hidden">
              <div 
                className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm10 10h10v10H10V10z' fill='%23000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}
              />
              <span className="font-serif italic text-[100px] md:text-[180px] text-muted-foreground/5 tracking-widest relative z-10">
                CARVE
              </span>
            </div>
          </FadeIn>
          
          <div className="w-full md:w-[45%] bg-background flex flex-col justify-center py-16 md:py-24 md:pl-24 lg:pl-32">
            <FadeIn delay={100}>
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-primary mb-8 block">
                The Origin
              </span>
            </FadeIn>
            <FadeIn delay={200}>
              <h2 className="font-serif text-[40px] md:text-[56px] text-foreground leading-[1.1] mb-10">
                Drawn from the <br/> finest cloth of <br/> Pakistan.
              </h2>
            </FadeIn>
            <FadeIn delay={300}>
              <div className="flex flex-col gap-6 font-sans font-light text-[14px] text-muted-foreground leading-[1.9] max-w-[42ch] mb-12">
                <p>
                  We began with a single conviction: that Pakistani cloth, in the right hands, belongs among the finest textiles in the world. Every piece we make is a conversation between heritage and restraint.
                </p>
                <p>
                  Our ateliers in Lahore and Karachi are home to craftspeople who have spent their lives perfecting a kind of quiet — the art of allowing cloth to do the speaking.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={400}>
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.2em] text-foreground pb-1 relative"
              >
                <span>The Full Story</span>
                <MoveRight size={14} strokeWidth={1} className="transition-transform group-hover:translate-x-1" />
                <div className="absolute bottom-0 left-0 w-0 h-px bg-foreground transition-all duration-500 group-hover:w-full" />
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 8. CRAFTSMANSHIP */}
      <section className="w-full bg-secondary py-32 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <FadeIn className="text-center mb-24">
            <h2 className="font-serif text-[48px] md:text-[56px] text-foreground">The Craft</h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            {[
              { num: "I", title: "Heritage Cloth", desc: "We source only from legacy mills — pure silks, worsted wools, and organic cottons woven the same way for generations." },
              { num: "II", title: "Artisan Tailoring", desc: "Built on bespoke construction methods handed down through generations. The drape you feel is not engineered — it is earned." },
              { num: "III", title: "Considered Design", desc: "We remove until what remains cannot be removed. What survives is not trend, not ornament. It simply is." }
            ].map((pillar, idx) => (
              <FadeIn key={idx} delay={idx * 150} className="flex flex-col items-center text-center">
                <span className="font-serif italic text-[64px] text-primary/30 leading-none mb-6">
                  {pillar.num}
                </span>
                <h3 className="font-serif text-[28px] text-foreground mb-4">
                  {pillar.title}
                </h3>
                <p className="font-sans font-light text-[13px] text-muted-foreground leading-[1.8] max-w-[32ch]">
                  {pillar.desc}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 9. INSTAGRAM GALLERY */}
      <section className="w-full bg-background py-32 overflow-hidden">
        <div className="text-center mb-16 px-6">
          <FadeIn>
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-primary mb-4 block">
              @carve.pk
            </span>
          </FadeIn>
          <FadeIn delay={100}>
            <h2 className="font-serif text-[40px] md:text-[48px] text-foreground">A Life Considered</h2>
          </FadeIn>
        </div>

        <div className="w-full flex overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-8">
          <div className="flex w-max min-w-full justify-center px-6 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((item, idx) => (
              <FadeIn key={item} delay={idx * 100} className="snap-center shrink-0">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="block relative w-[280px] md:w-[320px] aspect-square bg-gradient-to-br from-[#F5F3EF] to-[#E8E4DE] flex items-center justify-center overflow-hidden group"
                >
                  <span className="font-serif italic text-[120px] text-muted/10 transition-transform duration-1000 group-hover:scale-110">
                    C
                  </span>
                  <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/80 transition-colors duration-500 flex items-center justify-center">
                    <Instagram 
                      className="text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0" 
                      size={32} 
                      strokeWidth={1}
                    />
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>

        <div className="text-center mt-12 px-6">
          <FadeIn delay={200}>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-block font-sans text-[10px] uppercase tracking-[0.3em] text-foreground border border-foreground/20 px-12 py-5 hover:bg-foreground hover:text-white transition-colors duration-600"
            >
              Follow @carve.pk
            </a>
          </FadeIn>
        </div>
      </section>

      {/* 10. TESTIMONIALS */}
      <section className="w-full bg-[#1A1A1A] py-32 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <FadeIn className="text-center mb-24">
            <h2 className="font-serif italic text-[48px] md:text-[56px] text-white">Worn & Loved</h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            {[
              { name: "Zara H.", city: "Lahore", quote: "The drape of their silk is unparalleled. It feels like wearing nothing, yet demands attention in any room." },
              { name: "Aisha M.", city: "Karachi", quote: "A true masterclass in restraint. The tailoring reminds me of the heritage pieces my grandmother wore, perfected for today." },
              { name: "Fatima S.", city: "Islamabad", quote: "Finally, a brand that understands the luxury of subtlety. The attention to detail in every seam is extraordinary." }
            ].map((test, idx) => (
              <FadeIn key={idx} delay={idx * 150} className="flex flex-col items-center text-center">
                <span className="font-serif text-[80px] text-primary/40 leading-[0.5] mb-8">
                  "
                </span>
                <p className="font-serif italic text-[20px] md:text-[22px] text-white/90 leading-[1.6] mb-10 max-w-[32ch]">
                  {test.quote}
                </p>
                <div className="flex flex-col gap-2">
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/50">
                    {test.name}
                  </span>
                  <span className="font-sans text-[10px] uppercase tracking-widest text-primary/60">
                    {test.city}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 11. NEWSLETTER */}
      <section className="w-full bg-secondary py-[160px] px-6">
        <div className="max-w-[600px] mx-auto text-center flex flex-col items-center">
          <FadeIn>
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-primary mb-6 block">
              Private Access
            </span>
          </FadeIn>
          <FadeIn delay={100}>
            <h2 className="font-serif text-[40px] md:text-[52px] text-foreground leading-[1.1] mb-6">
              Join The Inner Circle
            </h2>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="font-sans font-light text-[14px] text-muted-foreground mb-16">
              Be the first to know. Exclusive access to new arrivals, private events, and editorial despatches from the atelier.
            </p>
          </FadeIn>
          <FadeIn delay={300} className="w-full">
            <form 
              className="flex flex-col sm:flex-row items-center w-full gap-6 sm:gap-0"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get("email") as string;
                if (email) {
                  subscribe.mutate(
                    { body: { email } } as any,
                    { onSuccess: () => setSubscribed(true) }
                  );
                }
              }}
            >
              {subscribed ? (
                <p className="w-full font-serif italic text-[22px] text-foreground animate-in fade-in zoom-in duration-500">
                  You are now part of the Inner Circle.
                </p>
              ) : (
                <>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="YOUR EMAIL ADDRESS"
                    className="w-full bg-transparent border-b border-border py-4 px-2 font-sans text-[11px] uppercase tracking-[0.2em] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                  />
                  <button 
                    type="submit"
                    disabled={subscribe.isPending}
                    className="w-full sm:w-auto bg-[#1A1A1A] text-white font-sans text-[10px] uppercase tracking-[0.3em] px-12 py-5 sm:-ml-4 hover:bg-[#333] transition-colors disabled:opacity-50"
                  >
                    {subscribe.isPending ? "Joining..." : "Join"}
                  </button>
                </>
              )}
            </form>
          </FadeIn>
        </div>
      </section>

      {/* 12. TRUST + SHIPPING */}
      <section className="w-full bg-background border-t border-b border-border py-16 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-stretch justify-center gap-12 md:gap-0">
          {[
            { icon: Truck, title: "Complimentary Delivery", desc: "On every order above PKR 10,000" },
            { icon: RotateCcw, title: "Gracious Returns", desc: "Returns honoured, no questions asked." },
            { icon: Shield, title: "Authenticity", desc: "Every piece is exactly what it claims to be." },
            { icon: Award, title: "Artisan Made", desc: "Shaped entirely by hand." },
          ].map((pillar, idx, arr) => {
            const Icon = pillar.icon;
            return (
              <React.Fragment key={idx}>
                <FadeIn delay={idx * 100} className="flex-1 w-full flex flex-col items-center text-center px-4 py-4 md:py-0">
                  <Icon size={24} strokeWidth={1} className="text-foreground mb-6" />
                  <h4 className="font-serif text-[18px] text-foreground mb-2">{pillar.title}</h4>
                  <p className="font-sans font-light text-[12px] text-muted-foreground">{pillar.desc}</p>
                </FadeIn>
                {idx < arr.length - 1 && (
                  <div className="hidden md:block w-[1px] bg-border my-4" />
                )}
                {idx < arr.length - 1 && (
                  <div className="block md:hidden h-[1px] w-24 bg-border mx-auto" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

    </Layout>
  );
}
