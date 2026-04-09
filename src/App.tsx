import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bell, Building, Camera, CheckCircle2, ChevronLeft, ChevronRight, Clock, ExternalLink, Image as ImageIcon, 
  LayoutDashboard, Lock, LogOut, Mail, Phone as PhoneIcon, Plus, QrCode, Search, Smartphone, Store, Timer, Trash2, 
  Upload, User, UserCheck, Users, X, Info, ArrowRight, ShieldCheck, Ticket, AlertCircle, History, RefreshCcw
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Customer, Establishment } from "./types";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "https://obhispzgjmcupjacuhck.supabase.co";
const SUPABASE_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaGlzcHpnam1jdXBqYWN1aGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MTE3MjIsImV4cCI6MjA5MDk4NzcyMn0.gEBLLzO7rjIBE-azcxajyRnAAc6jsfJRNn9MH682y6A";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface AuthUser {
  id: string;
  name: string;
  role: 'super' | 'establishment';
  email: string;
  estId?: string;
}

// --- GLOBAL TOAST SYSTEM ---
interface Toast { id: string; message: string; type: 'success' | 'error' | 'info'; }

const ToastContainer = ({ toasts, remove }: { toasts: Toast[], remove: (id: string) => void }) => (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-xs space-y-2 px-4 pointer-events-none">
    <AnimatePresence>
      {toasts.map(t => (
        <motion.div 
          key={t.id} 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
          className={cn(
            "pointer-events-auto p-4 flex items-center gap-3 border shadow-sm text-[10px] font-black uppercase tracking-widest",
            t.type === 'success' ? "bg-white border-primary text-primary" : "bg-red-50 border-red-200 text-red-500"
          )}
        >
          {t.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {t.message}
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

const KLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={cn("fill-primary w-8 h-8", className)}>
    <path d="M25 15 L25 85 M25 50 L75 15 M25 50 L75 85 M70 15 L80 15 M70 85 L80 85" stroke="currentColor" strokeWidth="10" strokeLinecap="square" />
  </svg>
);

const ContentWrapper = ({ children, wide = false }: { children: React.ReactNode, wide?: boolean }) => (
  <div className={cn("w-full mx-auto flex flex-col items-center px-4 mb-20 transition-all duration-500", wide ? "max-w-6xl" : "max-w-sm")}>{children}</div>
);

const BaseInput = ({ icon: Icon, label, ...props }: any) => (
  <div className="w-full mb-4">
    {label && <span className="text-[8px] font-black uppercase text-[#2563EB] block mb-1 opacity-50">{label}</span>}
    <div className="w-full bg-[#F8FAFC] border border-slate-200 focus-within:border-primary flex items-center px-4 h-14">
      {Icon && <Icon className="w-4 h-4 text-primary/30 mr-3 shrink-0" />}
      <input {...props} className="flex-grow bg-transparent text-[16px] font-bold border-none outline-none placeholder:text-slate-200" />
    </div>
  </div>
);



// --- 0. MARKETING: LANDING PAGE ---
const MarketingView = ({ onLoginClick }: { onLoginClick: () => void }) => {
  return (
    <div className="w-full bg-white selection:bg-primary/10">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100 h-20 flex items-center px-6 md:px-12 justify-between">
        <div className="flex items-center gap-3">
          <KLogo className="w-8 h-8" />
          <span className="font-black text-xl uppercase tracking-tighter text-[#0F172A]">KwikFilas</span>
        </div>
        <button onClick={onLoginClick} className="text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20 px-6 py-3 hover:bg-primary hover:text-white transition-all">
          Portal Parceiro
        </button>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 md:px-12 max-w-6xl mx-auto text-center space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl md:text-7xl font-black text-[#0F172A] uppercase tracking-tighter leading-[0.9]">
            A Fila Acabou.<br/>
            <span className="text-primary italic">A Liberdade Começou.</span>
          </h1>
          <p className="max-w-2xl mx-auto mt-8 text-slate-500 font-medium text-lg leading-relaxed">
            Transforme a espera física dos seus clientes numa experiência digital fluida. 
            Aumente a satisfação, melhore o fluxo e modernize o seu negócio com o KwikFilas.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-12">
            <button onClick={onLoginClick} className="w-full md:w-auto bg-primary text-white px-10 py-6 font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all">
              Aderir Agora <ArrowRight className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300">
              <ShieldCheck className="w-4 h-4" /> Sem taxas de adesão
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Bell, title: "Avisos em Tempo Real", desc: "Seus clientes recebem notificações via SMS quando a vez deles se aproxima." },
            { icon: LayoutDashboard, title: "Controle Total", desc: "Dashboard intuitivo para gerir múltiplas filas e estabelecimentos com precisão." },
            { icon: Smartphone, title: "Zero Apps", desc: "Os clientes só precisam de ler um QR Code. Sem instalações, sem fricção." },
            { icon: Timer, title: "Melhor Fluxo", desc: "Otimize o tempo de atendimento e reduza aglomerações no seu espaço físico." },
            { icon: Users, title: "CRM Integrado", desc: "Saiba quantos clientes passam pelo seu negócio e fidelize a sua base." },
            { icon: QrCode, title: "Cartazes Dinâmicos", desc: "Gere e imprima cartazes de entrada personalizados em segundos." }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-10 border border-slate-100 space-y-6 group hover:border-primary/30 transition-all">
              <div className="w-14 h-14 bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-[#0F172A]">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Business Section */}
      <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto text-center space-y-12">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Porquê ser parceiro?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div className="space-y-4">
            <CheckCircle2 className="w-8 h-8 text-primary" />
            <h4 className="font-black text-xl uppercase">Retenção de Clientes</h4>
            <p className="text-slate-500 text-sm">Clientes que não ficam presos em filas têm 70% mais chances de consumir mais no seu estabelecimento ou retornar.</p>
          </div>
          <div className="space-y-4">
            <CheckCircle2 className="w-8 h-8 text-primary" />
            <h4 className="font-black text-xl uppercase">Modernização da Marca</h4>
            <p className="text-slate-500 text-sm">Posicione o seu negócio como inovador e tecnológico perante a concorrência.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100 px-6 md:px-12 text-center">
        <KLogo className="w-10 h-10 mx-auto mb-8 opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-[1em] text-slate-300">KwikFilas 2024</p>
      </footer>
    </div>
  );
};

// --- 1. LANDING: LOGIN ---
const LandingView = ({ onLogin, onBack }: { onLogin: (authData: AuthUser) => void, onBack: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      if (res.ok) { onLogin(await res.json()); } else { alert("Credenciais Incorretas"); }
    } catch (e) { alert("Erro de Conexão"); }
    setLoading(false);
  };

  return (
    <ContentWrapper>
      <div className="pt-24 space-y-12 flex flex-col items-center w-full">
          <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-primary self-start mb-10 transition-colors">
            <ChevronLeft className="w-4 h-4"/> Voltar
          </button>
          <div className="text-center space-y-4">
            <KLogo className="w-16 h-16 mb-4 mx-auto" />
            <h1 className="text-4xl font-black text-[#0F172A] uppercase tracking-tighter">KwikFilas<br/><span className="text-[#2563EB] italic font-medium tracking-normal text-2xl">Mestre.</span></h1>
            <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.6em] mt-3 leading-none opacity-50">Portal Administrativo Oficial</p>
          </div>
          <div className="w-full bg-white p-8 border border-slate-100 shadow-sm">
            <form onSubmit={handleLogin} className="space-y-2">
               <BaseInput icon={Mail} value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="Utilizador / Email" type="email" required />
               <BaseInput icon={Lock} value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="Senha Mestra" type="password" required />
               <button type="submit" disabled={loading} className="w-full bg-[#2563EB] text-white py-6 mt-6 flex items-center justify-center gap-3 disabled:opacity-50 font-black text-xs uppercase tracking-widest leading-none">
                {loading ? "PROCURANDO..." : "ABRIR CANAL" } <ArrowRight className="w-4 h-4"/>
               </button>
            </form>
          </div>
      </div>
    </ContentWrapper>
  );
};

// --- 2. SUPER ADMIN: GESTÃO ---
const SuperAdminView = ({ onLogout, notify }: { onLogout: () => void, notify: (m: string, t?: any) => void }) => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [view, setView] = useState<"list" | "create">("list");
  const [formData, setFormData] = useState({ name: "", nif: "", admin_email: "", admin_password: "", logo_url: "" });
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    try {
      const res = await fetch("/api/admin/establishments");
      const data = await res.json();
      setEstablishments(Array.isArray(data) ? data : []);
    } catch (e) { console.error("API error"); }
  };

  useEffect(() => { refresh(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);
    try {
      const file = e.target.files[0];
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9]/g, '')}`;
      const { data, error } = await supabase.storage.from('logos').upload(fileName, file);
      if (!error) {
         const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(data.path);
         setFormData({ ...formData, logo_url: publicUrl });
         notify("Logótipo Carregado");
      }
    } catch (e) { notify("Erro no Upload", 'error'); }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/establishments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) { refresh(); setView("list"); notify("Canal Ativado com Sucesso"); setFormData({ name: "", nif: "", admin_email: "", admin_password: "", logo_url: "" }); }
      else { notify("Dados Duplicados", 'error'); }
    } catch (e) { notify("Erro Crítico", 'error'); }
    setLoading(false);
  };

  return (
    <ContentWrapper wide={view === "list"}>
       <div className="w-full pt-8 pb-32 space-y-8">
          <div className="flex justify-between items-center bg-white p-3 border border-slate-200">
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black uppercase text-primary">Master Control</span>
             </div>
             <button onClick={onLogout} className="p-3 bg-red-50 text-red-500 border border-red-100"><LogOut className="w-4 h-4" /></button>
          </div>
          <div className="flex bg-slate-50 border border-slate-100 p-1">
             <button onClick={() => setView("list")} className={cn("flex-grow py-3 text-[9px] font-black uppercase tracking-widest", view === "list" ? "bg-white text-primary border border-slate-100" : "text-slate-400")}>Catálogo</button>
             <button onClick={() => setView("create")} className={cn("flex-grow py-3 text-[9px] font-black uppercase tracking-widest", view === "create" ? "bg-white text-primary border border-slate-100" : "text-slate-400")}>Adicionar</button>
          </div>
          {view === "list" ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {establishments.map(est => (
                   <div key={est.id} className="bg-white p-6 border border-slate-100 flex items-center justify-between group hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 border border-slate-100 overflow-hidden shrink-0">{est.logo_url && <img src={est.logo_url} className="w-full h-full object-cover" />}</div>
                         <div className="text-left"><h4 className="font-black text-[14px] uppercase text-[#0F172A] leading-tight">{est.name}</h4><span className="text-[10px] font-bold text-primary tracking-widest opacity-40">{est.code}</span></div>
                      </div>
                   </div>
                ))}
             </div>
          ) : (
             <div className="bg-white p-8 border border-slate-100 space-y-6">
                <form onSubmit={handleCreate} className="space-y-2">
                   <div className="flex flex-col items-center mb-10">
                      <div className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative">
                         {formData.logo_url ? <img src={formData.logo_url} className="w-full h-full object-cover" /> : <ImageIcon className="w-10 h-10 text-slate-200" />}
                         <label className="absolute inset-0 bg-primary/80 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-all"><Camera className="w-6 h-6 text-white" /><input type="file" className="hidden" onChange={handleUpload} /></label>
                      </div>
                   </div>
                   <BaseInput value={formData.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} placeholder="Nome Profissional" required />
                   <BaseInput value={formData.nif} onChange={(e:any) => setFormData({...formData, nif: e.target.value})} placeholder="NIF Oficial" required />
                   <BaseInput value={formData.admin_email} onChange={(e:any) => setFormData({...formData, admin_email: e.target.value})} placeholder="Email Registado" type="email" required />
                   <BaseInput value={formData.admin_password} onChange={(e:any) => setFormData({...formData, admin_password: e.target.value})} placeholder="Senha de Gestão" type="password" required />
                   <button type="submit" disabled={loading} className="w-full bg-primary text-white py-6 mt-6 font-black text-[11px] uppercase tracking-widest">ACTUALIZAR BASE DE DADOS</button>
                </form>
             </div>
          )}
       </div>
    </ContentWrapper>
  );
};

// --- 3. EST ADMIN: GESTÃO ---
const EstAdminView = ({ auth, onLogout, notify }: { auth: AuthUser, onLogout: () => void, notify: (m: string, t?: any) => void }) => {
  const [est, setEst] = useState<Establishment | null>(null);
  const [manualPhone, setManualPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    const resArr = await fetch(`/api/admin/establishments?role=establishment&estId=${auth.estId}`);
    const data = await resArr.json();
    const found = data.find((e: any) => e.id === auth.estId);
    if (found) setEst(found);
  };

  useEffect(() => { refresh(); const itv = setInterval(refresh, 3000); return () => clearInterval(itv); }, []);

  const handleNext = async () => {
    if (!est) return;
    setLoading(true);
    const res = await fetch(`/api/establishments/${est.code}/next`, { method: "POST" });
    if (res.ok) { 
      const resJson = await res.json();
      if (resJson.next) notify(`Chamando Senha ${resJson.next.ticket_number.split('-').pop()}`);
      else notify("Fila de Espera Vazia", 'info');
      refresh(); 
    }
    setLoading(false);
  };

  const handleRecall = async (ticketId: string, ticketNum: string) => {
    if (!est) return;
    await fetch(`/api/establishments/${est.code}/recall`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ticketId }) });
    notify(`SMS de Reforço: ${ticketNum.split('-').pop()}`);
  };

  const handleCancel = async (ticketId: string) => {
    if (!est) return;
    await fetch(`/api/establishments/${est.code}/cancel`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ticketId }) });
    notify("Ticket Cancelado", 'error');
    refresh();
  };

  const handleManualJoin = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!est || !manualPhone) return;
     setLoading(true);
     const res = await fetch("/api/queue/join", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: manualPhone, estCode: est.code }) });
     if (res.ok) { setManualPhone(""); refresh(); notify("Senha Manual Gerada"); }
     else { notify("Cliente já na Fila", 'error'); }
     setLoading(false);
  };

  const handlePrintQR = () => {
    if (!est) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const qrSvg = document.getElementById('main-qr-canvas')?.innerHTML || '';
    printWindow.document.write(`
      <html><body style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; margin:0; text-align:center; font-family: sans-serif;">
        <h1 style="font-size: 32px; font-weight: 900; text-transform: uppercase;">${est.name}</h1>
        <div style="transform: scale(2.5); margin: 60px 0;">${qrSvg}</div>
        <h2 style="font-size: 16px; font-weight: 800; color: #64748b; letter-spacing: 0.2em;">KWIKFILAS - FILA DIGITAL</h2>
        <script>setTimeout(() => { window.print(); window.close(); }, 800);</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  if (!est) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-10 h-10 border-4 border-primary border-t-transparent animate-spin"></div></div>;

  const current = (est.queues || []).find(q => q.status === "called");
  const waiting = (est.queues || []).filter(q => q.status === "waiting");
  const totalToday = (est.queues || []).length;

  return (
    <ContentWrapper wide>
       <div className="w-full pt-8 pb-32 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
             
             {/* Left Column: Controls & Stats */}
             <div className="lg:col-span-4 space-y-6">
          {/* Header & Stats Cards */}
          <div className="w-full grid grid-cols-1 gap-2">
             <div className="bg-white border border-slate-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 border border-slate-100 overflow-hidden"><img src={est.logo_url} className="w-full h-full object-cover" /></div>
                   <div className="leading-none flex flex-col text-left"><h4 className="font-black text-sm uppercase text-primary">{est.name}</h4><span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-1">{est.code}</span></div>
                </div>
                <button onClick={onLogout} className="p-3 bg-red-50 text-red-500 border border-red-100"><LogOut className="w-4 h-4" /></button>
             </div>
              <div className="bg-slate-900 p-6 border border-slate-800 flex justify-between items-center px-10">
                <div className="text-center"><span className="text-[9px] font-black uppercase text-primary opacity-50 block mb-1">Passaram Hoje</span><span className="text-3xl font-black text-white">{totalToday}</span></div>
                <div className="h-10 w-px bg-slate-800"></div>
                <div className="text-center"><span className="text-[9px] font-black uppercase text-primary block mb-1">Aguardando</span><span className="text-3xl font-black text-white">{waiting.length}</span></div>
             </div>
          </div>

          <div className="space-y-3">
             <button onClick={handleNext} disabled={waiting.length === 0 || loading} className={cn("w-full py-14 px-8 border-4 flex flex-col items-center gap-4 transition-all relative overflow-hidden", waiting.length > 0 ? "bg-primary border-primary text-white" : "bg-slate-50 border-slate-100 opacity-40")}>
                {waiting.length > 0 && <motion.div animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-white" />}
                <Bell className={cn("w-10 h-10 relative z-10", waiting.length > 0 && "animate-pulse")} />
                <h2 className="text-3xl font-black uppercase tracking-tighter relative z-10">{waiting.length > 0 ? (loading ? "DISPARANDO..." : "PRÓXIMA SENHA") : "SEM ESPERA"}</h2>
                <div className="flex items-center gap-2 relative z-10"><span className="w-2.5 h-2.5 bg-white rounded-full"></span><p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Painel Digital & SMS</p></div>
             </button>

             <div className="bg-primary/5 p-10 border-2 border-primary border-dashed text-center flex flex-col items-center">
                <span className="text-[11px] font-black uppercase text-primary opacity-40 block mb-1 tracking-[0.4em]">Senha no Visor</span>
                <span className="text-7xl font-black text-primary tracking-tighter">{current ? current.ticket_number.split('-').pop() : '--'}</span>
                {current && (
                   <button onClick={() => handleRecall(current.id, current.ticket_number)} className="mt-8 flex items-center gap-3 text-primary bg-white border border-primary/20 px-8 py-3.5 font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                      <RefreshCcw className="w-4 h-4" /> Re-Notificar Terminal
                   </button>
                )}
             </div>
          </div>
          </div>

          {/* Right Column: Queue & Management */}
          <div className="lg:col-span-8 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Manual Entry */}
                <div className="bg-white border border-slate-200 p-8 flex flex-col items-center space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-50 pb-4 w-full justify-center"><Ticket className="w-4 h-4 text-primary" /><span className="text-[11px] font-black uppercase text-primary tracking-widest">Entrada Balcão</span></div>
                  <form onSubmit={handleManualJoin} className="w-full flex flex-col gap-3">
                    <input disabled={loading} value={manualPhone} onChange={e => setManualPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-6 text-2xl font-black outline-none text-center" placeholder="9XX XXX XXX" />
                    <button type="submit" disabled={loading} className="w-full bg-primary text-white py-6 font-black uppercase text-[11px] tracking-widest hover:brightness-110 active:scale-95 transition-all">GERAR SENHA FÍSICA</button>
                  </form>
                </div>

                {/* Entrance QR Gateway */}
                <div className="bg-white border border-slate-200 p-8 flex flex-col items-center space-y-6">
                  <div className="flex flex-col items-center gap-1"><QrCode className="w-5 h-5 text-primary opacity-20" /><span className="text-[10px] font-black uppercase text-primary opacity-40 tracking-widest">Canal de Entrada</span></div>
                  <div id="main-qr-canvas" className="p-4 border border-slate-50 bg-white"><QRCodeSVG value={`https://kwikfilas.vercel.app/?est=${est.code}`} size={140} level="H" imageSettings={{src: est.logo_url, x: undefined, y: undefined, height: 35, width: 35, excavate: true }} /></div>
                  <button onClick={handlePrintQR} className="w-full bg-slate-50 text-slate-400 py-6 flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-[.3em] hover:bg-primary hover:text-white transition-all border border-slate-100">CARTAZ DE IMPRESSÃO</button>
                </div>
             </div>

             {/* Live Queue Management */}
             <div className="w-full bg-slate-900 border border-slate-800 p-8">
                <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-5"><span className="text-[12px] font-black uppercase text-primary tracking-[0.4em]">Fila Activa em Tempo Real</span><Users className="w-5 h-5 text-slate-700" /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {waiting.map((q, i) => (
                      <div key={q.id} className="bg-slate-800 border border-slate-700 p-5 flex items-center justify-between group hover:border-primary/50 transition-colors">
                         <div className="flex items-center gap-5">
                            <span className="text-2xl font-black text-white w-12 shrink-0">#{q.ticket_number.split('-').pop()}</span>
                            <div className="text-left leading-none flex flex-col gap-2"><span className="text-[16px] font-black text-slate-100 tracking-tight">{q.phone}</span><span className="text-[8px] font-bold text-primary uppercase tracking-widest">{i === 0 ? "PRÓXIMO" : `${i + 1}º NA FILA`}</span></div>
                         </div>
                         <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleRecall(q.id, q.ticket_number)} className="p-4 bg-white/5 text-white/50 border border-white/5 hover:bg-white/10 hover:text-white active:scale-95 transition-all"><Bell className="w-4 h-4" /></button>
                            <button onClick={() => handleCancel(q.id)} className="p-4 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white active:scale-95 transition-all"><Trash2 className="w-4 h-4" /></button>
                         </div>
                      </div>
                   ))}
                   {waiting.length === 0 && <div className="col-span-full py-24 flex flex-col items-center opacity-10 grayscale text-center"><Timer className="w-12 h-12 mb-3" /><span className="text-[12px] font-black uppercase tracking-widest">Sem Clientes em Espera</span></div>}
                </div>
             </div>
          </div>
          </div>
       </div>
    </ContentWrapper>
  );
};

// --- 4. CLIENTE: TRACKING ---
const ClientView = ({ estCode, notify }: { estCode: string, notify: (m: string, t?: any) => void }) => {
  const [est, setEst] = useState<Establishment | null>(null);
  const [phone, setPhone] = useState("");
  const [myTicket, setMyTicket] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
     try {
       const resArr = await fetch(`/api/admin/establishments`);
       const data = await resArr.json();
       const found = data.find((e: any) => e.code === estCode);
       if (found) {
          setEst(found);
          const savedPhone = localStorage.getItem(`kw_phone_${estCode}`);
          if (savedPhone) {
             const ticket = (found.queues || []).find((q: any) => q.phone === savedPhone);
             if (ticket && ticket.status === 'called' && (!myTicket || myTicket.status !== 'called')) {
                if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 500]);
                notify("SUA SENHA FOI CHAMADA!", 'success');
             }
             setMyTicket(ticket || null);
          }
       }
     } catch (e) { console.error("Refresh ERROR"); }
     setLoading(false);
  };

  useEffect(() => { refresh(); const itv = setInterval(refresh, 3000); return () => clearInterval(itv); }, [myTicket]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/queue/join", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, estCode }) });
    if (res.ok) { localStorage.setItem(`kw_phone_${estCode}`, phone); refresh(); notify("ENTROU NA FILA DIGITAL"); }
    else { notify("JÁ SE ENCONTRA NA FILA", 'error'); }
    setLoading(false);
  };

  if (loading && !est) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-10 h-10 border-4 border-primary border-t-transparent animate-spin"></div></div>;
  if (!est) return <div className="min-h-screen flex flex-col items-center justify-center px-12 text-center space-y-6 grayscale opacity-20"><Info className="w-20 h-20" /><span className="text-[10px] font-black uppercase tracking-[0.6em]">Canal Indisponível</span></div>;

  if (myTicket) {
     const position = (est.queues || []).filter((q: any) => q.status === "waiting" && new Date(q.joined_at).getTime() < new Date(myTicket.joined_at).getTime()).length + 1;
     const isCalled = myTicket.status === "called";
     return (
       <ContentWrapper>
         <div className="py-20 space-y-12 w-full flex flex-col items-center animate-in fade-in transition-colors duration-500" style={{ backgroundColor: isCalled ? '#2563EB05' : 'transparent' }}>
            <div className="w-24 h-24 bg-white border border-slate-100 flex items-center justify-center overflow-hidden"><img src={est.logo_url} className="w-full h-full object-cover" /></div>
            <div className={cn("bg-white border-4 p-16 flex flex-col items-center gap-10 w-full transition-all duration-1000", isCalled ? "border-primary scale-105 shadow-2xl" : "border-slate-50 shadow-sm")}>
               <div className="relative w-48 h-48 flex items-center justify-center">
                  {isCalled && <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 bg-primary" />}
                  <span className={cn("text-8xl font-black tracking-tighter leading-none relative z-10", isCalled ? "text-primary" : "text-primary opacity-80")}>{myTicket.ticket_number.split('-').pop()}</span>
               </div>
               <div className="text-center space-y-4">
                  <h3 className="text-3xl font-black tracking-tighter uppercase leading-none">{isCalled ? "DIRIJA-SE AO LOCAL!" : `${position}º NA FILA`}</h3>
                  <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.4em] leading-relaxed px-8">{isCalled ? "O ATENDIMENTO ESTÁ AGUARDANDO POR SI AGORA." : "MANTENHA ESTA PÁGINA ABERTA PARA REBER O AVISO."}</p>
               </div>
            </div>
            {isCalled && <div className="bg-primary text-white p-4 w-full text-center font-black text-[12px] uppercase tracking-widest animate-pulse">Sua Senha foi Chamada</div>}
            <button onClick={() => { localStorage.removeItem(`kw_phone_${estCode}`); setMyTicket(null); notify("Saída da Fila Digital", 'info'); }} className="text-[10px] font-black text-slate-200 uppercase tracking-widest pt-12">Sair Deste Canal</button>
         </div>
       </ContentWrapper>
     );
  }

  return (
    <ContentWrapper>
       <div className="py-20 space-y-12 w-full text-center animate-in slide-in-from-top-4">
          <div className="w-32 h-32 bg-white border border-slate-100 mx-auto flex items-center justify-center overflow-hidden"><img src={est.logo_url} className="w-full h-full object-cover" /></div>
          <div className="space-y-4 px-6 text-center">
             <h1 className="text-5xl font-black text-[#0F172A] uppercase tracking-tighter leading-none opacity-90">{est.name}</h1>
             <p className="text-[11px] font-black text-primary uppercase tracking-[0.6em] opacity-40">FILA DIGITAL INTELIGENTE</p>
          </div>
          <div className="bg-white border border-slate-200 p-12 space-y-12 w-full shadow-sm">
             <div className="text-center space-y-2">
                <h2 className="text-3xl font-black uppercase tracking-tight text-[#0F172A]">Aceder à Fila</h2>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] opacity-30">Introduza o seu telemóvel</p>
             </div>
             <form onSubmit={handleJoin} className="space-y-10">
                <BaseInput value={phone} onChange={(e:any) => setPhone(e.target.value)} placeholder="Telemóvel (9XX...)" type="tel" required />
                <button type="submit" disabled={loading} className="w-full bg-primary text-white py-10 uppercase text-[12px] font-black tracking-[0.4em]">ENTRAR AGORA</button>
             </form>
          </div>
       </div>
    </ContentWrapper>
  );
};
export default function App() {
  const [auth, setAuth] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem("kw_auth");
    if (saved) { try { return JSON.parse(saved); } catch(e) { return null; } }
    return null;
  });
  const [clientEstCode, setClientEstCode] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const code = p.get("est");
    if (code) setClientEstCode(code);
  }, []);

  const handleLogin = (data: AuthUser) => { setAuth(data); localStorage.setItem("kw_auth", JSON.stringify(data)); showToast("Acesso Autorizado"); };
  const handleLogout = () => { setAuth(null); localStorage.removeItem("kw_auth"); showToast("Sessão Terminada", 'info'); };

  return (
    <div className="bg-white min-h-screen selection:bg-primary/5 overflow-x-hidden relative antialiased font-['Inter']">
      <style>{`
        * { border-radius: 0px !important; }
        .bg-primary { background-color: #2563EB; }
        .text-primary { color: #2563EB; }
        .border-primary { border-color: #2563EB; }
        .shadow-sm { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
      `}</style>
      
      <ToastContainer toasts={toasts} remove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      {clientEstCode ? ( 
        <ClientView estCode={clientEstCode} notify={showToast} /> 
      ) : auth ? ( 
        auth.role === 'super' ? <SuperAdminView onLogout={handleLogout} notify={showToast} /> : <EstAdminView auth={auth} onLogout={handleLogout} notify={showToast} /> 
      ) : showLogin ? (
        <LandingView onLogin={handleLogin} onBack={() => setShowLogin(false)} />
      ) : (
        <MarketingView onLoginClick={() => setShowLogin(true)} />
      )}
    </div>
  );
}
