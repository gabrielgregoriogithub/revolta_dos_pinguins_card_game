# Auditoria de segurança — RC.1

## Controles presentes

- O motor valida fases, turno, custos, cartas na mão e alvos.
- O protocolo local possui validação de versão e idempotência de comandos.
- O frontend não contém chaves administrativas.
- O service worker não armazena dados autenticados ou privados.

## Riscos pendentes

- O servidor WebSocket local não é uma autoridade de produção.
- Não há autenticação remota, TLS, rate limiting ou RLS configurados neste checkout.
- Ranking, recompensas e identidade não devem ser considerados oficiais.

Antes de produção, hospede o servidor atrás de TLS, valide a identidade no backend, aplique autorização por partida, limite requisições e audite migrations/políticas do banco.

