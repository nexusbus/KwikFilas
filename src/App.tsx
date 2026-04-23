import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bell, Building, Camera, CheckCircle2, ChevronLeft, ChevronRight, Clock, ExternalLink, Image as ImageIcon, 
  LayoutDashboard, Lock, LogOut, Mail, Pencil, Phone as PhoneIcon, Plus, QrCode, Search, Smartphone, Store, Timer, Trash2, Printer,
  Upload, User, UserCheck, Users, X, Info, ArrowRight, ShieldCheck, Ticket, AlertCircle, History, RefreshCcw, LayoutGrid, Layers, Monitor, Settings
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Customer, Establishment, Subscription } from "./types";

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

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden relative z-10"
        >
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#0F172A]">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
          </div>
          <div className="p-8">{children}</div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const KLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={cn("text-[#3451D1] w-8 h-8", className)} fill="none">
    <path d="M25 15 L25 85 M25 50 L75 15 M25 50 L75 85 M70 15 L80 15 M70 85 L80 85" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
  </svg>
);

// --- 0. MARKETING: LANDING PAGE ---
const MarketingView = ({ onLoginClick, onSubscribeClick }: { onLoginClick: () => void, onSubscribeClick: (plan?: string) => void }) => {
  return (
    <div className="w-full bg-[#F8FAFD] font-['Inter'] min-h-screen">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100 h-20 flex items-center px-6 md:px-12 justify-between">
        <div className="flex items-center gap-2">
          <KLogo className="w-8 h-8 text-[#3451D1]" />
          <span className="font-bold text-xl tracking-tight text-[#0F172A]">KwikFilas</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => onSubscribeClick()} className="text-sm font-bold text-slate-500 hover:text-[#3451D1] transition-colors">
            Adira à Rede
          </button>
          <button onClick={onLoginClick} className="btn-ghost text-sm">
            Portal Parceiro
          </button>
        </div>
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
            <button onClick={() => onSubscribeClick()} className="btn-primary px-8 py-4 text-base w-full md:w-auto">
              Registar Estabelecimento
            </button>
            <button onClick={onLoginClick} className="btn-ghost px-8 py-4 text-base w-full md:w-auto">
              Portal Parceiro
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

      <section id="pricing" className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A]">Planos de Subscrição</h2>
            <p className="text-slate-500">Escolha o plano ideal para a escala do seu negócio.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* KFmini */}
            <div className="card-premium flex flex-col justify-between border border-slate-100 hover:border-[#3451D1] transition-all">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#0F172A]">KFmini</h3>
                  <p className="text-xs text-slate-500 mt-1">Essencial para pequenos fluxos</p>
                </div>
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <span className="text-3xl font-bold text-[#0F172A]">150 kz</span>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-widest mt-1">Por cliente na fila</span>
                  </div>
                  <div className="flex items-center gap-4 py-1">
                    <div className="h-[1px] bg-slate-100 flex-1"></div>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">ou</span>
                    <div className="h-[1px] bg-slate-100 flex-1"></div>
                  </div>
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 text-center">
                    <span className="text-2xl font-bold text-[#3451D1]">90.000 kz</span>
                    <span className="text-[10px] text-blue-400 font-bold block uppercase tracking-widest mt-1">Subscrição Mensal</span>
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Alertas automáticos</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Gestão de contactos</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Visualização de base</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Gestão de filas</span>
                  </div>
                </div>
              </div>
              <button onClick={() => onSubscribeClick("KFmini")} className="btn-ghost w-full mt-10">Selecionar Plano</button>
            </div>

            {/* KFmed */}
            <div className="card-premium flex flex-col justify-between border-2 border-[#3451D1] relative md:scale-105 shadow-2xl z-10 py-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#3451D1] text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">Mais Popular</div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#0F172A]">KFmed</h3>
                  <p className="text-xs text-slate-500 mt-1">Crescimento com marketing direto</p>
                </div>
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <span className="text-3xl font-bold text-[#0F172A]">220 kz</span>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-widest mt-1">Por cliente na fila</span>
                  </div>
                  <div className="flex items-center gap-4 py-1">
                    <div className="h-[1px] bg-slate-100 flex-1"></div>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">ou</span>
                    <div className="h-[1px] bg-slate-100 flex-1"></div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                    <span className="text-2xl font-bold text-[#3451D1]">135.000 kz</span>
                    <span className="text-[10px] text-[#3451D1] font-bold block uppercase tracking-widest mt-1">Subscrição Mensal</span>
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-[#3451D1]" />
                    <span>Tudo no KFmini</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-[#3451D1]" />
                    <span>2x SMS Publicitária/Informativa/mês</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Suporte prioritário</span>
                  </div>
                </div>
              </div>
              <button onClick={() => onSubscribeClick("KFmed")} className="btn-primary w-full mt-10">Selecionar Plano</button>
            </div>

            {/* KFmax */}
            <div className="card-premium flex flex-col justify-between border border-slate-100 hover:border-[#3451D1] transition-all bg-slate-900 text-white">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold">KFmax</h3>
                  <p className="text-xs text-slate-400 mt-1">Escala total e publicidade</p>
                </div>
                <div className="space-y-3">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <span className="text-3xl font-bold">350 kz</span>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-widest mt-1">Por cliente na fila</span>
                  </div>
                  <div className="flex items-center gap-4 py-1">
                    <div className="h-[1px] bg-white/10 flex-1"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">ou</span>
                    <div className="h-[1px] bg-white/10 flex-1"></div>
                  </div>
                  <div className="p-4 bg-[#3451D1] rounded-2xl border border-blue-400/30 text-center">
                    <span className="text-2xl font-bold">225.000 kz</span>
                    <span className="text-[10px] text-blue-200 font-bold block uppercase tracking-widest mt-1">Subscrição Mensal</span>
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#3451D1]" />
                    <span>Tudo no KFmed</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-300 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-[#3451D1]" />
                    <span>4x SMS Publicitária/Informativa/mês</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#3451D1]" />
                    <span>Dashboard avançado</span>
                  </div>
                </div>
              </div>
              <button onClick={() => onSubscribeClick("KFmax")} className="btn-ghost bg-white/10 text-white hover:bg-white/20 w-full mt-10 border-none">Selecionar Plano</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-100 px-6 md:px-12 text-center bg-white">
        <KLogo className="w-8 h-8 mx-auto mb-4 text-slate-300" />
        <p className="text-sm font-medium text-slate-400">© 2026 KwikFilas. Todos os direitos reservados.</p>
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


// --- 1.5. SUBSCRIPÇÃO: FORMULÁRIO ---
const SubscribeView = ({ onBack, notify, initialPlan }: { onBack: () => void, notify: (m: string, t?: any) => void, initialPlan?: string }) => {
  const [formData, setFormData] = useState({ 
    name: "", 
    nif: "", 
    admin_email: "", 
    admin_password: "", 
    phone: "",
    logo_url: "",
    plan: initialPlan || "KFmini"
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);
    try {
      const file = e.target.files[0];
      const fileName = `sub-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9]/g, '')}`;
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
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSubmitted(true);
        notify("Pedido enviado com sucesso!");
      } else {
        notify("Erro ao enviar pedido", 'error');
      }
    } catch (e) { notify("Erro de conexão", 'error'); }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8FAFD] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card-premium p-10 max-w-sm text-center space-y-6">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold">Pedido Recebido!</h2>
          <p className="text-slate-500">A sua solicitação foi enviada para o nosso Super Admin. Irá receber um contacto assim que for aprovado.</p>
          <button onClick={onBack} className="btn-primary w-full">Voltar ao Início</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFD] p-6 flex flex-col items-center">
      <div className="max-w-xl w-full space-y-8 mt-12">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#3451D1] transition-colors">
          <ChevronLeft className="w-4 h-4"/> Voltar
        </button>

        <div className="card-premium p-8 md:p-12 space-y-8">
            <div className="text-center space-y-2">
              <KLogo className="w-12 h-12 mx-auto text-[#3451D1] mb-4" />
              <h1 className="text-3xl font-bold">Registe o seu Negócio</h1>
              <p className="text-slate-500">Junte-se à rede KwikFilas no plano <span className="font-bold text-[#3451D1]">{formData.plan}</span>.</p>
            </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden relative group">
                  {formData.logo_url ? <img src={formData.logo_url} className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 text-slate-300" />}
                  <label className="absolute inset-0 bg-[#3451D1]/80 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                    <Camera className="w-6 h-6 text-white" />
                    <input type="file" className="hidden" onChange={handleUpload} />
                  </label>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase mt-2">Logótipo do Negócio</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nome do Estabelecimento</label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-modern" placeholder="Ex: Restaurante Maré" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">NIF (Identificação Fiscal)</label>
                <input value={formData.nif} onChange={e => setFormData({...formData, nif: e.target.value})} className="input-modern" placeholder="999 999 999" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email do Gestor</label>
                  <input type="email" value={formData.admin_email} onChange={e => setFormData({...formData, admin_email: e.target.value})} className="input-modern" placeholder="gerente@exemplo.com" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Senha de Acesso</label>
                  <input type="password" value={formData.admin_password} onChange={e => setFormData({...formData, admin_password: e.target.value})} className="input-modern" placeholder="••••••••" required />
                </div>
              </div>
              <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Telemóvel (para notificações)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">+244</span>
                    <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="input-modern pl-14" type="tel" placeholder="9xxxxxxxx" required />
                  </div>
                  <p className="text-[10px] text-slate-400 px-1">Receberá um SMS assim que o seu pedido for analisado pela nossa equipa.</p>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-5">
              {loading ? "A enviar..." : "Enviar Candidatura"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- 2. SUPER ADMIN: GESTÃO ---
const SuperAdminView = ({ onLogout, notify }: { onLogout: () => void, notify: (m: string, t?: any) => void }) => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"lojas" | "pedidos" | "historico">("lojas");
  const [statsView, setStatsView] = useState<"visitas" | "ranking">("visitas");
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [formData, setFormData] = useState({ 
    name: "", nif: "", admin_email: "", admin_password: "", logo_url: "", 
    plan: "KFmini", sms_campaigns_balance: 2, is_active: true, phone: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Filtros Histórico
  const [filters, setFilters] = useState({ client: "", start_date: "", end_date: "", ticket_number: "" });

  const refreshEsts = async () => {
    try {
      const res = await fetch("/api/admin/establishments");
      const data = await res.json();
      setEstablishments(Array.isArray(data) ? data : []);
    } catch (e) { console.error("API error"); }
  };

  const refreshSubs = async () => {
    try {
      const res = await fetch("/api/admin/subscriptions");
      const data = await res.json();
      setSubs(Array.isArray(data) ? data : []);
    } catch (e) { console.error("API error"); }
  };

  const refreshStats = async () => {
    try {
      const q = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/admin/stats?${q}`);
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (e) { console.error("API error"); }
  };

  useEffect(() => { 
    if (activeTab === "lojas") refreshEsts();
    if (activeTab === "pedidos") refreshSubs();
    if (activeTab === "historico") refreshStats();
  }, [activeTab]);

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
      const url = "/api/admin/establishments";
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
        refreshEsts(); 
        setView("list"); 
        notify(isEdit ? "Dados atualizados" : "Estabelecimento criado"); 
        setFormData({ 
          name: "", nif: "", admin_email: "", admin_password: "", logo_url: "", 
          plan: "KFmini", sms_campaigns_balance: 2, is_active: true, phone: ""
        }); 
        setEditingId(null);
      }
      else { notify("Erro na operação", 'error'); }
    } catch (e) { notify("Erro Crítico", 'error'); }
    setLoading(false);
  };

  const handleApproveSub = async (subId: string) => {
    const pw = prompt("Senha Master para aprovar subscrição:");
    if (!pw) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/subscriptions/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subId, superPassword: pw })
      });
      if (res.ok) {
        notify("Subscrição aprovada!");
        refreshSubs();
      } else {
        notify("Falha na aprovação", 'error');
      }
    } catch (e) { notify("Erro de conexão", 'error'); }
    setLoading(false);
  };

  const openEdit = (est: Establishment) => {
    setEditingId(est.id);
    setFormData({
      name: est.name,
      nif: est.nif,
      admin_email: est.admin_email,
      admin_password: est.admin_password,
      logo_url: est.logo_url || "",
      plan: est.plan || "KFmini",
      sms_campaigns_balance: est.sms_campaigns_balance || 0,
      is_active: est.is_active ?? true,
      phone: est.phone || ""
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
                <p className="text-slate-500">Gira e monitorize todo o ecossistema KwikFilas.</p>
             </div>
             <div className="flex gap-3">
               <div className="bg-white border border-slate-100 rounded-xl p-1 flex shadow-sm">
                  <button onClick={() => setActiveTab("lojas")} className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-all", activeTab === 'lojas' ? "bg-[#3451D1] text-white" : "text-slate-400 hover:text-slate-600")}>Lojas</button>
                  <button onClick={() => setActiveTab("pedidos")} className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-all relative", activeTab === 'pedidos' ? "bg-[#3451D1] text-white" : "text-slate-400 hover:text-slate-600")}>
                    Pedidos 
                    {subs.filter(s => s.status === 'pending').length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] border-2 border-white">{subs.filter(s => s.status === 'pending').length}</span>}
                  </button>
                  <button onClick={() => setActiveTab("historico")} className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-all", activeTab === 'historico' ? "bg-[#3451D1] text-white" : "text-slate-400 hover:text-slate-600")}>Controlo Global</button>
               </div>
               <button onClick={onLogout} className="btn-ghost bg-red-50 text-red-500">
                 <LogOut className="w-4 h-4" /> Sair
               </button>
             </div>
          </header>

          <main>
            {activeTab === 'lojas' && (
              <>
                {view === "list" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {establishments.map(est => (
                        <motion.div key={est.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-premium space-y-6">
                          <div className="flex justify-between items-start">
                              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 p-2 overflow-hidden">
                                {est.logo_url ? <img src={est.logo_url} className="w-full h-full object-cover" /> : <Building className="w-full h-full text-slate-300" />}
                              </div>
                              <span className={cn("badge", est.is_active ? "badge-active" : "bg-red-50 text-red-500 border-red-100")}>
                                {est.is_active ? "ATIVO" : "DESATIVADO"}
                              </span>
                          </div>
                          <div>
                              <h3 className="text-xl font-bold text-[#0F172A]">{est.name}</h3>
                              <p className="text-sm text-slate-400 font-medium">
                                Cod: {est.code} • NIF: {est.nif} • Plano: <span className="text-[#3451D1] font-bold">{est.plan || 'KFmini'}</span>
                              </p>
                              <div className="mt-2 flex flex-wrap gap-3">
                                <div className="flex items-center gap-1.5">
                                  <PhoneIcon className="w-3 h-3 text-slate-300" />
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{est.phone || 'Sem Telefone'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Bell className="w-3 h-3 text-slate-300" />
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Saldo SMS: {est.sms_campaigns_balance || 0}</span>
                                </div>
                              </div>
                          </div>
                          <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{est.queues ? est.queues.length : 0} Clientes hoje</span>
                              <div className="flex gap-2">
                                <button onClick={() => openEdit(est)} className="p-2 text-slate-400 hover:text-[#3451D1] hover:bg-slate-50 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                                <button onClick={async () => {
                                      const pw = prompt("Senha Master para apagar:");
                                      if (!pw) return;
                                      const res = await fetch("/api/admin/establishments/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ targetId: est.id, superPassword: pw }) });
                                      if (res.ok) { notify("Estabelecimento removido"); refreshEsts(); } else { notify("Falha na autenticação", 'error'); }
                                    }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
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
                          <button onClick={() => { setView("list"); setEditingId(null); setFormData({ name: "", nif: "", admin_email: "", admin_password: "", logo_url: "", plan: "KFmini", sms_campaigns_balance: 2, is_active: true, phone: "" }); }} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><X className="w-5 h-5" /></button>
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
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nome Comercial</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-modern" required /></div>
                              <div className="space-y-1.5"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider">NIF</label><input value={formData.nif} onChange={e => setFormData({...formData, nif: e.target.value})} className="input-modern" required /></div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Admin</label><input value={formData.admin_email} onChange={e => setFormData({...formData, admin_email: e.target.value})} className="input-modern" type="email" required /></div>
                              <div className="space-y-1.5"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Senha Admin</label><input value={formData.admin_password} onChange={e => setFormData({...formData, admin_password: e.target.value})} className="input-modern" type="password" required /></div>
                          </div>
                          <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Telefone de Contacto</label>
                              <div className="relative">
                                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">+244</span>
                                 <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="input-modern pl-14" type="tel" placeholder="9xxxxxxxx" />
                              </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Plano de Subscrição</label>
                              <select value={formData.plan} onChange={e => setFormData({...formData, plan: e.target.value})} className="input-modern appearance-none">
                                <option value="KFmini">KFmini (Plano Inicial)</option>
                                <option value="KFmed">KFmed (Plano Intermédio)</option>
                                <option value="KFmax">KFmax (Plano Completo)</option>
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo Campanhas SMS</label>
                              <input type="number" value={formData.sms_campaigns_balance} onChange={e => setFormData({...formData, sms_campaigns_balance: parseInt(e.target.value) || 0})} className="input-modern" />
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <button 
                              type="button"
                              onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                              className={cn(
                                "w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none",
                                formData.is_active ? "bg-[#3451D1]" : "bg-slate-300"
                              )}
                            >
                              <div className={cn(
                                "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200",
                                formData.is_active ? "left-7" : "left-1"
                              )} />
                            </button>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-700">Estabelecimento Ativo</span>
                              <span className="text-[10px] text-slate-400 font-medium">Define se a loja pode operar e receber clientes</span>
                            </div>
                          </div>
                          <button type="submit" disabled={loading} className="btn-primary w-full py-4">{loading ? "A processar..." : "Salvar Estabelecimento"}</button>
                        </form>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'pedidos' && (
              <div className="card-premium p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                  <h3 className="font-bold text-[#0F172A]">Pedidos de Adesão Pendentes</h3>
                  <span className="badge badge-info">{subs.filter(s => s.status === 'pending').length} Novos</span>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Estabelecimento</th>
                      <th className="px-6 py-4">Plano</th>
                      <th className="px-6 py-4">Contacto</th>
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {subs.map(sub => (
                      <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#0F172A]">{sub.name} <div className="text-[10px] text-slate-400 font-medium tracking-widest">{sub.nif}</div></td>
                        <td className="px-6 py-4"><span className="text-[10px] font-black px-2 py-1 bg-blue-50 text-[#3451D1] rounded-md border border-blue-100">{sub.plan}</span></td>
                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                            <div className="font-bold text-[#3451D1]">{sub.phone}</div>
                            <div className="text-[10px] text-slate-400">{sub.admin_email}</div>
                         </td>
                        <td className="px-6 py-4 text-sm text-slate-400">{new Date(sub.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={cn("badge", sub.status === 'pending' ? "bg-amber-50 text-amber-600" : "badge-active")}>
                            {sub.status === 'pending' ? "PENDENTE" : "APROVADO"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {sub.status === 'pending' && (
                            <button onClick={() => handleApproveSub(sub.id)} className="btn-primary py-1.5 px-4 text-xs">Aprovar</button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {subs.length === 0 && <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-medium">Nenhum pedido de subscrição.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'historico' && (
              <div className="space-y-6">
                <div className="card-premium p-6 flex flex-wrap gap-4 items-end bg-white/50 backdrop-blur-sm shadow-premium">
                  <div className="flex-1 min-w-[200px] space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Buscar Cliente</label>
                    <input value={filters.client} onChange={e => setFilters({...filters, client: e.target.value})} className="input-modern" placeholder="9XX XXX XXX" />
                  </div>
                  <div className="flex-1 min-w-[150px] space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nº Senha</label>
                    <input value={filters.ticket_number} onChange={e => setFilters({...filters, ticket_number: e.target.value})} className="input-modern" placeholder="Ex: MC0-001" />
                  </div>
                  <div className="flex-1 min-w-[150px] space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Data Início</label>
                    <input type="date" value={filters.start_date} onChange={e => setFilters({...filters, start_date: e.target.value})} className="input-modern" />
                  </div>
                  <div className="flex-1 min-w-[150px] space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Data Fim</label>
                    <input type="date" value={filters.end_date} onChange={e => setFilters({...filters, end_date: e.target.value})} className="input-modern" />
                  </div>
                  <button onClick={refreshStats} className="btn-primary h-[50px] px-8"><Search className="w-4 h-4" /> Filtrar</button>
                  <button onClick={() => setFilters({client: "", start_date: "", end_date: "", ticket_number: ""})} className="btn-ghost h-[50px]"><RefreshCcw className="w-4 h-4" /></button>
                </div>

                <div className="flex gap-4 mb-6">
                   <button onClick={() => setStatsView("visitas")} className={cn("px-6 py-2 rounded-xl text-sm font-bold transition-all", statsView === 'visitas' ? "bg-white shadow-premium text-[#3451D1]" : "text-slate-400")}>Relatório de Visitas</button>
                   <button onClick={() => setStatsView("ranking")} className={cn("px-6 py-2 rounded-xl text-sm font-bold transition-all", statsView === 'ranking' ? "bg-white shadow-premium text-[#3451D1]" : "text-slate-400")}>Ranking de Clientes</button>
                </div>

                {statsView === 'visitas' ? (
                  <div className="card-premium p-0 overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                      <thead className="bg-[#0F172A] text-white text-[10px] font-bold uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-6">Cliente & Fila</th>
                          <th className="px-6 py-6">Estabelecimento</th>
                          <th className="px-6 py-6">Data & Hora</th>
                          <th className="px-6 py-6 text-right">Senha</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 bg-white">
                        {history.map(row => (
                          <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#3451D1] font-bold text-xs">{row.name?.charAt(0) || 'C'}</div>
                                <div>
                                  <div className="font-bold text-[#0F172A]">{row.name || 'Desconhecido'}</div>
                                  <div className="text-[10px] text-slate-400">{row.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4"><span className="text-sm font-bold text-[#3451D1]">{row.establishments?.name}</span></td>
                            <td className="px-6 py-4 text-xs text-slate-500 font-medium">{new Date(row.served_at).toLocaleString()}</td>
                            <td className="px-6 py-4 text-right"><span className="font-mono font-bold bg-slate-100 px-3 py-1 rounded-lg text-slate-700">{row.ticket_number}</span></td>
                          </tr>
                        ))}
                        {history.length === 0 && (
                          <tr><td colSpan={4} className="p-20 text-center">
                            <div className="space-y-4">
                              <Search className="w-12 h-12 mx-auto text-slate-200" />
                              <p className="text-slate-400 font-medium">Aplique filtros para ver os dados.</p>
                            </div>
                          </td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="card-premium p-0 overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                      <thead className="bg-[#3451D1] text-white text-[10px] font-bold uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-6">Cliente</th>
                          <th className="px-6 py-6">Total de Atendimentos</th>
                          <th className="px-6 py-6">Última Visita</th>
                          <th className="px-6 py-6 text-right">Status Global</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 bg-white">
                        {Array.from(history.reduce((acc, curr) => {
                          const contact = acc.get(curr.phone) || { ...curr, count: 0 };
                          contact.count += 1;
                          if (new Date(curr.served_at).getTime() > new Date(contact.served_at).getTime()) {
                            contact.served_at = curr.served_at;
                          }
                          acc.set(curr.phone, contact);
                          return acc;
                        }, new Map()).values())
                        .sort((a: any, b: any) => b.count - a.count)
                        .map((row: any) => (
                          <tr key={row.phone} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#3451D1] font-bold text-xs">{row.name?.charAt(0) || 'C'}</div>
                                <div>
                                  <div className="font-bold text-[#0F172A]">{row.name || 'Desconhecido'}</div>
                                  <div className="text-[10px] text-slate-400">{row.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-black text-[#3451D1]">{row.count} Senhas Recolhidas</span>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500 font-medium">{new Date(row.served_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-right">
                              <span className="badge badge-live">RECORRENTE</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
  const [activeTab, setActiveTab] = useState<"queue" | "crm" | "marketing" | "settings">("queue");
  const [contacts, setContacts] = useState<any[]>([]);
  const [newContactPhone, setNewContactPhone] = useState("");
  const [campaignMsg, setCampaignMsg] = useState("");
  const [sendingCampaign, setSendingCampaign] = useState(false);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [newService, setNewService] = useState({ name: "", prefix: "" });
  const [showModeModal, setShowModeModal] = useState<any>(null);
  const [modeConfirmPass, setModeConfirmPass] = useState("");

  const refreshContacts = async () => {
    if (!est) return;
    const res = await fetch(`/api/establishments/${est.code}/contacts`);
    if (res.ok) setContacts(await res.json());
  };

  const [fetchError, setFetchError] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  const refresh = async () => {
    try {
      const targetId = auth.estId || (auth as any).id;
      if (!targetId) {
        console.error("No targetId found in auth", auth);
        setFetchError(true);
        return;
      }

      // Tentar busca filtrada primeiro
      const resArr = await fetch(`/api/admin/establishments?role=establishment&estId=${targetId}`);
      if (!resArr.ok) {
        setFetchError(true);
        return;
      }

      const data = await resArr.json();
      let found = Array.isArray(data) ? data.find((e: any) => String(e.id) === String(targetId)) : null;

      // Fallback: Se não encontrou filtrado, tenta buscar todos (se permitido) e filtrar localmente
      if (!found) {
        const resAll = await fetch(`/api/admin/establishments`);
        if (resAll.ok) {
          const allData = await resAll.json();
          found = Array.isArray(allData) ? allData.find((e: any) => String(e.id) === String(targetId)) : null;
        }
      }

      if (found) {
        setEst(found);
        setFetchError(false);
      } else {
        setDebugInfo(`ID ${targetId} não encontrado na lista (${Array.isArray(data) ? data.length : 0} itens)`);
        setFetchError(true);
      }
    } catch (e: any) { 
      console.error("Refresh Error", e);
      setDebugInfo(`Erro: ${e.message || 'Desconhecido'}`);
      setFetchError(true);
    }
  };

  useEffect(() => { refresh(); const itv = setInterval(refresh, 3000); return () => clearInterval(itv); }, []);
  useEffect(() => { if (activeTab === 'crm') refreshContacts(); }, [activeTab, est]);

  const handleNext = async (serviceId?: string) => {
    if (!est) return;
    setLoading(true);
    const res = await fetch(`/api/establishments/${est.code}/next`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceId })
    });
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
     <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center space-y-6">
        <div className="w-12 h-12 border-4 border-[#3451D1] border-t-transparent animate-spin rounded-full"></div>
        <div className="space-y-2">
          <p className="text-lg font-bold text-slate-800">A carregar painel...</p>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">Estamos a preparar o seu ambiente de gestão de filas.</p>
        </div>
        {fetchError && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <p className="text-xs font-bold text-red-500 bg-red-50 px-4 py-2 rounded-lg">
               Não foi possível carregar os dados do seu estabelecimento.
               {debugInfo && <div className="mt-2 font-mono text-[10px] opacity-70 uppercase tracking-tighter">{debugInfo}</div>}
            </p>
            <button onClick={() => window.location.reload()} className="btn-primary py-2 px-6 text-xs">Tentar Novamente</button>
          </div>
        )}
        <button onClick={onLogout} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest pt-10">Sair da Conta</button>
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
                    <span className={cn(
                      "text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter border",
                      est.plan === 'KFmax' ? "bg-slate-900 text-white border-slate-800" : 
                      est.plan === 'KFmed' ? "bg-blue-600 text-white border-blue-700" :
                      "bg-slate-100 text-slate-500 border-slate-200"
                    )}>
                      {est.plan || 'KFmini'}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                 </div>
              </div>
           </div>
           <button onClick={onLogout} className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
           </button>
        </nav>
        
        {/* Dashboard Navigation (Professional UX) */}
        <div className="bg-white border-b border-slate-100 px-6 overflow-x-auto no-scrollbar">
          <div className="max-w-6xl mx-auto flex items-center gap-1">
             <button onClick={() => setActiveTab("queue")} className={cn(
               "px-6 py-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap", 
               activeTab === "queue" ? "border-[#3451D1] text-[#3451D1]" : "border-transparent text-slate-400 hover:text-slate-600"
             )}>
                <Timer className="w-4 h-4" /> Gestão de Fila
             </button>
             <button onClick={() => setActiveTab("crm")} className={cn(
               "px-6 py-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap", 
               activeTab === "crm" ? "border-[#3451D1] text-[#3451D1]" : "border-transparent text-slate-400 hover:text-slate-600"
             )}>
                <Users className="w-4 h-4" /> Base de Clientes
             </button>
             {est.plan !== 'KFmini' && (
               <button onClick={() => setActiveTab("marketing")} className={cn(
                 "px-6 py-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap", 
                 activeTab === "marketing" ? "border-[#3451D1] text-[#3451D1]" : "border-transparent text-slate-400 hover:text-slate-600"
               )}>
                  <Mail className="w-4 h-4" /> Marketing SMS
                  <span className="bg-blue-50 text-[#3451D1] text-[8px] font-black px-1.5 py-0.5 rounded ml-1 border border-blue-100">PRO</span>
               </button>
             )}
             <button onClick={() => setActiveTab("settings")} className={cn(
               "px-6 py-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap", 
               activeTab === "settings" ? "border-[#3451D1] text-[#3451D1]" : "border-transparent text-slate-400 hover:text-slate-600"
             )}>
                <Settings className="w-4 h-4" /> Definições
             </button>
          </div>
        </div>

       <main className="p-6 lg:p-12 max-w-6xl mx-auto">
          {activeTab === 'queue' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 {/* Left Column: Controls */}
                 <div className="lg:col-span-5 space-y-8">
                    <div className="card-premium p-10 flex flex-col items-center text-center space-y-6 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Painel Ativo</span>
                          </div>
                       </div>
                       <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">A chamar agora</span>
                       <div className="space-y-1">
                          <div className="text-[120px] font-bold text-[#0F172A] leading-none tracking-tighter">
                             #{current ? current.ticket_number.split('-').pop() : '--'}
                          </div>
                          {current?.service_name && (
                             <div className="text-sm font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full inline-block">
                                {current.service_name}
                             </div>
                          )}
                       </div>
                       <p className="text-slate-400 font-medium">
                          {current ? `Em atendimento há ${Math.floor((Date.now() - new Date(current.called_at!).getTime()) / 60000)} mins` : "Aguardando próxima senha"}
                       </p>
                    </div>

                    <div className="space-y-6">
                        {est.queue_mode === 'multi_service_multi' ? (
                           <div className="space-y-4">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Chamar por Serviço</label>
                              <div className="grid grid-cols-1 gap-3">
                                 {(est.services || []).map(svc => {
                                    const svcWaiting = waiting.filter(w => w.service_id === svc.id);
                                    return (
                                       <button 
                                          key={svc.id}
                                          onClick={() => handleNext(svc.id)} 
                                          disabled={svcWaiting.length === 0 || loading}
                                          className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-[#3451D1] hover:bg-blue-50/30 transition-all group disabled:opacity-50 disabled:grayscale"
                                       >
                                          <div className="flex items-center gap-4">
                                             <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-[#3451D1] group-hover:bg-white">
                                                {svc.prefix}
                                             </div>
                                             <div className="text-left">
                                                <h5 className="font-bold text-[#0F172A]">{svc.name}</h5>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">{svcWaiting.length} em espera</p>
                                             </div>
                                          </div>
                                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#3451D1]" />
                                       </button>
                                    );
                                 })}
                                 {(est.services || []).length === 0 && (
                                    <div className="p-6 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                                       <p className="text-xs text-slate-400 font-bold uppercase">Configure serviços nas Definições</p>
                                    </div>
                                 )}
                              </div>
                           </div>
                        ) : (
                           <button onClick={() => handleNext()} disabled={waiting.length === 0 || loading} className="btn-primary w-full py-7 text-2xl shadow-xl shadow-blue-500/20">
                              {loading ? <div className="w-8 h-8 border-3 border-white/30 border-t-white animate-spin rounded-full"></div> : <><ChevronRight className="w-8 h-8" /> Chamar Próximo</>}
                           </button>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <button onClick={() => current && handleRecall(current.id, current.ticket_number)} disabled={!current} className="btn-ghost flex-col py-6 gap-2">
                             <Bell className="w-5 h-5 text-blue-500" />
                             <span className="text-[10px] uppercase font-bold tracking-wider">Lembrar (SMS)</span>
                          </button>
                          <button onClick={handlePrintQR} className="btn-ghost flex-col py-6 gap-2">
                             <Printer className="w-5 h-5 text-slate-500" />
                             <span className="text-[10px] uppercase font-bold tracking-wider">Imprimir QR</span>
                          </button>
                       </div>
                    </div>

                    <div className="card-premium p-8 space-y-6 bg-slate-50/50 border-dashed border-2">
                       <div className="flex items-center gap-2 mb-4">
                          <Plus className="w-4 h-4 text-[#3451D1]" />
                          <h3 className="font-bold text-[#0F172A]">Adicionar Manualmente</h3>
                       </div>
                       <form onSubmit={handleManualJoin} className="space-y-4">
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+244</span>
                            <input disabled={loading} value={manualPhone} onChange={e => setManualPhone(e.target.value)} className="input-modern pl-16 text-xl font-bold py-4" placeholder="9XX XXX XXX" />
                          </div>
                          <button type="submit" disabled={loading} className="btn-primary w-full py-4">Gerar Senha</button>
                       </form>
                    </div>
                 </div>

                 {/* Right Column: List & Stats */}
                 <div className="lg:col-span-7 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="card-premium py-8 flex flex-col items-center">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Em Espera</span>
                         <span className="text-5xl font-bold text-[#0F172A]">{waiting.length}</span>
                       </div>
                       <div className="card-premium py-8 flex flex-col items-center">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Atendidos Hoje</span>
                         <span className="text-5xl font-bold text-[#0F172A]">{(est.queues || []).filter(q => q.status === 'served').length}</span>
                       </div>
                    </div>

                    <div className="card-premium p-0 overflow-hidden">
                       <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                          <h3 className="font-bold text-[#0F172A]">Fila de Espera</h3>
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tempo Real</span>
                          </div>
                       </div>
                       <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
                          {waiting.map((q, i) => (
                             <div key={q.id} className="p-6 flex items-center justify-between hover:bg-slate-50/80 transition-all group">
                                <div className="flex items-center gap-4">
                                   <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center font-black group-hover:border-[#3451D1] group-hover:bg-blue-50 transition-all">
                                      <span className="text-[8px] text-slate-400 uppercase font-black">Senha</span>
                                      <span className="text-lg text-[#3451D1]">#{q.ticket_number.split('-').pop()}</span>
                                   </div>
                                   <div>
                                     <div className="font-bold text-[#0F172A] flex items-center gap-2 text-base">
                                       {q.phone}
                                       {i === 0 && <span className="bg-green-100 text-green-600 text-[8px] px-1.5 py-0.5 rounded font-black uppercase">Próximo</span>}
                                     </div>
                                     <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Aguardando há {Math.floor((Date.now() - new Date(q.joined_at).getTime()) / 60000)}m</div>
                                   </div>
                                </div>
                                <div className="flex gap-2">
                                   <button onClick={() => handleRecall(q.id, q.ticket_number)} className="p-3 text-slate-400 hover:text-[#3451D1] hover:bg-white shadow-sm border border-transparent hover:border-slate-100 rounded-xl transition-all"><Bell className="w-5 h-5" /></button>
                                   <button onClick={() => handleCancel(q.id)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-white shadow-sm border border-transparent hover:border-slate-100 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                                </div>
                             </div>
                          ))}
                          {waiting.length === 0 && (
                            <div className="p-20 text-center space-y-4">
                               <Timer className="w-12 h-12 mx-auto text-slate-100" />
                               <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Fila Vazia</p>
                            </div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'crm' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="card-premium p-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#3451D1]"><Users className="w-6 h-6" /></div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Total</p>
                            <h3 className="text-2xl font-bold">{contacts.length} Clientes</h3>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="card-premium p-0 overflow-hidden">
                   <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                      <h3 className="text-xl font-bold text-[#0F172A]">Relação de Clientes</h3>
                      <button className="btn-ghost text-xs">Exportar</button>
                   </div>
                   <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50/50 text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em]">
                          <tr>
                             <th className="px-8 py-5">Cliente</th>
                             <th className="px-8 py-5">Recorrência</th>
                             <th className="px-8 py-5">Última Presença</th>
                             <th className="px-8 py-5 text-right">Ação</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {contacts.map((c, i) => (
                             <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-6">
                                   <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-[#3451D1] text-sm font-black">
                                        {(c.name || 'C').charAt(0).toUpperCase()}
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="font-bold text-[#0F172A] text-base">{c.name || 'Cliente'}</span>
                                        <span className="text-xs font-bold text-slate-400 tracking-wider">{c.phone}</span>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-8 py-6">
                                   <div className="flex flex-col gap-1">
                                      <span className="text-sm font-black text-[#3451D1]">{c.visit_count} Visitas</span>
                                      <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                                         <div className="h-full bg-blue-500" style={{ width: `${Math.min(c.visit_count * 10, 100)}%` }}></div>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-8 py-6 text-sm font-bold text-slate-500">
                                   {new Date(c.last_visit).toLocaleDateString('pt-PT')}
                                </td>
                                <td className="px-8 py-6 text-right">
                                   <button className="btn-ghost p-3 text-[#3451D1] hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-xl"><Mail className="w-4 h-4" /></button>
                                </td>
                             </tr>
                          ))}
                        </tbody>
                     </table>
                    </div>
                 </div>
               </div>
            )}

            {activeTab === 'marketing' && (
               <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="card-premium p-10 space-y-8">
                     <div className="flex justify-between items-start">
                        <div className="space-y-1">
                           <h3 className="text-3xl font-bold text-[#0F172A]">Nova Campanha SMS</h3>
                           <p className="text-slate-500">Comunique instantaneamente com toda a sua base.</p>
                        </div>
                        <div className="bg-slate-900 text-white rounded-2xl p-4 text-center">
                           <p className="text-[8px] font-black uppercase tracking-widest opacity-50 mb-1">Campanhas / Mês</p>
                           <p className="text-3xl font-black">{est.sms_campaigns_balance || 0}</p>
                        </div>
                     </div>

                     <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-6">
                        <div className="bg-white p-3 rounded-xl shadow-sm text-[#3451D1]"><Users className="w-6 h-6" /></div>
                        <div>
                           <h4 className="font-bold text-[#0F172A]">Alcance Estimado</h4>
                           <p className="text-sm text-slate-500">Sua mensagem chegará a <span className="font-black text-[#3451D1]">{contacts.length}</span> contactos.</p>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="space-y-1.5">
                           <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Corpo da Mensagem</label>
                           <textarea 
                              value={campaignMsg} 
                              onChange={e => setCampaignMsg(e.target.value)} 
                              className="input-modern min-h-[160px] resize-none py-6 leading-relaxed" 
                              placeholder="Ex: Olá! Hoje temos 20% de desconto para os nossos clientes habituais. Visitem-nos!"
                           />
                           <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase px-1">
                              <span>{campaignMsg.length} caracteres</span>
                              <span>{Math.ceil(campaignMsg.length / 160)} SMS p/ cliente</span>
                           </div>
                        </div>
                        
                        <button 
                          onClick={() => {
                             if (!campaignMsg) return notify("Escreva o conteúdo da SMS", 'error');
                             if ((est.sms_campaigns_balance || 0) <= 0) return notify("Saldo de campanhas esgotado este mês", 'error');
                             
                             if (window.confirm(`Confirmar envio para ${contacts.length} clientes?`)) {
                               setSendingCampaign(true);
                               setTimeout(() => {
                                 notify("Campanha enviada para processamento!");
                                 setCampaignMsg("");
                                 setSendingCampaign(false);
                               }, 1500);
                             }
                          }}
                          disabled={sendingCampaign || (est.sms_campaigns_balance || 0) <= 0}
                          className="btn-primary w-full py-6 text-xl"
                        >
                           {sendingCampaign ? "A DISPARAR..." : "Enviar Campanha"}
                        </button>
                     </div>
                  </div>

                  <div className="card-premium bg-slate-900 border-none p-8 flex items-center justify-between text-white overflow-hidden relative group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32 group-hover:opacity-40 transition-opacity"></div>
                     <div className="space-y-2 relative z-10">
                        <h4 className="text-lg font-bold">Plano {est.plan}</h4>
                        <p className="text-blue-200 text-xs">Inclui {est.plan === 'KFmax' ? 4 : 2} disparos em massa por mês.</p>
                     </div>
                     <button className="btn-ghost bg-white text-slate-900 hover:bg-blue-50 relative z-10 h-auto py-3 px-6 text-xs font-black">UPGRADE</button>
                  </div>
               </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="card-premium p-10 space-y-10">
                    <div className="space-y-1">
                       <h3 className="text-3xl font-bold text-[#0F172A]">Definições do Sistema</h3>
                       <p className="text-slate-500">Configure o modo de operação e os serviços da sua unidade.</p>
                    </div>

                    <div className="space-y-6">
                        <label className="text-sm font-bold text-slate-700">Modo de Funcionamento</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           {[
                            { id: 'normal', title: 'Normal', desc: 'Fila única tradicional. Ideal para fluxos simples.', icon: <Timer className="w-5 h-5" /> },
                            { id: 'multi_service_single', title: 'Multi-Serviço', desc: 'Fila única mas com seleção de serviço pelo cliente.', icon: <Layers className="w-5 h-5" /> },
                            { id: 'multi_service_multi', title: 'Multi-Fila', desc: 'Filas independentes por serviço. Ideal para balcões múltiplos.', icon: <LayoutGrid className="w-5 h-5" /> }
                          ].map(mode => (
                            <button 
                              key={mode.id}
                              onClick={() => {
                                 if (est.queue_mode === mode.id) return;
                                 setShowModeModal(mode);
                              }}
                              className={cn(
                                "p-6 rounded-2xl border-2 text-left transition-all space-y-4 group relative",
                                est.queue_mode === mode.id ? "border-[#3451D1] bg-blue-50/50 shadow-md" : "border-slate-100 hover:border-slate-200 bg-white"
                              )}
                            >
                               <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors", est.queue_mode === mode.id ? "bg-[#3451D1] text-white" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100")}>
                                  {mode.icon}
                               </div>
                               <div>
                                  <h4 className={cn("font-bold text-lg", est.queue_mode === mode.id ? "text-[#3451D1]" : "text-[#0F172A]")}>{mode.title}</h4>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 mb-2">{est.queue_mode === mode.id ? "Ativo" : "Selecionar"}</p>
                                  <p className="text-xs text-slate-500 leading-relaxed">{mode.desc}</p>
                               </div>
                               {est.queue_mode === mode.id && <div className="absolute top-4 right-4 w-3 h-3 bg-[#3451D1] rounded-full border-4 border-white shadow-sm"></div>}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="pt-10 border-t border-slate-50 space-y-8">
                       <div className="flex items-center justify-between">
                          <div className="space-y-1">
                             <h4 className="text-xl font-bold text-[#0F172A]">Gestão de Serviços</h4>
                             <p className="text-sm text-slate-500">Defina os tipos de atendimento disponíveis.</p>
                          </div>
                          <button 
                            onClick={() => setShowServiceModal(true)}
                            className="btn-primary py-3 px-6 text-xs flex items-center gap-2"
                          >
                             <Plus className="w-4 h-4" /> Novo Serviço
                          </button>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(est.services || []).map(svc => (
                             <div key={svc.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-[#3451D1]">
                                      {svc.prefix}
                                   </div>
                                   <div>
                                      <h5 className="font-bold text-[#0F172A]">{svc.name}</h5>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ativo</p>
                                   </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button 
                                     onClick={() => {
                                       if (window.confirm("Remover este serviço?")) {
                                          fetch(`/api/admin/services/${svc.id}`, { method: "DELETE" }).then(res => { if (res.ok) { notify("Serviço removido"); refresh(); } });
                                       }
                                     }}
                                     className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                   >
                                      <Trash2 className="w-4 h-4" />
                                   </button>
                                </div>
                             </div>
                          ))}
                          {(est.services || []).length === 0 && (
                            <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                               <Layers className="w-8 h-8 mx-auto text-slate-200 mb-2" />
                               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Nenhum serviço configurado</p>
                            </div>
                          )}
                       </div>
                    </div>

                    <div className="pt-10 border-t border-slate-50 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                             <Monitor className="w-5 h-5" />
                          </div>
                          <div>
                             <h4 className="font-bold text-[#0F172A]">Monitor de Senhas</h4>
                             <p className="text-xs text-slate-500">Link público para televisores/monitores.</p>
                          </div>
                       </div>
                       <button onClick={() => window.open(`/?display=${est.code}`, '_blank')} className="btn-ghost py-3 px-6 text-xs flex items-center gap-2">
                          <ExternalLink className="w-4 h-4" /> Abrir Monitor
                       </button>
                    </div>
                 </div>
              </div>
           )}
        </main>

        {/* Modal: Adicionar Serviço */}
        <Modal 
          isOpen={showServiceModal} 
          onClose={() => setShowServiceModal(false)} 
          title="Novo Serviço"
        >
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nome do Serviço</label>
                 <input 
                   type="text" 
                   value={newService.name}
                   onChange={e => setNewService(prev => ({ ...prev, name: e.target.value }))}
                   className="input-modern" 
                   placeholder="Ex: Geral, Tesouraria, Exames" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Prefixo da Senha</label>
                 <input 
                   type="text" 
                   value={newService.prefix}
                   onChange={e => setNewService(prev => ({ ...prev, prefix: e.target.value.toUpperCase() }))}
                   className="input-modern" 
                   placeholder="Ex: A, B, T, LAB" 
                   maxLength={4}
                 />
              </div>
              <button 
                onClick={() => {
                   if (!newService.name || !newService.prefix) return notify("Preencha todos os campos", 'error');
                   fetch("/api/admin/services", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ est_id: est.id, name: newService.name, prefix: newService.prefix })
                   }).then(res => { 
                      if (res.ok) { 
                        notify("Serviço adicionado!"); 
                        setNewService({ name: "", prefix: "" });
                        setShowServiceModal(false);
                        refresh(); 
                      } 
                   });
                }}
                className="btn-primary w-full py-4"
              >
                 Criar Serviço
              </button>
           </div>
        </Modal>

        {/* Modal: Confirmar Alteração de Modo */}
        <Modal 
          isOpen={!!showModeModal} 
          onClose={() => { setShowModeModal(null); setModeConfirmPass(""); }} 
          title="Alterar Modo de Fila"
        >
           <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-500 shrink-0">
                    <Info className="w-5 h-5" />
                 </div>
                 <p className="text-xs text-blue-700 leading-relaxed">
                    Está prestes a mudar para o modo <strong>{showModeModal?.title}</strong>. 
                    Isto alterará a forma como os clientes entram na fila e como as senhas são geradas.
                 </p>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Senha de Administrador</label>
                 <input 
                   type="password" 
                   value={modeConfirmPass}
                   onChange={e => setModeConfirmPass(e.target.value)}
                   className="input-modern" 
                   placeholder="Digite a sua senha para confirmar" 
                 />
              </div>
              <button 
                onClick={async () => {
                   if (modeConfirmPass === est.admin_password) {
                      const res = await fetch(`/api/establishments/${est.code}`, {
                         method: "PUT",
                         headers: { "Content-Type": "application/json" },
                         body: JSON.stringify({ adminPassword: modeConfirmPass, updateData: { queue_mode: showModeModal.id } })
                      });
                      if (res.ok) { 
                         notify("Modo de fila atualizado!"); 
                         setShowModeModal(null);
                         setModeConfirmPass("");
                         refresh(); 
                      } else {
                         notify("Erro na atualização", 'error');
                      }
                   } else {
                      notify("Senha incorreta", 'error');
                   }
                }}
                className="btn-primary w-full py-4"
              >
                 Confirmar Alteração
              </button>
           </div>
        </Modal>

        {/* Elemento oculto para geração do QR Code de impressão */}
        <div className="hidden">
           <div id="main-qr-canvas">
              <QRCodeSVG value={`${window.location.origin}/?est=${est.code}`} size={512} level="H" />
           </div>
        </div>
     </div>
  );
};

// --- 3.5 PUBLIC DISPLAY: MONITOR TV ---
const PublicDisplayView = ({ estCode }: { estCode: string }) => {
  const [est, setEst] = useState<Establishment | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const res = await fetch(`/api/admin/establishments?code=${estCode}`);
      if (!res.ok) return;
      const data = await res.json();
      const found = Array.isArray(data) ? data[0] : null;
      if (found) {
        setEst(found);
        setLoading(false);
      }
    } catch (e) { console.error("Monitor refresh error", e); }
  };

  useEffect(() => { refresh(); const itv = setInterval(refresh, 5000); return () => clearInterval(itv); }, []);

  if (loading || !est) return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent animate-spin rounded-full"></div>
    </div>
  );

  const called = (est.queues || []).filter(q => q.status === 'called').sort((a,b) => new Date(b.called_at!).getTime() - new Date(a.called_at!).getTime());
  const current = called[0];
  const history = called.slice(1, 5);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-12 flex flex-col gap-12 overflow-hidden">
       {/* Header */}
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 bg-white rounded-3xl p-4">
                <img src={est.logo_url} className="w-full h-full object-contain" />
             </div>
             <div>
                <h1 className="text-6xl font-black tracking-tight">{est.name}</h1>
                <p className="text-2xl text-slate-400 font-bold uppercase tracking-[0.3em]">Monitor de Chamadas</p>
             </div>
          </div>
          <div className="text-right">
             <div className="text-4xl font-black text-blue-500">{new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</div>
             <div className="text-slate-400 font-bold uppercase tracking-widest">{new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          </div>
       </div>

       {/* Main Content */}
       <div className="flex-1 grid grid-cols-12 gap-12">
          {/* Current Ticket */}
          <div className="col-span-8 bg-blue-600 rounded-[60px] shadow-2xl flex flex-col items-center justify-center text-center p-20 animate-pulse-subtle relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
             <span className="text-4xl font-black uppercase tracking-[0.5em] opacity-50 mb-8">Senha Atual</span>
             <div className="text-[320px] font-black leading-none tracking-tighter drop-shadow-2xl">
                {current ? current.ticket_number.split('-').pop() : '--'}
             </div>
             <div className="mt-12 space-y-4">
                <div className="text-5xl font-black uppercase tracking-widest">
                   {current?.service_name || 'Atendimento'}
                </div>
                {current?.name && (
                   <div className="text-3xl text-blue-100 font-bold">
                      {current.name}
                   </div>
                )}
             </div>
          </div>

          {/* History */}
          <div className="col-span-4 flex flex-col gap-8">
             <h2 className="text-3xl font-black uppercase tracking-widest text-slate-400 pl-4">Últimas Chamadas</h2>
             <div className="flex-1 flex flex-col gap-6">
                {history.map((h, i) => (
                   <motion.div 
                     initial={{ x: 50, opacity: 0 }} 
                     animate={{ x: 0, opacity: 1 }} 
                     transition={{ delay: i * 0.1 }}
                     key={h.id} 
                     className="bg-slate-800/50 border border-slate-700/50 rounded-[40px] p-8 flex items-center justify-between"
                   >
                      <div className="text-7xl font-black text-slate-300">
                         {h.ticket_number.split('-').pop()}
                      </div>
                      <div className="text-right">
                         <div className="text-xl font-black text-blue-400 uppercase tracking-widest">{h.service_name || 'Geral'}</div>
                         <div className="text-sm text-slate-500 font-bold">{new Date(h.called_at!).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                   </motion.div>
                ))}
                {history.length === 0 && (
                   <div className="flex-1 border-4 border-dashed border-slate-800 rounded-[40px] flex items-center justify-center">
                      <p className="text-slate-700 font-black uppercase tracking-widest text-xl">Aguardando...</p>
                   </div>
                )}
             </div>
             <div className="bg-slate-900 rounded-[40px] p-10 flex flex-col items-center justify-center text-center gap-4">
                <QrCode className="w-24 h-24 text-blue-500 opacity-20" />
                <p className="text-slate-500 font-bold text-sm uppercase tracking-[0.2em]">Escaneie o QR Code no balcão para entrar na fila</p>
             </div>
          </div>
       </div>
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
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

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
      body: JSON.stringify({ phone, estCode, name: userName, serviceId: selectedServiceId }) 
    });
    if (res.ok) { 
      const clean = phone.replace(/\D/g, '');
      localStorage.setItem(`kw_phone_${estCode}`, clean); 
      if (userName) localStorage.setItem(`kw_name_${clean}`, userName);
      refresh(); 
      notify("Entrou na fila!"); 
    } else { 
      const err = await res.json();
      notify(err.error || "Erro ao entrar na fila", 'error'); 
    }
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
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
        </div>
      </div>
    );
  }

  if (est.queue_mode !== 'normal' && !selectedServiceId && (est.services || []).length > 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFD] relative overflow-x-hidden">
         <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden pointer-events-none">
            <img src={est.logo_url} className="w-full h-full object-cover blur-3xl opacity-20 scale-125" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F8FAFD]/50 to-[#F8FAFD]" />
         </div>
         <div className="relative z-10 p-6 flex flex-col items-center justify-center min-h-screen">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-8">
               <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-white rounded-2xl mx-auto shadow-sm border border-slate-50 p-3 mb-6">
                     <img src={est.logo_url} className="w-full h-full object-contain" />
                  </div>
                  <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">O que deseja hoje?</h1>
                  <p className="text-slate-500 font-medium">Selecione o serviço para entrar na fila.</p>
               </div>
               <div className="grid grid-cols-1 gap-4">
                  {(est.services || []).map(svc => (
                     <button 
                       key={svc.id}
                       onClick={() => setSelectedServiceId(svc.id)}
                       className="card-premium p-8 text-left hover:border-[#3451D1] transition-all group flex items-center justify-between"
                     >
                        <div>
                           <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-[#3451D1]">{svc.name}</h3>
                           <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Prefixo {svc.prefix}</p>
                        </div>
                        <ArrowRight className="w-6 h-6 text-slate-200 group-hover:text-[#3451D1] transform group-hover:translate-x-1 transition-all" />
                     </button>
                  ))}
               </div>
            </motion.div>
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
  const [displayCode, setDisplayCode] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>(undefined);
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
    const dCode = p.get("display");
    if (dCode) setDisplayCode(dCode);

    const handleSubNav = (e: any) => {
      setSelectedPlan(e.detail?.plan);
      setShowSubscribe(true);
    };
    window.addEventListener('nav-subscribe', handleSubNav);
    return () => window.removeEventListener('nav-subscribe', handleSubNav);
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

      {displayCode ? (
        <PublicDisplayView estCode={displayCode} />
      ) : clientEstCode ? ( 
        <ClientView estCode={clientEstCode} notify={showToast} /> 
      ) : auth ? ( 
        auth.role === 'super' ? <SuperAdminView onLogout={handleLogout} notify={showToast} /> : <EstAdminView auth={auth} onLogout={handleLogout} notify={showToast} /> 
      ) : showSubscribe ? (
        <SubscribeView initialPlan={selectedPlan} onBack={() => { setShowSubscribe(false); setSelectedPlan(undefined); }} notify={showToast} />
      ) : showLogin ? (
        <LandingView onLogin={handleLogin} onBack={() => setShowLogin(false)} />
      ) : (
        <MarketingView 
          onLoginClick={() => setShowLogin(true)} 
          onSubscribeClick={(plan) => { setSelectedPlan(plan); setShowSubscribe(true); }}
        />
      )}
    </div>
  );
}
