import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bell, Building, Camera, CheckCircle2, ChevronLeft, ChevronRight, Clock, ExternalLink, Image as ImageIcon, 
  LayoutDashboard, Lock, LogOut, Mail, Phone as PhoneIcon, Plus, QrCode, Search, Smartphone, Store, Timer, Trash2, 
  Upload, User, UserCheck, Users, X, Info, ArrowRight, ShieldCheck, Ticket, AlertCircle, History
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

const KLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={cn("fill-primary w-8 h-8", className)}>
    <path d="M25 15 L25 85 M25 50 L75 15 M25 50 L75 85 M70 15 L80 15 M70 85 L80 85" stroke="currentColor" strokeWidth="8" strokeLinecap="square" />
  </svg>
);

const ContentWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-sm mx-auto flex flex-col items-center px-4">{children}</div>
);

const BaseInput = ({ icon: Icon, label, ...props }: any) => (
  <div className="w-full mb-3">
    {label && <span className="text-[7px] font-bold uppercase text-[#2563EB] block mb-1 px-1 opacity-60">{label}</span>}
    <div className="w-full bg-[#F8FAFC] rounded-none border border-slate-200 focus-within:border-primary transition-all flex items-center px-3 h-12">
      {Icon && <Icon className="w-3.5 h-3.5 text-primary/30 mr-2 shrink-0" />}
      <input {...props} className="flex-grow bg-transparent text-[14px] font-bold border-none outline-none placeholder:text-slate-300" />
    </div>
  </div>
);

// --- 1. LANDING: LOGIN (SQUARE DESIGN) ---
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
      } else { setError("Credenciais Inválidas."); }
    } catch (e) { setError("Falha de Conexão."); }
    setLoading(false);
  };

  return (
    <ContentWrapper>
      <div className="pt-20 space-y-12 flex flex-col items-center w-full">
          <div className="text-center space-y-3">
            <KLogo className="w-16 h-16 mb-6 mx-auto" />
            <h1 className="text-3xl font-black text-[#0F172A] uppercase tracking-tighter">KwikFilas<br/><span className="text-[#2563EB] italic font-medium tracking-normal text-xl">Admin.</span></h1>
            <p className="text-[8px] font-bold uppercase text-slate-400 tracking-[0.4em] mt-2">Plataforma de Gestão de Público.</p>
          </div>
          <div className="w-full space-y-4 bg-white p-6 border border-slate-100">
            <form onSubmit={handleLogin} className="space-y-0.5">
               <BaseInput icon={Mail} value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="Utilizador" type="email" required />
               <BaseInput icon={Lock} value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="Senha" type="password" required />
               {error && <p className="text-[8px] font-bold text-red-500 text-center py-2 uppercase bg-red-50 mb-4">{error}</p>}
               <button type="submit" disabled={loading} className="w-full bg-[#2563EB] text-white py-5 mt-4 flex items-center justify-center gap-2 disabled:opacity-50 font-black text-[10px] uppercase tracking-widest rounded-none">
                {loading ? "VALIDANDO..." : "ABRIR PAINEL" } <ArrowRight className="w-3 h-3"/>
               </button>
            </form>
          </div>
      </div>
    </ContentWrapper>
  );
};

// --- 2. SUPER ADMIN: GESTÃO (SQUARE DESIGN) ---
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
    try {
      const file = e.target.files[0];
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9]/g, '')}`;
      const { data, error: upError } = await supabase.storage.from('logos').upload(fileName, file);
      if (upError) { setError("Erro de Bucket: " + upError.message); } 
      else {
         const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(data.path);
         setFormData({ ...formData, logo_url: publicUrl });
      }
    } catch (e) { setError("Erro no upload."); }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.logo_url) return setError("Logótipo necessário.");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/establishments", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) { refresh(); setView("list"); setFormData({ name: "", nif: "", admin_email: "", admin_password: "", logo_url: "" }); }
      else { setError("Conflito de NIF/Email."); }
    } catch (e) { setError("Erro na submissão."); }
    setLoading(false);
  };

  return (
    <ContentWrapper>
       <div className="w-full pt-6 pb-20 space-y-6">
          <div className="flex justify-between items-center bg-white p-3 border border-slate-200">
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                <span className="text-[8px] font-black uppercase tracking-widest text-[#2563EB]">Master Control</span>
             </div>
             <button onClick={onLogout} className="p-2 bg-slate-50 border border-slate-200"><LogOut className="w-3.5 h-3.5 text-slate-400" /></button>
          </div>
          <div className="flex bg-[#F8FAFC] border border-slate-200 p-1">
             <button onClick={() => setView("list")} className={cn("flex-grow py-2.5 text-[8px] font-black uppercase tracking-widest", view === "list" ? "bg-white text-[#2563EB] border border-slate-200" : "text-slate-400")}>LISTA</button>
             <button onClick={() => setView("create")} className={cn("flex-grow py-2.5 text-[8px] font-black uppercase tracking-widest", view === "create" ? "bg-white text-[#2563EB] border border-slate-200" : "text-slate-400")}>REGISTAR</button>
          </div>
          {view === "list" ? (
             <div className="space-y-2">
                {establishments.map(est => (
                   <div key={est.id} className="bg-white p-3 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden">
                            {est.logo_url ? <img src={est.logo_url} className="w-full h-full object-cover" /> : <Store className="w-4 h-4 text-slate-200" />}
                         </div>
                         <div className="text-left"><h4 className="font-black text-xs text-[#0F172A] uppercase">{est.name}</h4><span className="text-[8px] font-bold text-[#2563EB] uppercase tracking-widest opacity-50">{est.code}</span></div>
                      </div>
                   </div>
                ))}
             </div>
          ) : (
             <div className="bg-white p-6 border border-slate-100 space-y-4">
                <form onSubmit={handleCreate} className="space-y-0.5">
                   <div className="flex flex-col items-center mb-6">
                      <div className="w-20 h-20 bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative group">
                         {formData.logo_url ? <img src={formData.logo_url} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-slate-200" />}
                         <label className="absolute inset-0 bg-[#2563EB]/80 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer"><Camera className="w-5 h-5 text-white" /><input type="file" className="hidden" onChange={handleUpload} /></label>
                      </div>
                   </div>
                   {error && <p className="text-[8px] font-bold text-red-500 text-center py-2 uppercase bg-red-50 mb-4">{error}</p>}
                   <BaseInput value={formData.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} placeholder="Estabelecimento" required />
                   <BaseInput value={formData.nif} onChange={(e:any) => setFormData({...formData, nif: e.target.value})} placeholder="NIF" required />
                   <BaseInput value={formData.admin_email} onChange={(e:any) => setFormData({...formData, admin_email: e.target.value})} placeholder="Email Admin" type="email" required />
                   <BaseInput value={formData.admin_password} onChange={(e:any) => setFormData({...formData, admin_password: e.target.value})} placeholder="Senha Admin" type="password" required />
                   <button type="submit" disabled={loading} className="w-full bg-[#2563EB] text-white py-5 mt-4 font-black text-[10px] uppercase tracking-widest">ACTIVAR CANAL</button>
                </form>
             </div>
          )}
       </div>
    </ContentWrapper>
  );
};

// --- 3. EST ADMIN: GESTÃO (SQUARE + CRM DESIGN) ---
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

  useEffect(() => { refresh(); const itv = setInterval(refresh, 3000); return () => clearInterval(itv); }, []);

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
       method: "POST", headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ phone: manualPhone, estCode: est.code }),
     });
     setManualPhone(""); refresh(); setLoading(false);
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

  if (!est) return <div className="min-h-screen flex items-center justify-center bg-white"><Timer className="animate-spin text-primary" /></div>;

  const current = (est.queues || []).find(q => q.status === "called");
  const waiting = (est.queues || []).filter(q => q.status === "waiting");
  // Simular Histórico (todos os que passaram menos os curr/wait)
  const history = (est.queues || []).sort((a,b) => new Date(b.joined_at).getTime() - new Date(a.joined_at).getTime());

  return (
    <ContentWrapper>
       <div className="w-full pt-6 pb-24 space-y-6 flex flex-col items-center">
          {/* Header Compacto */}
          <div className="w-full bg-white border border-slate-200 p-3 flex flex-col items-center text-center space-y-2">
             <div className="w-16 h-16 bg-slate-50 border border-slate-100 overflow-hidden"><img src={est.logo_url} className="w-full h-full object-cover" /></div>
             <div><h4 className="font-black text-sm uppercase text-[#2563EB] leading-none">{est.name}</h4><span className="text-[7px] font-bold text-slate-300 uppercase tracking-widest">{est.code}</span></div>
          </div>

          <div className="w-full space-y-4 flex flex-col items-center">
             {/* CHAMADA (RECTO) */}
             <button onClick={handleNext} disabled={waiting.length === 0 || loading} className={cn("w-full py-10 px-6 border-4 flex flex-col items-center gap-4 transition-all", waiting.length > 0 ? "bg-[#2563EB] border-[#2563EB] text-white" : "bg-slate-50 border-slate-100 opacity-40")}>
                <Bell className={cn("w-6 h-6", waiting.length > 0 && "animate-pulse")} />
                <h2 className="text-xl font-black uppercase tracking-tighter">{waiting.length > 0 ? (loading ? "DISPARANDO..." : "CHAMAR PRÓXIMO") : "FILA LIMPA"}</h2>
                <p className="text-[8px] font-bold uppercase tracking-widest opacity-60">Sms será disparado automaticamente</p>
             </button>

             {/* INDICADORES COMPACTOS */}
             <div className="w-full flex gap-1.5">
                <div className="flex-grow bg-[#F8FAFC] p-6 border border-slate-200 text-center">
                   <span className="text-[7px] font-black uppercase opacity-20 block mb-0.5 tracking-widest">Em espera</span>
                   <span className="text-2xl font-black text-[#0F172A]">{waiting.length}</span>
                </div>
                <div className="flex-grow bg-[#2563EB]/5 p-6 border border-[#2563EB]/10 text-center">
                   <span className="text-[7px] font-black uppercase text-[#2563EB] opacity-40 block mb-0.5 tracking-widest">No Painel</span>
                   <span className="text-2xl font-black text-[#2563EB]">{current ? current.ticket_number.split('-').pop() : '--'}</span>
                </div>
             </div>

             {/* CRM: LISTAS RECTAS */}
             <div className="w-full space-y-1.5 flex flex-col items-center">
                <div className="w-full bg-white border border-slate-200 p-5 space-y-4 flex flex-col items-center">
                   <div className="flex items-center gap-2 border-b border-slate-50 pb-2 w-full justify-center"><Ticket className="w-3.5 h-3.5 text-primary" /><span className="text-[8px] font-black uppercase text-primary tracking-widest">Senha Manual</span></div>
                   <form onSubmit={handleManualJoin} className="w-full flex flex-col gap-1.5">
                      <input disabled={loading} value={manualPhone} onChange={e => setManualPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-4 text-base font-black outline-none text-center" placeholder="9XX XXX XXX" />
                      <button type="submit" disabled={loading} className="w-full bg-[#2563EB] text-white py-4 font-black uppercase text-[10px] tracking-widest">GERAR SENHA</button>
                   </form>
                </div>

                <div className="w-full bg-white border border-slate-200 p-5 flex flex-col items-center space-y-6">
                   <div className="flex flex-col items-center gap-1"><QrCode className="w-4 h-4 text-primary opacity-20" /><span className="text-[7px] font-black uppercase text-primary opacity-40 tracking-widest">Canal de Entrada</span></div>
                   <div id="main-qr-canvas" className="p-4 border border-slate-50"><QRCodeSVG value={`https://kwikfilas.vercel.app/?est=${est.code}`} size={140} level="H" imageSettings={{src: est.logo_url, x: undefined, y: undefined, height: 32, width: 32, excavate: true, }} /></div>
                   <button onClick={handlePrintQR} className="w-full bg-slate-50 text-slate-400 py-4 flex items-center justify-center gap-2 font-black uppercase text-[8px] tracking-[.3em] hover:bg-primary hover:text-white transition-all border border-slate-100">IMPRIMIR QR CODE</button>
                </div>

                {/* LISTA DE CLIENTES NA FILA */}
                <div className="w-full bg-slate-900 border border-slate-800 p-5 mt-4">
                   <div className="flex items-center justify-between mb-4"><span className="text-[9px] font-black uppercase text-primary tracking-[0.4em]">Fila Activa</span><Users className="w-3.5 h-3.5 text-slate-700" /></div>
                   <div className="space-y-1">
                      {waiting.map((q, i) => (
                        <div key={q.id} className="bg-slate-800 border border-slate-700 p-3 flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black text-primary">#{q.ticket_number.split('-').pop()}</span>
                              <div className="text-left"><span className="text-[12px] font-black text-white block leading-none">{q.phone}</span><span className="text-[6px] font-bold text-slate-500 uppercase">Aguardando</span></div>
                           </div>
                        </div>
                      ))}
                      {waiting.length === 0 && <p className="text-[8px] text-slate-700 uppercase py-6 text-center font-bold">Vazio</p>}
                   </div>
                </div>

                {/* LISTA DE CONTACTOS / CRM */}
                <div className="w-full bg-white border border-slate-200 p-5 mt-2">
                   <div className="flex items-center justify-between mb-4"><span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.4em]">Lista de Contactos</span><History className="w-3.5 h-3.5 text-slate-200" /></div>
                   <div className="space-y-1 h-48 overflow-y-auto pr-1">
                      {history.map((q) => (
                        <div key={q.id} className="border-b border-slate-50 p-2.5 flex items-center justify-between last:border-none">
                           <div className="text-left"><span className="text-[11px] font-black text-slate-800 block leading-none">{q.phone}</span><span className="text-[6px] font-bold text-slate-400 uppercase">{new Date(q.joined_at).toLocaleTimeString()}</span></div>
                           <span className={cn("text-[6px] font-black uppercase px-2 py-0.5", q.status === 'called' ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-300")}>{q.status}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <button onClick={onLogout} className="text-[8px] font-black text-slate-200 uppercase tracking-[0.5em] pt-12 hover:text-red-500 transition-all">Terminar Sessão</button>
             </div>
          </div>
       </div>
    </ContentWrapper>
  );
};

// --- 4. CLIENTE: ENTRADA VIA QR (SQUARE DESIGN) ---
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
    if (!phone || phone.length < 9) return;
    setLoading(true);
    const res = await fetch("/api/queue/join", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, estCode }),
    });
    if (res.ok) { localStorage.setItem(`kw_phone_${estCode}`, phone); refresh(); }
    else { alert("Já se encontra na fila."); }
    setLoading(false);
  };

  if (loading && !est) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin"></div></div>;
  if (!est) return <div className="min-h-screen flex flex-col items-center justify-center px-12 text-center space-y-6"><Info className="w-8 h-8 text-slate-100" /><p className="text-[8px] font-black uppercase text-slate-300 tracking-widest">Canal Indisponível.</p></div>;

  if (myTicket) {
     const position = (est.queues || []).filter((q: any) => q.status === "waiting" && new Date(q.joined_at).getTime() < new Date(myTicket.joined_at).getTime()).length + 1;
     const isCalled = myTicket.status === "called";
     return (
       <ContentWrapper>
         <div className="py-20 space-y-12 w-full flex flex-col items-center animate-in fade-in">
            <div className="w-20 h-20 bg-white border border-slate-100 flex items-center justify-center overflow-hidden"><img src={est.logo_url} className="w-full h-full object-cover" /></div>
            <div className="bg-white border-2 border-slate-100 p-12 flex flex-col items-center gap-8 w-full">
               <div className="relative w-44 h-44 flex items-center justify-center border-4 border-primary/5">
                  <span className={cn("text-7xl font-black tracking-tighter leading-none transition-all", isCalled ? "text-green-600 animate-pulse" : "text-primary")}>{myTicket.ticket_number.split('-').pop()}</span>
               </div>
               <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black tracking-tighter uppercase">{isCalled ? "SUA VEZ!" : `${position}º NA Fila`}</h3>
                  <p className="text-[8px] font-black uppercase text-slate-300 tracking-[0.3em]">{isCalled ? "DIRIJA-SE AO BALCÃO." : "AGUARDE A CHAMADA NO LOCAL."}</p>
               </div>
            </div>
            <button onClick={() => { localStorage.removeItem(`kw_phone_${estCode}`); setMyTicket(null); }} className="text-[9px] font-black text-slate-200 uppercase tracking-widest">Sair da Fila</button>
         </div>
       </ContentWrapper>
     );
  }

  return (
    <ContentWrapper>
       <div className="py-16 space-y-10 w-full text-center animate-in slide-in-from-top-4">
          <div className="w-24 h-24 bg-white border border-slate-100 mx-auto flex items-center justify-center overflow-hidden"><img src={est.logo_url} className="w-full h-full object-cover" /></div>
          <div className="space-y-2">
             <h1 className="text-4xl font-black text-[#0F172A] uppercase tracking-tighter leading-none">{est.name}</h1>
             <p className="text-[9px] font-black text-[#2563EB] uppercase tracking-[0.4em] opacity-40">Fila Digital Inteligente</p>
          </div>
          <div className="bg-white border border-slate-200 p-10 space-y-10 w-full shadow-sm">
             <div className="text-center space-y-0.5">
                <h2 className="text-2xl font-black uppercase tracking-tight text-[#0F172A]">Ticket Digital</h2>
                <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em] opacity-50">Registe o seu telemóvel</p>
             </div>
             <form onSubmit={handleJoin} className="space-y-8">
                <BaseInput value={phone} onChange={(e:any) => setPhone(e.target.value)} placeholder="9XX XXX XXX" type="tel" required />
                <button type="submit" disabled={loading} className="w-full bg-[#2563EB] text-white py-8 tracking-[0.4em] uppercase text-[10px] font-black">OBTER SENHA</button>
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

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const code = p.get("est");
    if (code) setClientEstCode(code);
  }, []);

  const handleLogin = (data: AuthUser) => { setAuth(data); localStorage.setItem("kw_auth", JSON.stringify(data)); };
  const handleLogout = () => { setAuth(null); localStorage.removeItem("kw_auth"); };

  return (
    <div className="bg-white min-h-screen selection:bg-[#2563EB]/5 overflow-x-hidden relative scroll-smooth antialiased">
      <style>{`
        :root { --primary: #2563EB; --on-surface: #0F172A; }
        body { background-color: #ffffff; color: #0F172A; font-family: 'Inter', sans-serif; overflow-x: hidden; }
        * { border-radius: 0px !important; }
        input, button, div, span { border-radius: 0px !important; }
        .shadow-sm { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.03); }
      `}</style>
      {clientEstCode ? ( <ClientView estCode={clientEstCode} /> ) : auth ? ( auth.role === 'super' ? <SuperAdminView onLogout={handleLogout} /> : <EstAdminView auth={auth} onLogout={handleLogout} /> ) : ( <LandingView onLogin={handleLogin} /> )}
    </div>
  );
}
