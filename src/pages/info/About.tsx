import { Layout } from "@/components/layout/Layout";
import { PageTransition } from "@/components/PageTransition";
import { SEOMeta } from "@/components/SEOMeta";

export default function About() {
  return (
    <Layout>
      <SEOMeta
        title="Our Story"
        description="Carve began with a single conviction: that Pakistani cloth, in the right hands, belongs among the finest textiles in the world."
        url="/about"
      />
      <div className="w-full max-w-[900px] mx-auto pt-32 pb-32 px-6 md:px-12">
        <PageTransition className="text-center mb-24">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">Maison</span>
          <h1 className="font-serif text-5xl md:text-7xl mb-8">About CARVE</h1>
        </PageTransition>
        
        <PageTransition delay={100} className="font-sans text-sm md:text-base leading-loose text-muted-foreground space-y-12">
          <p className="text-foreground text-xl md:text-2xl font-serif italic text-center mb-16">
            "We believe that true luxury does not demand attention. It commands it through quiet excellence."
          </p>
          
          <div className="w-full aspect-[21/9] bg-secondary my-16 flex flex-col items-center justify-center">
            <span className="font-serif text-4xl text-muted/30 tracking-widest">ATELIER</span>
          </div>

          <p>
            CARVE was born from a desire to elevate Pakistani fine textiles to the global standard of quiet luxury. We reject the ephemeral trends of fast fashion, focusing instead on timeless architectural silhouettes, uncompromising material quality, and meticulous craftsmanship.
          </p>
          <p>
            Every piece in our collection is conceived in our private ateliers, where master artisans blend traditional techniques with minimalist, modern sensibilities. The result is a wardrobe that feels effortless yet impeccably constructed.
          </p>
          <p>
            For the woman who knows quality on sight, CARVE offers a sartorial sanctuary. Generous in restraint, precise in execution. Luxury, refined.
          </p>
        </PageTransition>
      </div>
    </Layout>
  );
}
