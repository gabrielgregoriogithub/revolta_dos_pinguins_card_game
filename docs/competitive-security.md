# Segurança competitiva

O navegador envia intenções; ele não envia dano, vida, cristais, resultado ou rating. O serviço autoritativo deve autenticar o jogador, validar o baralho e a versão do estado, aplicar idempotência por `requestId` e persistir resultado e rating em transação.

As migrations criam unicidade para entradas por jogador, histórico por partida/jogador e recompensas por temporada. RLS e políticas de Auth permanecem pendentes de configuração do projeto Supabase.
