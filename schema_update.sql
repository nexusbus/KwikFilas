-- Script de atualização da base de dados para o novo CRM
-- Adiciona a coluna 'name' às tabelas de fila e histórico

ALTER TABLE queues ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE history ADD COLUMN IF NOT EXISTS name TEXT;

-- Índices para melhorar a performance da base de dados de clientes
CREATE INDEX IF NOT EXISTS idx_history_phone ON history(phone);
CREATE INDEX IF NOT EXISTS idx_queues_phone ON queues(phone);
