# Auditoria de prontidão Beta

## Estado atual

| Área | Estado | Evidência | Restrição |
|---|---|---|---|
| Motor de combate | Pronto com restrições | testes unitários e simulação | sem teste visual automatizado completo |
| IA local | Pronta com restrições | partidas simuladas | decisões ainda heurísticas |
| Campanha | Pronta com restrições | testes de campanha | conteúdo é local |
| Multiplayer | Parcial | autoridade e testes locais | Auth, banco e servidor público ausentes |
| Ranking | Parcial | Elo/fila em memória testados | sem persistência remota |
| Torneios/cooperativo | Não implementados online | flags desativadas | dependem do backend |
| Telemetria Beta | Implementada localmente | `src/beta/contracts.ts` | não há coletor remoto |
| Feedback/diagnóstico | Implementados localmente | testes Beta | armazenamento local em memória |

## P0/P1 auditados

- Validação de baralhos com IDs desconhecidos agora retorna erro, sem lançar exceção.
- Efeitos diretos, limpeza, recurso, barreira de equipamento, regeneração e reflexão foram incorporados ao motor.
- Eventos de cura, status e bloqueio parcial carregam dados para a fila visual.

Não há ambiente remoto configurado; portanto acesso Beta real, painel administrativo remoto e testes com jogadores reais não foram declarados concluídos.
