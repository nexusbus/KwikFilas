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

// 1. Listar Estabelecimentos (Contactos ÚNICOS no Histórico)
app.get("/api/admin/establishments", async (req, res) => {
  const { data, error } = await supabase
    .from("establishments")
    .select("*, queues(*), history(*)");
  
  if (error) return res.status(500).json({ error: error.message });
  
  const formatted = (data || []).map(est => {
    // Deduplicação dos contactos pelo número de telefone
    const uniqueContactsMap = new Map();
    (est.history || []).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).forEach((h: any) => {
      if (!uniqueContactsMap.has(h.phone)) {
        uniqueContactsMap.set(h.phone, h);
      }
    });

    return {
      ...est,
      customers: (est.queues || []).filter(q => q.status === 'waiting' || q.status === 'called'),
      served_history: Array.from(uniqueContactsMap.values())
    };
  });
  
  res.json(formatted);
});

// 2. Criar Novo Estabelecimento
app.post("/api/admin/establishments", async (req, res) => {
  const { 
    name, initials, nif, admin_email, admin_password, opening_hours, product_photos, logo_url
  } = req.body;

  const countRes = await supabase.from("establishments").select("id", { count: "exact", head: true });
  const idNum = (countRes.count || 0) + 1;
  const code = `${initials.toUpperCase()}-${idNum.toString().padStart(3, "0")}`;

  const { data, error } = await supabase
    .from("establishments")
    .insert([{ 
      name, initials: initials.toUpperCase(), code, nif, admin_email, admin_password, 
      opening_hours: opening_hours || {}, product_photos: product_photos || [], logo_url
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 3. Entrar na Fila
app.post("/api/queue/join", async (req, res) => {
  const { phone, estCode } = req.body;
  const { data: est, error: estErr } = await supabase
    .from("establishments").select("id, initials, name").eq("code", estCode).single();

  if (estErr || !est) return res.status(404).json({ error: "Local não encontrado" });

  const { data: existing } = await supabase.from("queues").select("id").eq("est_id", est.id).eq("phone", phone).single();
  if (existing) return res.status(400).json({ error: "Já se encontra na fila" });

  const day = new Date().getDate().toString().padStart(2, "0");
  const { count: hCount } = await supabase.from("history").select("id", { count: "exact", head: true });
  const { count: qCount } = await supabase.from("queues").select("id", { count: "exact", head: true });
  const ticketSeq = ((qCount || 0) + (hCount || 0) + 1).toString().padStart(3, "0");
  const ticketNumber = `${est.initials}-${day}-${ticketSeq}`;

  const { data, error } = await supabase
    .from("queues")
    .insert([{ est_id: est.id, phone, ticket_number: ticketNumber, status: 'waiting' }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, customer: data });
});

// 4. CHAMAR PRÓXIMO
app.post("/api/establishments/:code/next", async (req, res) => {
  const { code } = req.params;
  const { data: est } = await supabase.from("establishments").select("id").eq("code", code).single();
  if (!est) return res.status(404).json({ error: "Local não encontrado" });

  const { data: currentlyCalled } = await supabase.from("queues").select("*").eq("est_id", est.id).eq("status", "called").single();
  if (currentlyCalled) {
    await supabase.from("history").insert([{ est_id: est.id, phone: currentlyCalled.phone, ticket_number: currentlyCalled.ticket_number }]);
    await supabase.from("queues").delete().eq("id", currentlyCalled.id);
  }

  const { data: waitingArr } = await supabase
    .from("queues").select("*").eq("est_id", est.id).eq("status", "waiting")
    .order("joined_at", { ascending: true }).limit(1);

  if (waitingArr && waitingArr.length > 0) {
    await supabase.from("queues").update({ status: "called" }).eq("id", waitingArr[0].id);
  }

  res.json({ success: true });
});

// 5. Abandonar Fila
app.post("/api/queue/leave", async (req, res) => {
  const { id } = req.body;
  await supabase.from("queues").delete().eq("id", id);
  res.json({ success: true });
});

export default app;
