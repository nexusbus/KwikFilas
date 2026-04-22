-- Script para vincular estabelecimentos a planos de subscrição

-- Adicionar coluna 'plan' à tabela de subscrições
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS plan TEXT;

-- Adicionar coluna 'plan' à tabela de estabelecimentos
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS plan TEXT;

-- Atualizar estabelecimentos existentes com um plano padrão se necessário
UPDATE establishments SET plan = 'KFmini' WHERE plan IS NULL;
