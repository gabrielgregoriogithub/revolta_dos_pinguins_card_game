# Auditoria global

## Evidência desta revisão

- 34 testes automatizados passaram.
- Typecheck e build passaram.
- Testes da autoridade local passaram.
- Simulação reproduzível de 1.000 partidas passou sem exceção.

## Classificação

| Sistema | Estado | Severidade/limitação |
|---|---|---|
| Motor, turnos e recursos | Implementado e validado | P1 corrigidos nesta revisão |
| Cartas e baralhos | Implementado e validado | catálogo local de 48 cartas |
| IA | Implementada parcialmente | heurística, sem busca profunda |
| Fila/rating | Implementada parcialmente | memória local, sem backend remoto |
| Multiplayer | Implementado parcialmente | servidor WebSocket local, Auth/produção ausentes |
| Campanha | Implementada parcialmente | conteúdo e persistência locais |
| Draft/Sobrevivência | Implementados localmente | série Draft completa ainda pendente |
| Torneio/cooperativo | Não implementados online | flags desativadas |
| VFX/replay | Implementados com restrições | sem teste visual Playwright nesta máquina |
| Beta/telemetria | Contratos locais implementados | sem coletor/painel remoto |

## P1 corrigidos

1. IDs desconhecidos em baralhos não causam exceção durante validação.
2. Efeitos diretos, limpeza, recurso, barreira e cartas de status passaram a ser resolvidos pelo motor.
3. Reflexão, regeneração por equipamento, espinhos de equipamento e efeitos de morte foram integrados.
4. A fila visual passou a representar cura, status, esquiva e HP após bloqueio parcial.
