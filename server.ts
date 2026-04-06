import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_ANON_KEY || ""
);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Integrada com Supabase ---

  // 1. Listar Estabelecimentos (Dashboard Master)
  app.get("/api/admin/establishments", async (req, res) => {
    const { data, error } = await supabase
      .from("establishments")
      .select("*, queues(*)");
    
    if (error) return res.status(500).json({ error: error.message });
    
    // Mapear para o formato esperado pelo frontend
    const formatted = data.map(est => ({
      ...est,
      customers: est.queues || [],
      contacts: [] // Poderiamos buscar do history depois
    }));
    
    res.json(formatted);
  });

  // 2. Criar Novo Estabelecimento
  app.post("/api/admin/establishments", async (req, res) => {
    const { name, initials } = req.body;
    if (!name || !initials) return res.status(400).json({ error: "Nome e iniciais são obrigatórios" });

    const day = new Date().getDate().toString().padStart(2, "0");
    const countRes = await supabase.from("establishments").select("id", { count: "exact" });
    const idNum = (countRes.count || 0) + 1;
    
    const code = `${initials.toUpperCase()}-${idNum.toString().padStart(3, "0")}`;
    const password = `${initials.toUpperCase()}${idNum}${day}`;

    const { data, error } = await supabase
      .from("establishments")
      .insert([{ name, initials: initials.toUpperCase(), code, password }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  // 3. Entrar na Fila
  app.post("/api/queue/join", async (req, res) => {
    const { phone, estCode } = req.body;
    
    // Buscar Estabelecimento
    const { data: est, error: estErr } = await supabase
      .from("establishments")
      .select("id, initials, name")
      .eq("code", estCode)
      .single();

    if (estErr || !est) return res.status(404).json({ error: "Estabelecimento não encontrado" });

    // Verificar se já está na fila
    const { data: existing } = await supabase
      .from("queues")
      .select("id")
      .eq("est_id", est.id)
      .eq("phone", phone)
      .single();

    if (existing) return res.status(400).json({ error: "Já está nesta fila" });

    // Gerar Ticket
    const day = new Date().getDate().toString().padStart(2, "0");
    const { count } = await supabase.from("queues").select("id", { count: "exact", head: true });
    const { count: hCount } = await supabase.from("history").select("id", { count: "exact", head: true });
    
    const ticketSeq = ((count || 0) + (hCount || 0) + 1).toString().padStart(3, "0");
    const ticketNumber = `${est.initials}-${day}-${ticketSeq}`;

    const { data, error } = await supabase
      .from("queues")
      .insert([{ est_id: est.id, phone, ticket_number: ticketNumber, status: 'waiting' }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    
    res.json({ success: true, customer: data });
  });

  // 4. Chamar Próximo (Lógica de Fila)
  app.post("/api/establishments/:code/next", async (req, res) => {
    const { code } = req.params;

    // Buscar Estabelecimento
    const { data: est } = await supabase
      .from("establishments")
      .select("id")
      .eq("code", code)
      .single();

    if (!est) return res.status(404).json({ error: "Local não encontrado" });

    // 1. Mover o atual (called) para o histórico
    const { data: currentlyCalled } = await supabase
      .from("queues")
      .select("*")
      .eq("est_id", est.id)
      .eq("status", "called")
      .single();

    if (currentlyCalled) {
      await supabase.from("history").insert([{
        est_id: est.id,
        phone: currentlyCalled.phone,
        ticket_number: currentlyCalled.ticket_number
      }]);
      
      await supabase.from("queues").delete().eq("id", currentlyCalled.id);
    }

    // 2. Chamar o próximo na ordem (waiting)
    const { data: nextArr } = await supabase
      .from("queues")
      .select("*")
      .eq("est_id", est.id)
      .eq("status", "waiting")
      .order("joined_at", { ascending: true })
      .limit(1);

    if (nextArr && nextArr.length > 0) {
      const next = nextArr[0];
      await supabase.from("queues").update({ status: "called" }).eq("id", next.id);
    }

    res.json({ success: true });
  });

  // 5. Abandonar Fila
  app.post("/api/queue/leave", async (req, res) => {
    const { id } = req.body;
    await supabase.from("queues").delete().eq("id", id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 KwikFilas Live: http://localhost:${PORT}`);
  });
}

startServer();
