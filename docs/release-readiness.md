# Release readiness — 1.0.0-rc.1

## Estado

Classificação atual: **CONDITIONAL GO para demonstração Web/PWA local ou GitHub Pages**.

O núcleo local é jogável e o build estático pode ser distribuído. Esta versão não deve ser tratada como lançamento de multiplayer competitivo em produção: o servidor existente é local, sem autenticação remota, banco de produção ou serviço autoritativo hospedado.

## Validado nesta revisão

- `npm test`: suíte existente.
- `npm run typecheck`: TypeScript sem erros.
- `npm run build`: bundle de produção gerado em `dist/`.
- Manifest, ícone, metadados e service worker presentes no build.
- GitHub Pages continua configurado com base `/revolta_dos_pinguins_card_game/`.

## Bloqueadores para lançamento público completo

| Item | Estado | Impacto |
|---|---|---|
| Multiplayer público | Não pronto | WebSocket local, sem backend hospedado e autenticação de produção |
| Ranking/temporadas | Não pronto | Implementação local/parcial; não usar como ranking oficial |
| PWA offline | Parcial | Shell e assets públicos; dados privados e partidas online não são cacheados |
| Artes/áudio finais | Pendente | Placeholders e efeitos programáticos permanecem |
| Teste visual automatizado | Não verificável | Playwright não está configurado no repositório |
| Termos e privacidade | Revisão humana | Documentos jurídicos ainda precisam de aprovação |

## Decisão

Adequado para apresentar o jogo localmente ou como demo Web. Para um lançamento público com contas, partidas online e competição, a decisão é **NO-GO até configurar e auditar a infraestrutura remota**.

