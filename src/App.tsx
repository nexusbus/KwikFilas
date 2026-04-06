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
  AlertCircle
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Customer, Establishment } from "./types";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Header = ({ title = "KwikFilas", onLogoClick }: { title?: string, onLogoClick?: () => void }) => (
  <header className="fixed top-0 w-full z-50 glass shadow-sm flex items-center justify-between px-6 h-16">
    <button onClick={onLogoClick} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
        <QrCode className="text-white w-5 h-5" />
      </div>
      <span className="text-xl font-black text-on-surface tracking-tighter">
        {title}<span className="text-primary">.</span>
      </span>
    </button>
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Live</span>
    </div>
  </header>
);

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-surface-container-lowest p-6 rounded-2xl shadow-ambient border border-outline-variant/10", className)}>
    {children}
  </div>
);

// --- Views ---

const SuperAdminView = ({ establishments, onCreate }: { establishments: Establishment[], onCreate: (name: string, initials: string) => void }) => {
  const [name, setName] = useState("");
  const [initials, setInitials] = useState("");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl mx-auto py-8 px-6 space-y-8">
      <div className="space-y-1">
        <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase opacity-70">Super User Console</span>
        <h1 className="text-3xl font-extrabold tracking-tight">Gestão de Canais</h1>
      </div>

      <Card className="p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" /> Cadastrar Novo Local
        </h2>
        <form onSubmit={(e) => { e.preventDefault(); onCreate(name, initials); setName(""); setInitials(""); }} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Nome do Estabelecimento</label>
            <input 
              value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-surface-container-low p-4 rounded-xl border border-outline focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
              placeholder="Ex: Central Burguer" required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Iniciais (2-3 letras)</label>
            <input 
              value={initials} onChange={e => setInitials(e.target.value.toUpperCase())}
              className="w-full bg-surface-container-low p-4 rounded-xl border border-outline focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
              placeholder="Ex: CB" maxLength={3} required
            />
          </div>
          <button type="submit" className="btn-primary h-[58px]">
            Criar Canal
          </button>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {establishments.map(est => (
          <Card key={est.id} className="hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{est.name}</h3>
                <p className="text-xs text-on-surface-variant font-mono bg-surface-container px-2 py-1 rounded inline-block mt-1">
                  ID: {est.code}
                </p>
              </div>
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                {est.initials}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/50">
              <div>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase block">Senha Admin</span>
                <span className="font-mono font-bold text-primary text-lg">{est.password}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase block">Na Fila</span>
                <span className="font-bold text-lg">{est.customers.length}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

const EstablishmentAdminView = ({ establishment, onNext }: { establishment: Establishment, onNext: () => void }) => {
  const [showContacts, setShowContacts] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const currentCustomer = (establishment.customers || []).find(c => c.status === "called");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto py-8 px-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
             <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">Admin</span>
             <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">{establishment.code}</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">{establishment.name}</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowQR(true)}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all"
          >
            <QrCode className="w-4 h-4" /> Exibir QR
          </button>
          <button 
            onClick={() => setShowContacts(!showContacts)}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all"
          >
            <History className="w-4 h-4" /> {showContacts ? "Ver Fila" : "Histórico"}
          </button>
        </div>
      </div>

      {showContacts ? (
        <Card>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" /> Histórico de Contactos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(establishment.contacts || []).map((phone, i) => (
              <div key={i} className="bg-surface-container-low p-4 rounded-xl flex items-center gap-3 border border-outline-variant/30">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-bold">+244 {phone}</span>
              </div>
            ))}
            {(establishment.contacts || []).length === 0 && <p className="col-span-full text-center text-on-surface-variant py-12">Nenhum contacto registado ainda.</p>}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <button 
              onClick={onNext}
              disabled={!establishment.customers || establishment.customers.length === 0}
              className={cn(
                "group w-full p-10 rounded-3xl shadow-2xl transition-all active:scale-[0.98] flex flex-col items-center justify-center gap-6 border-b-8",
                establishment.customers && establishment.customers.length > 0 
                  ? "bg-gradient-to-br from-primary to-primary/80 shadow-primary/30 border-primary-container" 
                  : "bg-surface-container-highest cursor-not-allowed border-transparent opacity-50"
              )}
            >
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center animate-pulse-subtle">
                <Bell className="text-white w-10 h-10 fill-current" />
              </div>
              <div className="text-center">
                <span className="text-white text-3xl font-black tracking-widest uppercase block">CHAMAR PRÓXIMO</span>
                <p className="text-white/80 text-sm font-bold mt-2">
                  {establishment.customers && establishment.customers.length > 0 
                    ? `Aguardando: ${establishment.customers[0].ticket_number}` 
                    : "Fila encerrada"}
                </p>
              </div>
            </button>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                 <h2 className="text-xl font-black tracking-tight uppercase text-on-surface-variant">Fila Atual</h2>
                 <span className="text-[10px] font-bold px-2 py-1 bg-surface-container rounded-full">{(establishment.customers || []).length} pessoas</span>
              </div>
              <AnimatePresence mode="popLayout">
                {(establishment.customers || []).map((c, i) => (
                  <motion.div 
                    key={c.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    className={cn(
                      "bg-surface-container-lowest p-6 rounded-2xl flex items-center justify-between border-2 transition-all",
                      c.status === "called" ? "border-primary shadow-lg shadow-primary/5" : "border-outline-variant/30"
                    )}
                  >
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "w-14 h-14 rounded-xl flex flex-col items-center justify-center font-black transition-all shadow-sm",
                        c.status === "called" ? "bg-primary text-white scale-110" : "bg-surface-container-high text-on-surface-variant"
                      )}>
                        <span className="text-xs opacity-60 leading-none mb-1">Ticket</span>
                        <span className="text-lg leading-none">{c.ticket_number.split('-').pop()}</span>
                      </div>
                      <div>
                        <p className="text-lg font-black text-on-surface">+244 {c.phone}</p>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                             {i + 1}º na Fila
                           </span>
                           <div className="w-1 h-1 bg-outline-variant rounded-full"></div>
                           <span className="text-[10px] font-bold text-primary uppercase">
                             Ativo agora
                           </span>
                        </div>
                      </div>
                    </div>
                    <div className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest", 
                      c.status === "called" ? "bg-primary text-white animate-pulse" : "bg-surface-container-high text-on-surface-variant"
                    )}>
                      {c.status === "called" ? "No Guichê" : "Aguardando"}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-6">
             <Card className="bg-primary text-white border-none shadow-primary/20">
                <span className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em] mb-2 block">Sendo Atendido</span>
                {currentCustomer ? (
                  <div className="space-y-4">
                     <h3 className="text-5xl font-black">{currentCustomer.ticket_number.split('-').pop()}</h3>
                     <p className="text-sm font-bold opacity-80">+244 {currentCustomer.phone}</p>
                  </div>
                ) : (
                  <p className="text-xl font-bold opacity-40">Nenhum chamado</p>
                )}
             </Card>
          </div>
        </div>
      )}

      {/* QR Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-on-surface/90 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setShowQR(false)}
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[40px] p-12 max-w-sm w-full text-center space-y-8 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="space-y-2">
                <span className="text-primary text-[10px] font-black uppercase tracking-widest">Escaneie para entrar</span>
                <h2 className="text-3xl font-black tracking-tight">{establishment.name}</h2>
              </div>
              <div className="bg-surface-container-low p-8 rounded-[32px] inline-block shadow-inner border-4 border-surface">
                <QRCodeSVG value={`${window.location.origin}?est=${establishment.code}`} size={200} includeMargin={false} />
              </div>
              <button onClick={() => setShowQR(false)} className="bg-on-surface text-white w-full py-4 rounded-2xl font-bold">Fechar</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CustomerView = ({ establishment, onJoin, onLeave }: { establishment: Establishment, onJoin: (phone: string) => void, onLeave: (id: string) => void }) => {
  const [phone, setPhone] = useState("");
  const [myCustomer, setMyCustomer] = useState<Customer | null>(null);

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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg mx-auto space-y-8 py-8 px-6">
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-black tracking-tight">{establishment.name}</h1>
        </div>

        <div className="bg-surface-container-lowest rounded-[40px] p-10 flex flex-col items-center justify-center relative overflow-hidden shadow-ambient border-2 border-outline-variant/10">
          <div className="relative w-56 h-56 flex items-center justify-center mb-8">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle className="text-surface-container-high" cx="112" cy="112" fill="transparent" r="100" stroke="currentColor" strokeWidth="12" />
              <motion.circle 
                initial={{ strokeDashoffset: 628 }}
                animate={{ strokeDashoffset: isCalled ? 0 : 628 - (628 * (1 / (position || 1))) }}
                className={isCalled ? "text-green-500" : "text-primary"} cx="112" cy="112" fill="transparent" r="100" stroke="currentColor" strokeDasharray="628" strokeLinecap="round" strokeWidth="12" 
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="flex flex-col items-center justify-center text-center px-4">
              <span className={cn("text-6xl font-black tracking-tighter leading-none mb-2 transition-colors", isCalled ? "text-green-600" : "text-primary")}>
                {myCustomer.ticket_number.split('-').pop()}
              </span>
              <span className="text-[10px] font-black text-on-surface-variant tracking-[0.2em] uppercase">Ticket</span>
            </div>
          </div>
          <div className="text-center space-y-4">
               <h3 className="text-2xl font-black">{isCalled ? "Sua vez chegou!" : `Posição: ${position}º`}</h3>
               <p className={cn("font-bold text-sm", isCalled ? "text-green-600" : "text-on-surface-variant")}>
                 {isCalled ? "Por favor, dirija-se ao balcão agora." : `Aproximadamente ~${position * 5} min de espera.`}
               </p>
          </div>
        </div>

        <button onClick={() => { onLeave(myCustomer.id); localStorage.removeItem(`kwikfilas_phone_${establishment.code}`); }} className="w-full text-on-surface-variant font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:text-red-500 transition-colors">
          <LogOut className="w-3 h-3" /> Cancelar Vez
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-lg mx-auto py-8 px-6 flex flex-col items-center">
      <div className="w-full mb-12 text-center">
        <h1 className="text-5xl font-black tracking-tighter mb-4">Entrar na Fila</h1>
        <p className="text-on-surface-variant text-lg font-medium leading-relaxed">Simplifique seu atendimento. Digite seu número.</p>
      </div>

      <div className="w-full bg-surface-container-lowest rounded-[40px] p-10 shadow-ambient relative overflow-hidden border-2 border-outline-variant/10">
        <form onSubmit={handleJoin} className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center bg-surface-container-low rounded-2xl p-1 border-2 border-transparent focus-within:border-primary/20 focus-within:bg-white shadow-inner">
              <div className="flex items-center gap-2 px-5 py-4 border-r border-outline-variant/30">
                <span className="font-black text-on-surface-variant text-lg">+244</span>
              </div>
              <input value={phone} onChange={e => setPhone(e.target.value)} className="flex-grow bg-transparent border-none focus:ring-0 text-2xl font-black px-6 py-4" placeholder="9xx xxx xxx" type="tel" required />
            </div>
          </div>
          <button type="submit" className="w-full bg-on-surface text-white py-6 rounded-3xl text-xl font-black shadow-2xl flex items-center justify-center gap-4 hover:bg-primary transition-all active:scale-[0.98]">
            ENTRAR AGORA <ArrowRight className="w-6 h-6" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<"landing" | "customer" | "admin" | "superadmin">("landing");
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [selectedEst, setSelectedEst] = useState<Establishment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/establishments");
      const data = await res.json();
      setEstablishments(Array.isArray(data) ? data : []);
      if (selectedEst) {
        const updated = (data || []).find((e: Establishment) => e.code === selectedEst.code);
        if (updated) setSelectedEst(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [selectedEst?.code]);

  const handleJoin = async (phone: string) => {
    if (!selectedEst) return;
    try {
      const res = await fetch("/api/queue/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, estCode: selectedEst.code }),
      });
      if (res.ok) fetchData();
      else {
        const data = await res.json();
        setError(data.error);
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) { console.error(err); }
  };

  const handleLeave = async (id: string) => {
    try {
      await fetch("/api/queue/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleNext = async () => {
    if (!selectedEst) return;
    try {
      await fetch(`/api/establishments/${selectedEst.code}/next`, { method: "POST" });
      fetchData();
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-surface pb-24">
      <Header onLogoClick={() => { setView("landing"); setSelectedEst(null); }} />
      
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -20 }} className="fixed top-20 left-0 right-0 z-[100] flex justify-center px-6 pointer-events-none">
            <div className="bg-red-500 text-white p-5 rounded-2xl shadow-xl flex items-center gap-4 pointer-events-auto">
              <span className="text-sm font-black uppercase">{error}</span>
              <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-24 min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {view === "landing" && (
            <motion.div key="landing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-xl mx-auto py-12 px-6 w-full space-y-12 text-center">
                <h1 className="text-7xl font-black tracking-tighter text-on-surface">Kwik<span className="text-primary">Filas</span></h1>
                <div className="grid gap-3">
                  <button onClick={() => setView("customer")} className="flex items-center gap-5 p-2 bg-surface-container-low rounded-[32px] hover:bg-white transition-all group">
                    <div className="w-16 h-16 bg-primary text-white rounded-[26px] flex items-center justify-center shadow-lg"><Users className="w-7 h-7" /></div>
                    <div className="text-left"><h3 className="font-black text-xl">Sou Cliente</h3><p className="text-xs font-bold text-on-surface-variant uppercase">Entrar numa fila</p></div>
                  </button>
                  <button onClick={() => setView("admin")} className="flex items-center gap-5 p-2 bg-surface-container-low rounded-[32px] hover:bg-white transition-all group">
                    <div className="w-16 h-16 bg-on-surface text-white rounded-[26px] flex items-center justify-center shadow-lg"><LayoutDashboard className="w-7 h-7" /></div>
                    <div className="text-left"><h3 className="font-black text-xl text-on-surface">Painel Admin</h3><p className="text-xs font-bold text-on-surface-variant uppercase">Gerir meu local</p></div>
                  </button>
              </div>
              <button onClick={() => setView("superadmin")} className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40 hover:text-primary">Master Console</button>
            </motion.div>
          )}

          {view === "superadmin" && <SuperAdminView key="superadmin" establishments={establishments} onCreate={async (name, initials) => {
            await fetch("/api/admin/establishments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, initials }) });
            fetchData();
          }} />}

          {view === "admin" && !selectedEst && (
            <motion.div key="admin-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto py-12 px-6 w-full space-y-8">
              <h2 className="text-4xl font-black tracking-tight text-center">Qual o seu Local?</h2>
              <div className="grid gap-3">
                {establishments.map(est => (
                  <button key={est.id} onClick={() => setSelectedEst(est)} className="w-full bg-white p-6 rounded-[28px] border-2 border-outline-variant/30 flex justify-between items-center hover:border-primary transition-all">
                    <div className="flex items-center gap-4 text-left">
                       <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center font-black">{est.initials}</div>
                       <div><span className="font-black text-xl block leading-none">{est.name}</span><span className="text-[10px] font-bold text-on-surface-variant uppercase">{est.code}</span></div>
                    </div>
                    <ChevronRight />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {view === "admin" && selectedEst && <EstablishmentAdminView key="admin-dashboard" establishment={selectedEst} onNext={handleNext} />}

          {view === "customer" && !selectedEst && (
            <motion.div key="customer-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto py-12 px-6 w-full space-y-8">
              <h2 className="text-4xl font-black tracking-tight text-center">Onde você está?</h2>
              <div className="grid gap-3">
                {establishments.map(est => (
                  <button key={est.id} onClick={() => setSelectedEst(est)} className="w-full bg-white p-2 pr-6 rounded-[32px] border-2 border-outline-variant/30 flex items-center gap-5 hover:border-primary transition-all group">
                    <div className="w-16 h-16 bg-surface-container text-on-surface rounded-[26px] flex items-center justify-center font-black text-xl group-hover:bg-primary group-hover:text-white transition-all">{est.initials}</div>
                    <div className="text-left flex-grow"><h3 className="font-black text-xl leading-none">{est.name}</h3><span className="text-[9px] font-black tracking-widest text-on-surface-variant uppercase">{est.customers?.length || 0} pessoas esperando</span></div>
                    <ChevronRight />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {view === "customer" && selectedEst && <CustomerView key="customer-status" establishment={selectedEst} onJoin={handleJoin} onLeave={handleLeave} />}
        </AnimatePresence>
      </main>
    </div>
  );
}
