import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOMeta } from "@/components/SEOMeta";
import { useSubscribeNewsletter } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export default function GiftCards() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const subscribe = useSubscribeNewsletter();

  function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    subscribe.mutate(
      { data: { email: email.trim() } },
      {
        onSuccess: () => {
          toast({ title: "You are on the list.", description: "We will reach you when gift cards launch." });
          setEmail("");
        },
        onError: () => {
          toast({ title: "Already registered", description: "This email is already on the list." });
          setEmail("");
        },
      }
    );
  }

  return (
    <Layout transparentNav={false}>
      <SEOMeta
        title="Gift Cards"
        description="Give the gift of quiet luxury. Carve physical gift cards — a considered gift for someone who knows."
        url="/gift-cards"
      />
      {/* Hero editorial block */}
      <div className="w-full bg-[#111] min-h-[60vh] flex items-center justify-center text-white px-6">
        <div className="max-w-3xl text-center">
          <span className="font-sans text-[9px] uppercase tracking-[0.45em] text-[#C9A96E] block mb-8">
            Gift of Intention
          </span>
          <h1
            className="font-serif italic text-white leading-none mb-8"
            style={{ fontSize: "clamp(52px, 7vw, 96px)" }}
          >
            Gift Cards
          </h1>
          <p className="font-sans font-light text-[14px] text-white/70 leading-relaxed max-w-[46ch] mx-auto">
            Give someone the freedom to choose. Carve gift cards are the most considered gift — a voucher for quiet luxury, for pieces that endure.
          </p>
        </div>
      </div>

      {/* Coming soon section */}
      <div className="w-full max-w-[900px] mx-auto px-6 md:px-12 py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          {/* Left — status */}
          <div>
            <span className="font-sans text-[9px] uppercase tracking-[0.35em] text-[#C9A96E] block mb-6">
              Digital Gift Cards
            </span>
            <h2
              className="font-serif font-normal mb-6 leading-tight"
              style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
            >
              Coming Soon
            </h2>
            <p className="font-sans font-light text-[13px] text-muted-foreground leading-relaxed mb-8">
              Digital gift cards — redeemable instantly at checkout, in any denomination — are launching soon. Join the waitlist and we will notify you the moment they are available.
            </p>

            {/* Waitlist form */}
            <form onSubmit={handleWaitlist} className="flex flex-col gap-4">
              <div>
                <label className="block font-sans text-[9px] uppercase tracking-[0.2em] mb-2 text-muted-foreground">
                  Your Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full border-b border-border bg-transparent py-3 font-sans text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40"
                />
              </div>
              <button
                type="submit"
                disabled={subscribe.isPending}
                className="w-full bg-foreground text-background font-sans text-[10px] uppercase tracking-[0.25em] py-4 hover:bg-foreground/90 transition-colors disabled:opacity-50"
              >
                {subscribe.isPending ? "Joining…" : "Join the Waitlist"}
              </button>
            </form>
          </div>

          {/* Right — physical card note */}
          <div className="border border-border p-10 bg-secondary/50">
            <span className="font-sans text-[9px] uppercase tracking-[0.35em] text-muted-foreground block mb-5">
              Available Now
            </span>
            <h3 className="font-serif text-[26px] mb-4">Physical Gift Cards</h3>
            <p className="font-sans font-light text-[13px] text-muted-foreground leading-relaxed mb-6">
              Hand-crafted physical gift cards — presented in our signature envelope — are available at our ateliers in Lahore and Karachi.
            </p>
            <p className="font-sans font-light text-[13px] text-muted-foreground leading-relaxed">
              Available in denominations of PKR 2,000 · 5,000 · 10,000 · 25,000.
            </p>
            <div className="w-12 h-px bg-[#C9A96E] mt-8" />
            <p className="font-sans text-[11px] text-muted-foreground mt-4">
              Contact us at{" "}
              <a href="mailto:info@carve.pk" className="text-foreground underline underline-offset-4 decoration-border hover:opacity-70 transition-opacity">
                info@carve.pk
              </a>{" "}
              to arrange collection.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative divider */}
      <div className="w-full max-w-[900px] mx-auto px-6 md:px-12 pb-24">
        <div className="w-full h-px bg-border" />
        <p className="font-sans text-[11px] text-muted-foreground text-center mt-8 tracking-[0.1em]">
          Gift cards do not expire · Valid for all items in The Collection
        </p>
      </div>
    </Layout>
  );
}
