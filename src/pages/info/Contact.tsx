import { Layout } from "@/components/layout/Layout";
import { SEOMeta } from "@/components/SEOMeta";
import { PageTransition } from "@/components/PageTransition";

export default function Contact() {
  return (
    <Layout>
      <SEOMeta
        title="Contact Us"
        description="Reach Carve by phone, email, or in person at our Lahore and Karachi ateliers."
        url="/contact"
      />
      <div className="w-full max-w-[1200px] mx-auto pt-32 pb-32 px-6 md:px-12">
        <PageTransition className="text-center mb-24 max-w-2xl mx-auto">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">Concierge</span>
          <h1 className="font-serif text-5xl md:text-7xl mb-8">Contact Us</h1>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
            Our private client advisors are available to assist you with bespoke inquiries, styling advice, and order management.
          </p>
        </PageTransition>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32">
          <PageTransition delay={100}>
            <form className="flex flex-col gap-10">
              <div className="relative group">
                <input type="text" required className="w-full bg-transparent border-b border-border py-4 font-sans text-sm tracking-wide focus:outline-none focus:border-foreground transition-colors peer" placeholder=" " id="name" />
                <label htmlFor="name" className="absolute left-0 top-4 font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground pointer-events-none transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-foreground peer-valid:-top-4 peer-valid:text-xs peer-valid:text-foreground">Full Name</label>
              </div>
              <div className="relative group">
                <input type="email" required className="w-full bg-transparent border-b border-border py-4 font-sans text-sm tracking-wide focus:outline-none focus:border-foreground transition-colors peer" placeholder=" " id="email" />
                <label htmlFor="email" className="absolute left-0 top-4 font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground pointer-events-none transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-foreground peer-valid:-top-4 peer-valid:text-xs peer-valid:text-foreground">Email Address</label>
              </div>
              <div className="relative group">
                <textarea required rows={4} className="w-full bg-transparent border-b border-border py-4 font-sans text-sm tracking-wide focus:outline-none focus:border-foreground transition-colors peer resize-none" placeholder=" " id="message" />
                <label htmlFor="message" className="absolute left-0 top-4 font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground pointer-events-none transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-foreground peer-valid:-top-4 peer-valid:text-xs peer-valid:text-foreground">Message</label>
              </div>
              <button type="button" className="self-start bg-foreground text-background font-sans text-[11px] uppercase tracking-[0.2em] px-12 py-4 luxury-button hover:bg-foreground/90 transition-colors mt-4">Send Message</button>
            </form>
          </PageTransition>
          
          <PageTransition delay={200} className="flex flex-col gap-12 bg-secondary p-12 lg:p-16">
            <div>
              <h3 className="font-serif text-2xl mb-6">Direct Contact</h3>
              <div className="flex flex-col gap-4 font-sans text-sm text-muted-foreground">
                <a href="mailto:info@carve.pk" className="hover:text-foreground transition-colors">info@carve.pk</a>
                <span className="block mt-2">0306-5748182</span>
                <span>0300-8619916</span>
              </div>
            </div>
            
            <div className="w-full h-px bg-border" />
            
            <div>
              <h3 className="font-serif text-2xl mb-6">WhatsApp Concierge</h3>
              <p className="font-sans text-sm text-muted-foreground mb-6 leading-relaxed">
                For immediate assistance or private styling appointments, reach out to our dedicated WhatsApp concierge.
              </p>
              <a href="https://wa.me/923008619916" target="_blank" rel="noopener noreferrer" className="font-sans text-[11px] uppercase tracking-[0.2em] border-b border-foreground text-foreground pb-1 inline-block">
                Message Us
              </a>
            </div>
          </PageTransition>
        </div>
      </div>
    </Layout>
  );
}
