import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bell, Building, Camera, CheckCircle2, ChevronLeft, ChevronRight, Clock, ExternalLink, Image as ImageIcon, 
  LayoutDashboard, Lock, LogOut, Mail, Pencil, Phone as PhoneIcon, Plus, QrCode, Search, Smartphone, Store, Timer, Trash2, 
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
            "pointer-events-auto p-4 flex items-center gap-3 border shadow-premium rounded-xl text-sm font-bold bg-white",
            t.type === 'success' ? "border-green-100 text-green-600" : "border-red-100 text-red-500"
          )}
        >
          {t.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {t.message}
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

const KLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={cn("text-[#3451D1] w-8 h-8", className)} fill="none">
    <path d="M25 15 L25 85 M25 50 L75 15 M25 50 L75 85 M70 15 L80 15 M70 85 L80 85" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
  </svg>
);

// --- 0. MARKETING: LANDING PAGE ---
const MarketingView = ({ onLoginClick }: { onLoginClick: () => void }) => {
  return (
    <div className="w-full bg-[#F8FAFD] font-['Inter'] min-h-screen">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100 h-20 flex items-center px-6 md:px-12 justify-between">
        <div className="flex items-center gap-2">
          <KLogo className="w-8 h-8 text-[#3451D1]" />
          <span className="font-bold text-xl tracking-tight text-[#0F172A]">KwikFilas</span>
        </div>
        <button onClick={onLoginClick} className="btn-ghost text-sm">
          Portal Parceiro
        </button>
      </nav>

      <section className="pt-40 pb-20 px-6 md:px-12 max-w-5xl mx-auto flex flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
          <span className="badge badge-live">Gestão em Tempo Real</span>
          <h1 className="text-5xl md:text-7xl font-bold text-[#0F172A] tracking-tight leading-tight">
            Gestão de Filas<br/>
            <span className="text-[#3451D1]">Inteligente</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 font-medium text-lg leading-relaxed">
            Elimine a espera física com alertas por SMS em tempo real. Dê liberdade aos seus clientes e eficiência ao seu negócio.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
            <button onClick={onLoginClick} className="btn-primary px-8 py-4 text-base w-full md:w-auto">
              Começar agora
            </button>
            <button className="btn-ghost px-8 py-4 text-base w-full md:w-auto">
              Ver Demonstração
            </button>
          </div>
        </motion.div>
      </section>

      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A]">Por que escolher o KwikFilas?</h2>
            <p className="text-slate-500">Tecnologia desenhada para transformar a experiência de quem espera e a gestão de quem atende.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-premium space-y-4">
              <div className="w-12 h-12 bg-blue-50 flex items-center justify-center rounded-xl text-[#3451D1]">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A]">Avisos em Tempo Real</h3>
              <p className="text-slate-500 text-sm">Seus clientes recebem atualizações automáticas via SMS sobre sua posição na fila e o tempo estimado.</p>
            </div>

            <div className="card-premium bg-[#3451D1] text-white space-y-4">
              <div className="w-12 h-12 bg-white/20 flex items-center justify-center rounded-xl text-white">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Zero Apps para o Cliente</h3>
              <p className="text-white/80 text-sm">Nenhum download necessário. Funciona em qualquer telemóvel com sinal de SMS ou web, de forma simples.</p>
            </div>

            <div className="card-premium space-y-4">
              <div className="w-12 h-12 bg-blue-50 flex items-center justify-center rounded-xl text-[#3451D1]">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Controle Total</h3>
              <p className="text-slate-500 text-sm">Painel administrativo intuitivo para gerenciar múltiplas filas, estatísticas e atendimento com um clique.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 bg-[#F8FAFD]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-bold text-[#0F172A]">Como funciona para parceiros?</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#3451D1] font-bold shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-lg">Check-in Instantâneo</h4>
                  <p className="text-slate-500">O cliente lê o QR Code ou você insere o número dele no painel.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#3451D1] font-bold shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-lg">Acompanhamento Digital</h4>
                  <p className="text-slate-500">O cliente recebe um SMS e pode ver sua posição em tempo real no telemóvel.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#3451D1] font-bold shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-lg">Notificação de Chamada</h4>
                  <p className="text-slate-500">Quando chega a vez, um SMS automático orienta o cliente a retornar ao local.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="card-premium p-4 md:p-8 bg-slate-900 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#3451D1] rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <img 
                src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800" 
                alt="Partner usage" 
                className="rounded-xl shadow-2xl relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-100 px-6 md:px-12 text-center bg-white">
        <KLogo className="w-8 h-8 mx-auto mb-4 text-slate-300" />
        <p className="text-sm font-medium text-slate-400">© 2024 KwikFilas. Todos os direitos reservados.</p>
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
    <div className="min-h-screen bg-[#F8FAFD] flex flex-col items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md space-y-8">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#3451D1] transition-colors">
          <ChevronLeft className="w-4 h-4"/> Voltar para o início
        </button>
        
        <div className="card-premium p-8 md:p-10 space-y-8">
          <div className="text-center space-y-2">
            <KLogo className="w-12 h-12 mx-auto text-[#3451D1] mb-4" />
            <h1 className="text-3xl font-bold text-[#0F172A]">Portal Parceiro</h1>
            <p className="text-slate-500 text-sm">Aceda à sua área de gestão de filas</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
             <div className="space-y-1.5">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
               <input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="exemplo@vibe.pt" 
                type="email" 
                className="input-modern"
                required 
               />
             </div>
             <div className="space-y-1.5">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Senha</label>
               <input 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                type="password" 
                className="input-modern"
                required 
               />
             </div>
             <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base mt-4">
              {loading ? "A processar..." : "Entrar no Painel" }
             </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// --- 2. SUPER ADMIN: GESTÃO ---
const SuperAdminView = ({ onLogout, notify }: { onLogout: () => void, notify: (m: string, t?: any) => void }) => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [formData, setFormData] = useState({ name: "", nif: "", admin_email: "", admin_password: "", logo_url: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isEdit = view === "edit" && editingId;
      const url = isEdit ? "/api/admin/establishments" : "/api/admin/establishments";
      const method = isEdit ? "PUT" : "POST";
      
      const payload = isEdit 
        ? { targetId: editingId, superPassword: prompt("Confirme a Senha Master para alterar:"), updateData: formData }
        : formData;

      if (isEdit && !payload.superPassword) { setLoading(false); return; }

      const res = await fetch(url, { 
        method, 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(payload) 
      });

      if (res.ok) { 
        refresh(); 
        setView("list"); 
        notify(isEdit ? "Dados atualizados" : "Estabelecimento criado"); 
        setFormData({ name: "", nif: "", admin_email: "", admin_password: "", logo_url: "" }); 
        setEditingId(null);
      }
      else { notify("Erro na operação", 'error'); }
    } catch (e) { notify("Erro Crítico", 'error'); }
    setLoading(false);
  };

  const openEdit = (est: Establishment) => {
    setEditingId(est.id);
    setFormData({
      name: est.name,
      nif: est.nif,
      admin_email: est.admin_email,
      admin_password: est.admin_password,
      logo_url: est.logo_url || ""
    });
    setView("edit");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] p-6 lg:p-12">
       <div className="max-w-6xl mx-auto space-y-10">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="space-y-1">
                <span className="text-xs font-bold text-[#3451D1] uppercase tracking-widest">Consola Superadmin</span>
                <h1 className="text-4xl font-bold text-[#0F172A]">Centro de Gestão</h1>
                <p className="text-slate-500">Gira e monitorize todos os estabelecimentos do ecossistema.</p>
             </div>
             <div className="flex gap-3">
               <button onClick={() => setView("create")} className="btn-ghost">
                 <Plus className="w-4 h-4" /> Novo Estabelecimento
               </button>
               <button onClick={onLogout} className="btn-ghost bg-red-50 text-red-500">
                 <LogOut className="w-4 h-4" /> Sair
               </button>
             </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { label: "Fluxo Total", value: "1,284", growth: "+15%", color: "text-[#0F172A]" },
               { label: "Filas Ativas", value: establishments.length.toString(), growth: "Live", color: "text-[#0F172A]" },
               { label: "Espera Média", value: "18m", growth: "-2m", color: "text-[#0F172A]" },
               { label: "Uptime do Sistema", value: "99.98%", growth: "Estável", color: "text-white", bg: "bg-[#3451D1]" }
             ].map((stat, i) => (
               <div key={i} className={cn("card-premium flex flex-col justify-between h-32", stat.bg)}>
                  <span className={cn("text-xs font-bold uppercase tracking-wider opacity-60", stat.bg ? "text-white" : "text-slate-400")}>{stat.label}</span>
                  <div className="flex items-baseline justify-between mt-auto">
                    <span className={cn("text-3xl font-bold", stat.color)}>{stat.value}</span>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", stat.bg ? "bg-white/20 text-white" : "bg-green-50 text-green-600")}>{stat.growth}</span>
                  </div>
               </div>
             ))}
          </div>

          <main>
            {view === "list" ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {establishments.map(est => (
                    <motion.div key={est.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-premium space-y-6">
                       <div className="flex justify-between items-start">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 p-2 overflow-hidden">
                             {est.logo_url ? <img src={est.logo_url} className="w-full h-full object-cover" /> : <Building className="w-full h-full text-slate-300" />}
                          </div>
                          <span className={cn("badge", est.queues && est.queues.length > 0 ? "badge-live" : "badge-inactive")}>
                            {est.queues && est.queues.length > 0 ? "LIVE" : "INATIVO"}
                          </span>
                       </div>
                       <div>
                          <h3 className="text-xl font-bold text-[#0F172A]">{est.name}</h3>
                          <p className="text-sm text-slate-400 font-medium">Cod: {est.code} • NIF: {est.nif}</p>
                       </div>
                       <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{est.queues ? est.queues.length : 0} Clientes hoje</span>
                          <div className="flex gap-2">
                             <button 
                               onClick={() => openEdit(est)}
                               className="p-2 text-slate-400 hover:text-[#3451D1] hover:bg-slate-50 rounded-lg transition-colors"
                             >
                               <Pencil className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={async () => {
                                 const pw = prompt("Senha Master para apagar:");
                                 if (!pw) return;
                                 const res = await fetch("/api/admin/establishments/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ targetId: est.id, superPassword: pw }) });
                                 if (res.ok) { notify("Estabelecimento removido"); refresh(); } else { notify("Falha na autenticação", 'error'); }
                               }}
                               className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                             <button className="text-[#3451D1] text-xs font-bold flex items-center gap-1 hover:underline ml-2">
                               Gerir <ArrowRight className="w-3 h-3" />
                             </button>
                          </div>
                       </div>
                    </motion.div>
                  ))}
                  <button onClick={() => setView("create")} className="card-premium border-2 border-dashed border-slate-200 bg-transparent flex flex-col items-center justify-center p-12 text-slate-400 hover:border-[#3451D1] hover:text-[#3451D1] transition-all gap-4">
                     <Plus className="w-8 h-8" />
                     <span className="font-bold text-sm uppercase tracking-widest">Adicionar Unidade</span>
                  </button>
               </div>
            ) : (
               <div className="max-w-2xl mx-auto">
                 <div className="card-premium p-8 md:p-12 space-y-10">
                    <div className="flex items-center justify-between">
                       <h3 className="text-2xl font-bold">{view === 'edit' ? 'Editar Unidade' : 'Registo de Unidade'}</h3>
                       <button onClick={() => { setView("list"); setEditingId(null); setFormData({ name: "", nif: "", admin_email: "", admin_password: "", logo_url: "" }); }} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                       <div className="flex flex-col items-center">
                          <div className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden relative group">
                             {formData.logo_url ? <img src={formData.logo_url} className="w-full h-full object-cover" /> : <Building className="w-10 h-10 text-slate-200" />}
                             <label className="absolute inset-0 bg-[#3451D1]/80 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                                <Camera className="w-6 h-6 text-white" />
                                <input type="file" className="hidden" onChange={handleUpload} />
                             </label>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase mt-2">Logótipo da Unidade</span>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nome Comercial</label>
                            <input value={formData.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} className="input-modern" placeholder="Ex: Barbearia Lux" required />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">NIF</label>
                            <input value={formData.nif} onChange={(e:any) => setFormData({...formData, nif: e.target.value})} className="input-modern" placeholder="999 999 999" required />
                          </div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email do Administrador</label>
                            <input value={formData.admin_email} onChange={(e:any) => setFormData({...formData, admin_email: e.target.value})} className="input-modern" placeholder="admin@empresa.pt" type="email" required />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Senha de Acesso</label>
                            <input value={formData.admin_password} onChange={(e:any) => setFormData({...formData, admin_password: e.target.value})} className="input-modern" placeholder="••••••••" type="password" required />
                          </div>
                       </div>
                       <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base mt-4">
                         {loading ? "A processar..." : (view === 'edit' ? "Guardar Alterações" : "Ativar Unidade Digital")}
                       </button>
                    </form>
                 </div>
               </div>
            )}
          </main>
       </div>
    </div>
  );
};

// --- 3. EST ADMIN: GESTÃO ---
const EstAdminView = ({ auth, onLogout, notify }: { auth: AuthUser, onLogout: () => void, notify: (m: string, t?: any) => void }) => {
  const [est, setEst] = useState<Establishment | null>(null);
  const [manualPhone, setManualPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"queue" | "crm">("queue");
  const [contacts, setContacts] = useState<any[]>([]);
  const [newContactPhone, setNewContactPhone] = useState("");

  const refreshContacts = async () => {
    if (!est) return;
    const res = await fetch(`/api/establishments/${est.code}/contacts`);
    if (res.ok) setContacts(await res.json());
  };

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
  useEffect(() => { if (activeTab === 'crm') refreshContacts(); }, [activeTab, est]);

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
    notify(`SMS Re-enviado: ${ticketNum.split('-').pop()}`);
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

     let autoName = null;
     try {
       const ck = await fetch(`/api/check-phone/${manualPhone}`);
       const ckData = await ck.json();
       autoName = ckData.name;
     } catch(e) {}

     const res = await fetch("/api/queue/join", { 
       method: "POST", 
       headers: { "Content-Type": "application/json" }, 
       body: JSON.stringify({ phone: manualPhone, estCode: est.code, name: autoName })
      });

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
      <html>
      <head>
        <title>Imprimir QR Code - ${est.name}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
          body { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; margin:0; text-align:center; font-family: 'Inter', sans-serif; background: white; padding: 40px; }
          h1 { font-size: 64px; font-weight: 900; text-transform: uppercase; margin: 0; color: #0f172a; }
          .subtitle { font-size: 20px; color: #64748b; margin-top: 15px; font-weight: 700; letter-spacing: 0.15em; }
          .qr-container { margin: 80px 0; display: flex; align-items: center; justify-content: center; width: 100%; }
          .qr-container svg { width: 500px !important; height: 500px !important; }
          svg image { clip-path: inset(0% round 15%); }
          h2 { font-size: 28px; font-weight: 800; color: #0f172a; letter-spacing: 0.5em; margin: 0; }
          .footer-text { font-size: 16px; color: #94a3b8; margin-top: 10px; font-weight: 600; }
        </style>
      </head>
      <body>
        <h1>${est.name}</h1>
        <p class="subtitle">ESCANEIE PARA ENTRAR NA FILA</p>
        <div class="qr-container">${qrSvg}</div>
        <h2>KWIKFILAS</h2>
        <p class="footer-text">THE DIGITAL CURATOR</p>
        <script>setTimeout(() => { window.print(); window.close(); }, 1200);</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  if (!est) return (
     <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
        <div className="w-8 h-8 border-4 border-[#3451D1] border-t-transparent animate-spin rounded-full"></div>
        <p className="text-sm font-bold text-slate-400">A carregar painel...</p>
     </div>
  );

  const current = (est.queues || []).find(q => q.status === "called");
  const waiting = (est.queues || []).filter(q => q.status === "waiting");

  return (
    <div className="min-h-screen bg-[#F8FAFD]">
       <nav className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 p-1.5 overflow-hidden">
                <img src={est.logo_url} className="w-full h-full object-cover" />
             </div>
             <div>
                <h4 className="font-bold text-[#0F172A] leading-tight">{est.name}</h4>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sistema Online</span>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex bg-slate-50 rounded-lg p-1">
               <button onClick={() => setActiveTab("queue")} className={cn("px-4 py-1.5 text-xs font-bold rounded-md transition-all", activeTab === "queue" ? "bg-white text-[#3451D1] shadow-sm" : "text-slate-500")}>Fila Digital</button>
               <button onClick={() => setActiveTab("crm")} className={cn("px-4 py-1.5 text-xs font-bold rounded-md transition-all", activeTab === "crm" ? "bg-white text-[#3451D1] shadow-sm" : "text-slate-500")}>Base de Clientes</button>
            </div>
            <button onClick={onLogout} className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><LogOut className="w-5 h-5" /></button>
          </div>
       </nav>

       <main className="p-6 lg:p-12 max-w-6xl mx-auto">
          {activeTab === 'queue' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
             
             {/* Left Column: Controls */}
             <div className="lg:col-span-5 space-y-8">
                <div className="card-premium p-10 flex flex-col items-center text-center space-y-6">
                   <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">A chamar agora</span>
                   <div className="text-[120px] font-bold text-[#0F172A] leading-none tracking-tighter">
                      #{current ? current.ticket_number.split('-').pop() : '--'}
                   </div>
                   <p className="text-slate-400 font-medium">
                      {current ? `Chamado há ${Math.floor((Date.now() - new Date(current.called_at!).getTime()) / 60000)} mins` : "Aguardando próximo"}
                   </p>
                </div>

                <div className="space-y-4">
                   <button 
                     onClick={handleNext} 
                     disabled={waiting.length === 0 || loading} 
                     className="btn-primary w-full py-6 text-xl"
                   >
                      <ChevronRight className="w-6 h-6" />
                      {loading ? "A PROCESSAR..." : "Chamar Próximo"}
                   </button>

                   <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => current && handleRecall(current.id, current.ticket_number)} disabled={!current} className="btn-ghost flex-col py-6 gap-2">
                         <Mail className="w-5 h-5" />
                         <span className="text-[10px] uppercase font-bold tracking-wider">Re-notificar SMS</span>
                      </button>
                      <button className="btn-ghost flex-col py-6 gap-2 text-red-500 bg-red-50">
                         <X className="w-5 h-5" />
                         <span className="text-[10px] uppercase font-bold tracking-wider">Pausar Fila</span>
                      </button>
                   </div>
                </div>

                <div className="card-premium p-8 space-y-6">
                   <div className="flex items-center gap-2 mb-4">
                      <Plus className="w-4 h-4 text-[#3451D1]" />
                      <h3 className="font-bold text-[#0F172A]">Entrada Manual</h3>
                   </div>
                   <form onSubmit={handleManualJoin} className="space-y-4">
                      <input disabled={loading} value={manualPhone} onChange={e => setManualPhone(e.target.value)} className="input-modern text-center text-2xl font-bold py-4" placeholder="9XX XXX XXX" />
                      <button type="submit" disabled={loading} className="btn-primary w-full">Gerar Senha</button>
                   </form>
                </div>
             </div>

             {/* Right Column: List & Stats */}
             <div className="lg:col-span-7 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                   <div className="card-premium py-6 flex flex-col items-center">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Em Espera</span>
                     <span className="text-4xl font-bold text-[#0F172A]">{waiting.length}</span>
                   </div>
                   <div className="card-premium py-6 flex flex-col items-center">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Atendidos</span>
                     <span className="text-4xl font-bold text-[#0F172A]">{(est.queues || []).filter(q => q.status === 'served').length}</span>
                   </div>
                </div>

                <div className="card-premium p-0 overflow-hidden">
                   <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                      <h3 className="font-bold text-[#0F172A]">Fila de Espera</h3>
                      <div className="flex gap-2">
                        <span className="badge badge-live">Live</span>
                      </div>
                   </div>
                   <div className="divide-y divide-slate-50">
                      {waiting.map((q, i) => (
                         <div key={q.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-[#3451D1]">
                                 #{q.ticket_number.split('-').pop()}
                               </div>
                               <div>
                                 <div className="font-bold text-[#0F172A]">{q.phone}</div>
                                 <div className="text-xs text-slate-400 font-medium">{i === 0 ? "Próximo a ser chamado" : `${i + 1}º na fila`}</div>
                               </div>
                            </div>
                            <div className="flex gap-2">
                               <button onClick={() => handleRecall(q.id, q.ticket_number)} className="p-2.5 text-slate-400 hover:text-[#3451D1] hover:bg-blue-50 rounded-lg transition-all"><Bell className="w-4 h-4" /></button>
                               <button onClick={() => handleCancel(q.id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                            </div>
                         </div>
                      ))}
                      {waiting.length === 0 && (
                        <div className="p-20 text-center space-y-4">
                           <Timer className="w-12 h-12 mx-auto text-slate-200" />
                           <p className="text-slate-400 font-medium">A fila está vazia no momento.</p>
                        </div>
                      )}
                   </div>
                </div>

                <div className="card-premium flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                       <QrCode className="w-6 h-6 text-slate-300" />
                       <div>
                          <h4 className="font-bold text-[#0F172A]">QR Code de Entrada</h4>
                          <p className="text-xs text-slate-400">Imprima o cartaz para os seus clientes.</p>
                       </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                       <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                          <QRCodeSVG 
                            value={`https://kwikfilas.vercel.app/?est=${est.code}`} 
                            size={80} 
                            imageSettings={{
                              src: est.logo_url,
                              height: 20,
                              width: 20,
                              excavate: true,
                            }}
                          />
                       </div>
                       <button onClick={handlePrintQR} className="btn-ghost text-[10px] h-auto py-1">Imprimir Cartaz</button>
                    </div>

                    <div id="main-qr-canvas" className="hidden">
                       <QRCodeSVG 
                         value={`https://kwikfilas.vercel.app/?est=${est.code}`} 
                         size={1024} 
                         level="H"
                         imageSettings={{
                           src: est.logo_url,
                           height: 200,
                           width: 200,
                           excavate: true,
                         }}
                       />
                    </div>
                 </div>
             </div>
          </div>
          ) : (
             <div className="card-premium p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                   <h3 className="font-bold text-[#0F172A]">Base de Dados de Clientes</h3>
                   <span className="text-xs font-bold text-slate-400">{contacts.length} Contactos</span>
                </div>
                <table className="w-full text-left">
                   <thead className="bg-slate-50/50 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      <tr>
                         <th className="px-6 py-4">Cliente</th>
                         <th className="px-6 py-4">Frequência</th>
                         <th className="px-6 py-4">Última Atividade</th>
                         <th className="px-6 py-4 text-right">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {contacts.map((c, i) => (
                         <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#3451D1] text-xs font-bold">
                                    {(c.name || 'C').charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-bold text-[#0F172A]">{c.name || 'Cliente'}</span>
                                    <span className="text-[10px] text-slate-400 font-medium">{c.phone}</span>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <span className="text-xs font-bold text-[#3451D1] bg-blue-50 px-2 py-1 rounded-md">{c.visit_count} Visitas</span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-500">
                               {new Date(c.last_visit).toLocaleDateString()} às {new Date(c.last_visit).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="px-6 py-4 text-right">
                               <span className="badge badge-active">Ativo</span>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          )}
       </main>
    </div>
  );
};

// --- 4. CLIENTE: TRACKING ---
const ClientView = ({ estCode, notify }: { estCode: string, notify: (m: string, t?: any) => void }) => {
  const [est, setEst] = useState<Establishment | null>(null);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [showAbandonModal, setShowAbandonModal] = useState(false);
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
          if (ticket && (ticket.status === 'called' || ticket.status === 'waiting')) {
            if (ticket.status === 'called' && (!myTicket || myTicket.status !== 'called')) {
              if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 500]);
              notify("SUA VEZ CHEGOU!", 'success');
            }
            setMyTicket(ticket);
          } else {
            setMyTicket(null);
          }
        }
      }
    } catch (e) { console.error("Refresh ERROR"); }
    setLoading(false);
  };

  useEffect(() => { refresh(); const itv = setInterval(refresh, 5000); return () => clearInterval(itv); }, [myTicket]);

  const checkPhoneAndContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) return notify("Número inválido", "error");
    
    // 1. Tentar primeiro o nome guardado localmente para este número
    const localName = localStorage.getItem(`kw_name_${phone}`);
    if (localName) {
      setName(localName);
      return handleJoin(e, localName);
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/check-phone/${phone}`);
      const data = await res.json();
      if (data.name) {
        setName(data.name);
        localStorage.setItem(`kw_name_${phone}`, data.name);
        handleJoin(e, data.name);
      } else {
        setShowNameInput(true);
      }
    } catch (e) { setShowNameInput(true); }
    setLoading(false);
  };

  const handleJoin = async (e: React.FormEvent, finalName?: string) => {
    if(e) e.preventDefault();
    const userName = finalName || name;
    setLoading(true);
    const res = await fetch("/api/queue/join", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ phone, estCode, name: userName }) 
    });
    if (res.ok) { 
      localStorage.setItem(`kw_phone_${estCode}`, phone); 
      if (userName) localStorage.setItem(`kw_name_${phone}`, userName);
      refresh(); 
      notify("Entrou na fila!"); 
    }
    else { notify("Já se encontra na fila", 'error'); }
    setLoading(false);
  };

  const handleConfirmArrival = async () => {
    if (!myTicket) return;
    setLoading(true);
    await fetch("/api/queue/confirm-arrival", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ticketId: myTicket.id }) });
    notify("Chegada Confirmada!");
    refresh();
    setLoading(false);
  };

  const handleLeave = async () => {
    if (!myTicket || !est) return;
    
    setLoading(true);
    const res = await fetch(`/api/establishments/${est.code}/cancel`, { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ ticketId: myTicket.id }) 
    });
    
    if (res.ok) {
      localStorage.removeItem(`kw_phone_${estCode}`);
      setMyTicket(null);
      setShowAbandonModal(false);
      notify("Saiu da fila.");
    }
    setLoading(false);
  };

  if (loading && !est) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-4 border-[#3451D1] border-t-transparent animate-spin rounded-full"></div></div>;
  if (!est) return <div className="min-h-screen flex flex-col items-center justify-center p-12 text-center space-y-4 text-slate-400 font-bold uppercase tracking-widest bg-[#F8FAFD]"><Info className="w-12 h-12 mb-4" /> Estabelecimento não encontrado</div>;

  if (myTicket) {
    const position = (est.queues || []).filter((q: any) => q.status === "waiting" && new Date(q.joined_at).getTime() < new Date(myTicket.joined_at).getTime()).length + 1;
    const isCalled = myTicket.status === "called";
    
    return (
      <div className="min-h-screen bg-[#F8FAFD] relative overflow-x-hidden">
        {/* Foto de Capa Ofuscada */}
        <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden pointer-events-none">
           <img 
             src={est.logo_url} 
             className="w-full h-full object-cover blur-3xl opacity-20 scale-125" 
           />
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F8FAFD]/50 to-[#F8FAFD]" />
        </div>

        <div className="relative z-10 p-6 flex flex-col items-center justify-center min-h-screen">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm space-y-8">
            <div className="text-center space-y-2">
               <div className="w-16 h-16 bg-white rounded-2xl mx-auto shadow-sm border border-slate-50 p-3 mb-6">
                  <img src={est.logo_url} className="w-full h-full object-contain" />
               </div>
               <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">{est.name}</h1>
               <span className="badge badge-live">Canal Digital Ativo</span>
            </div>

            <div className={cn("card-premium p-10 flex flex-col items-center text-center space-y-8", isCalled ? "bg-[#3451D1] text-white border-none" : "")}>
                <div className="space-y-2">
                   <p className={cn("text-xs font-bold uppercase tracking-widest", isCalled ? "text-white/60" : "text-slate-400")}>Sua Senha</p>
                   <div className="text-8xl font-bold leading-none tracking-tighter">#{myTicket.ticket_number.split('-').pop()}</div>
                </div>

                <div className="space-y-4 w-full">
                   <div className="h-px bg-current opacity-10 w-full"></div>
                   <h2 className="text-2xl font-bold tracking-tight">
                     {isCalled ? "Sua vez chegou!" : `${position}º na Linha`}
                   </h2>
                   <p className={cn("text-sm font-medium", isCalled ? "text-white/80" : "text-slate-500")}>
                     {isCalled ? "Por favor, dirija-se ao local de atendimento agora." : "Aguarde tranquilamente. Iremos notificar assim que for chamado."}
                   </p>
                </div>

                {isCalled && !myTicket.is_arrived && (
                  <button onClick={handleConfirmArrival} disabled={loading} className="btn-primary w-full bg-white text-[#3451D1] hover:bg-white/90">
                    Estou no local
                  </button>
                )}
                
                {isCalled && myTicket.is_arrived && (
                  <div className="flex items-center gap-2 text-white font-bold text-sm bg-white/20 px-6 py-3 rounded-xl border border-white/10 uppercase tracking-widest"><CheckCircle2 className="w-5 h-5" /> Presença Confirmada</div>
                )}
            </div>

            <button onClick={() => setShowAbandonModal(true)} disabled={loading} className="w-full py-4 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest">Abandonar Fila</button>
            </motion.div>
            
            <AnimatePresence>
              {showAbandonModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAbandonModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                  <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="card-premium w-full max-w-xs p-8 relative z-10 space-y-6 text-center shadow-2xl">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
                      <LogOut className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-[#0F172A]">Abandonar Fila?</h3>
                      <p className="text-sm text-slate-500 font-medium">Irá perder a sua posição na linha e precisará de recolher uma nova senha.</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <button onClick={handleLeave} disabled={loading} className="btn-primary bg-red-500 hover:bg-red-600 border-none py-4">Sim, desejo sair</button>
                      <button onClick={() => setShowAbandonModal(false)} disabled={loading} className="text-xs font-bold text-slate-400 uppercase tracking-widest py-2">Cancelar</button>
                    </div>
            <button onClick={() => setShowAbandonModal(true)} disabled={loading} className="w-full py-4 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest">Abandonar Fila</button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFD] relative overflow-x-hidden">
       {/* Foto de Capa Ofuscada */}
       <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden pointer-events-none">
          <img 
            src={est.logo_url} 
            className="w-full h-full object-cover blur-3xl opacity-20 scale-125" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F8FAFD]/50 to-[#F8FAFD]" />
       </div>

       <div className="relative z-10 p-6 flex flex-col items-center justify-center min-h-screen">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-8">
          <header className="text-center space-y-2">
             <div className="w-16 h-16 bg-white rounded-2xl mx-auto shadow-sm border border-slate-50 p-3 mb-6">
                <img src={est.logo_url} className="w-full h-full object-contain" />
             </div>
             <h1 className="text-4xl font-bold text-[#0F172A] tracking-tight">
               {showNameInput ? "Como se chama?" : "Entrar na Fila"}
             </h1>
             <p className="text-slate-500 font-medium">
               {showNameInput ? "Diga-nos o seu nome para o administrador o reconhecer." : "Insira o seu número para receber senha digital e alertas por SMS."}
             </p>
          </header>

          <div className="card-premium p-8 md:p-10 space-y-8">
             {!showNameInput ? (
               <form onSubmit={checkPhoneAndContinue} className="space-y-6">
                  <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Número de Telemóvel</label>
                     <div className="flex gap-2">
                        <div className="input-modern w-24 flex items-center justify-center bg-slate-100 text-slate-500 font-bold">+244</div>
                        <input value={phone} onChange={(e:any) => setPhone(e.target.value)} placeholder="9XX XXX XXX" type="tel" className="input-modern flex-1" required />
                     </div>
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full py-5 text-base">
                    {loading ? "A processar..." : "Obter Senha Digital"} <ArrowRight className="w-5 h-5" />
                  </button>
               </form>
             ) : (
               <form onSubmit={(e) => handleJoin(e)} className="space-y-6">
                  <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Seu Nome</label>
                     <input value={name} onChange={(e:any) => setName(e.target.value)} placeholder="Ex: João Silva" type="text" className="input-modern" required autoFocus />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full py-5 text-base">
                    Confirmar e Entrar <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <button type="button" onClick={() => setShowNameInput(false)} className="w-full text-xs font-bold text-slate-400 uppercase">Voltar</button>
               </form>
             )}
             <div className="flex items-center gap-2 justify-center text-[10px] text-slate-400 font-medium uppercase tracking-wider pt-2">
                <ShieldCheck className="w-3 h-3" /> Seus dados estão protegidos
             </div>
          </div>

          <footer className="text-center pt-8">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-loose">© 2024 KWIKFILAS THE DIGITAL CURATOR.<br/>ALL RIGHTS RESERVED.</p>
          </footer>
        </motion.div>
       </div>
    </div>
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
    <div className="bg-[#F8FAFD] min-h-screen selection:bg-[#3451D1]/10 overflow-x-hidden relative antialiased">
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
