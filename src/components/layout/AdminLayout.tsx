import { Link, useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { cn } from "@/lib/utils";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/orders", label: "Orders" },
  ];

  return (
    <Layout>
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-100px)] mt-24">
        {/* Admin Sidebar */}
        <aside className="w-full md:w-64 border-r border-border bg-secondary/20 p-6 flex flex-col gap-6">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 pl-4">Administration</span>
          <nav className="flex flex-col gap-2">
            {links.map(link => {
              const active = location === link.href || (link.href !== "/admin" && location.startsWith(link.href));
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={cn(
                    "font-sans text-sm px-4 py-3 rounded-sm transition-colors",
                    active ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        
        {/* Admin Content */}
        <main className="flex-1 p-6 md:p-12 overflow-x-auto bg-background">
          {children}
        </main>
      </div>
    </Layout>
  );
}
