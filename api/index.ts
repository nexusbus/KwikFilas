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

  const { data, error } = await query;
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

// 4.1 EDITAR (Com Senha de Super Admin)
app.put("/api/admin/establishments", async (req, res) => {
  const { targetId, superPassword, updateData } = req.body;

  const { data: isSuper } = await supabase
    .from("establishments")
    .select("id")
    .eq("role", "super")
    .eq("admin_password", superPassword)
    .single();

  if (!isSuper) return res.status(403).json({ error: "Acesso negado" });

  const { data, error } = await supabase
    .from("establishments")
    .update(updateData)
    .eq("id", targetId)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 5. ENTRAR NA FILA (Garantir Unicidade e Ticket)
app.post("/api/queue/join", async (req, res) => {
  const { phone, estCode, name } = req.body;
  const { data: est } = await supabase.from("establishments").select("id, initials").eq("code", estCode).single();
  if (!est) return res.status(404).json({ error: "Estabelecimento não encontrado" });

  const { data: exists } = await supabase.from("queues").select("id").eq("est_id", est.id).eq("phone", phone).single();
  if (exists) return res.status(400).json({ error: "Já está nesta fila" });

  const today = new Date().toISOString().split('T')[0];
  
  // Contar senhas geradas HOJE para este estabelecimento
  const { count: qCount } = await supabase.from("queues")
    .select("id", { count: "exact", head: true })
    .eq("est_id", est.id)
    .gte("joined_at", `${today}T00:00:00Z`);

  const { count: hCount } = await supabase.from("history")
    .select("id", { count: "exact", head: true })
    .eq("est_id", est.id)
    .gte("served_at", `${today}T00:00:00Z`);
  
  const seq = (qCount || 0) + (hCount || 0) + 1;
  const ticket = `${est.initials}-${seq.toString().padStart(3, '0')}`;

  const { data, error } = await supabase
    .from("queues")
    .insert([{ est_id: est.id, phone, name, ticket_number: ticket }])
    .select().single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 5.1 VERIFICAR NOME POR TELEFONE
app.get("/api/check-phone/:phone", async (req, res) => {
  const { phone } = req.params;
  
  // No histórico (mais recente)
  const { data: hist } = await supabase
    .from("history")
    .select("name")
    .eq("phone", phone)
    .neq("name", "")
    .not("name", "is", null)
    .order("served_at", { ascending: false })
    .limit(1);

  if (hist && hist.length > 0 && hist[0].name) {
    return res.json({ name: hist[0].name });
  }

  // Na fila ativa
  const { data: active } = await supabase
    .from("queues")
    .select("name")
    .eq("phone", phone)
    .neq("name", "")
    .not("name", "is", null)
    .limit(1);

  res.json({ name: (active && active.length > 0) ? active[0].name : null });
});

// 6. CHAMAR PRÓXIMO + DISPARO SMS
app.post("/api/establishments/:code/next", async (req, res) => {
  const { code } = req.params;
  const { data: est } = await supabase.from("establishments").select("id, name").eq("code", code).single();
  if (!est) return res.status(404).json({ error: "Local não encontrado" });

  const { data: current } = await supabase.from("queues").select("*").eq("est_id", est.id).eq("status", "called").single();
  if (current) {
    // Tentar mover para histórico (se falhar, removemos da fila na mesma para não bloquear, mas tentamos ser robustos)
    const histPayload: any = {
      est_id: est.id,
      phone: current.phone,
      name: current.name,
      ticket_number: current.ticket_number
    };
    
    // Adicionar served_at apenas se existir ou usar joined_at como fallback
    histPayload.served_at = new Date().toISOString();

    await supabase.from("history").insert([histPayload]);
    await supabase.from("queues").delete().eq("id", current.id);
  }

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

    // Notificar a 2ª posição (o novo primeiro na lista de espera)
    const { data: pos2 } = await supabase.from("queues")
      .select("*")
      .eq("est_id", est.id)
      .eq("status", "waiting")
      .order("joined_at", { ascending: true })
      .limit(1)
      .single();

    if (pos2) {
      const pos2Msg = `KwikFilas: Só falta uma pessoa para sua vez em ${est.name}. Por favor, prepare-se.`;
      await triggerSms(pos2.phone, pos2.ticket_number, est.name, pos2Msg);
    }
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

// 9. CONFIRMAR CHEGADA (Client Side)
app.post("/api/queue/confirm-arrival", async (req, res) => {
  const { ticketId } = req.body;
  const { error } = await supabase.from("queues").update({ is_arrived: true }).eq("id", ticketId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// 10. LISTAR CONTACTOS DO PARCEIRO (Base de Clientes completa com frequências)
app.get("/api/establishments/:code/contacts", async (req, res) => {
  const { code } = req.params;
  const { data: est } = await supabase.from("establishments").select("id").eq("code", code).single();
  if (!est) return res.status(404).json({ error: "Local não encontrado" });

  // Buscar de ambas as tabelas
  const { data: qData } = await supabase.from("queues").select("*").eq("est_id", est.id);
  const { data: hData } = await supabase.from("history").select("*").eq("est_id", est.id);

  const rawData = [
    ...(qData || []).map(q => ({ phone: q.phone || 'S/N', name: q.name, date: q.joined_at || new Date().toISOString() })),
    ...(hData || []).map(h => ({ phone: h.phone || 'S/N', name: h.name, date: h.served_at || h.joined_at || new Date().toISOString() }))
  ];
  
  // Agrupar por telefone para calcular estatísticas
  const statsMap = new Map();
  
  rawData.forEach(record => {
    const existing = statsMap.get(record.phone);
    const currentDate = new Date(record.date).getTime();
    
    if (!existing) {
      statsMap.set(record.phone, {
        phone: record.phone,
        name: record.name || null,
        last_visit: record.date,
        visit_count: 1,
        _lastDateMs: currentDate
      });
    } else {
      existing.visit_count += 1;
      
      // Prioritizar sempre ter um nome. Se o novo registro tiver nome, e o atual não tiver
      // OU se o novo registro for mais recente e tiver nome, atualizamos.
      if (record.name && (!existing.name || currentDate > existing._lastDateMs)) {
        existing.name = record.name;
      }

      // Atualizar metadata da última visita
      if (currentDate > existing._lastDateMs) {
        existing._lastDateMs = currentDate;
        existing.last_visit = record.date;
      }
    }
  });

  const finalResults = Array.from(statsMap.values()).sort((a, b) => b.visit_count - a.visit_count || b._lastDateMs - a._lastDateMs);

  res.json(finalResults);
});

// 11. ADICIONAR CONTACTO MANUALMENTE
app.post("/api/establishments/:code/contacts", async (req, res) => {
  const { code } = req.params;
  const { phone } = req.body;
  const { data: est } = await supabase.from("establishments").select("id").eq("code", code).single();
  if (!est) return res.status(404).json({ error: "Local não encontrado" });

  const { error } = await supabase.from("history").insert([{
    est_id: est.id,
    phone,
    ticket_number: "CRM-MANUAL",
    served_at: new Date().toISOString()
  }]);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// --- HELPER SMS ---
async function triggerSms(phone: string, ticket: string, estName: string, customMsg?: string) {
  const rawId = process.env.SMSHUB_AUTH_ID ?? '';
  const rawToken = process.env.SMSHUB_SECRET ?? '';
  const rawUrl = process.env.SMSHUB_BASE_URL ?? "https://app.smshubangola.com/api/sendsms";
  
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
    const message = customMsg || `KwikFilas: Sua senha ${ticketSeq} em ${estName} foi chamada. Por favor dirija-se ao local.`;
    
    try {
      const queryParams = new URLSearchParams({
        auth_id: smsId,
        secret_key: smsToken,
        to: cleanPhone,
        from: "KwikFilas",
        message: message
      });

      const finalUrl = `${smsUrl}?${queryParams.toString()}`;
      
      console.log('--- SMS DISPATCH ATTEMPT ---');
      console.log('URL:', finalUrl.split('secret_key=')[0] + 'secret_key=***');
      
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


