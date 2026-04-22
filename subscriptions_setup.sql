-- Script para adicionar suporte a subscrições e histórico avançado

-- Tabela de Subscrições/Pedidos de Adesão
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    nif TEXT NOT NULL,
    admin_email TEXT NOT NULL,
    admin_password TEXT NOT NULL,
    logo_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Habilitar RLS (opcional, dependendo da configuração do projeto)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas simples (ajustar conforme necessário)
CREATE POLICY "Enable read for all" ON subscriptions FOR SELECT USING (true);
CREATE POLICY "Enable insert for all" ON subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for service role" ON subscriptions FOR UPDATE USING (true);

-- Índices extra para o histórico se não existirem
CREATE INDEX IF NOT EXISTS idx_history_served_at ON history(served_at);
CREATE INDEX IF NOT EXISTS idx_history_est_id ON history(est_id);
