# Testes multiplayer

`npm run server:test` valida sala cheia, prontidão, idempotência, conflito de versão e privacidade. O teste atual é de autoridade em memória; não afirma teste entre dois dispositivos reais. Para teste manual, execute `npm run server`, conecte dois clientes WebSocket ao `ws://127.0.0.1:8787` e envie os comandos definidos em `src/server/protocol.ts`.
