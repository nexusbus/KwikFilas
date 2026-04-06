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
  ChevronLeft,
  Mail,
  Lock,
  Clock,
  Image as ImageIcon,
  Building
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
        <Smartphone className="w-3 h-3" /> Painel Parceiro
      </button>
    </div>
  </header>
);

const Footer = () => (
  <footer className="py-12 mt-auto text-center space-y-4">
    <div className="flex items-center justify-center gap-2 mb-6">
       <div className="h-px w-8 bg-[#2563EB]/20"></div>
       <span className="text-[9px] font-bold text-[#2563EB] uppercase tracking-[0.4em]">Premium Queue System</span>
       <div className="h-px w-8 bg-[#2563EB]/20"></div>
    </div>
    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
      © 2026 <span className="text-[#2563EB]">KwikFilas Angola.</span>
    </p>
  </footer>
);

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="space-y-1 text-center w-full mb-8">
    <h2 className="text-2xl font-black tracking-tight text-on-surface">{title}</h2>
    {subtitle && <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">{subtitle}</p>}
  </div>
);

// --- Components Centered Layout ---

const FormContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-sm mx-auto flex flex-col items-center">
    {children}
  </div>
);

// --- SuperAdminView: Registration Form ---

const SuperAdminView = ({ establishments, onCreate, onBack }: { establishments: Establishment[], onCreate: (data: any) => void, onBack: () => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    initials: "",
    nif: "",
    admin_email: "",
    admin_password: "",
    opening_hours: "Segunda a Sexta: 08:00 - 18:00",
    product_photos: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      ...formData,
      product_photos: formData.product_photos.split(",").map(p => p.trim())
    });
    setFormData({ name: "", initials: "", nif: "", admin_email: "", admin_password: "", opening_hours: "", product_photos: "" });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full pb-20">
      <FormContainer>
        <button onClick={onBack} className="self-start flex items-center gap-2 text-[10px] font-bold uppercase text-primary mb-8 hover:opacity-70"><ChevronLeft className="w-3 h-3" /> Dashboard Admin</button>
        <SectionHeader title="Novo Registro" subtitle="Cadastrar Parceiro" />

        <div className="card-main w-full space-y-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Secção 1: Identidade */}
            <div className="space-y-3">
              <span className="text-[9px] font-black uppercase tracking-widest opacity-30 px-1">Identidade do Negócio</span>
              <div className="flex bg-surface-variant rounded-2xl border border-outline/30 focus-within:ring-2 focus-within:ring-primary/10 overflow-hidden items-center px-4">
                 <Building className="w-4 h-4 text-primary/40 mr-2" />
                 <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="flex-grow bg-transparent p-4 text-sm font-bold border-none outline-none" placeholder="Nome do Estabelecimento" required />
              </div>
              <div className="flex gap-2">
                <input value={formData.initials} onChange={e => setFormData({...formData, initials: e.target.value.toUpperCase()})} className="flex-grow bg-surface-variant p-4 rounded-2xl text-sm font-bold border-none outline-none" placeholder="Sigla (EX: KF)" maxLength={3} required />
                <input value={formData.nif} onChange={e => setFormData({...formData, nif: e.target.value})} className="flex-grow bg-surface-variant p-4 rounded-2xl text-sm font-bold border-none outline-none" placeholder="NIF" required />
              </div>
            </div>

            {/* Secção 2: Acesso */}
            <div className="space-y-3">
              <span className="text-[9px] font-black uppercase tracking-widest opacity-30 px-1">Credenciais de Acesso</span>
              <div className="flex bg-surface-variant rounded-2xl border border-outline/30 focus-within:ring-2 focus-within:ring-primary/10 overflow-hidden items-center px-4">
                 <Mail className="w-4 h-4 text-primary/40 mr-2" />
                 <input value={formData.admin_email} onChange={e => setFormData({...formData, admin_email: e.target.value})} className="flex-grow bg-transparent p-4 text-sm font-bold border-none outline-none" placeholder="Email do Parceiro" type="email" required />
              </div>
              <div className="flex bg-surface-variant rounded-2xl border border-outline/30 focus-within:ring-2 focus-within:ring-primary/10 overflow-hidden items-center px-4">
                 <Lock className="w-4 h-4 text-primary/40 mr-2" />
                 <input value={formData.admin_password} onChange={e => setFormData({...formData, admin_password: e.target.value})} className="flex-grow bg-transparent p-4 text-sm font-bold border-none outline-none" placeholder="Senha do Parceiro" type="password" required />
              </div>
            </div>

            {/* Secção 3: Operação */}
            <div className="space-y-3">
              <span className="text-[9px] font-black uppercase tracking-widest opacity-30 px-1">Horário & Fotos</span>
              <div className="flex bg-surface-variant rounded-2xl border border-outline/30 focus-within:ring-2 focus-within:ring-primary/10 overflow-hidden items-center px-4">
                 <Clock className="w-4 h-4 text-primary/40 mr-2" />
                 <input value={formData.opening_hours} onChange={e => setFormData({...formData, opening_hours: e.target.value})} className="flex-grow bg-transparent p-4 text-sm font-bold border-none outline-none" placeholder="Días de Semana: 08:00 - 18:00" required />
              </div>
              <div className="flex bg-surface-variant rounded-2xl border border-outline/30 focus-within:ring-2 focus-within:ring-primary/10 overflow-hidden items-start px-4">
                 <ImageIcon className="w-4 h-4 text-primary/40 mr-2 mt-4" />
                 <textarea value={formData.product_photos} onChange={e => setFormData({...formData, product_photos: e.target.value})} className="flex-grow bg-transparent p-4 text-[10px] font-bold border-none outline-none min-h-[80px]" placeholder="URLs das Fotos (Separadas por vírgula)" />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary py-5 mt-4">FINALIZAR CADASTRO</button>
          </form>
        </div>

        {/* Listagem */}
        <div className="w-full mt-12 space-y-3">
           <span className="text-[10px] font-black uppercase text-on-surface-variant/40 tracking-[0.2em] px-2 block">Parceiros Ativos</span>
           {establishments.map(est => (
             <div key={est.id} className="w-full bg-white p-4 rounded-3xl border border-outline/40 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center font-black text-xs">{est.initials}</div>
                   <div><h4 className="font-bold text-sm leading-none mb-1">{est.name}</h4><p className="text-[9px] font-bold opacity-30 uppercase">{est.nif || 'Sem NIF'}</p></div>
                </div>
                <div className="group active:scale-95 transition-all"><ChevronRight className="w-4 h-4 text-outline" /></div>
             </div>
           ))}
        </div>
      </FormContainer>
    </motion.div>
  );
};

// --- EstablishmentAdminView: Partner Console with QR ---

const EstablishmentAdminView = ({ establishment, onNext, onBack }: { establishment: Establishment, onNext: () => void, onBack: () => void }) => {
  const currentCustomer = (establishment.customers || []).find(c => c.status === "called");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20">
      <FormContainer>
        <button onClick={onBack} className="self-start flex items-center gap-1.5 text-[10px] font-bold uppercase text-on-surface-variant hover:text-primary mb-8 active:scale-95 transition-all"><ChevronLeft className="w-3 h-3" /> Canais Parceiros</button>
        <SectionHeader title={establishment.name} subtitle="Painel de Verificação" />

        <div className="space-y-6 w-full px-4">
           {/* QR Centralized & Verifiable */}
           <div className="bg-white p-10 rounded-[48px] shadow-elevated border border-outline/30 flex flex-col items-center gap-8">
              <div className="p-4 bg-white border border-outline/50 rounded-[40px] shadow-sm">
                 <QRCodeSVG value={`https://kwikfilas.vercel.app/?est=${establishment.code}`} size={200} />
              </div>
              <div className="text-center space-y-2">
                 <h3 className="text-base font-black uppercase tracking-widest text-primary">QR Code Único</h3>
                 <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-50 px-6">Posicione este QR em local visível para os seus clientes.</p>
              </div>
           </div>

           {/* Centralized Action Button */}
           <button 
             onClick={onNext}
             disabled={!establishment.customers || establishment.customers.length === 0}
             className="w-full bg-primary text-white p-10 rounded-[40px] shadow-elevated flex flex-col items-center justify-center gap-6 group hover:brightness-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
           >
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center animate-pulse-subtle"><Bell className="w-7 h-7 fill-white" /></div>
              <div className="text-center">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 leading-none">Notificar Próximo</span>
                 <h2 className="text-3xl font-black mt-2">CHAMAR AGORA</h2>
              </div>
           </button>

           {/* Stats Centralized */}
           <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-variant p-6 rounded-[32px] text-center border border-outline/20">
                 <span className="text-[9px] font-black uppercase opacity-40 block mb-1">Na Fila</span>
                 <span className="text-2xl font-black text-on-surface">{(establishment.customers || []).length}</span>
              </div>
              <div className="bg-primary/5 p-6 rounded-[32px] text-center border border-primary/10">
                 <span className="text-[9px] font-black uppercase text-primary opacity-60 block mb-1">Último Chamado</span>
                 <span className="text-2xl font-black text-primary">{currentCustomer ? currentCustomer.ticket_number.split('-').pop() : '--'}</span>
              </div>
           </div>
        </div>
      </FormContainer>
    </motion.div>
  );
};

// --- Customer View: Registration ---

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
      <FormContainer>
        <div className="py-12 space-y-12">
          <SectionHeader title={establishment.name} subtitle="Sua Posição" />
          <div className="bg-white rounded-[64px] p-12 shadow-elevated border border-outline/30 flex flex-col items-center gap-10">
             <div className="relative w-48 h-48 flex items-center justify-center">
                <div className={cn("absolute inset-0 rounded-full border-4 border-dashed", isCalled ? "border-green-500 animate-spin-slow" : "border-primary/20 animate-spin-slow-reverse")}></div>
                <div className="text-center pt-2">
                   <span className="text-[10px] font-black uppercase text-on-surface-variant tracking-[0.4em] block opacity-40">Ticket</span>
                   <span className={cn("text-7xl font-black tracking-tighter leading-none", isCalled ? "text-green-600" : "text-primary")}>
                     {myCustomer.ticket_number.split('-').pop()}
                   </span>
                </div>
             </div>
             <div className="text-center space-y-2">
                <h3 className="text-3xl font-black">{isCalled ? "SEU TURNO!" : `${position}º Lugar`}</h3>
                <p className="text-[10px] font-black uppercase text-on-surface-variant opacity-50 tracking-widest leading-6">
                  {isCalled ? "DIRIJA-SE AO LOCAL IMEDIATAMENTE." : "A SUA VEZ ESTÁ QUASE A CHEGAR. POR FAVOR AGUARDE NO LOCAL."}
                </p>
             </div>
          </div>
          <button onClick={() => { onLeave(myCustomer.id); localStorage.removeItem(`kwikfilas_phone_${establishment.code}`); }} className="flex mx-auto items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40 hover:text-red-500 transition-all"><LogOut className="w-3 h-3" /> Abandonar Fila</button>
        </div>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <div className="py-20 space-y-16">
        <div className="text-center space-y-8">
           <div className="w-20 h-20 bg-primary/5 rounded-[32px] flex items-center justify-center mx-auto shadow-inner animate-pulse-subtle">
              <Store className="text-primary w-10 h-10" />
           </div>
           <h1 className="text-5xl font-black tracking-tighter text-on-surface leading-none">{establishment.name}</h1>
           <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.4em] opacity-40">Fila Digital Premium</p>
        </div>

        {step === "welcome" ? (
          <div className="space-y-4 w-full px-6">
            <button onClick={() => setStep("input")} className="w-full btn-primary py-8 text-base shadow-elevated">ENTRAR NA FILA AGORA</button>
            <p className="text-[9px] font-bold text-center text-on-surface-variant opacity-30 px-8 uppercase leading-relaxed tracking-wider">Iremos notificá-lo via SMS assim que chegar a sua vez.</p>
          </div>
        ) : (
          <div className="card-main w-full space-y-8">
             <div className="flex items-center gap-4 border-b border-outline/30 pb-6 mb-4">
                <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center"><PhoneIcon className="w-5 h-5" /></div>
                <div className="text-left"><h3 className="font-black text-sm uppercase tracking-widest text-on-surface leading-none mb-1">Seu Telemóvel</h3><span className="text-[9px] font-bold text-primary/50 uppercase tracking-widest">Acesso SMS</span></div>
             </div>
             <form onSubmit={handleJoin} className="space-y-6">
                <div className="flex bg-surface-variant p-2 rounded-2xl border border-outline/30 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                  <div className="px-5 py-4 border-r border-outline/30 font-black text-slate-400">AO <span className="text-on-surface ml-1">+244</span></div>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="flex-grow bg-transparent p-4 text-xl font-bold border-none outline-none" placeholder="9XX XXX XXX" type="tel" required autoFocus />
                </div>
                <button type="submit" className="w-full btn-primary py-6 flex items-center justify-center gap-3">GERAR TICKET <CheckCircle2 className="w-4 h-4" /></button>
             </form>
          </div>
        )}
      </div>
    </FormContainer>
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

  const handleCreate = async (data: any) => {
    await fetch("/api/admin/establishments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchData();
  };

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20 overflow-x-hidden">
      <style>{`
        :root { --primary: #2563EB; --on-surface: #0F172A; --surface-variant: #F1F5F9; }
        body { background-color: #ffffff; color: #0F172A; }
        .btn-primary { background-color: #2563EB !important; color: #ffffff !important; }
        .text-primary { color: #2563EB !important; }
        .bg-primary { background-color: #2563EB !important; }
        .border-primary { border-color: #2563EB !important; }
        input, textarea { caret-color: #2563EB; }
      `}</style>
      
      <Header onLogoClick={() => { setView("landing"); setSelectedEst(null); }} onAdminClick={() => { setView("admin"); setSelectedEst(null); }} />
      
      <main className="pt-24 min-h-screen w-full">
        <AnimatePresence mode="wait">
          {view === "landing" && (
            <motion.div key="landing" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="pt-24 space-y-16 flex flex-col items-center">
                <FormContainer>
                  <KLogo className="w-20 h-20 mb-8 animate-pulse-subtle" />
                  <h1 className="text-5xl font-black tracking-tighter text-on-surface text-center leading-none">Gestão de filas<br/><span className="text-primary tracking-normal">sem stress.</span></h1>
                  <p className="text-[10px] font-black uppercase text-on-surface-variant/40 tracking-[0.4em] mt-6 px-10 text-center leading-relaxed">Experiência premium para o mercado de luanda.</p>
                  
                  <div className="grid grid-cols-1 gap-3 w-full max-w-[280px] mt-20 px-6">
                     <button onClick={() => setView("customer")} className="btn-primary py-7 text-sm flex items-center justify-center gap-4">SOU CLIENTE <ArrowRight className="w-4 h-4" /></button>
                     <button onClick={() => setView("admin")} className="btn-outline py-7 text-sm">PAINEL ADMIN</button>
                  </div>
                </FormContainer>
            </motion.div>
          )}

          {view === "customer" && !selectedEst && (
            <FormContainer>
               <div className="pt-12 px-6 w-full space-y-10">
                  <SectionHeader title="Onde você está?" subtitle="Selecione o Local" />
                  <div className="grid gap-3">
                    {establishments.map(est => (
                      <button key={est.id} onClick={() => setSelectedEst(est)} className="w-full bg-white p-5 pr-8 rounded-[36px] border border-outline/40 flex items-center gap-6 hover:border-primary active:bg-surface-variant transition-all group">
                        <div className="w-14 h-14 bg-surface-variant rounded-[24px] flex items-center justify-center font-black text-xl group-hover:bg-primary group-hover:text-white transition-all">{est.initials}</div>
                        <div className="flex-grow text-left leading-none"><h3 className="font-bold text-lg mb-1">{est.name}</h3><span className="text-[9px] font-black tracking-widest text-on-surface-variant/40 uppercase">{est.customers?.length || 0} na fila agora</span></div>
                        <ChevronRight className="w-4 h-4 text-outline/40 group-hover:text-primary" />
                      </button>
                    ))}
                  </div>
               </div>
            </FormContainer>
          )}

          {view === "customer" && selectedEst && <CustomerView establishment={selectedEst} onJoin={handleJoin} onLeave={handleLeave} />}

          {view === "admin" && (
            <FormContainer>
               <div className="pt-12 px-6 w-full space-y-10 text-center">
                  <SectionHeader title="Canais Parceiros" subtitle="Seleção de Gestão" />
                  <div className="grid gap-3 w-full">
                    {establishments.map(est => (
                      <button key={est.id} onClick={() => { setSelectedEst(est); setView("superadmin"); }} className="p-6 bg-surface-variant rounded-[36px] border border-outline/20 hover:border-primary active:bg-white transition-all flex justify-between items-center group">
                        <div className="text-left leading-none">
                          <span className="text-[8px] font-black uppercase tracking-widest text-primary mb-2 block opacity-60">{est.code}</span>
                          <h3 className="text-lg font-bold text-on-surface">{est.name}</h3>
                        </div>
                        <LayoutDashboard className="w-5 h-5 text-outline/40 group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                    <button onClick={() => { setView("superadmin"); setSelectedEst(null); }} className="mt-12 text-[10px] font-black uppercase tracking-[0.4em] text-primary hover:opacity-100 opacity-30 active:scale-95 transition-all">+ Master Console</button>
                  </div>
               </div>
            </FormContainer>
          )}

          {view === "superadmin" && !selectedEst && <SuperAdminView establishments={establishments} onBack={() => setView("admin")} onCreate={handleCreate} />}
          {view === "superadmin" && selectedEst && <EstablishmentAdminView establishment={selectedEst} onBack={() => { setView("admin"); setSelectedEst(null); }} onNext={handleNext} />}
        </AnimatePresence>
      </main>
      
      {!loading && <Footer />}
    </div>
  );
}
