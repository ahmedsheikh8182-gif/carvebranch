import { useState } from "react";
import { useLocation, Link } from "wouter";
import { PageTransition } from "@/components/PageTransition";
import { useRegister } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const registerMutation = useRegister();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: "Weak password", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }
    
    registerMutation.mutate({ data: { firstName, lastName, email, password } }, {
      onSuccess: (res) => {
        localStorage.setItem('carve_token', res.token);
        toast({ title: "Account Created", description: "Welcome to CARVE." });
        setLocation("/account");
      },
      onError: () => {
        toast({ title: "Registration failed", description: "Please check your details.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background selection:bg-primary/20 selection:text-foreground">
      
      <div className="hidden md:flex md:w-1/2 relative bg-[#111] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#111] via-[#1a1a1a] to-[#222]" />
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white z-10">
          <Link href="/">
            <span className="font-serif text-3xl tracking-[0.3em] font-semibold uppercase block mb-8">Carve</span>
          </Link>
          <p className="font-serif text-4xl italic max-w-sm leading-tight text-white/80">
            "Join an exclusive circle of those who appreciate the unhurried craft."
          </p>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <Link href="/" className="md:hidden absolute top-8 left-1/2 -translate-x-1/2">
          <span className="font-serif text-xl tracking-[0.3em] font-semibold uppercase">Carve</span>
        </Link>
        
        <PageTransition className="w-full max-w-sm mt-20 md:mt-0">
          <div className="mb-12">
            <h1 className="font-serif text-4xl mb-4">Create Account</h1>
            <p className="font-sans text-sm text-muted-foreground tracking-wide">
              Establish your private profile.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="relative group">
                <input 
                  type="text" 
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-border py-3 font-sans text-sm tracking-wide focus:outline-none focus:border-foreground transition-colors peer"
                  placeholder=" "
                  id="firstName"
                />
                <label 
                  htmlFor="firstName"
                  className="absolute left-0 top-3 font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground pointer-events-none transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-foreground peer-valid:-top-4 peer-valid:text-xs peer-valid:text-foreground"
                >
                  First Name
                </label>
              </div>
              <div className="relative group">
                <input 
                  type="text" 
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-border py-3 font-sans text-sm tracking-wide focus:outline-none focus:border-foreground transition-colors peer"
                  placeholder=" "
                  id="lastName"
                />
                <label 
                  htmlFor="lastName"
                  className="absolute left-0 top-3 font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground pointer-events-none transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-foreground peer-valid:-top-4 peer-valid:text-xs peer-valid:text-foreground"
                >
                  Last Name
                </label>
              </div>
            </div>
            
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
                minLength={8}
                className="w-full bg-transparent border-b border-border py-3 font-sans text-sm tracking-wide focus:outline-none focus:border-foreground transition-colors peer"
                placeholder=" "
                id="password"
              />
              <label 
                htmlFor="password"
                className="absolute left-0 top-3 font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground pointer-events-none transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-foreground peer-valid:-top-4 peer-valid:text-xs peer-valid:text-foreground"
              >
                Password (min 8 chars)
              </label>
            </div>
            
            <button 
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-foreground text-background font-sans text-[11px] uppercase tracking-[0.2em] py-4 luxury-button hover:bg-foreground/90 transition-colors mt-6 disabled:opacity-50"
            >
              {registerMutation.isPending ? "Creating..." : "Create Account"}
            </button>
            
            <div className="text-center mt-6">
              <p className="font-sans text-xs text-muted-foreground tracking-wide">
                Already have an account? <Link href="/login" className="text-foreground border-b border-foreground pb-0.5 ml-1">Sign in</Link>
              </p>
            </div>
          </form>
        </PageTransition>
      </div>
    </div>
  );
}
