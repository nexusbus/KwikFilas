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
  Upload,
  UserCheck,
  Search
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
  <header className="fixed top-0 left-0 w-full z-[100] bg-white/95 backdrop-blur-xl border-b border-outline/20 px-6 h-14 flex items-center justify-between">
    <button onClick={onLogoClick} className="flex items-center gap-2 group active:scale-95 transition-all">
       <KLogo className="w-5 h-5 group-hover:scale-105" />
       <span className="text-sm font-bold text-on-surface tracking-tighter">Kwik<span className="text-primary">Filas</span></span>
    </button>
    <div className="flex items-center gap-2">
      <button onClick={onAdminClick} className="text-[8px] font-bold uppercase tracking-widest border border-outline/40 px-3 py-1.5 rounded-lg bg-[#2563EB]/5 text-primary active:scale-95 transition-all flex items-center gap-1.5 shrink-0">
        <Smartphone className="w-2.5 h-2.5" /> Administração
      </button>
    </div>
  </header>
);

const Footer = () => (
  <footer className="py-12 mt-auto text-center space-y-4">
    <div className="flex items-center justify-center gap-2 mb-4">
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
  <div className="space-y-1 text-center w-full mb-8">
    <h2 className="text-2xl font-black tracking-tight text-on-surface uppercase opacity-90">{title}</h2>
    {subtitle && <p className="text-[9px] font-bold text-primary uppercase tracking-[0.3em] leading-none">{subtitle}</p>}
  </div>
);

const ContentWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-sm mx-auto flex flex-col items-center px-4">
    {children}
  </div>
);

const BaseInput = ({ icon: Icon, ...props }: any) => (
  <div className="w-full bg-[#F1F5F9] rounded-2xl border border-outline/20 focus-within:ring-2 focus-within:ring-primary/10 transition-all flex items-center px-4 h-14 overflow-hidden mb-3">
    {Icon && <Icon className="w-4 h-4 text-primary/30 mr-2 shrink-0" />}
    <input {...props} className="flex-grow bg-transparent text-[16px] font-bold border-none outline-none placeholder:text-slate-300" />
  </div>
);

// --- SuperAdmin: Registration Form ---

const SuperAdminView = ({ establishments, onCreate, onBack }: { establishments: Establishment[], onCreate: (data: any) => void, onBack: () => void }) => {
  const [formData, setFormData] = useState({
    name: "", initials: "", nif: "", admin_email: "", admin_password: "", opening_hours: "08:00 - 18:00", product_photos: "", logo_url: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ ...formData, product_photos: formData.product_photos.split(",").map(p => p.trim()) });
    setFormData({ name: "", initials: "", nif: "", admin_email: "", admin_password: "", opening_hours: "", product_photos: "", logo_url: "" });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full pb-20">
      <ContentWrapper>
        <button onClick={onBack} className="self-start flex items-center gap-1.5 text-[9px] font-bold uppercase text-primary mb-6 hover:opacity-70 group transition-all"><ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5" /> Voltar</button>
        <SectionHeader title="Novo Parceiro" subtitle="Expansão KwikFilas" />
        <div className="card-main w-full space-y-6">
          <form onSubmit={handleSubmit} className="space-y-1">
            <BaseInput icon={Building} value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} placeholder="Estabelecimento" required />
            <BaseInput icon={Plus} value={formData.initials} onChange={(e: any) => setFormData({...formData, initials: e.target.value.toUpperCase()})} placeholder="Iniciais (Ex: KF)" maxLength={3} required />
            <BaseInput icon={UserCheck} value={formData.nif} onChange={(e: any) => setFormData({...formData, nif: e.target.value})} placeholder="NIF da Empresa" required />
            <BaseInput icon={Mail} value={formData.admin_email} onChange={(e: any) => setFormData({...formData, admin_email: e.target.value})} placeholder="Email de Gestão" type="email" required />
            <BaseInput icon={Lock} value={formData.admin_password} onChange={(e: any) => setFormData({...formData, admin_password: e.target.value})} placeholder="Senha do Painel" type="password" required />
            <BaseInput icon={Upload} value={formData.logo_url} onChange={(e: any) => setFormData({...formData, logo_url: e.target.value})} placeholder="Link do Logotipo" />
            <button type="submit" className="w-full btn-primary py-5 mt-6 tracking-[0.2em] shadow-lg">FINALIZAR REGISTRO</button>
          </form>
        </div>
      </ContentWrapper>
    </motion.div>
  );
};

// --- EstablishmentAdminView: PRO Console ---

const EstablishmentAdminView = ({ establishment, onNext, onBack }: { establishment: Establishment, onNext: () => void, onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<"control" | "contacts">("control");
  const waitingCustomers = (establishment.customers || []).filter(c => c.status === "waiting");
  const currentCustomer = (establishment.customers || []).find(c => c.status === "called");
  const history = (establishment as any).served_history || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20 w-full">
      <ContentWrapper>
        <div className="w-full flex justify-between items-center mb-10 pt-4">
           <button onClick={onBack} className="flex items-center gap-1 text-[9px] font-black uppercase text-on-surface-variant/40 hover:text-primary active:scale-95 transition-all"><ChevronLeft className="w-3.5 h-3.5" /> Sair</button>
           <div className="flex bg-[#F1F5F9] p-1 rounded-xl gap-1">
              <button onClick={() => setActiveTab("control")} className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", activeTab === "control" ? "bg-white text-primary shadow-sm" : "text-slate-400")}>Fila Ativa</button>
              <button onClick={() => setActiveTab("contacts")} className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", activeTab === "contacts" ? "bg-white text-primary shadow-sm" : "text-slate-400")}>Contactos</button>
           </div>
        </div>

        {activeTab === "control" ? (
          <div className="space-y-6 w-full flex flex-col items-center">
             <SectionHeader title={establishment.name} subtitle="Controle de Chamadas" />
             
             {/* Main Action Button */}
             <button 
               onClick={onNext}
               disabled={waitingCustomers.length === 0 && !currentCustomer}
               className={cn("w-full transition-all p-10 rounded-[48px] flex flex-col items-center gap-6 group shadow-elevated", 
                 waitingCustomers.length === 0 ? "bg-slate-200 opacity-60 cursor-not-allowed" : "bg-primary text-white hover:brightness-110 active:scale-95"
               )}
             >
                <div className={cn("w-14 h-14 rounded-full flex items-center justify-center transition-all", waitingCustomers.length > 0 ? "bg-white/20 animate-pulse-subtle" : "bg-slate-300")}>
                  <Bell className={cn("w-7 h-7", waitingCustomers.length > 0 ? "fill-white" : "text-slate-400")} />
                </div>
                <div className="text-center">
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80 leading-none">
                     {waitingCustomers.length > 0 ? "Chamar Próximo" : "Sem espera"}
                   </span>
                   <h2 className="text-3xl font-black mt-2 tracking-tighter uppercase">{waitingCustomers.length > 0 ? "NOTIFICAR" : "FILA VAZIA"}</h2>
                </div>
             </button>

             {/* Ticket Display */}
             <div className="grid grid-cols-2 gap-3 w-full mt-4">
                <div className="bg-[#F8FAFC] p-8 rounded-[40px] text-center border border-outline/20">
                   <span className="text-[9px] font-black uppercase opacity-30 block mb-1 tracking-widest">Em Espera</span>
                   <span className="text-3xl font-black text-on-surface">{waitingCustomers.length}</span>
                </div>
                <div className="bg-[#2563EB]/5 p-8 rounded-[40px] text-center border border-primary/10">
                   <span className="text-[9px] font-black uppercase text-primary opacity-50 block mb-1 tracking-widest">Agora no Painel</span>
                   <span className="text-3xl font-black text-primary">{currentCustomer ? currentCustomer.ticket_number.split('-').pop() : '--'}</span>
                </div>
             </div>

             {/* QR Visibility Card */}
             <div className="w-full bg-white p-6 rounded-[32px] border border-outline/20 flex items-center justify-between mt-8">
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-slate-50 rounded-xl border border-outline/30"><QRCodeSVG value={`https://kwikfilas.vercel.app/?est=${establishment.code}`} size={48} /></div>
                   <div className="text-left"><h4 className="font-bold text-sm">QR Code Activo</h4><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verificação Centralizada</p></div>
                </div>
                <ExternalLink className="w-4 h-4 text-primary" />
             </div>
          </div>
        ) : (
          <div className="w-full space-y-6">
             <SectionHeader title="Contactos" subtitle="Histórico de Clientes" />
             <div className="flex flex-col gap-2">
                {history.length > 0 ? history.map((h: any) => (
                  <div key={h.id} className="bg-white p-5 rounded-[28px] border border-outline/10 flex items-center justify-between shadow-sm">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#F1F5F9] text-slate-400 rounded-xl flex items-center justify-center font-black text-[10px]">{h.ticket_number.split('-').pop()}</div>
                        <div className="text-left">
                           <h4 className="font-bold text-base text-on-surface leading-tight mb-1">{h.phone}</h4>
                           <span className="text-[9px] font-black text-primary uppercase tracking-widest">Atendido às {new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                     </div>
                     <PhoneIcon className="w-4 h-4 text-slate-200" />
                  </div>
                )) : (
                  <div className="py-20 flex flex-col items-center opacity-10 text-center grayscale">
                     <Users className="w-16 h-16" />
                     <p className="text-xs font-black uppercase mt-4">Nenhum atendimento registado</p>
                  </div>
                )}
             </div>
          </div>
        )}
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
    const position = (establishment.customers || []).filter(c => c.status === "waiting" && new Date(c.joined_at).getTime() < new Date(myCustomer.joined_at).getTime()).length + 1;
    const isCalled = myCustomer.status === "called";

    return (
      <ContentWrapper>
        <div className="py-12 space-y-12 w-full">
          <SectionHeader title={establishment.name} subtitle="Seu Ticket Móvel" />
          <div className="bg-white rounded-[64px] p-12 shadow-elevated border border-outline/20 flex flex-col items-center gap-12 w-full">
             <div className="relative w-48 h-48 flex items-center justify-center">
                <div className={cn("absolute inset-0 rounded-full border-4 border-dashed", isCalled ? "border-green-500 animate-spin-slow" : "border-primary/20 animate-spin-slow-reverse")}></div>
                <div className="text-center pt-2">
                   <span className="text-[10px] font-black uppercase text-slate-300 tracking-[0.5em] block">ID</span>
                   <span className={cn("text-7xl font-black tracking-tighter leading-none transition-all", isCalled ? "text-green-600" : "text-primary")}>
                     {myCustomer.ticket_number.split('-').pop()}
                   </span>
                </div>
             </div>
             <div className="text-center space-y-2">
                <h3 className="text-3xl font-black tracking-tighter uppercase">{isCalled ? "Sua Vez Agora!" : `${position}º na Espera`}</h3>
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] px-4 leading-relaxed">
                  {isCalled ? "POR FAVOR DIRIJA-SE AO LOCAL IMEDIATAMENTE PARA SER ATENDIDO." : "AGUARDE ATENTAMENTE À SUA NOTIFICAÇÃO NO PAINEL E VIA SMARTPHONE."}
                </p>
             </div>
          </div>
          <button onClick={() => { onLeave(myCustomer.id); localStorage.removeItem(`kwikfilas_phone_${establishment.code}`); }} className="flex mx-auto items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-red-500 transition-all active:scale-95"><X className="w-3 h-3" /> Cancelar Ticket</button>
        </div>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper>
      <div className="py-16 space-y-12 w-full text-center">
        <div className="space-y-6">
           <div className="w-20 h-20 bg-[#2563EB]/5 rounded-[32px] flex items-center justify-center mx-auto shadow-inner border border-[#2563EB]/10 overflow-hidden">
              {establishment.logo_url ? <img src={establishment.logo_url} className="w-full h-full object-cover" /> : <Store className="text-primary w-10 h-10" />}
           </div>
           <h1 className="text-4xl font-black tracking-tighter leading-none text-on-surface uppercase opacity-90">{establishment.name}</h1>
           <p className="text-[9px] font-bold text-primary uppercase tracking-[0.4em] opacity-50">Sistema Digital de Filas</p>
        </div>

        {step === "welcome" ? (
          <div className="space-y-6 px-4 w-full">
            <button onClick={() => setStep("input")} className="w-full btn-primary py-8 text-sm shadow-xl tracking-[0.3em]">ENTRAR NA FILA</button>
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed px-4">Utilize o seu número oficial para notificações precisas via SMS.</p>
          </div>
        ) : (
          <div className="card-main w-full space-y-8">
             <div className="text-center border-b border-outline/10 pb-6">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2">Ticket Telemóvel</span>
                <p className="text-sm font-bold text-on-surface">Validar sua Senha</p>
             </div>
             <form onSubmit={handleJoin} className="space-y-6">
                <div className="flex bg-[#F1F5F9] p-2 rounded-2xl border border-outline/10 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                  <div className="px-5 py-4 border-r border-outline/10 font-black text-slate-300">AO <span className="text-on-surface ml-1">+244</span></div>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="flex-grow bg-transparent p-4 text-xl font-bold border-none outline-none" placeholder="9XX XXX XXX" type="tel" required autoFocus />
                </div>
                <button type="submit" className="w-full btn-primary py-7 flex items-center justify-center gap-3 shadow-lg">OBTER MINHA SENHA <CheckCircle2 className="w-4 h-4" /></button>
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
      
      <Header onLogoClick={() => { setView("landing"); setSelectedEst(null); window.history.replaceState({}, '', '/'); }} onAdminClick={() => { setView("admin"); setSelectedEst(null); }} />
      
      <main className="pt-20 min-h-screen w-full relative">
        <AnimatePresence mode="wait">
          {view === "landing" && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 space-y-16">
                <ContentWrapper>
                  <KLogo className="w-16 h-16 mb-8 animate-pulse-subtle" />
                  <h1 className="text-4xl font-black tracking-tighter text-on-surface text-center leading-none uppercase">KwikFilas<br/><span className="text-primary tracking-normal font-medium">Network.</span></h1>
                  <p className="text-[9px] font-black uppercase text-slate-300 tracking-[0.6em] mt-8 text-center px-10 leading-relaxed">Gestão Inteligente de Fluxo Humano em Tempo Real.</p>
                  
                  <div className="flex flex-col gap-3 w-full mt-16 px-4">
                     <button onClick={() => setView("customer")} className="btn-primary py-7 flex items-center justify-center gap-4 text-sm">SOU CLIENTE <ArrowRight className="w-4 h-4" /></button>
                     <button onClick={() => setView("admin")} className="btn-outline py-7 text-sm font-black">ÁREA ADMINISTRATIVA</button>
                  </div>
                </ContentWrapper>
            </motion.div>
          )}

          {view === "customer" && !selectedEst && (
            <ContentWrapper>
               <div className="pt-12 w-full space-y-10">
                  <SectionHeader title="Filiais" subtitle="Parceiros Ativos" />
                  <div className="flex flex-col gap-3 w-full">
                    {establishments.map(est => (
                      <button key={est.id} onClick={() => setSelectedEst(est)} className="w-full bg-white p-5 pr-8 rounded-[40px] border border-outline/20 flex items-center gap-5 hover:border-primary active:bg-[#F8FAFC] transition-all group shadow-sm">
                        <div className="w-14 h-14 bg-[#F1F5F9] rounded-[24px] flex items-center justify-center overflow-hidden border border-outline/10">
                          {est.logo_url ? <img src={est.logo_url} className="w-full h-full object-cover" /> : <span className="font-black text-primary text-xl">{est.initials}</span>}
                        </div>
                        <div className="flex-grow text-left leading-none"><h3 className="font-bold text-lg mb-1">{est.name}</h3><span className="text-[9px] font-black tracking-widest text-[#2563EB]/30 uppercase">{(est.customers || []).length} Na Fila</span></div>
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
                  <SectionHeader title="Gestão" subtitle="Seleção Profissional" />
                  <div className="flex flex-col gap-3 w-full px-4">
                    {establishments.map(est => (
                      <button key={est.id} onClick={() => { setSelectedEst(est); setView("superadmin"); }} className="p-6 bg-[#F8FAFC] rounded-[40px] border border-outline/20 hover:border-primary active:bg-white transition-all flex justify-between items-center group">
                        <div className="text-left leading-none">
                          <span className="text-[8px] font-black uppercase tracking-widest text-primary/40 mb-2 block">{est.code}</span>
                          <h3 className="text-lg font-bold text-on-surface">{est.name}</h3>
                        </div>
                        <LayoutDashboard className="w-5 h-5 text-outline/30 group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                    <button onClick={() => { setView("superadmin"); setSelectedEst(null); }} className="mt-12 text-[10px] font-black uppercase tracking-[0.4em] text-primary hover:opacity-100 opacity-20 active:scale-95 transition-all">+ Registro de Mestre</button>
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
