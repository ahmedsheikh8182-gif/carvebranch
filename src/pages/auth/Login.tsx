import { useState } from "react";
import { useLocation, Link } from "wouter";
import { PageTransition } from "@/components/PageTransition";
import { useLogin } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const loginMutation = useLogin();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ data: { email, password } }, {
      onSuccess: (res) => {
        localStorage.setItem('carve_token', res.token);
        toast({ title: "Welcome back", description: "You are now logged in." });
        setLocation("/account");
      },
      onError: () => {
        toast({ title: "Login failed", description: "Please check your credentials.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background selection:bg-primary/20 selection:text-foreground">
      
      {/* Left side: Editorial Visual */}
      <div className="hidden md:flex md:w-1/2 relative bg-[#111] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#111] to-black opacity-80" />
        {/* Subtle noise/texture overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white z-10">
          <Link href="/">
            <span className="font-serif text-3xl tracking-[0.3em] font-semibold uppercase block mb-8">Carve</span>
          </Link>
          <p className="font-serif text-4xl italic max-w-sm leading-tight text-white/80">
            "True luxury does not demand attention. It commands it."
          </p>
        </div>
      </div>
      
      {/* Right side: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <Link href="/" className="md:hidden absolute top-8 left-1/2 -translate-x-1/2">
          <span className="font-serif text-xl tracking-[0.3em] font-semibold uppercase">Carve</span>
        </Link>
        
        <PageTransition className="w-full max-w-sm mt-20 md:mt-0">
          <div className="mb-12">
            <h1 className="font-serif text-4xl mb-4">Sign In</h1>
            <p className="font-sans text-sm text-muted-foreground tracking-wide">
              Access your private atelier and past orders.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="relative group">
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b border-border py-3 font-sans text-sm tracking-wide focus:outline-none focus:border-foreground transition-colors peer"
                placeholder=" "
                id="email"
              />
              <label 
                htmlFor="email"
                className="absolute left-0 top-3 font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground pointer-events-none transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-foreground peer-valid:-top-4 peer-valid:text-xs peer-valid:text-foreground"
              >
                Email Address
              </label>
            </div>
            
            <div className="relative group">
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border-b border-border py-3 font-sans text-sm tracking-wide focus:outline-none focus:border-foreground transition-colors peer"
                placeholder=" "
                id="password"
              />
              <label 
                htmlFor="password"
                className="absolute left-0 top-3 font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground pointer-events-none transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-foreground peer-valid:-top-4 peer-valid:text-xs peer-valid:text-foreground"
              >
                Password
              </label>
            </div>
            
            <div className="flex justify-end -mt-4">
              <a href="#" className="font-sans text-[10px] uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground transition-colors">
                Forgot password?
              </a>
            </div>
            
            <button 
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-foreground text-background font-sans text-[11px] uppercase tracking-[0.2em] py-4 luxury-button hover:bg-foreground/90 transition-colors mt-4 disabled:opacity-50"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </button>
            
            <div className="text-center mt-6">
              <p className="font-sans text-xs text-muted-foreground tracking-wide">
                Don't have an account? <Link href="/register" className="text-foreground border-b border-foreground pb-0.5 ml-1">Create one</Link>
              </p>
            </div>
          </form>
        </PageTransition>
      </div>
    </div>
  );
}
