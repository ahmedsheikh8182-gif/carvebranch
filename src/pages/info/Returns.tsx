import { Layout } from "@/components/layout/Layout";
import { SEOMeta } from "@/components/SEOMeta";
import { PageTransition } from "@/components/PageTransition";

export default function Returns() {
  return (
    <Layout>
      <SEOMeta
        title="Returns & Exchanges"
        description="Gracious returns within 30 days. Carve accepts unworn, unaltered pieces in original packaging."
        url="/returns"
      />
      <div className="w-full max-w-[900px] mx-auto pt-32 pb-32 px-6 md:px-12">
        <PageTransition className="mb-24">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">Information</span>
          <h1 className="font-serif text-5xl md:text-7xl mb-8">Returns</h1>
        </PageTransition>
        
        <PageTransition delay={100} className="font-sans text-sm leading-loose text-muted-foreground space-y-12">
          <section>
            <p className="text-xl font-serif text-foreground mb-8">We accept returns for exchange or store credit within 14 days of receipt, provided the garment is in its original pristine condition.</p>
          </section>
          <section>
            <h2 className="font-serif text-3xl text-foreground mb-6">Conditions</h2>
            <p>Garments must be unworn, unwashed, unaltered, and with all original tags attached. Fragrance, makeup marks, or signs of wear will render the return invalid. Bespoke, altered, and sale items are strictly final sale.</p>
          </section>
          <section>
            <h2 className="font-serif text-3xl text-foreground mb-6">Process</h2>
            <p>To initiate a return, please contact our concierge via email (info@carve.pk) with your order number. Once approved, you will receive instructions for returning the piece to our atelier. The cost of return shipping is the responsibility of the client.</p>
          </section>
        </PageTransition>
      </div>
    </Layout>
  );
}
