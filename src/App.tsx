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
  timestamp?: number;
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
            "pointer-events-auto p-4 flex items-center gap-3 border shadow-premium text-[10px] font-black uppercase tracking-widest glass-card",
            t.type === 'success' ? "border-primary/50 text-primary" : "border-red-200 text-red-500"
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
  <svg viewBox="0 0 100 100" className={cn("text-primary w-8 h-8", className)} fill="none">
    <path d="M25 15 L25 85 M25 50 L75 15 M25 50 L75 85 M70 15 L80 15 M70 85 L80 85" stroke="currentColor" strokeWidth="10" strokeLinecap="square" />
  </svg>
);

const StickIllustration = ({ type, className }: { type: 'queue' | 'freedom', className?: string }) => {
  const stroke = "currentColor";
  const width = "8";
  return (
    <svg viewBox="0 0 200 120" className={cn("w-full h-auto", className)} fill="none">
      {type === 'queue' ? (
        <g stroke={stroke} strokeWidth={width} strokeLinecap="square">
          <circle cx="40" cy="30" r="10" />
          <path d="M40 40 L40 80 M40 55 L25 70 M40 55 L55 70 M40 80 L30 100 M40 80 L50 100" />
          <circle cx="80" cy="30" r="10" />
          <path d="M80 40 L80 80 M80 55 L65 70 M80 55 L95 70 M80 80 L70 100 M80 80 L90 100" />
          <circle cx="120" cy="30" r="10" />
          <path d="M120 40 L120 80 M120 55 L105 70 M120 55 L135 70 M120 80 L110 100 M120 80 L130 100" />
          <path d="M150 20 L150 100" strokeWidth="4" opacity="0.2" />
        </g>
      ) : (
        <g stroke={stroke} strokeWidth={width} strokeLinecap="square">
          <circle cx="100" cy="30" r="10" />
          <path d="M100 40 L100 70 M100 55 L80 40 M100 55 L120 40 M100 70 L80 100 M100 70 L120 100" />
          <path d="M140 30 L160 30 M150 20 L150 40" strokeWidth="4" />
          <path d="M140 20 L160 40 M160 20 L140 40" strokeWidth="4" />
          <path d="M40 60 L60 80 L100 30" stroke="#2563EB" strokeWidth="12" opacity="0.3" />
        </g>
      )}
    </svg>
  );
};

const ContentWrapper = ({ children, wide = false }: { children: React.ReactNode, wide?: boolean }) => (
  <div className={cn("w-full mx-auto flex flex-col items-center px-4 mb-20 transition-all duration-500", wide ? "max-w-6xl" : "max-w-sm")}>{children}</div>
);

const BaseInput = ({ icon: Icon, label, ...props }: any) => (
  <div className="w-full mb-4">
    {label && <span className="text-[8px] font-black uppercase text-[#2563EB] block mb-1 opacity-50">{label}</span>}
    <div className="w-full bg-[#F8FAFC] border border-slate-200 focus-within:border-primary flex items-center px-4 h-14 transition-all">
      {Icon && <Icon className="w-4 h-4 text-primary/30 mr-3 shrink-0" />}
      <input {...props} className="flex-grow bg-transparent text-[16px] font-bold border-none outline-none placeholder:text-slate-200" />
    </div>
  </div>
);

// --- 0. MARKETING: LANDING PAGE ---
const MarketingView = ({ onLoginClick }: { onLoginClick: () => void }) => {
  return (
    <div className="w-full bg-white font-['Inter']">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100 h-20 flex items-center px-6 md:px-12 justify-between">
        <div className="flex items-center gap-3">
          <KLogo className="w-8 h-8" />
          <span className="font-black text-xl uppercase tracking-tighter text-[#0F172A]">KwikFilas</span>
        </div>
        <button onClick={onLoginClick} className="text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20 px-6 py-3 hover:bg-primary hover:text-white transition-all">
          Portal Parceiro
        </button>
      </nav>

      <section className="pt-40 pb-20 px-6 md:px-12 max-w-6xl mx-auto flex flex-col items-center text-center space-y-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
          <h1 className="text-5xl md:text-8xl font-black text-[#0F172A] uppercase tracking-tighter leading-[0.85] text-center">
            A Fila Acabou.<br/>
            <span className="text-gradient italic">A Liberdade Começou.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 font-medium text-lg leading-relaxed">
            Elimine a frustração das esperas físicas. Transforme o seu negócio em 
            um ecossistema digital inteligente onde o cliente é livre para circular.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
            <button onClick={onLoginClick} className="btn-modern w-full md:w-auto px-12 py-7 h-auto">
              Aderir Agora <ArrowRight className="inline ml-2 w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 pt-20">
           <div className="bg-slate-50 p-12 space-y-6 flex flex-col items-center">
              <StickIllustration type="queue" className="text-slate-300 h-24" />
              <div className="text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-400">O Passado</span>
                <h4 className="text-2xl font-black uppercase tracking-tighter mt-2">Aglomerados de Gente</h4>
              </div>
           </div>
           <div className="glass-card bg-primary/5 p-12 border-2 border-primary/20 border-dashed space-y-6 flex flex-col items-center">
              <StickIllustration type="freedom" className="text-primary h-24" />
              <div className="text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">O Futuro</span>
                <h4 className="text-2xl font-black uppercase tracking-tighter mt-2 text-primary">Liberdade Total</h4>
              </div>
           </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 bg-white text-center">
         <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">Pode esperar em qualquer lugar.</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {['Na Esplanada', 'No Carro', 'A Passear', 'Em Casa'].map((loc, i) => (
                  <div key={i} className="bg-[#F8FAFC] py-8 border border-slate-100 font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-primary transition-colors">
                     {loc}
                  </div>
               ))}
            </div>
         </div>
      </section>

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
            <div key={i} className="glass-card p-10 space-y-6 group hover:border-primary/30 transition-all border-white/50">
              <div className="w-14 h-14 bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-[#0F172A]">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

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
          <div className="text-center space-y-6">
            <KLogo className="w-20 h-20 mb-6 mx-auto drop-shadow-2xl" />
            <h1 className="text-5xl md:text-6xl font-black text-[#0F172A] uppercase tracking-tighter leading-none">
              KwikFilas<br/>
              <span className="text-gradient italic font-medium tracking-normal text-3xl">Mestre.</span>
            </h1>
            <p className="text-[11px] font-black uppercase text-slate-300 tracking-[0.8em] mt-4 opacity-60">Segurança de Nível Militar</p>
          </div>
          <div className="w-full max-w-md bg-white p-12 border border-slate-100 shadow-premium relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700" />
            <form onSubmit={handleLogin} className="space-y-4">
               <BaseInput icon={Mail} value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="Utilizador / Email" type="email" required />
               <BaseInput icon={Lock} value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="Senha Mestra" type="password" required />
               <button type="submit" disabled={loading} className="btn-modern w-full mt-8">
                {loading ? "Sincronizando..." : "Aceder ao Núcleo" }
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
       <div className="w-full pt-12 pb-32 space-y-12">
          <div className="flex justify-between items-center glass-card p-6 border-slate-200/50">
             <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3"><ShieldCheck className="w-6 h-6 text-primary" /></div>
                <div className="flex flex-col"><span className="text-[9px] font-black uppercase tracking-widest text-primary opacity-50 leading-none">Canal de Autoridade</span><h2 className="text-xl font-black uppercase tracking-tighter">Master Control</h2></div>
             </div>
             <button onClick={onLogout} className="p-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><LogOut className="w-5 h-5" /></button>
          </div>
          <div className="flex border border-slate-100 p-1.5 bg-slate-50/50 backdrop-blur-sm max-w-md mx-auto">
             <button onClick={() => setView("list")} className={cn("flex-grow py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all", view === "list" ? "bg-white text-primary shadow-sm" : "text-slate-400")}>Base Ativa</button>
             <button onClick={() => setView("create")} className={cn("flex-grow py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all", view === "create" ? "bg-white text-primary shadow-sm" : "text-slate-400")}>Nova Filial</button>
          </div>

          {view === "list" ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {establishments.map((est, i) => (
                   <motion.div key={est.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-10 flex flex-col items-center space-y-8 group hover:border-primary/50 transition-all border-slate-200/40 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl tracking-tighter select-none">#{i+1}</div>
                      <div className="w-20 h-20 border-2 border-slate-100 bg-white shadow-sm overflow-hidden p-2 group-hover:scale-110 transition-transform">
                         {est.logo_url && <img src={est.logo_url} className="w-full h-full object-cover" />}
                      </div>
                      <div className="text-center space-y-2">
                         <h4 className="font-black text-lg uppercase text-[#0F172A] tracking-tighter leading-tight">{est.name}</h4>
                         <span className="text-[10px] font-bold text-primary px-3 py-1 bg-primary/5 tracking-[0.2em]">{est.code}</span>
                      </div>
                      <div className="w-full h-px bg-slate-100" />
                      <div className="flex items-center gap-4 text-[10px] font-black uppercase text-slate-300">
                         <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {est.queues?.length || 0}</span>
                         <span className="h-3 w-px bg-slate-100" />
                         <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Live</span>
                      </div>
                   </motion.div>
                ))}
             </div>
          ) : (
             <div className="glass-card p-12 border-slate-200/50 space-y-10 max-w-2xl mx-auto shadow-premium">
                <div className="text-center space-y-2">
                   <h3 className="text-3xl font-black uppercase tracking-tighter">Registo de Filial</h3>
                   <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] opacity-40">Configuração de Canal Oficial</p>
                </div>
                <form onSubmit={handleCreate} className="space-y-4">
                   <div className="flex flex-col items-center mb-6">
                      <div className="w-28 h-28 bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative shadow-inner">
                         {formData.logo_url ? <img src={formData.logo_url} className="w-full h-full object-cover" /> : <ImageIcon className="w-10 h-10 text-slate-200" />}
                         <label className="absolute inset-0 bg-primary/80 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-all"><Camera className="w-6 h-6 text-white" /><input type="file" className="hidden" onChange={handleUpload} /></label>
                      </div>
                   </div>
                   <BaseInput value={formData.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} placeholder="Nome Profissional" required />
                   <BaseInput value={formData.nif} onChange={(e:any) => setFormData({...formData, nif: e.target.value})} placeholder="NIF Oficial" required />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <BaseInput value={formData.admin_email} onChange={(e:any) => setFormData({...formData, admin_email: e.target.value})} placeholder="Email de Acesso" type="email" required />
                     <BaseInput value={formData.admin_password} onChange={(e:any) => setFormData({...formData, admin_password: e.target.value})} placeholder="Senha de Gestão" type="password" required />
                   </div>
                   <button type="submit" disabled={loading} className="btn-modern w-full mt-6">Ativar Canal Digital</button>
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
    try {
      const targetId = auth.estId || (auth as any).id;
      const resArr = await fetch(`/api/admin/establishments?role=establishment&estId=${targetId}`);
      if (!resArr.ok) throw new Error("API Fail");
      const data = await resArr.json();
      const found = data.find((e: any) => e.id === targetId);
      if (found) setEst(found);
    } catch (e) { console.error("Refresh Error", e); }
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

  if (!est) return (
     <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-6">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Conectando ao Canal...</p>
        <button onClick={onLogout} className="text-primary font-black text-[9px] uppercase tracking-widest border border-primary/20 px-6 py-3">Cancelar e Sair</button>
     </div>
  );

  const current = (est.queues || []).find(q => q.status === "called");
  const waiting = (est.queues || []).filter(q => q.status === "waiting");
  const totalToday = (est.queues || []).length;

  return (
    <ContentWrapper wide>
       <div className="w-full pt-12 pb-32 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
             
             <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-6 border-slate-200/50 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 border-2 border-slate-100 overflow-hidden shadow-sm shadow-indigo-100"><img src={est.logo_url} className="w-full h-full object-cover" /></div>
                      <div className="leading-none flex flex-col text-left"><h4 className="font-black text-lg uppercase text-slate-900 tracking-tighter">{est.name}</h4><span className="text-[9px] font-bold text-primary uppercase tracking-widest mt-1 opacity-60">{est.code}</span></div>
                   </div>
                   <button onClick={onLogout} className="p-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><LogOut className="w-5 h-5" /></button>
                </div>

                <div className="glass-card bg-slate-900 border-none p-10 flex justify-between items-center px-14 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                   <div className="text-center relative z-10"><span className="text-[10px] font-black uppercase text-primary/60 block mb-2 tracking-widest">Atendidos</span><span className="text-5xl font-black text-white tracking-tighter leading-none">{totalToday}</span></div>
                   <div className="h-16 w-px bg-white/10 relative z-10"></div>
                   <div className="text-center relative z-10"><span className="text-[10px] font-black uppercase text-primary block mb-2 tracking-widest">Espera</span><span className="text-5xl font-black text-white tracking-tighter leading-none">{waiting.length}</span></div>
                </div>

                <div className="space-y-4">
                   <button onClick={handleNext} disabled={waiting.length === 0 || loading} className={cn("w-full py-20 px-10 glass-card border-none flex flex-col items-center gap-6 transition-all relative overflow-hidden shadow-premium group", waiting.length > 0 ? "bg-primary text-white" : "bg-slate-50 opacity-40")}>
                      {waiting.length > 0 && <motion.div animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-white" />}
                      <Bell className={cn("w-12 h-12 relative z-10 group-hover:scale-125 transition-transform", waiting.length > 0 && "animate-pulse")} />
                      <h2 className="text-3xl font-black uppercase tracking-tighter relative z-10">{waiting.length > 0 ? (loading ? "DISPARANDO..." : "PRÓXIMA SENHA") : "SEM ESPERA"}</h2>
                      <div className="flex items-center gap-2 relative z-10"><span className="w-2.5 h-2.5 bg-white rounded-full"></span><p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Terminal Digital & SMS</p></div>
                   </button>

                   <div className="glass-card p-12 bg-primary/5 border-2 border-primary border-dashed text-center flex flex-col items-center shadow-premium">
                      <span className="text-[12px] font-black uppercase text-primary opacity-40 block mb-2 tracking-[0.6em]">Senha no Visor</span>
                      <span className="text-gradient text-[100px] font-black leading-none tracking-tighter">{current ? current.ticket_number.split('-').pop() : '--'}</span>
                      {current && (
                         <button onClick={() => handleRecall(current.id, current.ticket_number)} className="mt-10 flex items-center gap-3 text-primary bg-white px-8 py-4 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all shadow-sm">
                            <RefreshCcw className="w-5 h-5" /> Re-Notificar Terminal
                         </button>
                      )}
                   </div>
                </div>
             </div>

             <div className="lg:col-span-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="glass-card p-10 flex flex-col items-center space-y-6">
                      <div className="flex items-center gap-3 border-b border-slate-50 pb-5 w-full justify-center"><Ticket className="w-5 h-5 text-primary" /><span className="text-[12px] font-black uppercase text-primary tracking-[0.4em]">Entrada Balcão</span></div>
                      <form onSubmit={handleManualJoin} className="w-full flex flex-col gap-4">
                         <input disabled={loading} value={manualPhone} onChange={e => setManualPhone(e.target.value)} className="w-full bg-slate-50/50 p-8 text-3xl font-black outline-none text-center border-none shadow-inner" placeholder="9XX XXX XXX" />
                         <button type="submit" disabled={loading} className="btn-modern w-full">Gerar Senha Física</button>
                      </form>
                   </div>

                   <div className="glass-card p-10 flex flex-col items-center space-y-8">
                      <div className="flex flex-col items-center gap-2"><QrCode className="w-6 h-6 text-primary opacity-30" /><span className="text-[10px] font-black uppercase text-primary opacity-50 tracking-[0.3em]">Canal de Entrada</span></div>
                      <div id="main-qr-canvas" className="p-6 bg-white shadow-premium"><QRCodeSVG value={`https://kwikfilas.vercel.app/?est=${est.code}`} size={160} level="H" imageSettings={{src: est.logo_url, x: undefined, y: undefined, height: 40, width: 40, excavate: true }} /></div>
                      <button onClick={handlePrintQR} className="w-full bg-slate-50 text-slate-400 py-6 flex items-center justify-center gap-4 font-black uppercase text-[10px] tracking-[0.4em] hover:bg-primary hover:text-white transition-all shadow-sm">Cartaz de Impressão</button>
                   </div>
                </div>

                <div className="w-full bg-slate-900 glass-card border-none p-10 space-y-10 shadow-premium">
                   <div className="flex items-center justify-between border-b border-white/5 pb-8"><span className="text-[14px] font-black uppercase text-primary tracking-[0.6em]">Fila Ativa (Live)</span><Users className="w-6 h-6 text-primary opacity-40" /></div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {waiting.map((q, i) => (
                         <motion.div key={q.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="bg-white/5 p-6 flex items-center justify-between group hover:bg-white/10 transition-all border border-white/5">
                            <div className="flex items-center gap-6">
                               <span className="text-3xl font-black text-white/90 w-16 shrink-0 leading-none">#{q.ticket_number.split('-').pop()}</span>
                               <div className="flex flex-col gap-2"><span className="text-lg font-black text-white/70 tracking-tight leading-none">{q.phone}</span><span className="text-[9px] font-bold text-primary uppercase tracking-widest">{i === 0 ? "PRÓXIMO" : `${i + 1}º NA FILA`}</span></div>
                            </div>
                            <div className="flex gap-2">
                               <button onClick={() => handleRecall(q.id, q.ticket_number)} className="p-4 bg-white/5 text-white/40 hover:bg-primary hover:text-white transition-all"><Bell className="w-4 h-4" /></button>
                               <button onClick={() => handleCancel(q.id)} className="p-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                            </div>
                         </motion.div>
                      ))}
                      {waiting.length === 0 && <div className="col-span-full py-28 flex flex-col items-center opacity-10 grayscale text-center"><Timer className="w-16 h-16 mb-4" /><span className="text-sm font-black uppercase tracking-[0.6em]">Sem Clientes no Canal</span></div>}
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
        <div className="py-24 space-y-16 w-full flex flex-col items-center">
            <div className="w-24 h-24 bg-white shadow-premium flex items-center justify-center overflow-hidden border border-slate-100 p-2"><img src={est.logo_url} className="w-full h-full object-cover" /></div>
            <div className={cn("bg-white p-12 md:p-24 flex flex-col items-center gap-16 w-full transition-all duration-1000 border border-slate-50 relative overflow-hidden", isCalled ? "shadow-glow ring-8 ring-primary/5" : "shadow-premium")}>
               <div className="relative w-72 h-72 flex items-center justify-center rounded-full border border-slate-100">
                  {isCalled && <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0, 0.1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-primary rounded-full" />}
                  <div className="text-center relative z-10 leading-none">
                     <span className="text-[14px] font-black uppercase tracking-[0.8em] text-slate-300 block mb-6">Sua Senha</span>
                     <span className={cn("text-[140px] font-black tracking-tighter leading-none block", isCalled ? "text-primary animate-pulse" : "text-slate-900")}>{myTicket.ticket_number.split('-').pop()}</span>
                  </div>
               </div>
               <div className="text-center space-y-8">
                  <h3 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-[0.85] text-gradient">{isCalled ? "Sua Vez Chegou!" : `${position}º na Linha`}</h3>
                  <div className="h-1.5 w-24 bg-primary mx-auto opacity-20" />
                  <p className="text-[12px] font-black uppercase text-slate-300 tracking-[0.6em] leading-relaxed max-w-xs mx-auto">{isCalled ? "POR FAVOR, DIRIJA-SE AO LOCAL DE ATENDIMENTO." : "SERÁ NOTIFICADO NESTE ECRÃ ASSIM QUE FOR CHAMADO."}</p>
               </div>
            </div>
            {isCalled && <button className="btn-modern w-full shadow-glow">Confirmar Chegada</button>}
            <button onClick={() => { localStorage.removeItem(`kw_phone_${estCode}`); setMyTicket(null); notify("Saída do Canal", 'info'); }} className="text-[11px] font-black text-slate-300 uppercase tracking-widest pt-12 hover:text-primary transition-colors hover:underline">Abandonar Fila Digital</button>
        </div>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper>
       <div className="py-24 space-y-16 w-full flex flex-col items-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-40 h-40 bg-white border border-slate-50 shadow-premium flex items-center justify-center overflow-hidden p-3 transition-transform hover:scale-105"><img src={est.logo_url} className="w-full h-full object-cover" /></motion.div>
          <div className="space-y-6 px-6 text-center">
             <h1 className="text-6xl font-black text-[#0F172A] uppercase tracking-tighter leading-none text-gradient">{est.name}</h1>
             <p className="text-[12px] font-black text-primary uppercase tracking-[0.8em] opacity-40">CANAL DIGITAL OFICIAL</p>
          </div>
          <div className="bg-white p-16 space-y-16 w-full shadow-premium border border-slate-50 max-w-md">
             <div className="text-center space-y-3">
                <h2 className="text-4xl font-black uppercase tracking-tighter text-[#0F172A]">Aceder</h2>
                <p className="text-[11px] font-black text-primary uppercase tracking-[0.6em] opacity-30">Seu Telemóvel</p>
             </div>
             <form onSubmit={handleJoin} className="space-y-10">
                <input value={phone} onChange={(e:any) => setPhone(e.target.value)} placeholder="9XX XXX XXX" type="tel" className="w-full bg-slate-50 p-8 text-3xl font-black text-center outline-none border-b-4 border-slate-100 focus:border-primary transition-all transition-colors" required />
                <button type="submit" disabled={loading} className="btn-modern w-full py-8 text-xs">Entrar na Fila Digital</button>
             </form>
          </div>
       </div>
    </ContentWrapper>
  );
};

export default function App() {
  const [auth, setAuth] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem("kw_auth");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.timestamp && Date.now() - parsed.timestamp > 86400000) {
          localStorage.removeItem("kw_auth");
          return null;
        }
        return parsed;
      }
    } catch (e) { return null; }
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

  const handleLogin = (data: AuthUser) => { 
    const mappedData = { ...data, estId: data.estId || (data as any).id, timestamp: Date.now() };
    setAuth(mappedData); 
    localStorage.setItem("kw_auth", JSON.stringify(mappedData)); 
    showToast("Acesso Autorizado"); 
  };
  const handleLogout = () => { setAuth(null); localStorage.removeItem("kw_auth"); showToast("Sessão Terminada", 'info'); };

  return (
    <div className="bg-[#FFFFFF] min-h-screen selection:bg-primary/5 overflow-x-hidden relative antialiased">
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
