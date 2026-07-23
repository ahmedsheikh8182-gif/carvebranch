import { Layout } from "@/components/layout/Layout";
import { PageTransition } from "@/components/PageTransition";
import { useListCollections } from "@workspace/api-client-react";
import { Link } from "wouter";
import { SEOMeta } from "@/components/SEOMeta";

export default function Collections() {
  const { data: collectionsRes, isLoading } = useListCollections();
  
  const collections = collectionsRes?.data || collectionsRes || [];

  return (
    <Layout>
      <SEOMeta
        title="Collections"
        description="Discover Carve's seasonal collections — cohesive narratives in architectural form, rich textiles, and uncompromising restraint."
        url="/collections"
      />
      <div className="w-full max-w-[1400px] mx-auto pt-32 pb-24 px-6 md:px-12">
        <PageTransition className="text-center mb-24 max-w-2xl mx-auto">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">Curated</span>
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.15] pb-2 mb-8">Collections</h1>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
            Discover our seasonal narratives. Each collection is a cohesive expression of architectural form, rich textiles, and uncompromising restraint.
          </p>
        </PageTransition>

        {isLoading ? (
          <div className="space-y-32 animate-pulse">
            <div className="w-full h-[60vh] bg-secondary" />
            <div className="w-full h-[60vh] bg-secondary" />
          </div>
        ) : (
          <div className="flex flex-col gap-y-32">
            {collections.map((col: any, idx: number) => {
              const isEven = idx % 2 === 0;
              return (
                <PageTransition key={col.id} delay={100} className="group flex flex-col md:flex-row gap-12 lg:gap-24 items-center">
                  <div className={`w-full md:w-[60%] aspect-[4/3] md:aspect-[16/9] overflow-hidden bg-secondary relative ${!isEven ? 'md:order-2' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F5F3EF] via-[#EDE9E3] to-[#E2DDD6] flex items-center justify-center transition-transform duration-1000 ease-out group-hover:scale-105">
                      <span className="font-serif italic text-[4rem] md:text-[6rem] text-[#C9A96E]/20 tracking-widest select-none">C</span>
                    </div>
                  </div>
                  
                  <div className={`w-full md:w-[40%] flex flex-col items-start ${!isEven ? 'md:order-1 md:items-end md:text-right' : ''}`}>
                    {col.isSeasonal && (
                      <span className="font-sans text-[9px] uppercase tracking-[0.3em] bg-foreground text-background px-3 py-1 mb-8">Seasonal</span>
                    )}
                    <h2 className="font-serif text-4xl lg:text-6xl mb-6">{col.name}</h2>
                    {col.description && (
                      <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-10 max-w-md">
                        {col.description}
                      </p>
                    )}
                    <Link 
                      href={`/collections/${col.slug}`}
                      className="font-sans text-[11px] uppercase tracking-[0.2em] border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-colors"
                    >
                      Explore Collection
                    </Link>
                  </div>
                </PageTransition>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
