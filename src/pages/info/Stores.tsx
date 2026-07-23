import { Layout } from "@/components/layout/Layout";
import { SEOMeta } from "@/components/SEOMeta";
import { MapPin, Phone, Mail } from "lucide-react";

const STORES = [
  {
    city: "Lahore",
    area: "DHA Phase VI",
    address: "House 14, Block J, DHA Phase VI, Lahore",
    phone: "0306-5748182",
    email: "lahore@carve.pk",
    hours: "Mon – Sat, 11:00 am – 8:00 pm",
    status: "Opening Soon",
  },
  {
    city: "Karachi",
    area: "Clifton",
    address: "Ground Floor, Block 5, Clifton, Karachi",
    phone: "0300-8619916",
    email: "karachi@carve.pk",
    hours: "Mon – Sat, 11:00 am – 8:00 pm",
    status: "Opening Soon",
  },
];

export default function Stores() {
  return (
    <Layout transparentNav={false}>
      <SEOMeta
        title="Our Stores"
        description="Visit Carve in Lahore (DHA Phase VI) and Karachi (Clifton). Our ateliers are open Sunday through Friday."
        url="/stores"
      />
      {/* Editorial header */}
      <div className="w-full bg-[#111] py-36 px-6 text-white text-center">
        <span className="font-sans text-[9px] uppercase tracking-[0.45em] text-[#C9A96E] block mb-8">
          Find Us
        </span>
        <h1
          className="font-serif italic text-white leading-none mb-6"
          style={{ fontSize: "clamp(52px, 7vw, 96px)" }}
        >
          Our Atelier
        </h1>
        <p className="font-sans font-light text-[14px] text-white/60 max-w-[42ch] mx-auto leading-relaxed">
          Spaces where the garments live. Where fabric is felt and silhouette is understood.
        </p>
      </div>

      <div className="w-full max-w-[1100px] mx-auto px-6 md:px-12 py-24">
        {/* Map placeholder */}
        <div
          className="w-full border border-border flex items-center justify-center mb-24"
          style={{ minHeight: "360px" }}
        >
          <div className="text-center px-6">
            <MapPin size={28} strokeWidth={0.8} className="text-muted-foreground/40 mx-auto mb-4" />
            <p className="font-serif italic text-muted-foreground text-xl mb-1">Map Coming Soon</p>
            <p className="font-sans text-[11px] text-muted-foreground/60 tracking-[0.1em]">
              Interactive store locator launching with our ateliers
            </p>
          </div>
        </div>

        {/* Store cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {STORES.map((store) => (
            <div key={store.city} className="border border-border p-10">
              {/* City + status */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <span className="font-sans text-[9px] uppercase tracking-[0.35em] text-[#C9A96E] block mb-2">
                    {store.area}
                  </span>
                  <h2 className="font-serif text-[32px] leading-none">{store.city}</h2>
                </div>
                <span className="font-sans text-[9px] uppercase tracking-[0.2em] bg-foreground/8 border border-border px-3 py-1.5 text-muted-foreground shrink-0 ml-4">
                  {store.status}
                </span>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3 mb-5">
                <MapPin size={14} strokeWidth={1} className="text-muted-foreground mt-0.5 shrink-0" />
                <p className="font-sans text-[13px] text-muted-foreground leading-relaxed">
                  {store.address}
                </p>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 mb-4">
                <Phone size={14} strokeWidth={1} className="text-muted-foreground shrink-0" />
                <a
                  href={`tel:${store.phone.replace(/-/g, "")}`}
                  className="font-sans text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {store.phone}
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 mb-8">
                <Mail size={14} strokeWidth={1} className="text-muted-foreground shrink-0" />
                <a
                  href={`mailto:${store.email}`}
                  className="font-sans text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {store.email}
                </a>
              </div>

              {/* Hours */}
              <div className="border-t border-border pt-6">
                <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60 block mb-1">
                  Hours
                </span>
                <span className="font-sans text-[13px] text-muted-foreground">{store.hours}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Enquiry note */}
        <div className="mt-20 text-center">
          <p className="font-sans font-light text-[13px] text-muted-foreground mb-4">
            For private appointments or bespoke consultations, write to us.
          </p>
          <a
            href="mailto:info@carve.pk"
            className="font-sans text-[10px] uppercase tracking-[0.25em] border-b border-foreground pb-px hover:opacity-60 transition-opacity"
          >
            info@carve.pk
          </a>
        </div>
      </div>
    </Layout>
  );
}
