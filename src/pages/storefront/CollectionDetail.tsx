import { useParams } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { PageTransition } from "@/components/PageTransition";
import { ProductCard } from "@/components/ProductCard";
import { useGetCollection } from "@workspace/api-client-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { SEOMeta } from "@/components/SEOMeta";

export default function CollectionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: collection, isLoading } = useGetCollection(slug, { query: { enabled: !!slug } });

  if (isLoading || !collection) {
    return (
      <Layout>
        <div className="w-full h-[60vh] bg-secondary animate-pulse" />
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="aspect-[3/4] bg-secondary" />)}
          </div>
        </div>
      </Layout>
    );
  }

  const products = collection.products || [];

  return (
    <Layout transparentNav={!!collection.bannerImageUrl}>
      <SEOMeta
        title={collection.name}
        description={collection.description ?? `Explore the ${collection.name} collection by Carve — luxury Pakistani women's fashion in heritage cloth and artisan tailoring.`}
        url={`/collections/${collection.slug}`}
      />

      {/* Editorial Header */}
      <div className="relative w-full h-[60vh] md:h-[80vh] bg-[#111] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-[#1a1a1a]" />
        
        <PageTransition className="relative z-10 max-w-3xl px-6" delay={100}>
          <span className="font-sans text-[11px] uppercase tracking-[0.4em] text-white/70 mb-6 block">Collection</span>
          <h1 className="font-serif text-5xl md:text-8xl italic text-white mb-6">{collection.name}</h1>
          {collection.description && (
            <p className="font-sans text-sm tracking-wide text-white/80 leading-relaxed max-w-xl mx-auto">
              {collection.description}
            </p>
          )}
          {collection.endsAt && (
            <div className="mt-10 flex justify-center">
              <CountdownTimer endsAt={collection.endsAt} />
            </div>
          )}
        </PageTransition>
      </div>

      {/* Products Grid */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-32">
        <div className="flex justify-between items-center mb-16 border-b border-border pb-6">
          <h2 className="font-sans text-[11px] uppercase tracking-[0.2em]">The Pieces</h2>
          <span className="font-sans text-[11px] uppercase tracking-[0.1em] text-muted-foreground">{products.length} Items</span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <span className="font-serif text-2xl text-muted-foreground">No pieces available yet.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-8">
            {products.map((product, idx) => (
              <PageTransition key={product.id} delay={(idx % 3) * 100}>
                <ProductCard product={product} />
              </PageTransition>
            ))}
          </div>
        )}
      </div>

    </Layout>
  );
}
