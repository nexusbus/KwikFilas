import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_ANON_KEY || ""
);

const app = express();
app.use(express.json());

// --- AUX: Gerador de Iniciais Únicas ---
async function generateUniqueInitials(name: string) {
  const base = name.split(" ").map(w => w[0]).join("").toUpperCase().substring(0, 3);
  let initials = base;
  let counter = 1;

  while (true) {
    const { data } = await supabase.from("establishments").select("id").eq("initials", initials).single();
    if (!data) return initials;
    initials = `${base}${counter}`;
    counter++;
  }
}

// 1. LOGIN (Super Admin vs Establishment Admin)
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase
    .from("establishments")
    .select("*")
    .eq("admin_email", email)
    .eq("admin_password", password)
    .single();

  if (error || !data) return res.status(401).json({ error: "Credenciais inválidas" });
  res.json(data);
});

// 2. LISTAR (Filtro por Role)
app.get("/api/admin/establishments", async (req, res) => {
  const { role, estId } = req.query;
  
  let query = supabase.from("establishments").select("*, queues(*)");
  
  if (role === 'establishment' && estId) {
    query = query.eq("id", estId);
  }

  const { data, error } = await supabase.from("establishments").select("*, queues(*)");
  if (error) return res.status(500).json({ error: error.message });
  
  const formatted = (data || []).map(est => ({
    ...est,
    customers: (est.queues || []).filter(q => q.status !== 'served'),
  }));
  
  res.json(formatted);
});

// 3. CRIAR (Com Lógica de Iniciais e NIF único)
app.post("/api/admin/establishments", async (req, res) => {
  const { name, nif, admin_email, admin_password, logo_url } = req.body;

  // Gerar iniciais automáticas
  const initials = await generateUniqueInitials(name);
  
  // Gerar código único
  const countRes = await supabase.from("establishments").select("id", { count: "exact", head: true });
  const code = `${initials}-${(countRes.count || 0) + 1}`;

  const { data, error } = await supabase
    .from("establishments")
    .insert([{ 
      name, nif, admin_email, admin_password, logo_url, initials, code, role: 'establishment' 
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: "Erro ao criar (NIF ou Email duplicado)" });
  res.json(data);
});

// 4. ELIMINAR (Com Senha de Super Admin)
app.post("/api/admin/establishments/delete", async (req, res) => {
  const { targetId, superPassword } = req.body;

  const { data: isSuper } = await supabase
    .from("establishments")
    .select("id")
    .eq("role", "super")
    .eq("admin_password", superPassword)
    .single();

  if (!isSuper) return res.status(403).json({ error: "Senha de Super User incorreta" });

  const { error } = await supabase.from("establishments").delete().eq("id", targetId);
  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true });
});

// 5. ENTRAR NA FILA (Garantir Unicidade e Ticket)
app.post("/api/queue/join", async (req, res) => {
  const { phone, estCode } = req.body;
  const { data: est } = await supabase.from("establishments").select("id, initials").eq("code", estCode).single();
  if (!est) return res.status(404).json({ error: "Estabelecimento não encontrado" });

  const { data: exists } = await supabase.from("queues").select("id").eq("est_id", est.id).eq("phone", phone).single();
  if (exists) return res.status(400).json({ error: "Já está nesta fila" });

  const day = new Date().getDate();
  const ticket = `${est.initials}-${day}-${Math.floor(Math.random() * 900) + 100}`;

  const { data, error } = await supabase
    .from("queues")
    .insert([{ est_id: est.id, phone, ticket_number: ticket }])
    .select().single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 6. CHAMAR PRÓXIMO + DISPARO SMS
app.post("/api/establishments/:code/next", async (req, res) => {
  const { code } = req.params;
  const { data: est } = await supabase.from("establishments").select("id, name").eq("code", code).single();
  if (!est) return res.status(404).json({ error: "Local não encontrado" });

  const { data: current } = await supabase.from("queues").select("*").eq("est_id", est.id).eq("status", "called").single();
  if (current) await supabase.from("queues").delete().eq("id", current.id);

  const { data: next } = await supabase.from("queues")
    .select("*")
    .eq("est_id", est.id)
    .eq("status", "waiting")
    .order("joined_at", { ascending: true })
    .limit(1)
    .single();
  
  if (next) {
    await supabase.from("queues").update({ status: "called" }).eq("id", next.id);
    await triggerSms(next.phone, next.ticket_number, est.name);
  }
  res.json({ success: true, next: next || null });
});

// 7. RE-CHAMAR (DISPARAR SMS NOVAMENTE)
app.post("/api/establishments/:code/recall", async (req, res) => {
  const { code } = req.params;
  const { ticketId } = req.body;
  const { data: est } = await supabase.from("establishments").select("id, name").eq("code", code).single();
  const { data: ticket } = await supabase.from("queues").select("*").eq("id", ticketId).single();
  
  if (ticket && est) {
    await triggerSms(ticket.phone, ticket.ticket_number, est.name);
    return res.json({ success: true });
  }
  res.status(404).json({ error: "Ticket não encontrado" });
});

// 8. CANCELAR TICKET
app.post("/api/establishments/:code/cancel", async (req, res) => {
  const { ticketId } = req.body;
  await supabase.from("queues").delete().eq("id", ticketId);
  res.json({ success: true });
});

// --- HELPER SMS ---
async function triggerSms(phone: string, ticket: string, estName: string) {
  const rawId = process.env.SMSHUB_AUTH_ID ?? '';
  const rawToken = process.env.SMSHUB_SECRET ?? '';
  const rawUrl = process.env.SMSHUB_BASE_URL ?? "https://smshub.ao/api/sms/send";
  
  const smsId = rawId.replace(/^"|"$/g, '');
  const smsToken = rawToken.replace(/^"|"$/g, '');
  const smsUrl = rawUrl.replace(/^"|"$/g, '');

  if (smsId && smsToken && smsUrl && phone) {
    let cleanPhone = phone.replace(/\D/g, '');
    
    // Formatar para Angola se necessário (9 dígitos -> 244 + 9 dígitos)
    if (cleanPhone.length === 9) {
      cleanPhone = '244' + cleanPhone;
    }

    const ticketSeq = ticket.split('-').pop();
    const message = `KwikFilas: Sua senha ${ticketSeq} em ${estName} foi chamada. Por favor dirija-se ao local.`;
    
    try {
      const queryParams = new URLSearchParams({
        id: smsId,
        api_key: smsToken,
        telemo: cleanPhone,
        sms: message
      });

      const finalUrl = `${smsUrl}?${queryParams.toString()}`;
      
      console.log('--- SMS DISPATCH ATTEMPT ---');
      console.log('URL:', finalUrl.split('api_key=')[0] + 'api_key=***');
      
      const response = await fetch(finalUrl, { method: "GET" });
      const responseData = await response.text();
      
      console.log('SMS Hub Status:', response.status);
      console.log('SMS Hub Response:', responseData);
      console.log('---------------------------');
      return responseData;
    } catch (e) {
      console.error('CRITICAL: SMS Hub Dispatch Failed', e);
      return null;
    }
  } else {
    console.warn('SMS dispatch skipped: Missing configuration or phone number');
    return null;
  }
}

export default app;


