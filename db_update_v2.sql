-- Atualização para suportar telemóvel e equilíbrio de SMS nas subscrições e estabelecimentos

-- Adicionar coluna 'phone' à tabela de subscrições
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS phone TEXT;

-- Adicionar coluna 'phone' à tabela de estabelecimentos
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS phone TEXT;

-- Adicionar coluna 'sms_campaigns_balance' para controlar limites de planos
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS sms_campaigns_balance INTEGER DEFAULT 0;

-- Garantir que estabelecimentos existentes tenham o saldo inicial de acordo com o plano
UPDATE establishments SET sms_campaigns_balance = 0 WHERE plan = 'KFmini';
UPDATE establishments SET sms_campaigns_balance = 2 WHERE plan = 'KFmed';
UPDATE establishments SET sms_campaigns_balance = 4 WHERE plan = 'KFmax';
