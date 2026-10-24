# Multiplayer local autoritativo

O MVP multiplayer usa `src/server/server.ts` + `src/server/authority.ts` sobre WebSocket. O servidor cria salas, autentica uma sessão por token interno, valida baralhos e comandos, controla versão/idempotência e publica views privadas. O motor de regras continua em `src/engine` e não depende do React.

O servidor local é executável com `npm run server`. Ele é uma base de desenvolvimento, não um serviço público: ainda não há Supabase Auth, banco persistente ou deployment remoto configurado.
