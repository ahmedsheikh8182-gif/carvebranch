import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function Layout({ children, transparentNav = false }: { children: React.ReactNode, transparentNav?: boolean }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20 selection:text-foreground">
      <Navbar isTransparent={transparentNav} />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
