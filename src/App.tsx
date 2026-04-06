import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  QrCode, 
  LayoutDashboard, 
  ArrowRight, 
  Store, 
  Users, 
  LogOut,
  Bell,
  User,
  Plus,
  History,
  Phone,
  ChevronRight,
  X,
  CheckCircle2,
  AlertCircle,
  UtensilsCrossed,
  ShoppingBag,
  Bike,
  Info,
  MapPin
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Customer, Establishment } from "./types";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Icons / Brand ---
const KLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={cn("fill-primary w-12 h-12", className)}>
    <path d="M20 10 L20 90 M20 50 L75 10 M20 50 L75 90 M70 10 L80 10 M70 90 L80 90" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

// --- Components ---

const Header = ({ onLogoClick, onAdminClick }: { onLogoClick?: () => void, onAdminClick?: () => void }) => (
  <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl flex items-center justify-between px-8 h-20 border-b border-outline/30">
    <button onClick={onLogoClick} className="flex items-center gap-3 group transition-all">
       <KLogo className="w-8 h-8 group-hover:scale-105 transition-transform" />
       <span className="text-xl font-black text-on-surface tracking-tighter">Kwik<span className="text-primary">Filas</span></span>
    </button>
    <div className="flex items-center gap-3">
      <button className="text-[10px] font-black uppercase tracking-[0.2em] bg-primary text-white px-6 py-3 rounded-full hover:shadow-lg transition-all hidden md:block">Sobre Nós</button>
      <button onClick={onAdminClick} className="text-[10px] font-black uppercase tracking-[0.2em] border-2 border-outline px-6 py-3 rounded-full hover:bg-surface-container transition-all">Admin</button>
    </div>
  </header>
);

const Footer = () => (
  <footer className="py-16 text-center space-y-4">
    <div className="flex items-center justify-center gap-2 mb-6">
       <div className="h-px w-8 bg-primary/20"></div>
       <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Premium Queue System</span>
       <div className="h-px w-8 bg-primary/20"></div>
    </div>
    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
      © 2026 <span className="text-primary">KwikFilas Angola.</span> Todos os direitos reservados.
    </p>
    <p className="text-[9px] font-black text-on-surface uppercase tracking-[0.2em] pt-2">Privacidade & Termos Legais</p>
  </footer>
);

// --- Views ---

const CustomerView = ({ establishment, onJoin, onLeave }: { establishment: Establishment, onJoin: (phone: string) => void, onLeave: (id: string) => void }) => {
  const [phone, setPhone] = useState("");
  const [myCustomer, setMyCustomer] = useState<Customer | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("eat-in");

  useEffect(() => {
    const savedPhone = localStorage.getItem(`kwikfilas_phone_${establishment.code}`);
    if (savedPhone) {
      const found = (establishment.customers || []).find(c => c.phone === savedPhone);
      if (found) setMyCustomer(found);
      else setMyCustomer(null);
    }
  }, [establishment.customers]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length >= 9) {
      localStorage.setItem(`kwikfilas_phone_${establishment.code}`, cleanPhone);
      onJoin(cleanPhone);
    }
  };

  if (myCustomer) {
    const position = (establishment.customers || []).findIndex(c => c.id === myCustomer.id) + 1;
    const isCalled = myCustomer.status === "called";

    return (
      <div className="max-w-xl mx-auto space-y-8 py-12 px-6 text-center">
        <KLogo className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-4xl font-black tracking-tight">{establishment.name}</h1>
        
        <div className="bg-white rounded-[40px] p-12 shadow-elevated border border-outline/50 space-y-10">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Seu Ticket</span>
            <div className="text-8xl font-black text-primary tracking-tighter">
              {myCustomer.ticket_number.split('-').pop()}
            </div>
          </div>
          
          <div className="space-y-4 pt-6 border-t border-outline/50">
             <h3 className="text-2xl font-black">{isCalled ? "Sua vez chegou!" : `Posição na Fila: ${position}º`}</h3>
             <p className="text-on-surface-variant font-bold text-sm">
               {isCalled ? "Dirija-se ao local agora." : `A sua vez está quase a chegar. Acompanhe em tempo real.`}
             </p>
          </div>
        </div>

        <button onClick={() => { onLeave(myCustomer.id); localStorage.removeItem(`kwikfilas_phone_${establishment.code}`); }} className="text-on-surface-variant font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:text-primary transition-colors">
          <LogOut className="w-3 h-3" /> Cancelar Minha Vez
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-20 px-6 flex flex-col items-center">
      <div className="w-full text-center space-y-6 mb-16">
        <KLogo className="w-20 h-20 mx-auto mb-8 animate-pulse-subtle" />
        <h1 className="text-6xl font-black tracking-tight text-on-surface leading-[1.1]">
          Sua vez sem filas,<br/><span className="text-primary">sem stress.</span>
        </h1>
        <p className="text-on-surface-variant text-lg font-medium max-w-sm mx-auto">
          Junte-se à nossa fila digital premium e acompanhe o seu lugar em tempo real.
        </p>
      </div>

      <div className="card-main space-y-12">
        <div className="space-y-8">
           {/* Code Info */}
           <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center">
                    <MapPin className="text-primary w-3 h-3" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Código do Local</span>
              </div>
              <div className="flex justify-between items-center bg-surface-container p-6 rounded-3xl border border-outline/50 group hover:border-primary/20 transition-all">
                <span className="text-2xl font-black tracking-[0.5em] text-on-surface">{establishment.code}</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest px-3 py-1 bg-primary/5 rounded-lg">{establishment.initials}</span>
              </div>
           </div>

           {/* Phone Input */}
           <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center">
                    <Phone className="text-primary w-3 h-3" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Seu Telemóvel</span>
              </div>
              <div className="flex items-center bg-surface-container p-2 rounded-3xl border border-outline/50 focus-within:border-primary/20 transition-all">
                <div className="px-5 py-4 border-r border-outline/30 font-black text-on-surface-variant">AO <span className="text-on-surface ml-1">+244</span></div>
                <input value={phone} onChange={e => setPhone(e.target.value)} className="flex-grow bg-transparent border-none focus:ring-0 text-xl font-black px-6 py-4" placeholder="9XX XXX XXX" type="tel" required />
              </div>
           </div>

           {/* Methods */}
           <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center">
                    <UtensilsCrossed className="text-primary w-3 h-3" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Tipo de Atendimento</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                 {[
                   { id: "eat-in", label: "Vou Comer Aqui", icon: UtensilsCrossed },
                   { id: "takeaway", label: "Vou Levar", icon: ShoppingBag },
                   { id: "delivery", label: "Entrega-me", icon: Bike }
                 ].map(m => (
                   <button 
                     key={m.id}
                     type="button"
                     onClick={() => setSelectedMethod(m.id)}
                     className={cn("badge-category", selectedMethod === m.id && "border-primary bg-primary/5 text-primary")}
                    >
                     <m.icon className={cn("w-5 h-5", selectedMethod === m.id ? "text-primary" : "text-on-surface-variant/40")} />
                     <span className="leading-tight">{m.label}</span>
                   </button>
                 ))}
              </div>
           </div>
        </div>

        <form onSubmit={handleJoin} className="space-y-8">
           <div className="flex items-center gap-3 px-2">
              <input type="checkbox" id="terms" className="w-5 h-5 rounded border-outline text-primary focus:ring-primary/20" required />
              <label htmlFor="terms" className="text-[11px] font-bold text-on-surface-variant">Li e aceito os <span className="text-primary hover:underline cursor-pointer">Termos e Condições</span></label>
           </div>
           <button type="submit" className="w-full btn-primary py-7 text-lg">ENTRAR NA FILA AGORA</button>
        </form>
      </div>

      <div className="mt-12 flex items-start gap-4 p-6 bg-primary/5 rounded-3xl max-w-sm">
         <div className="p-2 bg-primary text-white rounded-xl"><Info className="w-4 h-4" /></div>
         <p className="text-[11px] font-bold text-on-surface-variant leading-relaxed uppercase tracking-tight">Iremos enviar-lhe uma notificação via SMS assim que o seu ticket estiver no topo da fila.</p>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<"landing" | "customer" | "admin" | "superadmin">("landing");
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [selectedEst, setSelectedEst] = useState<Establishment | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/establishments");
      const data = await res.json();
      setEstablishments(Array.isArray(data) ? data : []);
      if (selectedEst) {
        const updated = (data || []).find((e: Establishment) => e.code === selectedEst.code);
        if (updated) setSelectedEst(updated);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Deep linking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const estCode = params.get("est");
    if (estCode && establishments.length > 0) {
       const found = establishments.find(e => e.code === estCode);
       if (found) { setSelectedEst(found); setView("customer"); }
    }
  }, [establishments]);

  const handleJoin = async (phone: string) => {
    if (!selectedEst) return;
    const res = await fetch("/api/queue/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, estCode: selectedEst.code }),
    });
    if (res.ok) fetchData();
  };

  const handleLeave = async (id: string) => {
    await fetch("/api/queue/leave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onLogoClick={() => { setView("landing"); setSelectedEst(null); }} 
        onAdminClick={() => setView("admin")}
      />
      
      <main className="pt-24 min-h-screen flex flex-col items-center">
        <AnimatePresence mode="wait">
          {view === "landing" && (
            <motion.div key="landing" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-20 px-8 text-center space-y-16">
                <div className="space-y-8">
                  <KLogo className="w-24 h-24 mx-auto mb-10" />
                  <h1 className="text-7xl font-black tracking-tight text-on-surface leading-tight">Gestão de filas<br/><span className="text-primary italic">sem stress.</span></h1>
                  <p className="text-on-surface-variant text-xl font-medium max-w-md mx-auto">Experiência premium para clientes em espera digital.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4 max-w-xs mx-auto">
                   <button onClick={() => setView("customer")} className="btn-primary py-8 text-lg flex items-center justify-center gap-4">
                      SOU CLIENTE <ArrowRight className="w-6 h-6" />
                   </button>
                   <button onClick={() => setView("admin")} className="btn-outline py-8 text-lg">PAINEL ADMIN</button>
                </div>
            </motion.div>
          )}

          {view === "customer" && !selectedEst && (
            <motion.div key="customer-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto py-12 px-6 w-full space-y-10">
              <h2 className="text-4xl font-black tracking-tight text-center">Escolha o <span className="text-primary">Local</span></h2>
              <div className="grid gap-4">
                {establishments.map(est => (
                  <button key={est.id} onClick={() => setSelectedEst(est)} className="w-full bg-white p-6 rounded-[32px] border-2 border-outline hover:border-primary transition-all flex items-center gap-6 group text-left">
                    <div className="w-16 h-16 bg-surface-container rounded-[24px] flex items-center justify-center font-black text-xl group-hover:bg-primary group-hover:text-white transition-all">{est.initials}</div>
                    <div className="flex-grow"><h3 className="font-black text-2xl leading-none mb-1">{est.name}</h3><span className="text-[10px] font-black tracking-widest text-on-surface-variant uppercase">{est.customers?.length || 0} na fila agora</span></div>
                    <ChevronRight className="text-outline group-hover:text-primary" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {view === "customer" && selectedEst && <CustomerView key="customer-status" establishment={selectedEst} onJoin={handleJoin} onLeave={handleLeave} />}

          {view === "admin" && (
            <motion.div key="admin-temp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto py-20 px-8 text-center space-y-12">
               <div className="space-y-4">
                 <h2 className="text-5xl font-black">Área Administrativa</h2>
                 <p className="text-on-surface-variant font-medium">Selecione o local para gerir as senhas em tempo real.</p>
               </div>
               <div className="grid gap-4">
                 {establishments.map(est => (
                   <button key={est.id} onClick={() => { setSelectedEst(est); setView("superadmin"); }} className="p-8 bg-surface-container rounded-[36px] border-2 border-outline hover:border-primary transition-all flex justify-between items-center group">
                      <div className="text-left">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">{est.code}</span>
                        <h3 className="text-2xl font-black text-on-surface">{est.name}</h3>
                      </div>
                      <LayoutDashboard className="w-6 h-6 text-outline group-hover:text-primary transition-colors" />
                   </button>
                 ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {!loading && <Footer />}
    </div>
  );
}
