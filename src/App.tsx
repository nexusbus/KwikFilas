import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "motion"; // Simplified motion import
import { 
  Bell, Building, Camera, CheckCircle2, ChevronLeft, ChevronRight, Clock, ExternalLink, Image as ImageIcon, 
  LayoutDashboard, Lock, LogOut, Mail, Phone as PhoneIcon, Plus, QrCode, Search, Smartphone, Store, Timer, Trash2, 
  Upload, User, UserCheck, Users, X, Info, ArrowRight, ShieldCheck, Ticket, AlertCircle
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Customer, Establishment } from "./types";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

// --- Safe Supabase Initialization (Prevents WSOD) ---
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "https://obhispzgjmcupjacuhck.supabase.co";
const SUPABASE_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaGlzcHpnam1jdXBqYWN1aGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MTE3MjIsImV4cCI6MjA5MDk4NzcyMn0.gEBLLzO7rjIBE-azcxajyRnAAc6jsfJRNn9MH682y6A";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Auth Context Simulation ---
interface AuthUser {
  id: string;
  name: string;
  role: 'super' | 'establishment';
  email: string;
  estId?: string;
}

// --- Brand Assets ---
const KLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={cn("fill-primary w-10 h-10", className)}>
    <path d="M25 15 L25 85 M25 50 L75 15 M25 50 L75 85 M70 15 L80 15 M70 85 L80 85" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

// --- Component Helpers ---
const ContentWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-sm mx-auto flex flex-col items-center px-4 overflow-hidden">{children}</div>
);

const BaseInput = ({ icon: Icon, label, ...props }: any) => (
  <div className="w-full mb-4">
    {label && <span className="text-[8px] font-black uppercase text-[#2563EB] block mb-1.5 px-2 opacity-40">{label}</span>}
    <div className="w-full bg-[#F1F5F9] rounded-2xl border border-outline/10 focus-within:ring-2 focus-within:ring-primary/5 transition-all flex items-center px-4 h-14 overflow-hidden">
      {Icon && <Icon className="w-4 h-4 text-primary/30 mr-3 shrink-0" />}
      <input {...props} className="flex-grow bg-transparent text-[16px] font-bold border-none outline-none placeholder:text-slate-300" />
    </div>
  </div>
);

// --- 1. LANDING: LOGIN ---

const LandingView = ({ onLogin }: { onLogin: (authData: AuthUser) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
         const user = await res.json();
         onLogin({ id: user.id, name: user.name, role: user.role, email: user.admin_email, estId: user.id });
      } else {
         setError("Os dados estão incorretos.");
      }
    } catch (e) {
      setError("Falha de conexão.");
    }
    setLoading(false);
  };

  return (
    <ContentWrapper>
      <div className="pt-24 space-y-16 flex flex-col items-center w-full">
          <div className="text-center space-y-4">
            <KLogo className="w-20 h-20 mb-8 mx-auto animate-pulse" />
            <h1 className="text-4xl font-black text-[#0F172A] uppercase tracking-tighter">KwikFilas<br/><span className="text-[#2563EB] italic font-medium tracking-normal">Portal.</span></h1>
            <p className="text-[9px] font-black uppercase text-slate-300 tracking-[0.6em] mt-2">Acesso Exclusivo para Gestão Profissional.</p>
          </div>

          <div className="card-main w-full space-y-6">
            <form onSubmit={handleLogin} className="space-y-1">
               <BaseInput icon={Mail} value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="Utilizador / Email" type="email" required />
               <BaseInput icon={Lock} value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="Senha Mestra" type="password" required />
               {error && <p className="text-[9px] font-bold text-red-500 text-center py-2 px-4 bg-red-50 rounded-lg">{error}</p>}
               <button type="submit" disabled={loading} className="w-full btn-primary py-7 mt-4 flex items-center justify-center gap-3 disabled:opacity-50">
                {loading ? "PROCURANDO..." : "ABRIR PORTAL" } <ArrowRight className="w-4 h-4"/>
               </button>
            </form>
          </div>
      </div>
    </ContentWrapper>
  );
};

// --- 2. SUPER ADMIN: GESTÃO ---

const SuperAdminView = ({ onLogout }: { onLogout: () => void }) => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [view, setView] = useState<"list" | "create">("list");
  const [formData, setFormData] = useState({ name: "", nif: "", admin_email: "", admin_password: "", logo_url: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const res = await fetch("/api/admin/establishments");
      const data = await res.json();
      setEstablishments(Array.isArray(data) ? data : []);
    } catch (e) { console.error("Refresh fail"); }
  };

  useEffect(() => { refresh(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const file = e.target.files[0];
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9]/g, '')}`;
      const { data, error: upError } = await supabase.storage.from('logos').upload(fileName, file);
      if (upError) { setError("Erro no Bucket: " + upError.message); } 
      else {
         const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(data.path);
         setFormData({ ...formData, logo_url: publicUrl });
      }
    } catch (e) { setError("Erro crítico no upload."); }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.logo_url) return setError("A foto do logótipo é obrigatória!");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/establishments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
         setFormData({ name: "", nif: "", admin_email: "", admin_password: "", logo_url: "" });
         setView("list");
         refresh();
      } else { setError("Dados já registados (NIF ou Email)."); }
    } catch (e) { setError("Falha na submissão."); }
    setLoading(false);
  };

  const handleDelete = async (targetId: string) => {
    const pass = prompt("Verificação de Identidade (Super User Password):");
    if (!pass) return;
    const res = await fetch("/api/admin/establishments/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId, superPassword: pass }),
    });
    if (res.ok) refresh(); else alert("Acesso negado.");
  };

  return (
    <ContentWrapper>
       <div className="w-full pt-8 pb-20 space-y-8 animate-in fade-in duration-500">
          <div className="flex justify-between items-center bg-white p-4 rounded-[28px] border border-outline/10 h-14 shadow-sm">
             <div className="flex items-center gap-2 px-2">
                <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[#2563EB]">Master Control</span>
             </div>
             <button onClick={onLogout} className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-outline/10"><LogOut className="w-4 h-4 text-slate-300" /></button>
          </div>

          <div className="flex bg-[#F1F5F9] p-1 rounded-2xl w-full border border-slate-200/50">
             <button onClick={() => setView("list")} className={cn("flex-grow py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", view === "list" ? "bg-white text-[#2563EB] shadow-sm" : "text-slate-400")}>Catálogo</button>
             <button onClick={() => setView("create")} className={cn("flex-grow py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", view === "create" ? "bg-white text-[#2563EB] shadow-sm" : "text-slate-400")}>Adicionar</button>
          </div>

          {view === "list" ? (
             <div className="space-y-3 w-full">
                {establishments.map(est => (
                   <div key={est.id} className="w-full bg-white p-4 rounded-[32px] border border-outline/20 flex items-center justify-between group active:scale-[0.98] transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-50 rounded-[20px] overflow-hidden shadow-inner flex items-center justify-center border border-outline/10">
                            {est.logo_url ? <img src={est.logo_url} className="w-full h-full object-cover" /> : <Store className="w-5 h-5 text-slate-200" />}
                         </div>
                         <div className="text-left"><h4 className="font-black text-sm text-[#0F172A] uppercase mb-1">{est.name}</h4><span className="text-[9px] font-bold text-[#2563EB] uppercase tracking-widest opacity-50">{est.initials} • {est.code}</span></div>
                      </div>
                      <button onClick={() => handleDelete(est.id)} className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4 text-red-500" /></button>
                   </div>
                ))}
             </div>
          ) : (
             <div className="card-main w-full space-y-6 pt-10 px-8 pb-8">
                <form onSubmit={handleCreate} className="space-y-1">
                   <div className="flex flex-col items-center mb-10">
                      <div className="w-24 h-24 bg-white rounded-[48px] shadow-sm border-2 border-dashed border-[#2563EB]/20 flex items-center justify-center overflow-hidden relative group">
                         {formData.logo_url ? <img src={formData.logo_url} className="w-full h-full object-cover" /> : (loading ? <Timer className="w-6 h-6 text-[#2563EB] animate-spin" /> : <ImageIcon className="w-8 h-8 text-[#2563EB]/10" />)}
                         <label className="absolute inset-0 bg-[#2563EB]/80 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all"><Camera className="w-6 h-6 text-white" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={loading} />
                         </label>
                      </div>
                      <span className="text-[10px] font-black uppercase text-[#2563EB] tracking-[.2em] mt-3">Logótipo Corporativo</span>
                   </div>
                   {error && <div className="p-4 mb-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3"><AlertCircle className="w-4 h-4 text-red-500" /><p className="text-[9px] font-bold text-red-600 leading-tight uppercase">{error}</p></div>}
                   <BaseInput value={formData.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} placeholder="Nome Profissional" required />
                   <BaseInput value={formData.nif} onChange={(e:any) => setFormData({...formData, nif: e.target.value})} placeholder="NIF Oficial (Único)" required />
                   <BaseInput value={formData.admin_email} onChange={(e:any) => setFormData({...formData, admin_email: e.target.value})} placeholder="Email Registrado" type="email" required />
                   <BaseInput value={formData.admin_password} onChange={(e:any) => setFormData({...formData, admin_password: e.target.value})} placeholder="Senha de Gestão" type="password" required />
                   <button type="submit" disabled={loading} className="w-full btn-primary py-7 mt-6 shadow-elevated disabled:opacity-50 text-[11px] font-black uppercase tracking-widest">
                      {loading ? "GERANDO..." : "CONSTRUIR CANAL"}
                   </button>
                </form>
             </div>
          )}
       </div>
    </ContentWrapper>
  );
};

// --- 3. EST ADMIN: GESTÃO ---

const EstAdminView = ({ auth, onLogout }: { auth: AuthUser, onLogout: () => void }) => {
  const [est, setEst] = useState<Establishment | null>(null);
  const [manualPhone, setManualPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    const resArr = await fetch(`/api/admin/establishments?role=establishment&estId=${auth.estId}`);
    const data = await resArr.json();
    const found = data.find((e: any) => e.id === auth.estId);
    if (found) setEst(found);
  };

  useEffect(() => { refresh(); const itv = setInterval(refresh, 4000); return () => clearInterval(itv); }, []);

  const handleNext = async () => {
    if (!est) return;
    setLoading(true);
    await fetch(`/api/establishments/${est.code}/next`, { method: "POST" });
    refresh();
    setLoading(false);
  };

  const handleManualJoin = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!est || !manualPhone) return;
     setLoading(true);
     await fetch("/api/queue/join", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ phone: manualPhone, estCode: est.code }),
     });
     setManualPhone("");
     refresh();
     setLoading(false);
  };

  if (!est) return <div className="min-h-screen flex items-center justify-center bg-white"><Timer className="animate-spin text-[#2563EB]" /></div>;

  const current = (est.queues || []).find(q => q.status === "called");
  const waiting = (est.queues || []).filter(q => q.status === "waiting");

  return (
    <ContentWrapper>
       <div className="w-full pt-8 pb-20 space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-[32px] border border-outline/10 h-14 shadow-sm">
             <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 bg-slate-50 rounded-xl overflow-hidden border border-outline/5 shadow-inner">
                   {est.logo_url ? <img src={est.logo_url} className="w-full h-full object-cover" /> : <Store className="w-5 h-5 text-slate-100" />}
                </div>
                <div className="leading-none"><h4 className="font-black text-[12px] uppercase text-[#2563EB] mb-0.5">{est.name}</h4><span className="text-[9px] font-bold text-slate-300 uppercase">{est.code}</span></div>
             </div>
             <button onClick={onLogout} className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-outline/10"><LogOut className="w-4.5 h-4.5 text-slate-400" /></button>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button onClick={handleNext} disabled={waiting.length === 0 || loading} className={cn("col-span-2 p-12 rounded-[64px] flex flex-col items-center gap-6 transition-all", waiting.length > 0 ? "bg-[#2563EB] text-white shadow-elevated" : "bg-slate-50 opacity-40 border border-dashed border-slate-200")}>
                <div className={cn("w-14 h-14 rounded-full flex items-center justify-center", waiting.length > 0 ? "bg-white/20 animate-pulse" : "bg-slate-200")}>
                   <Bell className="w-7 h-7 fill-white" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">{waiting.length > 0 ? (loading ? "CHAMANDO..." : "CHAMAR PRÓXIMO") : "FILA LIMPA"}</h2>
             </button>
             <div className="bg-[#F8FAFC] p-8 rounded-[48px] text-center border border-outline/10"><span className="text-[10px] font-black uppercase opacity-20 block mb-1 tracking-widest leading-none">Aguardando</span><span className="text-2xl font-black text-[#0F172A]">{waiting.length}</span></div>
             <div className="bg-[#2563EB]/5 p-8 rounded-[48px] text-center border border-[#2563EB]/5"><span className="text-[10px] font-black uppercase text-[#2563EB] opacity-40 block mb-1 tracking-widest leading-none">Em Painel</span><span className="text-2xl font-black text-[#2563EB]">{current ? current.ticket_number.split('-').pop() : '--'}</span></div>
          </div>

          <div className="card-main w-full p-8 space-y-4">
             <div className="flex items-center gap-3 mb-2 px-2"><Ticket className="w-4 h-4 text-[#2563EB]" /><span className="text-[10px] font-black uppercase text-[#2563EB] opacity-40 tracking-widest">Senha Manual</span></div>
             <form onSubmit={handleManualJoin} className="flex gap-2">
                <input disabled={loading} value={manualPhone} onChange={e => setManualPhone(e.target.value)} className="flex-grow bg-slate-50 p-5 rounded-[24px] text-[16px] font-bold outline-none border-none shadow-inner" placeholder="9XX XXX XXX" />
                <button type="submit" disabled={loading} className="bg-[#2563EB] text-white px-6 rounded-[24px] shadow-sm"><Plus className="w-6 h-6"/></button>
             </form>
          </div>

          <div className="space-y-4 w-full">
             <div className="flex justify-between items-center px-4"><span className="text-[10px] font-black uppercase text-[#2563EB]/30 tracking-[0.4em]">Fila Activa</span><Users className="w-4 h-4 text-slate-100" /></div>
             {waiting.length > 0 ? (
               waiting.map((q, i) => (
                <div key={q.id} className="bg-white p-5 rounded-[44px] border border-outline/10 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all animate-in slide-in-from-bottom-2 duration-300">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 text-[#2563EB] font-black rounded-3xl flex flex-col items-center justify-center border border-outline/10">
                         <span className="text-[10px] opacity-20">#{i+1}</span>
                         <span className="text-base">{q.ticket_number.split('-').pop()}</span>
                      </div>
                      <div className="text-left leading-none"><h4 className="font-black text-[16px] text-[#0F172A] mb-1">{q.phone}</h4><p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Aguardando Vez</p></div>
                   </div>
                   <div className="p-3 bg-white border border-outline/10 rounded-2xl"><QRCodeSVG value={`https://kwikfilas.vercel.app/?est=${est.code}`} size={32} /></div>
                </div>
               ))
             ) : (
                <div className="py-24 flex flex-col items-center opacity-10 grayscale text-center"><Timer className="w-10 h-10 mb-4" /><span className="text-[10px] font-black uppercase tracking-widest leading-none">Sem Actividade Digital</span></div>
             )}
          </div>
       </div>
    </ContentWrapper>
  );
};

// --- 4. CLIENTE: ENTRADA VIA QR ---

const ClientView = ({ estCode }: { estCode: string }) => {
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
             setMyTicket(ticket || null);
          }
       }
     } catch (e) { console.error("Client refresh fail"); }
     setLoading(false);
  };

  useEffect(() => { refresh(); const itv = setInterval(refresh, 3000); return () => clearInterval(itv); }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/queue/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, estCode }),
    });
    if (res.ok) { localStorage.setItem(`kw_phone_${estCode}`, phone); refresh(); }
    else { alert("Este número já possui senha activa."); }
    setLoading(false);
  };

  if (loading && !est) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent animate-spin rounded-full"></div></div>;
  if (!est) return <div className="min-h-screen flex flex-col items-center justify-center px-16 text-center space-y-10"><Info className="w-12 h-12 text-slate-100" /><p className="text-[10px] font-black uppercase opacity-20 tracking-widest leading-relaxed">Código de Canal Expirado.<br/>Por favor, escaneie o QR Code novamente.</p></div>;

  if (myTicket) {
     const position = (est.queues || []).filter((q: any) => q.status === "waiting" && new Date(q.joined_at).getTime() < new Date(myTicket.joined_at).getTime()).length + 1;
     const isCalled = myTicket.status === "called";

     return (
       <ContentWrapper>
         <div className="py-20 space-y-16 w-full flex flex-col items-center animate-in fade-in">
            <div className="w-28 h-28 bg-white rounded-[48px] shadow-sm flex items-center justify-center overflow-hidden border border-outline/10 relative">
               <img src={est.logo_url} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-[#2563EB]/5"></div>
            </div>
            <div className="bg-white rounded-[80px] p-16 shadow-elevated border border-outline/5 flex flex-col items-center gap-10 w-full relative group">
               <div className="relative w-56 h-56 flex items-center justify-center">
                  <div className={cn("absolute inset-0 rounded-full border-[6px] border-dashed transition-all duration-1000", isCalled ? "border-green-500 animate-spin-slow scale-110" : "border-[#2563EB]/5 animate-spin-slow-reverse")}></div>
                  <div className="text-center pt-3">
                     <span className={cn("text-8xl font-black tracking-tighter leading-none transition-all duration-500", isCalled ? "text-green-600 scale-125" : "text-[#2563EB] opacity-90")}>
                       {myTicket.ticket_number.split('-').pop()}
                     </span>
                  </div>
               </div>
               <div className="text-center space-y-3">
                  <h3 className="text-4xl font-black tracking-tighter uppercase leading-none">{isCalled ? "SUA VEZ!" : `${position}º NA Fila`}</h3>
                  <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.4em] leading-relaxed px-8">{isCalled ? "DIRIJA-SE AO BALCÃO PARA ATENDIMENTO." : "ESTE TICKET GARANTE O SEU LUGAR DIGITAL."}</p>
               </div>
               {isCalled && <div className="absolute -top-4 bg-green-500 text-white px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest animate-bounce">Notificação Activa</div>}
            </div>
            <button onClick={() => { localStorage.removeItem(`kw_phone_${estCode}`); setMyTicket(null); }} className="text-[11px] font-black text-slate-200 uppercase tracking-[0.4em] hover:text-red-500 active:scale-95 transition-all">Sair do Canal</button>
         </div>
       </ContentWrapper>
     );
  }

  return (
    <ContentWrapper>
       <div className="py-20 space-y-12 w-full text-center animate-in slide-in-from-top-4">
          <div className="w-28 h-28 bg-white rounded-[48px] shadow-sm mx-auto flex items-center justify-center overflow-hidden border border-outline/10 relative">
             <img src={est.logo_url} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-[#2563EB]/5"></div>
          </div>
          <div className="space-y-4">
             <h1 className="text-5xl font-black text-[#0F172A] uppercase leading-none tracking-tighter opacity-90">{est.name}</h1>
             <p className="text-[10px] font-black text-[#2563EB] uppercase tracking-[0.6em] opacity-40 px-6">Mobilidade e Controle de Público</p>
          </div>
          <div className="card-main w-full space-y-12 p-12 bg-white mt-12 shadow-elevated">
             <div className="text-center space-y-1">
                <h2 className="text-3xl font-black uppercase tracking-tight text-[#0F172A]">Ticket Digital</h2>
                <p className="text-[10px] font-black text-[#2563EB] uppercase tracking-[0.4em] opacity-50">Confirme o seu Telemóvel</p>
             </div>
             <form onSubmit={handleJoin} className="space-y-10">
                <BaseInput value={phone} onChange={(e:any) => setPhone(e.target.value)} placeholder="9XX XXX XXX" type="tel" required />
                <button type="submit" disabled={loading} className="w-full btn-primary py-10 tracking-[0.5em] shadow-elevated uppercase text-[12px] font-black">
                   {loading ? "VALIDANDO..." : "OBTER SENHA"}
                </button>
             </form>
          </div>
       </div>
    </ContentWrapper>
  );
};

// --- MAIN APP ---

export default function App() {
  const [auth, setAuth] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem("kw_auth");
    if (saved) { try { return JSON.parse(saved); } catch(e) { return null; } }
    return null;
  });
  const [clientEstCode, setClientEstCode] = useState<string | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const code = p.get("est");
    if (code) setClientEstCode(code);
  }, []);

  const handleLogin = (data: AuthUser) => {
    setAuth(data);
    localStorage.setItem("kw_auth", JSON.stringify(data));
  };

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem("kw_auth");
  };

  return (
    <div className="bg-white min-h-screen selection:bg-[#2563EB]/5 overflow-x-hidden relative scroll-smooth antialiased">
      <style>{`
        :root { --primary: #2563EB; --on-surface: #0F172A; }
        body { background-color: #ffffff; color: #0F172A; font-family: 'Inter', sans-serif; }
        .btn-primary { background-color: #2563EB !important; color: #ffffff !important; border-radius: 24px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-primary:active { transform: scale(0.96); }
        .shadow-elevated { box-shadow: 0 40px 100px -20px rgba(37, 99, 235, 0.2); }
        .card-main { border-radius: 64px; border: 1px solid rgba(15, 23, 42, 0.05); }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-slow-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        .animate-spin-slow-reverse { animation: spin-slow-reverse 15s linear infinite; }
      `}</style>
      
      {clientEstCode ? (
        <ClientView estCode={clientEstCode} />
      ) : auth ? (
        auth.role === 'super' ? <SuperAdminView onLogout={handleLogout} /> : <EstAdminView auth={auth} onLogout={handleLogout} />
      ) : (
        <LandingView onLogin={handleLogin} />
      )}
    </div>
  );
}
