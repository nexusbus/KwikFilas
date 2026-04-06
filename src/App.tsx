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
  Building,
  Upload
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
  <header className="fixed top-0 left-0 w-full z-[100] bg-white/95 backdrop-blur-xl border-b border-outline/30 px-6 h-14 flex items-center justify-between">
    <button onClick={onLogoClick} className="flex items-center gap-2 group active:scale-95 transition-all">
       <KLogo className="w-5 h-5 group-hover:scale-105" />
       <span className="text-sm font-bold text-on-surface tracking-tighter">Kwik<span className="text-primary">Filas</span></span>
    </button>
    <div className="flex items-center gap-2">
      <button onClick={onAdminClick} className="text-[8px] font-bold uppercase tracking-widest border border-outline px-3 py-1.5 rounded-lg bg-surface-variant/50 hover:bg-white active:scale-95 transition-all flex items-center gap-1.5 shrink-0">
        <Smartphone className="w-2.5 h-2.5" /> Parceiros
      </button>
    </div>
  </header>
);

const Footer = () => (
  <footer className="py-12 mt-auto text-center space-y-4">
    <div className="flex items-center justify-center gap-2 mb-6">
       <div className="h-px w-8 bg-[#2563EB]/10"></div>
       <span className="text-[8px] font-bold text-[#2563EB] uppercase tracking-[0.4em]">Premium Queue System</span>
       <div className="h-px w-8 bg-[#2563EB]/10"></div>
    </div>
    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">
      © 2026 <span className="text-[#2563EB]">KwikFilas Angola.</span>
    </p>
  </footer>
);

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="space-y-1.5 text-center w-full mb-8">
    <h2 className="text-2xl font-black tracking-tight text-on-surface uppercase">{title}</h2>
    {subtitle && <p className="text-[9px] font-bold text-primary uppercase tracking-[0.3em] leading-none">{subtitle}</p>}
  </div>
);

// --- Layout Tools: Strict Row Column ---

const ContentWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-sm mx-auto flex flex-col items-center px-4">
    {children}
  </div>
);

const BaseInput = ({ icon: Icon, ...props }: any) => (
  <div className="w-full bg-surface-variant rounded-2xl border border-outline/30 focus-within:ring-2 focus-within:ring-primary/10 transition-all flex items-center px-4 h-14 overflow-hidden mb-3">
    {Icon && <Icon className="w-4 h-4 text-primary/40 mr-2 shrink-0" />}
    <input {...props} className="flex-grow bg-transparent text-[16px] font-bold border-none outline-none placeholder:text-slate-300" />
  </div>
);

// --- SuperAdminView: Strict Column Form ---

const SuperAdminView = ({ establishments, onCreate, onBack }: { establishments: Establishment[], onCreate: (data: any) => void, onBack: () => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    initials: "",
    nif: "",
    admin_email: "",
    admin_password: "",
    opening_hours: "Segunda a Sexta: 08:00 - 18:00",
    product_photos: "",
    logo_url: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      ...formData,
      initials: formData.initials.toUpperCase(),
      product_photos: formData.product_photos.split(",").map(p => p.trim())
    });
    setFormData({ name: "", initials: "", nif: "", admin_email: "", admin_password: "", opening_hours: "", product_photos: "", logo_url: "" });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full pb-20">
      <ContentWrapper>
        <button onClick={onBack} className="self-start flex items-center gap-1.5 text-[9px] font-black uppercase text-primary mb-6 hover:opacity-70 group transition-all"><ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5" /> Voltar</button>
        <SectionHeader title="Registro de Canal" subtitle="Novos Parceiros" />

        <div className="card-main w-full space-y-6">
          <form onSubmit={handleSubmit} className="space-y-1">
            <span className="text-[8px] font-black uppercase tracking-widest text-[#2563EB] block mb-3 px-1 text-center opacity-40">Configuração do Painel</span>
            
            <BaseInput icon={Building} value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} placeholder="Nome Profissional" required />
            <BaseInput icon={Store} value={formData.initials} onChange={(e: any) => setFormData({...formData, initials: e.target.value.toUpperCase()})} placeholder="Sigla do Local (Ex: KFC)" maxLength={3} required />
            <BaseInput icon={History} value={formData.nif} onChange={(e: any) => setFormData({...formData, nif: e.target.value})} placeholder="NIF da Empresa" required />
            
            <BaseInput icon={Mail} value={formData.admin_email} onChange={(e: any) => setFormData({...formData, admin_email: e.target.value})} placeholder="Email Corporativo" type="email" required />
            <BaseInput icon={Lock} value={formData.admin_password} onChange={(e: any) => setFormData({...formData, admin_password: e.target.value})} placeholder="Senha de Acesso" type="password" required />
            
            <BaseInput icon={Clock} value={formData.opening_hours} onChange={(e: any) => setFormData({...formData, opening_hours: e.target.value})} placeholder="Días Úteis: 08:00 - 18:00" required />
            <BaseInput icon={ImageIcon} value={formData.product_photos} onChange={(e: any) => setFormData({...formData, product_photos: e.target.value})} placeholder="URLs de Produtos (Vírgulas)" />
            <BaseInput icon={Upload} value={formData.logo_url} onChange={(e: any) => setFormData({...formData, logo_url: e.target.value})} placeholder="URL do Logotipo/Marca" />

            <button type="submit" className="w-full btn-primary py-5 mt-6 tracking-[0.2em] shadow-elevated">FINALIZAR E PUBLICAR</button>
          </form>
        </div>

        <div className="w-full mt-10 space-y-2">
           <span className="text-[9px] font-black uppercase text-on-surface-variant/30 tracking-widest text-center block mb-4">Gerenciar Portfólio</span>
           {establishments.map(est => (
             <div key={est.id} className="w-full bg-white/50 p-4 rounded-2xl border border-outline/20 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-surface-variant rounded-xl flex items-center justify-center overflow-hidden border border-outline/20 shadow-inner">
                      {est.logo_url ? <img src={est.logo_url} className="w-full h-full object-cover" /> : <span className="text-primary font-black text-xs">{est.initials}</span>}
                   </div>
                   <div><h4 className="font-bold text-sm text-on-surface leading-tight mb-0.5">{est.name}</h4><p className="text-[9px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">{est.code}</p></div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-outline" />
             </div>
           ))}
        </div>
      </ContentWrapper>
    </motion.div>
  );
};

// --- EstablishmentAdminView: QR Verifiable Center ---

const EstablishmentAdminView = ({ establishment, onNext, onBack }: { establishment: Establishment, onNext: () => void, onBack: () => void }) => {
  const currentCustomer = (establishment.customers || []).find(c => c.status === "called");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20 w-full">
      <ContentWrapper>
        <button onClick={onBack} className="self-start flex items-center gap-1.5 text-[9px] font-black uppercase text-on-surface-variant/50 hover:text-primary mb-8 active:scale-95 transition-all"><ChevronLeft className="w-3 h-3 shrink-0" /> Gestão</button>
        <SectionHeader title={establishment.name} subtitle="Verificação de QR Único" />

        <div className="space-y-6 w-full flex flex-col items-center">
           <div className="bg-white p-8 rounded-[48px] shadow-ambient border border-outline/30 flex flex-col items-center gap-8 w-full">
              <div className="w-full aspect-square bg-white border border-outline/40 rounded-[40px] shadow-inner p-5 flex items-center justify-center">
                 <QRCodeSVG value={`https://kwikfilas.vercel.app/?est=${establishment.code}`} size={200} className="w-full h-full" />
              </div>
              <div className="text-center space-y-1.5">
                 <h3 className="text-sm font-black uppercase tracking-widest text-[#2563EB]">Sincronização em Tempo Real</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60 leading-relaxed px-2">O cliente é identificado automaticamente ao escanear.</p>
              </div>
           </div>

           <button 
             onClick={onNext}
             disabled={!establishment.customers || establishment.customers.length === 0}
             className="w-full bg-primary text-white p-10 rounded-[48px] shadow-elevated flex flex-col items-center justify-center gap-6 group hover:brightness-110 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
           >
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center animate-pulse-subtle"><Bell className="w-7 h-7 fill-white" /></div>
              <div className="text-center">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80 leading-none">Notificar Chamado</span>
                 <h2 className="text-3xl font-black mt-2 tracking-tighter">PRÓXIMO</h2>
              </div>
           </button>

           <div className="grid grid-cols-2 gap-3 w-full">
              <div className="bg-surface-variant p-6 rounded-[32px] text-center border border-outline/30 shadow-inner">
                 <span className="text-[9px] font-black uppercase opacity-30 block mb-1 tracking-widest">Ativos</span>
                 <span className="text-2xl font-black text-on-surface">{(establishment.customers || []).length}</span>
              </div>
              <div className="bg-[#2563EB]/5 p-6 rounded-[32px] text-center border border-primary/10 shadow-inner">
                 <span className="text-[9px] font-black uppercase text-primary opacity-50 block mb-1 tracking-widest">Chamado</span>
                 <span className="text-2xl font-black text-primary">{currentCustomer ? currentCustomer.ticket_number.split('-').pop() : '--'}</span>
              </div>
           </div>
        </div>
      </ContentWrapper>
    </motion.div>
  );
};

// --- Customer View: Mobile Fixed ---

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
      <ContentWrapper>
        <div className="py-12 space-y-12 w-full">
          <SectionHeader title={establishment.name} subtitle="Status do Ticket" />
          <div className="bg-white rounded-[64px] p-12 shadow-elevated border border-outline/20 flex flex-col items-center gap-12 w-full">
             <div className="relative w-48 h-48 flex items-center justify-center">
                <div className={cn("absolute inset-0 rounded-full border-4 border-dashed", isCalled ? "border-green-500 animate-spin-slow" : "border-primary/20 animate-spin-slow-reverse")}></div>
                <div className="text-center pt-2">
                   <span className="text-[10px] font-black uppercase text-slate-300 tracking-[0.5em] block">ID</span>
                   <span className={cn("text-7xl font-black tracking-tighter leading-none transition-all", isCalled ? "text-green-600 scale-110" : "text-primary")}>
                     {myCustomer.ticket_number.split('-').pop()}
                   </span>
                </div>
             </div>
             <div className="text-center space-y-2">
                <h3 className="text-3xl font-black tracking-tighter">{isCalled ? "Sua Vez!" : `${position}º na Fila`}</h3>
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] px-4 leading-relaxed">
                  {isCalled ? "DIRIJA-SE AO LOCAL IMEDIATAMENTE PARA SER ATENDIDO." : "ACOMPANHE O SEU POSICIONAMENTO EM TEMPO REAL PELO SMARTPHONE."}
                </p>
             </div>
          </div>
          <button onClick={() => { onLeave(myCustomer.id); localStorage.removeItem(`kwikfilas_phone_${establishment.code}`); }} className="flex mx-auto items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E11D48] opacity-60 hover:opacity-100 transition-all active:scale-95"><X className="w-3 h-3" /> Cancelar Ticket</button>
        </div>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper>
      <div className="py-16 space-y-12 w-full text-center">
        <div className="space-y-6">
           <div className="w-20 h-20 bg-[#2563EB]/5 rounded-[32px] flex items-center justify-center mx-auto shadow-inner border border-[#2563EB]/5 overflow-hidden">
              {establishment.logo_url ? <img src={establishment.logo_url} className="w-full h-full object-cover" /> : <Store className="text-primary w-10 h-10" />}
           </div>
           <h1 className="text-4xl font-black tracking-tighter leading-none text-on-surface uppercase">{establishment.name}</h1>
           <p className="text-[9px] font-bold text-primary uppercase tracking-[0.4em] opacity-40">Fila Mobile Inteligente</p>
        </div>

        {step === "welcome" ? (
          <div className="space-y-6 px-4 w-full">
            <button onClick={() => setStep("input")} className="w-full btn-primary py-8 text-sm shadow-elevated">ENTRAR NA FILA</button>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed px-4">Utilizaremos o seu número apenas para notificações automáticas.</p>
          </div>
        ) : (
          <div className="card-main w-full space-y-8">
             <div className="text-center border-b border-outline/30 pb-6">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2">Login de Fila</span>
                <p className="text-sm font-bold text-on-surface">Introduza o seu número</p>
             </div>
             <form onSubmit={handleJoin} className="space-y-6">
                <div className="flex bg-surface-variant p-2 rounded-2xl border border-outline/30 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                  <div className="px-5 py-4 border-r border-outline/30 font-black text-slate-300">AO <span className="text-on-surface ml-1">+244</span></div>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="flex-grow bg-transparent p-4 text-xl font-bold border-none outline-none" placeholder="9XX XXX XXX" type="tel" required autoFocus />
                </div>
                <button type="submit" className="w-full btn-primary py-7 flex items-center justify-center gap-3">GERAR MEU TICKET <CheckCircle2 className="w-4 h-4" /></button>
             </form>
          </div>
        )}
      </div>
    </ContentWrapper>
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
    <div className="min-h-screen bg-white pb-20 overflow-x-hidden selection:bg-[#2563EB]/10">
      <style>{`
        :root { --primary: #2563EB; --on-surface: #0F172A; --surface-variant: #F1F5F9; }
        body { background-color: #ffffff; color: #0F172A; }
        .btn-primary { background-color: #2563EB !important; color: #ffffff !important; }
        .text-primary { color: #2563EB !important; }
        .bg-primary { background-color: #2563EB !important; }
        input, textarea { caret-color: #2563EB; }
      `}</style>
      
      <Header onLogoClick={() => { setView("landing"); setSelectedEst(null); }} onAdminClick={() => { setView("admin"); setSelectedEst(null); }} />
      
      <main className="pt-20 min-h-screen w-full relative overflow-hidden">
        <AnimatePresence mode="wait">
          {view === "landing" && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 space-y-16">
                <ContentWrapper>
                  <KLogo className="w-16 h-16 mb-8 animate-pulse-subtle" />
                  <h1 className="text-4xl font-black tracking-tighter text-on-surface text-center leading-none uppercase">KwikFilas<br/><span className="text-primary italic tracking-normal">Premium.</span></h1>
                  <p className="text-[9px] font-black uppercase text-slate-300 tracking-[0.5em] mt-8 text-center px-12 leading-relaxed">Infraestrutura Móvel para Controle de Fluxo.</p>
                  
                  <div className="flex flex-col gap-3 w-full mt-16">
                     <button onClick={() => setView("customer")} className="btn-primary py-7 flex items-center justify-center gap-4">SOU CLIENTE <ArrowRight className="w-4 h-4" /></button>
                     <button onClick={() => setView("admin")} className="btn-outline py-7">PAINEL ADMINISTRATIVO</button>
                  </div>
                </ContentWrapper>
            </motion.div>
          )}

          {view === "customer" && !selectedEst && (
            <ContentWrapper>
               <div className="pt-12 w-full space-y-10">
                  <SectionHeader title="Filiais" subtitle="Rede Parceira" />
                  <div className="flex flex-col gap-3 w-full">
                    {establishments.map(est => (
                      <button key={est.id} onClick={() => setSelectedEst(est)} className="w-full bg-white p-5 pr-8 rounded-[40px] border border-outline/30 flex items-center gap-5 hover:border-primary active:bg-surface-variant transition-all group">
                        <div className="w-14 h-14 bg-surface-variant rounded-[24px] flex items-center justify-center overflow-hidden border border-outline/20">
                          {est.logo_url ? <img src={est.logo_url} className="w-full h-full object-cover" /> : <span className="font-black text-primary text-xl">{est.initials}</span>}
                        </div>
                        <div className="flex-grow text-left leading-none"><h3 className="font-bold text-lg mb-1">{est.name}</h3><span className="text-[9px] font-black tracking-widest text-[#2563EB]/40 uppercase">{est.customers?.length || 0} Ativos</span></div>
                        <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-all" />
                      </button>
                    ))}
                  </div>
               </div>
            </ContentWrapper>
          )}

          {view === "customer" && selectedEst && <CustomerView establishment={selectedEst} onJoin={handleJoin} onLeave={handleLeave} />}

          {view === "admin" && (
            <ContentWrapper>
               <div className="pt-12 w-full space-y-10 text-center">
                  <SectionHeader title="Gestão" subtitle="Seleção de Parceiro" />
                  <div className="flex flex-col gap-3 w-full">
                    {establishments.map(est => (
                      <button key={est.id} onClick={() => { setSelectedEst(est); setView("superadmin"); }} className="p-6 bg-surface-variant rounded-[40px] border border-outline/20 hover:border-primary active:bg-white transition-all flex justify-between items-center group">
                        <div className="text-left leading-none">
                          <span className="text-[8px] font-bold uppercase tracking-widest text-primary/50 mb-2 block">{est.code}</span>
                          <h3 className="text-lg font-bold text-on-surface">{est.name}</h3>
                        </div>
                        <LayoutDashboard className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                    <button onClick={() => { setView("superadmin"); setSelectedEst(null); }} className="mt-12 text-[10px] font-black uppercase tracking-[0.4em] text-primary hover:opacity-100 opacity-20 active:scale-95 transition-all">+ Registro Global</button>
                  </div>
               </div>
            </ContentWrapper>
          )}

          {view === "superadmin" && !selectedEst && <SuperAdminView establishments={establishments} onBack={() => setView("admin")} onCreate={handleCreate} />}
          {view === "superadmin" && selectedEst && <EstablishmentAdminView establishment={selectedEst} onBack={() => { setView("admin"); setSelectedEst(null); }} onNext={handleNext} />}
        </AnimatePresence>
      </main>
      
      {!loading && <Footer />}
    </div>
  );
}
