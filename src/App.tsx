import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bell, Building, Camera, CheckCircle2, ChevronLeft, ChevronRight, Clock, ExternalLink, Image as ImageIcon, 
  LayoutDashboard, Lock, LogOut, Mail, Phone as PhoneIcon, Plus, QrCode, Search, Smartphone, Store, Timer, Trash2, 
  Upload, User, UserCheck, Users, X, Info, ArrowRight, ShieldCheck, Ticket
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Customer, Establishment } from "./types";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

// --- Initialization: Supabase Cloud Client ---
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

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
  <div className="w-full max-w-sm mx-auto flex flex-col items-center px-4">{children}</div>
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

// --- 1. LANDING: SÓ LOGIN ---

const LandingView = ({ onLogin }: { onLogin: (authData: AuthUser) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
       const user = await res.json();
       onLogin({ id: user.id, name: user.name, role: user.role, email: user.admin_email, estId: user.id });
    } else {
       setError("Credenciais de acesso incorretas");
    }
    setLoading(false);
  };

  return (
    <ContentWrapper>
      <div className="pt-24 space-y-16 flex flex-col items-center w-full">
          <div className="text-center space-y-4">
            <KLogo className="w-20 h-20 mb-8 mx-auto animate-pulse-subtle" />
            <h1 className="text-4xl font-black text-on-surface uppercase tracking-tighter">KwikFilas<br/><span className="text-primary italic font-medium tracking-normal">Admin.</span></h1>
            <p className="text-[9px] font-black uppercase text-slate-300 tracking-[0.6em] mt-2">Acesso Restrito ao Painel de Gestão.</p>
          </div>

          <div className="card-main w-full space-y-6">
            <form onSubmit={handleLogin} className="space-y-1">
               <BaseInput icon={Mail} value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="Email Corporativo" type="email" required />
               <BaseInput icon={Lock} value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="Palavra-passe" type="password" required />
               {error && <p className="text-[9px] font-bold text-red-500 text-center py-2 px-4 bg-red-50 rounded-lg">{error}</p>}
               <button type="submit" disabled={loading} className="w-full btn-primary py-7 mt-4 flex items-center justify-center gap-3 disabled:opacity-50">
                {loading ? "VALIDANDO..." : "ENTRAR NO SISTEMA" } <ArrowRight className="w-4 h-4"/>
               </button>
            </form>
          </div>
      </div>
    </ContentWrapper>
  );
};

// --- 2. SUPER ADMIN: GESTÃO COMPLETA ---

const SuperAdminView = ({ onLogout }: { onLogout: () => void }) => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [view, setView] = useState<"list" | "create">("list");
  const [formData, setFormData] = useState({ name: "", nif: "", admin_email: "", admin_password: "", logo_url: "" });
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    const res = await fetch("/api/admin/establishments");
    const data = await res.json();
    setEstablishments(Array.isArray(data) ? data : []);
  };

  useEffect(() => { refresh(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.logo_url) return alert("Logótipo obrigatório para registro");
    setLoading(true);
    await fetch("/api/admin/establishments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setFormData({ name: "", nif: "", admin_email: "", admin_password: "", logo_url: "" });
    setView("list");
    refresh();
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    
    const { data, error } = await supabase.storage.from('logos').upload(fileName, file);

    if (error) {
       alert("Erro no Cloud Storage: " + error.message);
    } else {
       const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(data.path);
       setFormData({ ...formData, logo_url: publicUrl });
    }
    setLoading(false);
  };

  const handleDelete = async (targetId: string) => {
    const pass = prompt("Confirme a Senha Master para eliminar o parceiro:");
    if (!pass) return;
    const res = await fetch("/api/admin/establishments/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId, superPassword: pass }),
    });
    if (res.ok) refresh();
    else alert("Erro! Senha Mestra Inválida.");
  };

  return (
    <ContentWrapper>
       <div className="w-full pt-8 pb-20 space-y-8">
          <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-outline/10 h-14">
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[9px] font-black uppercase tracking-widest text-on-surface">Super Admin</span>
             </div>
             <button onClick={onLogout} className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-outline/20"><LogOut className="w-4 h-4 text-slate-300" /></button>
          </div>

          <div className="flex bg-[#F1F5F9] p-1 rounded-2xl w-full">
             <button onClick={() => setView("list")} className={cn("flex-grow py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", view === "list" ? "bg-white text-primary shadow-sm" : "text-slate-400")}>Catálogo</button>
             <button onClick={() => setView("create")} className={cn("flex-grow py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", view === "create" ? "bg-white text-primary shadow-sm" : "text-slate-400")}>Novo Parceiro</button>
          </div>

          {view === "list" ? (
             <div className="space-y-3 w-full">
                {establishments.map(est => (
                   <div key={est.id} className="w-full bg-white p-4 rounded-3xl border border-outline/20 flex items-center justify-between group active:scale-[0.98] transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-50 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border border-outline/10">
                            {est.logo_url ? <img src={est.logo_url} className="w-full h-full object-cover" /> : <Store className="w-5 h-5 text-slate-200" />}
                         </div>
                         <div className="text-left">
                            <h4 className="font-black text-sm text-on-surface uppercase leading-none mb-1">{est.name}</h4>
                            <span className="text-[9px] font-bold text-primary uppercase tracking-widest opacity-50">{est.initials} • {est.code}</span>
                         </div>
                      </div>
                      <button onClick={() => handleDelete(est.id)} className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4 text-red-500" /></button>
                   </div>
                ))}
             </div>
          ) : (
             <div className="card-main w-full space-y-6">
                <form onSubmit={handleCreate} className="space-y-1">
                   <div className="flex flex-col items-center mb-6">
                      <div className="w-20 h-20 bg-slate-50 rounded-[32px] border-2 border-dashed border-primary/20 flex items-center justify-center overflow-hidden relative group">
                         {formData.logo_url ? <img src={formData.logo_url} className="w-full h-full object-cover" /> : (loading ? <Timer className="w-6 h-6 text-primary animate-spin" /> : <ImageIcon className="w-6 h-6 text-slate-200" />)}
                         <label className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all"><Camera className="w-5 h-5 text-white" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={loading} />
                         </label>
                      </div>
                      <span className="text-[8px] font-black uppercase text-primary tracking-[.2em] mt-2">Logótipo Corporativo</span>
                   </div>
                   <BaseInput value={formData.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} placeholder="Nome Comercial" required />
                   <BaseInput value={formData.nif} onChange={(e:any) => setFormData({...formData, nif: e.target.value})} placeholder="NIF da Empresa" required />
                   <BaseInput value={formData.admin_email} onChange={(e:any) => setFormData({...formData, admin_email: e.target.value})} placeholder="Email de Admin" type="email" required />
                   <BaseInput value={formData.admin_password} onChange={(e:any) => setFormData({...formData, admin_password: e.target.value})} placeholder="Senha de Acesso" type="password" required />
                   <button type="submit" disabled={loading} className="w-full btn-primary py-6 mt-4 shadow-elevated disabled:opacity-50">
                      {loading ? "PROCESSANDO..." : "CONCLUIR CADASTRO"}
                   </button>
                </form>
             </div>
          )}
       </div>
    </ContentWrapper>
  );
};

// --- 3. EST ADMIN: GESTÃO DE FILA ---

const EstAdminView = ({ auth, onLogout }: { auth: AuthUser, onLogout: () => void }) => {
  const [est, setEst] = useState<Establishment | null>(null);
  const [manualPhone, setManualPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    const res = await fetch(`/api/admin/establishments?role=establishment&estId=${auth.estId}`);
    const data = await res.json();
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
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ phone: manualPhone, estCode: est.code }),
     });
     setManualPhone("");
     refresh();
     setLoading(false);
  };

  if (!est) return <div className="min-h-screen flex items-center justify-center"><Timer className="animate-spin text-primary" /></div>;

  const current = (est.queues || []).find(q => q.status === "called");
  const waiting = (est.queues || []).filter(q => q.status === "waiting");

  return (
    <ContentWrapper>
       <div className="w-full pt-8 pb-20 space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-outline/10 h-14 shadow-sm">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl overflow-hidden border border-outline/10 shadow-inner">
                   {est.logo_url ? <img src={est.logo_url} className="w-full h-full object-cover" /> : <Store className="w-5 h-5 text-slate-200" />}
                </div>
                <div><h4 className="font-black text-[11px] leading-none mb-1 uppercase tracking-tighter">{est.name}</h4><span className="text-[10px] font-bold text-primary opacity-40">{est.code}</span></div>
             </div>
             <button onClick={onLogout} className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center"><LogOut className="w-4 h-4 text-slate-300" /></button>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button onClick={handleNext} disabled={waiting.length === 0 || loading} className={cn("col-span-2 p-10 rounded-[48px] flex flex-col items-center gap-6 transition-all", waiting.length > 0 ? "bg-primary text-white shadow-elevated" : "bg-slate-50 opacity-40")}>
                <div className={cn("w-14 h-14 rounded-full flex items-center justify-center transition-all", waiting.length > 0 ? "bg-white/20 animate-pulse-subtle" : "bg-slate-200")}>
                   <Bell className="w-6 h-6 fill-white" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">{waiting.length > 0 ? (loading ? "CHAMANDO..." : "CHAMAR") : "SEM FILA"}</h2>
             </button>
             <div className="bg-[#F8FAFC] p-6 rounded-[34px] text-center border border-outline/10"><span className="text-[10px] font-black uppercase opacity-20 block mb-1">Aguardando</span><span className="text-2xl font-black text-on-surface">{waiting.length}</span></div>
             <div className="bg-primary/5 p-6 rounded-[34px] text-center border border-primary/5"><span className="text-[10px] font-black uppercase text-primary opacity-40 block mb-1">No Painel</span><span className="text-2xl font-black text-primary">{current ? current.ticket_number.split('-').pop() : '--'}</span></div>
          </div>

          <div className="card-main w-full p-6 space-y-4">
             <div className="flex items-center gap-2 mb-2"><Ticket className="w-4 h-4 text-primary" /><span className="text-[10px] font-black uppercase text-primary opacity-40 tracking-widest">Senha Manual</span></div>
             <form onSubmit={handleManualJoin} className="flex gap-2">
                <input disabled={loading} value={manualPhone} onChange={e => setManualPhone(e.target.value)} className="flex-grow bg-slate-50 p-4.5 rounded-2xl text-[16px] font-bold outline-none border-none shadow-inner" placeholder="Pelo Telemóvel" />
                <button type="submit" disabled={loading} className="bg-primary text-white p-4.5 rounded-2xl shadow-sm"><Plus className="w-5 h-5"/></button>
             </form>
          </div>

          <div className="space-y-2.5 w-full">
             <span className="text-[9px] font-black uppercase text-slate-300 tracking-[0.4em] px-2 block mb-4">Monitorização Activa</span>
             {waiting.length > 0 ? waiting.map((q, i) => (
                <div key={q.id} className="bg-white p-4.5 rounded-[32px] border border-outline/10 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 text-primary font-black rounded-2xl flex flex-col items-center justify-center border border-outline/10">
                         <span className="text-[10px] opacity-20">#{i+1}</span>
                         <span className="text-sm">{q.ticket_number.split('-').pop()}</span>
                      </div>
                      <div className="text-left"><h4 className="font-black text-[15px] text-on-surface leading-tight mb-0.5">{q.phone}</h4><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Aguardando no Local</p></div>
                   </div>
                   <div className="p-3 bg-white border border-outline/20 rounded-2xl"><QRCodeSVG value={`https://kwikfilas.vercel.app/?est=${est.code}`} size={32} /></div>
                </div>
             )) : (
              <div className="py-20 flex flex-col items-center opacity-10 grayscale text-center">
                 <Timer className="w-8 h-8 mb-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Fila Actual Limpa</span>
              </div>
             )}
          </div>
       </div>
    </ContentWrapper>
  );
};

// --- 4. CLIENTE: ENTRADA VIA QR CODE ---

const ClientView = ({ estCode }: { estCode: string }) => {
  const [est, setEst] = useState<Establishment | null>(null);
  const [phone, setPhone] = useState("");
  const [myTicket, setMyTicket] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
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
    if (res.ok) {
       localStorage.setItem(`kw_phone_${estCode}`, phone);
       refresh();
    } else {
       alert("Erro ao entrar na fila. Tente novamente.");
    }
    setLoading(false);
  };

  if (loading && !est) return <div className="min-h-screen flex items-center justify-center"><Timer className="animate-spin text-primary" /></div>;
  if (!est) return <div className="min-h-screen flex flex-col items-center justify-center px-12 text-center space-y-6"><X className="w-10 h-10 text-red-500 opacity-20" /><p className="text-[10px] font-black uppercase opacity-20">Este canal QR não está ativo ou foi expirado.</p></div>;

  if (myTicket) {
     const position = (est.queues || []).filter((q: any) => q.status === "waiting" && new Date(q.joined_at).getTime() < new Date(myTicket.joined_at).getTime()).length + 1;
     const isCalled = myTicket.status === "called";

     return (
       <ContentWrapper>
         <div className="py-20 space-y-12 w-full flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-[44px] shadow-sm flex items-center justify-center overflow-hidden border border-outline/10">
               <img src={est.logo_url} className="w-full h-full object-cover" />
            </div>
            <div className="bg-white rounded-[72px] p-12 shadow-elevated border border-outline/5 flex flex-col items-center gap-10 w-full relative">
               <div className="relative w-48 h-48 flex items-center justify-center">
                  <div className={cn("absolute inset-0 rounded-full border-4 border-dashed", isCalled ? "border-green-500 animate-spin-slow" : "border-primary/10 animate-spin-slow-reverse")}></div>
                  <div className="text-center pt-2">
                     <span className={cn("text-8xl font-black tracking-tighter leading-none transition-all", isCalled ? "text-green-600 scale-110" : "text-primary")}>
                       {myTicket.ticket_number.split('-').pop()}
                     </span>
                  </div>
               </div>
               <div className="text-center space-y-2">
                  <h3 className="text-3xl font-black tracking-tighter uppercase leading-none opacity-90">{isCalled ? "SUA VEZ!" : `${position}º NA Fila`}</h3>
                  <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] leading-relaxed px-6">{isCalled ? "DIRIJA-SE AO LOCAL IMEDIATAMENTE PARA SER ATENDIDO." : "ACOMPANHE O SEU POSICIONAMENTO DIGITAL EM TEMPO REAL."}</p>
               </div>
            </div>
            <button onClick={() => { localStorage.removeItem(`kw_phone_${estCode}`); setMyTicket(null); }} className="text-[10px] font-bold text-slate-200 uppercase tracking-widest hover:text-red-500 transition-all">Sair da Fila em Espera</button>
         </div>
       </ContentWrapper>
     );
  }

  return (
    <ContentWrapper>
       <div className="py-20 space-y-12 w-full text-center">
          <div className="w-24 h-24 bg-white rounded-[44px] shadow-sm mx-auto flex items-center justify-center overflow-hidden border border-outline/10">
             <img src={est.logo_url} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-4">
             <h1 className="text-4xl font-black text-on-surface uppercase leading-none tracking-tighter opacity-90">{est.name}</h1>
             <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em] opacity-40 px-6">Infraestrutura Mobile de Gestão de Público</p>
          </div>
          <div className="card-main w-full space-y-10 p-10 bg-white">
             <div className="text-center space-y-2">
                <h2 className="text-2xl font-black uppercase tracking-tight text-on-surface">Ticket Digital</h2>
                <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Validar para Iniciar</p>
             </div>
             <form onSubmit={handleJoin} className="space-y-8">
                <BaseInput value={phone} onChange={(e:any) => setPhone(e.target.value)} placeholder="Telemóvel (AO +244)" type="tel" required />
                <button type="submit" disabled={loading} className="w-full btn-primary py-8 tracking-[0.5em] shadow-elevated uppercase text-sm">
                   {loading ? "GERANDO..." : "OBTER SENHA"}
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
    if (saved) {
       try { return JSON.parse(saved); } catch(e) { return null; }
    }
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

  // 1. Cliente via QR (Absolute Priority)
  if (clientEstCode) return <div className="bg-white min-h-screen selection:bg-primary/5 overflow-x-hidden relative"><ClientView estCode={clientEstCode} /></div>;

  // 2. Admin (Only if Authenticated)
  if (auth) {
    return (
      <div className="bg-white min-h-screen selection:bg-primary/5 overflow-x-hidden relative">
        <style>{`
          :root { --primary: #2563EB; --on-surface: #0F172A; --surface-variant: #F1F5F9; }
          body { background-color: #ffffff; color: #0F172A; font-family: 'Inter', sans-serif; }
          .btn-primary { background-color: #2563EB !important; color: #ffffff !important; }
          .shadow-elevated { box-shadow: 0 20px 50px rgba(37, 99, 235, 0.15); }
        `}</style>
        {auth.role === 'super' ? <SuperAdminView onLogout={handleLogout} /> : <EstAdminView auth={auth} onLogout={handleLogout} />}
      </div>
    );
  }

  // 3. Login Inicial (Portal Admin)
  return <div className="bg-white min-h-screen selection:bg-primary/5 overflow-x-hidden relative"><LandingView onLogin={handleLogin} /></div>;
}
