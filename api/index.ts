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
  
  if (data.role === 'establishment' && data.is_active === false) {
    return res.status(403).json({ error: "Este estabelecimento está desativado. Contacte o administrador." });
  }

  res.json(data);
});

// 2. LISTAR (Filtro por Role)
app.get("/api/admin/establishments", async (req, res) => {
  const { role, estId } = req.query;
  
  let query = supabase.from("establishments").select("id, name, nif, initials, code, is_active, plan, queue_mode, queues(*), services(*)");
  
  if (role === 'establishment' && estId) {
    query = query.eq("id", estId);
  } else if (req.query.code) {
    query = query.eq("code", req.query.code);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[CRITICAL] Establishment Fetch Error:", JSON.stringify(error, null, 2));
    return res.status(500).json({ error: "Erro na base de dados: " + error.message });
  }


  if (role === 'establishment' && estId && (!data || data.length === 0)) {
    return res.status(404).json({ error: "Estabelecimento não encontrado para este ID." });
  }
  
  const formatted = (data || []).map(est => ({
    ...est,
    customers: (est.queues || []).filter(q => q.status !== 'served'),
  }));
  
  res.json(formatted);
});

// 2.1 GESTÃO DE SERVIÇOS
app.post("/api/admin/services", async (req, res) => {
  const { est_id, name, prefix } = req.body;
  const { data, error } = await supabase.from("services").insert([{ est_id, name, prefix, is_active: true }]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put("/api/admin/services/:id", async (req, res) => {
  const { id } = req.params;
  const { name, prefix, is_active } = req.body;
  const { data, error } = await supabase.from("services").update({ name, prefix, is_active }).eq("id", id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete("/api/admin/services/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// 3. CRIAR (Com Lógica de Iniciais e NIF único)
app.post("/api/admin/establishments", async (req, res) => {
  const { name, nif, admin_email, admin_password, logo_url } = req.body;

  // Gerar iniciais automáticas
  const initials = await generateUniqueInitials(name);
  
  // Gerar código único
  const countRes = await supabase.from("establishments").select("id", { count: "exact", head: true });
  const code = `${initials}-${(countRes.count || 0) + 1}`;

  const balance = req.body.plan === 'KFmax' ? 4 : 2;

  const { data, error } = await supabase
    .from("establishments")
    .insert([{ 
      name, nif, admin_email, admin_password, logo_url, initials, code, 
      role: 'establishment', 
      plan: req.body.plan || 'KFmini',
      sms_campaigns_balance: balance,
      is_active: true
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

// 4.2 ATUALIZAR DEFINIÇÕES PELO PARCEIRO
app.put("/api/establishments/:code", async (req, res) => {
  const { code } = req.params;
  const { adminPassword, updateData } = req.body;

  const { data: est, error: authError } = await supabase
    .from("establishments")
    .select("id")
    .eq("code", code)
    .eq("admin_password", adminPassword)
    .single();

  if (authError || !est) return res.status(403).json({ error: "Senha incorreta ou acesso negado" });

  const { data, error } = await supabase
    .from("establishments")
    .update(updateData)
    .eq("id", est.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});


// 5. ENTRAR NA FILA (Garantir Unicidade e Ticket)
app.post("/api/queue/join", async (req, res) => {
  const { phone, estCode, name, serviceId } = req.body;
  const { data: est, error: estError } = await supabase.from("establishments").select("id, initials, is_active, queue_mode").eq("code", estCode).single();
  if (estError || !est) return res.status(404).json({ error: "Estabelecimento não encontrado" });
  if (est.is_active === false) return res.status(403).json({ error: "Este estabelecimento está temporariamente indisponível." });

  const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
  if (!cleanPhone || cleanPhone.length < 9) return res.status(400).json({ error: "Número de telefone inválido" });

  const { data: exists } = await supabase
    .from("queues")
    .select("id, ticket_number")
    .eq("est_id", est.id)
    .eq("phone", cleanPhone)
    .in("status", ["waiting", "called"])
    .maybeSingle();

  if (exists) return res.status(400).json({ error: `Já se encontra na fila com a senha #${exists.ticket_number.split('-').pop()}` });

  let servicePrefix = '';
  let serviceName = '';
  if (serviceId) {
    const { data: svc } = await supabase.from("services").select("*").eq("id", serviceId).single();
    if (svc) {
      servicePrefix = svc.prefix;
      serviceName = svc.name;
    }
  }

  const today = new Date().toISOString().split('T')[0];
  
  // Contagem para ticket depende do modo
  let qCount, hCount;

  if (est.queue_mode === 'multi_service_multi' && serviceId) {
    const qRes = await supabase.from("queues").select("id", { count: "exact", head: true }).eq("est_id", est.id).eq("service_id", serviceId).gte("joined_at", `${today}T00:00:00Z`);
    const hRes = await supabase.from("history").select("id", { count: "exact", head: true }).eq("est_id", est.id).eq("service_id", serviceId).gte("served_at", `${today}T00:00:00Z`);
    qCount = qRes.count;
    hCount = hRes.count;
  } else {
    const qRes = await supabase.from("queues").select("id", { count: "exact", head: true }).eq("est_id", est.id).gte("joined_at", `${today}T00:00:00Z`);
    const hRes = await supabase.from("history").select("id", { count: "exact", head: true }).eq("est_id", est.id).gte("served_at", `${today}T00:00:00Z`);
    qCount = qRes.count;
    hCount = hRes.count;
  }
  
  const seq = (qCount || 0) + (hCount || 0) + 1;
  const basePrefix = servicePrefix || est.initials;
  const ticket = `${basePrefix}-${seq.toString().padStart(3, '0')}`;

  const { data, error } = await supabase
    .from("queues")
    .insert([{ 
      est_id: est.id, 
      phone, 
      name, 
      ticket_number: ticket,
      service_id: serviceId,
      service_name: serviceName
    }])
    .select().single();

    if (error) {
    console.error("Join Error:", error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// 5.1 VERIFICAR NOME POR TELEFONE
app.get("/api/check-phone/:phone", async (req, res) => {
  const phone = req.params.phone.replace(/\D/g, '');
  
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
  const { serviceId } = req.body;
  const { data: est } = await supabase.from("establishments").select("id, name, queue_mode").eq("code", code).single();
  if (!est) return res.status(404).json({ error: "Local não encontrado" });

  // 1. Finalizar chamada atual (se houver) para este estabelecimento e serviço (se multi_queue)
  let currentQuery = supabase.from("queues").select("*").eq("est_id", est.id).eq("status", "called");
  if (est.queue_mode === 'multi_service_multi' && serviceId) {
    currentQuery = currentQuery.eq("service_id", serviceId);
  }
  
  const { data: current } = await currentQuery.limit(1).maybeSingle();

  if (current) {
    const histPayload: any = {
      est_id: est.id,
      phone: current.phone,
      name: current.name,
      ticket_number: current.ticket_number,
      service_id: current.service_id,
      service_name: current.service_name,
      served_at: new Date().toISOString()
    };
    await supabase.from("history").insert([histPayload]);
    await supabase.from("queues").delete().eq("id", current.id);
  }

  // 2. Chamar o próximo
  let nextQuery = supabase.from("queues")
    .select("*")
    .eq("est_id", est.id)
    .eq("status", "waiting");
  
  if (serviceId) {
    nextQuery = nextQuery.eq("service_id", serviceId);
  }

  const { data: next } = await nextQuery
    .order("joined_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  
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

// 12. SUBSCREVER (Pendente de Aprovação)
app.post("/api/subscriptions", async (req, res) => {
  const { name, nif, admin_email, admin_password, logo_url, plan, phone } = req.body;
  const { data, error } = await supabase
    .from("subscriptions")
    .insert([{ name, nif, admin_email, admin_password, logo_url, plan: plan || 'KFmini', phone, status: 'pending' }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  
  // Enviar SMS de confirmação (pendente)
  if (phone) {
    await triggerSms(phone, "", name, `Olá ${name}! O seu pedido de adesão ao KwikFilas foi recebido e está aguardando aprovação comercial. Contactaremos em breve.`);
  }

  res.json(data);
});

// 13. LISTAR SUBSKRIÇÕES (Super Admin)
app.get("/api/admin/subscriptions", async (req, res) => {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// 14. APROVAR SUBSKRIÇÃO (Super Admin)
app.post("/api/admin/subscriptions/approve", async (req, res) => {
  const { subId, superPassword } = req.body;

  // Verificar super senha
  const { data: isSuper } = await supabase
    .from("establishments")
    .select("id")
    .eq("role", "super")
    .eq("admin_password", superPassword)
    .single();

  if (!isSuper) return res.status(403).json({ error: "Senha de Super User incorreta" });

  // Buscar dados da subscrição
  const { data: sub } = await supabase.from("subscriptions").select("*").eq("id", subId).single();
  if (!sub) return res.status(404).json({ error: "Subscrição não encontrada" });

  // Criar estabelecimento
  const initials = await generateUniqueInitials(sub.name);
  const countRes = await supabase.from("establishments").select("id", { count: "exact", head: true });
  const code = `${initials}-${(countRes.count || 0) + 1}`;

  const balance = sub.plan === 'KFmax' ? 4 : 2;

  const { error: estError } = await supabase
    .from("establishments")
    .insert([{ 
      name: sub.name, 
      nif: sub.nif, 
      admin_email: sub.admin_email, 
      admin_password: sub.admin_password, 
      logo_url: sub.logo_url, 
      plan: sub.plan || 'KFmini',
      phone: sub.phone,
      sms_campaigns_balance: balance,
      is_active: true,
      initials, 
      code, 
      role: 'establishment' 
    }]);

  if (estError) return res.status(500).json({ error: "Erro ao criar estabelecimento" });

  // Atualizar status da subscrição
  await supabase.from("subscriptions").update({ status: 'approved' }).eq("id", subId);

  // Enviar SMS de aprovação
  if (sub.phone) {
    await triggerSms(sub.phone, "", sub.name, `Parabéns! O estabelecimento ${sub.name} foi aprovado no KwikFilas. Use o seu email e senha para aceder ao painel. Bem-vindo!`);
  }

  res.json({ success: true });
});

// 15. ESTATÍSTICAS GLOBAIS (Super Admin)
app.get("/api/admin/stats", async (req, res) => {
  const { client, start_date, end_date, ticket_number } = req.query;

  let query = supabase.from("history").select("*, establishments(name)");

  if (client) {
    query = query.ilike("phone", `%${client}%`);
  }
  if (start_date) {
    query = query.gte("served_at", `${start_date}T00:00:00Z`);
  }
  if (end_date) {
    query = query.lte("served_at", `${end_date}T23:59:59Z`);
  }
  if (ticket_number) {
    query = query.ilike("ticket_number", `%${ticket_number}%`);
  }

  const { data, error } = await query.order("served_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
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


