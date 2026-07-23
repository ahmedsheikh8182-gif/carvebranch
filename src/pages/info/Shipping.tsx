import { Layout } from "@/components/layout/Layout";
import { SEOMeta } from "@/components/SEOMeta";
import { PageTransition } from "@/components/PageTransition";

export default function Shipping() {
  return (
    <Layout>
      <SEOMeta
        title="Shipping"
        description="Carve offers complimentary delivery on orders above PKR 10,000. Ships across Pakistan in 3–5 business days."
        url="/shipping"
      />
      <div className="w-full max-w-[900px] mx-auto pt-32 pb-32 px-6 md:px-12">
        <PageTransition className="mb-24">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">Information</span>
          <h1 className="font-serif text-5xl md:text-7xl mb-8">Shipping</h1>
        </PageTransition>
        
        <PageTransition delay={100} className="font-sans text-sm leading-loose text-muted-foreground space-y-12">
          <section>
            <h2 className="font-serif text-3xl text-foreground mb-6">Domestic Delivery</h2>
            <p>We offer complimentary express shipping on all domestic orders within Pakistan. Orders are typically processed within 1-2 business days and delivered within 2-4 business days.</p>
          </section>
          <section>
            <h2 className="font-serif text-3xl text-foreground mb-6">International Shipping</h2>
            <p>Global deliveries are dispatched via DHL Express. Transit times generally range from 3-7 business days depending on the destination. Shipping rates are calculated at checkout based on region.</p>
          </section>
          <section>
            <h2 className="font-serif text-3xl text-foreground mb-6">Duties & Taxes</h2>
            <p>For international orders, local duties and taxes are the responsibility of the recipient. These are levied by your local customs authority and will be communicated to you directly by the courier prior to delivery.</p>
          </section>
        </PageTransition>
      </div>
    </Layout>
  );
}
