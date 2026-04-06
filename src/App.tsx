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
  Phone as PhoneIcon,
  ChevronRight,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  MapPin,
  Trash2,
  Smartphone,
  Timer,
  ExternalLink,
  ChevronLeft
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Customer, Establishment } from "./types";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Brand Assets ---
const KLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={cn("fill-primary w-10 h-10", className)}>
    <path d="M25 15 L25 85 M25 50 L75 15 M25 50 L75 85 M70 15 L80 15 M70 85 L80 85" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

// --- Fluid Components ---

const Header = ({ onLogoClick, onAdminClick }: { onLogoClick?: () => void, onAdminClick?: () => void }) => (
  <header className="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-xl border-b border-outline/30 px-6 h-14 flex items-center justify-between">
    <button onClick={onLogoClick} className="flex items-center gap-2 group transition-all active:scale-95">
       <KLogo className="w-6 h-6 group-hover:scale-105" />
       <span className="text-base font-bold text-on-surface tracking-tighter">Kwik<span className="text-primary">Filas</span></span>
    </button>
    <div className="flex items-center gap-2">
      <button onClick={onAdminClick} className="text-[9px] font-bold uppercase tracking-wider border border-outline px-4 py-2 rounded-xl bg-surface-variant/50 hover:bg-white active:scale-95 transition-all flex items-center gap-1.5">
        <Smartphone className="w-3 h-3" /> Painel
      </button>
    </div>
  </header>
);

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="space-y-1 text-left w-full mb-6">
    <h2 className="text-2xl font-black tracking-tight text-on-surface">{title}</h2>
    {subtitle && <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">{subtitle}</p>}
  </div>
);

// --- High Density Views ---

const SuperAdminView = ({ establishments, onCreate, onBack }: { establishments: Establishment[], onCreate: (name: string, initials: string) => void, onBack: () => void }) => {
  const [name, setName] = useState("");
  const [initials, setInitials] = useState("");

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-sm mx-auto py-6 px-4 space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold uppercase text-primary hover:opacity-70"><ChevronLeft className="w-3 h-3" /> Voltar</button>
      <SectionHeader title="Controle Maestro" subtitle="Gerador de Canais" />

      <div className="bg-white p-6 rounded-3xl border border-outline/50 shadow-ambient space-y-4">
        <div className="space-y-3">
          <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-surface-variant p-4 rounded-xl text-sm font-bold placeholder:opacity-30 border-none outline-none focus:ring-1 focus:ring-primary/20" placeholder="Nome do Local" required />
          <input value={initials} onChange={e => setInitials(e.target.value.toUpperCase())} className="w-full bg-surface-variant p-4 rounded-xl text-sm font-bold placeholder:opacity-30 border-none outline-none focus:ring-1 focus:ring-primary/20" placeholder="Iniciais (EX: KF)" maxLength={3} required />
        </div>
        <button onClick={() => { if(name && initials) { onCreate(name, initials); setName(""); setInitials(""); } }} className="w-full btn-primary py-4">Criar Novo</button>
      </div>

      <div className="space-y-2">
         {establishments.map(est => (
           <div key={est.id} className="bg-white/50 p-4 rounded-2xl border border-outline/30 flex justify-between items-center group active:scale-[0.98] transition-all">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center font-black text-xs">{est.initials}</div>
                 <div>
                    <h3 className="font-bold text-sm leading-tight text-on-surface">{est.name}</h3>
                    <span className="text-[9px] font-bold text-on-surface-variant font-mono">{est.code}</span>
                 </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline" />
           </div>
         ))}
      </div>
    </motion.div>
  );
};

const EstablishmentAdminView = ({ establishment, onNext, onBack }: { establishment: Establishment, onNext: () => void, onBack: () => void }) => {
  const currentCustomer = (establishment.customers || []).find(c => c.status === "called");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-sm mx-auto py-6 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-on-surface-variant active:scale-90 transition-all"><ChevronLeft className="w-3 h-3" /> Dashboard</button>
        <span className="text-[9px] font-bold px-2 py-1 bg-primary/5 text-primary rounded-lg uppercase tracking-widest">{establishment.code}</span>
      </div>

      <SectionHeader title={establishment.name} subtitle="Gestão em Tempo Real" />

      {/* Main Call Action */}
      <div className="bg-primary text-white p-8 rounded-[40px] shadow-elevated flex flex-col items-center gap-6 relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer group" onClick={onNext}>
         <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
         <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors animate-pulse-subtle">
            <Bell className="w-6 h-6 fill-white" />
         </div>
         <div className="text-center">
            <span className="text-sm font-black uppercase tracking-[0.2em] opacity-80 leading-none">Chamar Próximo</span>
            <h3 className="text-4xl font-black mt-2">Pronto!</h3>
         </div>
         {currentCustomer && (
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full mt-2">
               <span className="text-[10px] font-bold">Ticket: {currentCustomer.ticket_number.split('-').pop()}</span>
            </div>
         )}
      </div>

      {/* Waiting List */}
      <div className="space-y-3">
         <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Lista de Espera</span>
            <span className="text-[9px] font-bold px-3 py-1 bg-surface-variant rounded-full text-on-surface-variant">{(establishment.customers || []).length} pessoas</span>
         </div>
         <AnimatePresence mode="popLayout">
           {(establishment.customers || []).map((c, i) => (
             <motion.div key={c.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-4 rounded-3xl border border-outline/30 flex items-center justify-between group active:bg-surface-variant transition-all">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-surface-variant rounded-xl flex flex-col items-center justify-center font-black">
                      <span className="text-[8px] opacity-30 leading-none mb-0.5">#{i + 1}</span>
                      <span className="text-sm leading-none">{c.ticket_number.split('-').pop()}</span>
                   </div>
                   <div>
                      <p className="text-sm font-bold text-on-surface">{c.phone}</p>
                      <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">{c.status === 'called' ? 'Atendendo' : 'Esperando'}</span>
                   </div>
                </div>
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", c.status === 'called' ? "bg-primary/20 text-primary animate-pulse" : "bg-outline/20 text-outline")}>
                   <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
             </motion.div>
           ))}
         </AnimatePresence>
         {(establishment.customers || []).length === 0 && (
            <div className="py-12 flex flex-col items-center text-center space-y-3 opacity-30">
               <Users className="w-8 h-8" />
               <p className="text-xs font-bold uppercase tracking-widest leading-none">Ninguém na fila</p>
            </div>
         )}
      </div>
    </motion.div>
  );
};

const CustomerView = ({ establishment, onJoin, onLeave }: { establishment: Establishment, onJoin: (phone: string) => void, onLeave: (id: string) => void }) => {
  const [phone, setPhone] = useState("");
  const [myCustomer, setMyCustomer] = useState<Customer | null>(null);
  const [step, setStep] = useState<"welcome" | "input">("welcome");

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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm mx-auto py-12 px-6 flex flex-col items-center text-center space-y-12">
        <SectionHeader title={establishment.name} subtitle="Status da Sua Vez" />
        
        <div className="w-full bg-white rounded-[48px] p-10 shadow-elevated border border-outline/30 space-y-8 flex flex-col items-center">
           <div className="relative w-44 h-44 flex items-center justify-center">
              <div className={cn("absolute inset-0 rounded-full border-4 border-dashed transition-all", isCalled ? "border-green-500 animate-spin-slow" : "border-primary/20 animate-spin-slow-reverse")}></div>
              <div className="text-center">
                 <span className="text-xs font-black uppercase text-on-surface-variant tracking-widest block opacity-40">Ticket</span>
                 <span className={cn("text-6xl font-black tracking-tighter leading-none transition-colors", isCalled ? "text-green-600" : "text-primary")}>
                   {myCustomer.ticket_number.split('-').pop()}
                 </span>
              </div>
           </div>
           
           <div className="space-y-2">
              <h3 className="text-2xl font-black">{isCalled ? "Chegou a sua vez!" : `Você é o ${position}º`}</h3>
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">
                 {isCalled ? "Dirija-se ao guichê imediatamente." : `Aguarde aprox. ${position * 5} minutos.`}
              </p>
           </div>
        </div>

        <button onClick={() => { onLeave(myCustomer.id); localStorage.removeItem(`kwikfilas_phone_${establishment.code}`); }} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 hover:text-red-500 hover:opacity-100 transition-all">
          <LogOut className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Cancelar Ticket
        </button>
      </motion.div>
    );
  }

  if (step === "welcome") {
    return (
      <motion.div key="welcome" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm mx-auto py-16 px-8 flex flex-col items-center text-center space-y-12">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-primary/5 rounded-[22px] flex items-center justify-center mx-auto mb-8 shadow-inner">
             <Store className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-5xl font-black tracking-tight text-on-surface leading-[1.1]">{establishment.name}</h1>
          <p className="text-on-surface-variant text-sm font-medium tracking-tight px-4 leading-relaxed opacity-70">
            Junte-se à fila digital premium e acompanhe o seu lugar diretamente no smartphone.
          </p>
        </div>

        <button onClick={() => setStep("input")} className="w-full btn-primary py-7 text-base flex items-center justify-center gap-4 active:scale-95 transition-all">
          ENTRAR NA FILA <ArrowRight className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 text-on-surface-variant/20 uppercase font-black text-[9px] tracking-[0.4em]">
           <span className="h-px w-6 bg-current"></span> Premium <span className="h-px w-6 bg-current"></span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div key="input" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-sm mx-auto py-12 px-6 flex flex-col items-center text-center">
      <div className="w-full mb-10 flex items-center justify-between">
         <button onClick={() => setStep("welcome")} className="w-10 h-10 rounded-full border border-outline flex items-center justify-center active:scale-90"><ChevronLeft className="w-4 h-4" /></button>
         <div className="text-right">
            <h3 className="text-2xl font-black text-on-surface leading-none">Telemóvel</h3>
            <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Confirmação via SMS</span>
         </div>
      </div>

      <div className="card-main space-y-10">
        <form onSubmit={handleJoin} className="space-y-8">
           <div className="space-y-6">
              <div className="flex items-center bg-surface-variant p-2 rounded-2xl border border-outline/30 focus-within:border-primary/20 focus-within:bg-white transition-all shadow-inner">
                 <div className="px-5 py-4 border-r border-outline/30 font-black text-on-surface-variant text-base">AO <span className="text-on-surface ml-1">+244</span></div>
                 <input value={phone} onChange={e => setPhone(e.target.value)} className="flex-grow bg-transparent border-none focus:ring-0 text-xl font-bold px-6 py-4" placeholder="9XX XXX XXX" type="tel" autoFocus required />
              </div>

              <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-2xl text-left border border-primary/5">
                 <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                 <p className="text-[10px] font-bold text-on-surface-variant leading-relaxed">
                    Você receberá um SMS automático quando estiver no topo da fila. Certifique-se de que o número está correto.
                 </p>
              </div>
           </div>

           <button type="submit" className="w-full btn-primary py-6 flex items-center justify-center gap-3">
             GERAR TICKET AGORA <CheckCircle2 className="w-4 h-4" />
           </button>
        </form>
      </div>

      <p className="mt-12 text-[10px] font-medium text-on-surface-variant/40 max-w-[200px] leading-relaxed">
        Ao prosseguir, você concorda com nossos <span className="text-primary hover:underline cursor-pointer">Termos de Uso</span> e nossa política de privacidade.
      </p>
    </motion.div>
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
    await fetch("/api/queue/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, estCode: selectedEst.code }),
    });
    fetchData();
  };

  const handleLeave = async (id: string) => {
    await fetch("/api/queue/leave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  const handleNext = async () => {
    if (!selectedEst) return;
    await fetch(`/api/establishments/${selectedEst.code}/next`, { method: "POST" });
    fetchData();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-white pb-12 selection:bg-primary/10">
      <Header 
        onLogoClick={() => { setView("landing"); setSelectedEst(null); window.history.replaceState({}, '', '/'); }} 
        onAdminClick={() => { setView("admin"); setSelectedEst(null); }}
      />
      
      <main className="pt-14 min-h-screen">
        <AnimatePresence mode="wait">
          {view === "landing" && (
            <motion.div key="landing" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="pt-24 px-8 text-center space-y-12">
                <div className="space-y-6">
                  <KLogo className="w-16 h-16 mx-auto mb-8 animate-pulse-subtle" />
                  <h1 className="text-4xl font-black tracking-tight text-on-surface leading-[1.1]">Gestão de filas<br/><span className="text-primary">inteligente.</span></h1>
                  <p className="text-on-surface-variant text-base font-medium max-w-[280px] mx-auto opacity-70 leading-relaxed">Experiência ágil para clientes e administradores em movimento.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3 max-w-[240px] mx-auto">
                   <button onClick={() => setView("customer")} className="btn-primary py-5 text-sm flex items-center justify-center gap-3">
                      SOU CLIENTE <ArrowRight className="w-4 h-4" />
                   </button>
                   <button onClick={() => setView("admin")} className="btn-outline py-5 text-sm">PAINEL ADMIN</button>
                </div>
                
                <div className="pt-12 grid grid-cols-3 gap-6 max-w-[280px] mx-auto opacity-20">
                   <div className="h-px bg-on-surface grow"></div>
                   <div className="text-[8px] font-black uppercase tracking-[0.4em] shrink-0 -mt-1.5">Mobile First</div>
                   <div className="h-px bg-on-surface grow"></div>
                </div>
            </motion.div>
          )}

          {view === "customer" && !selectedEst && (
            <motion.div key="customer-list" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-sm mx-auto py-8 px-6 space-y-8">
              <SectionHeader title="Onde você está?" subtitle="Selecione o Local" />
              <div className="grid gap-2.5">
                {establishments.map(est => (
                  <button key={est.id} onClick={() => setSelectedEst(est)} className="w-full bg-white p-4 pr-6 rounded-3xl border border-outline/30 flex items-center gap-5 hover:border-primary active:bg-surface-variant transition-all group">
                    <div className="w-12 h-12 bg-surface-variant rounded-2xl flex items-center justify-center font-black text-lg group-hover:bg-primary group-hover:text-white transition-all">{est.initials}</div>
                    <div className="flex-grow text-left leading-none"><h3 className="font-bold text-base mb-1">{est.name}</h3><span className="text-[9px] font-black tracking-widest text-on-surface-variant uppercase">{est.customers?.length || 0} na fila</span></div>
                    <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {view === "customer" && selectedEst && (
            <CustomerView establishment={selectedEst} onJoin={handleJoin} onLeave={handleLeave} />
          )}

          {view === "admin" && (
            <motion.div key="admin-list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm mx-auto py-8 px-6 space-y-8">
               <SectionHeader title="Área Administrativa" subtitle="Escolha seu Canal" />
               <div className="grid gap-2.5">
                 {establishments.map(est => (
                   <button key={est.id} onClick={() => { setSelectedEst(est); setView("superadmin"); }} className="p-5 bg-white rounded-3xl border border-outline/40 hover:border-primary active:bg-surface-variant transition-all flex justify-between items-center group">
                      <div className="text-left leading-none">
                        <span className="text-[8px] font-black uppercase tracking-widest text-primary mb-1.5 block opacity-60 font-mono">{est.code}</span>
                        <h3 className="text-base font-bold text-on-surface">{est.name}</h3>
                      </div>
                      <LayoutDashboard className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                   </button>
                 ))}
                 <button onClick={() => setView("superadmin")} className="mt-8 text-[9px] font-black uppercase tracking-[0.3em] text-on-surface-variant/30 hover:text-primary text-center w-full active:scale-95 transition-all">
                    + Master Console
                 </button>
               </div>
            </motion.div>
          )}

          {view === "superadmin" && !selectedEst && (
            <SuperAdminView establishments={establishments} onBack={() => setView("admin")} onCreate={async (name, initials) => {
              await fetch("/api/admin/establishments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, initials }) });
              fetchData();
            }} />
          )}

          {view === "superadmin" && selectedEst && (
            <EstablishmentAdminView establishment={selectedEst} onBack={() => { setView("admin"); setSelectedEst(null); }} onNext={handleNext} />
          )}
        </AnimatePresence>
      </main>
      
      {!loading && <div className="mt-auto"><Footer /></div>}
    </div>
  );
}
