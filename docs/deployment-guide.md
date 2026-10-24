# Deployment

O frontend continua sendo servido por Vite. O servidor WebSocket requer Node 20+, `npm install`, `npm run server` e uma variável `PORT`. Para produção, configure TLS/WSS, Supabase Auth, PostgreSQL, RLS, rate limiting e uma autoridade server-side separada; nunca coloque service-role keys em `VITE_*` ou no navegador. Nenhum deployment remoto foi realizado.
