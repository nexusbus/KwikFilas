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

// 1. Listar Estabelecimentos
app.get("/api/admin/establishments", async (req, res) => {
  const { data, error } = await supabase
    .from("establishments")
    .select("*, queues(*)");
  
  if (error) return res.status(500).json({ error: error.message });
  
  const formatted = (data || []).map(est => ({
    ...est,
    customers: (est.queues || []).filter(q => q.status !== 'served'),
    contacts: [] 
  }));
  
  res.json(formatted);
});

// 2. Criar Novo Estabelecimento (Versão Mobile Corrigida)
app.post("/api/admin/establishments", async (req, res) => {
  const { 
    name, 
    initials, 
    nif, 
    admin_email, 
    admin_password, 
    opening_hours, 
    product_photos,
    logo_url
  } = req.body;

  const countRes = await supabase.from("establishments").select("id", { count: "exact", head: true });
  const idNum = (countRes.count || 0) + 1;
  const code = `${initials.toUpperCase()}-${idNum.toString().padStart(3, "0")}`;

  const { data, error } = await supabase
    .from("establishments")
    .insert([{ 
      name, 
      initials: initials.toUpperCase(), 
      code, 
      nif,
      admin_email,
      admin_password,
      opening_hours: opening_hours || {},
      product_photos: product_photos || [],
      logo_url
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 3. Entrar na Fila (Garantir Unicidade por Sessão)
app.post("/api/queue/join", async (req, res) => {
  const { phone, estCode } = req.body;
  const { data: est, error: estErr } = await supabase
    .from("establishments")
    .select("id, initials, name")
    .eq("code", estCode)
    .single();

  if (estErr || !est) return res.status(404).json({ error: "Local não encontrado" });

  // Prevenir duplicados ativos para o mesmo número
  const { data: existing } = await supabase.from("queues").select("id").eq("est_id", est.id).eq("phone", phone).single();
  if (existing) return res.status(400).json({ error: "Já se encontra na fila" });

  const day = new Date().getDate().toString().padStart(2, "0");
  const { count } = await supabase.from("history").select("id", { count: "exact", head: true });
  const { count: qCount } = await supabase.from("queues").select("id", { count: "exact", head: true });
  const ticketSeq = ((qCount || 0) + (count || 0) + 1).toString().padStart(3, "0");
  const ticketNumber = `${est.initials}-${day}-${ticketSeq}`;

  const { data, error } = await supabase
    .from("queues")
    .insert([{ est_id: est.id, phone, ticket_number: ticketNumber, status: 'waiting' }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, customer: data });
});

// 4. CHAMAR PRÓXIMO (Lógica Definitiva anti-Ghosting)
app.post("/api/establishments/:code/next", async (req, res) => {
  const { code } = req.params;
  const { data: est } = await supabase.from("establishments").select("id").eq("code", code).single();
  if (!est) return res.status(404).json({ error: "Local não encontrado" });

  // 1. Verificar se existe alguém em ESPERA antes de fazer qualquer coisa
  const { data: waitingArr } = await supabase
    .from("queues")
    .select("*")
    .eq("est_id", est.id)
    .eq("status", "waiting")
    .order("joined_at", { ascending: true })
    .limit(1);

  if (!waitingArr || waitingArr.length === 0) {
    return res.status(400).json({ error: "Fila de espera vazia. Não há quem chamar." });
  }

  // 2. Se existe alguém para chamar, Mover o ATUAL (se houver) para o histórico
  const { data: currentlyCalled } = await supabase.from("queues").select("*").eq("est_id", est.id).eq("status", "called").single();
  if (currentlyCalled) {
    await supabase.from("history").insert([{ est_id: est.id, phone: currentlyCalled.phone, ticket_number: currentlyCalled.ticket_number }]);
    await supabase.from("queues").delete().eq("id", currentlyCalled.id);
  }

  // 3. Promover o PRÓXIMO da espera para chamado
  const nextCustomer = waitingArr[0];
  const { data: updated, error: upErr } = await supabase
    .from("queues")
    .update({ status: "called" })
    .eq("id", nextCustomer.id)
    .select()
    .single();

  if (upErr) return res.status(500).json({ error: upErr.message });

  // SMS Hub Angola - Enviar apenas se houver sucesso na transição
  // await sendSMS(updated.phone, `KwikFilas: Sua vez chegou no local! Ticket [${updated.ticket_number}]`);

  res.json({ success: true, called: updated });
});

// 5. Abandonar Fila
app.post("/api/queue/leave", async (req, res) => {
  const { id } = req.body;
  await supabase.from("queues").delete().eq("id", id);
  res.json({ success: true });
});

export default app;
