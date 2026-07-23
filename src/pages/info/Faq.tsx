import { Layout } from "@/components/layout/Layout";
import { SEOMeta } from "@/components/SEOMeta";
import { PageTransition } from "@/components/PageTransition";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-border py-8">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center group text-left">
        <span className="font-serif text-xl md:text-2xl text-foreground group-hover:text-muted-foreground transition-colors pr-8">{question}</span>
        <span className="shrink-0">{isOpen ? <ChevronUp size={20} strokeWidth={1} /> : <ChevronDown size={20} strokeWidth={1} />}</span>
      </button>
      <div className={cn("overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]", isOpen ? "max-h-[500px] mt-6 opacity-100" : "max-h-0 mt-0 opacity-0")}>
        <p className="font-sans text-sm leading-relaxed text-muted-foreground">{answer}</p>
      </div>
    </div>
  );
}

export default function Faq() {
  const faqs = [
    {
      q: "What is your return policy?",
      a: "We accept returns within 14 days of delivery for store credit or exchange. Garments must be unworn, in pristine condition, with all original tags attached. Bespoke or altered pieces are final sale."
    },
    {
      q: "Do you ship internationally?",
      a: "Yes, CARVE ships globally via express courier services. Delivery times and duties vary by region. Please consult our Shipping page for precise details."
    },
    {
      q: "How do I care for my garments?",
      a: "Each piece comes with a specific care label. Generally, we recommend dry cleaning for our fine wools and silks to maintain their structural integrity and drape."
    },
    {
      q: "Can I request bespoke alterations?",
      a: "Currently, bespoke alterations are reserved for our private atelier clients in select regions. Please contact our WhatsApp concierge to discuss feasibility."
    }
  ];

  return (
    <Layout>
      <SEOMeta
        title="FAQ"
        description="Answers to common questions about Carve orders, shipping, returns, and our garments."
        url="/faq"
      />
      <div className="w-full max-w-[900px] mx-auto pt-32 pb-32 px-6 md:px-12">
        <PageTransition className="mb-24">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">Support</span>
          <h1 className="font-serif text-5xl md:text-7xl mb-8">FAQ</h1>
        </PageTransition>
        
        <PageTransition delay={100} className="flex flex-col border-t border-border">
          {faqs.map((faq, idx) => (
            <FaqItem key={idx} question={faq.q} answer={faq.a} />
          ))}
        </PageTransition>
      </div>
    </Layout>
  );
}
