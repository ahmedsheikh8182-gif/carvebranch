import { Layout } from "@/components/layout/Layout";
import { SEOMeta } from "@/components/SEOMeta";
import { PageTransition } from "@/components/PageTransition";

export default function SizeGuide() {
  return (
    <Layout>
      <SEOMeta
        title="Size Guide"
        description="Find your perfect fit with the Carve size guide. Measurements in centimetres for all garment categories."
        url="/size-guide"
      />
      <div className="w-full max-w-[900px] mx-auto pt-32 pb-32 px-6 md:px-12">
        <PageTransition className="mb-24">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">Information</span>
          <h1 className="font-serif text-5xl md:text-7xl mb-8">Size Guide</h1>
          <p className="font-sans text-sm text-muted-foreground">Measurements are provided in inches.</p>
        </PageTransition>
        
        <PageTransition delay={100}>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-sm text-muted-foreground">
              <thead>
                <tr className="border-b border-border text-foreground font-medium uppercase tracking-wider text-xs">
                  <th className="py-4 pr-6">Size</th>
                  <th className="py-4 px-6">Bust</th>
                  <th className="py-4 px-6">Waist</th>
                  <th className="py-4 px-6">Hips</th>
                  <th className="py-4 pl-6">Shoulder</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="py-4 pr-6 text-foreground font-medium">XS (0)</td>
                  <td className="py-4 px-6">32</td>
                  <td className="py-4 px-6">25</td>
                  <td className="py-4 px-6">35</td>
                  <td className="py-4 pl-6">14</td>
                </tr>
                <tr className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="py-4 pr-6 text-foreground font-medium">S (1)</td>
                  <td className="py-4 px-6">34</td>
                  <td className="py-4 px-6">27</td>
                  <td className="py-4 px-6">37</td>
                  <td className="py-4 pl-6">14.5</td>
                </tr>
                <tr className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="py-4 pr-6 text-foreground font-medium">M (2)</td>
                  <td className="py-4 px-6">36</td>
                  <td className="py-4 px-6">29</td>
                  <td className="py-4 px-6">39</td>
                  <td className="py-4 pl-6">15</td>
                </tr>
                <tr className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="py-4 pr-6 text-foreground font-medium">L (3)</td>
                  <td className="py-4 px-6">38</td>
                  <td className="py-4 px-6">31</td>
                  <td className="py-4 px-6">41</td>
                  <td className="py-4 pl-6">15.5</td>
                </tr>
                <tr className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="py-4 pr-6 text-foreground font-medium">XL (4)</td>
                  <td className="py-4 px-6">40</td>
                  <td className="py-4 px-6">33</td>
                  <td className="py-4 px-6">43</td>
                  <td className="py-4 pl-6">16</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-16 bg-secondary p-8 text-center">
            <p className="font-sans text-sm text-muted-foreground">
              For bespoke sizing inquiries, please contact our <a href="/contact" className="text-foreground border-b border-foreground pb-0.5">concierge</a>.
            </p>
          </div>
        </PageTransition>
      </div>
    </Layout>
  );
}
