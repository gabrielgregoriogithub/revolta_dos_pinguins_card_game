# Arquitetura de produção

## Estado atual

O frontend é uma aplicação React/Vite estática. O build é publicado em `dist/` e pode ser servido pelo GitHub Pages. O motor local, a IA, a campanha e a persistência de baralhos funcionam no navegador.

O servidor em `src/server` é um servidor WebSocket local para desenvolvimento e testes. Ele não é uma infraestrutura de produção e não deve ser exposto diretamente na Internet.

## Arquitetura necessária para lançamento online

1. Frontend estático servido por HTTPS.
2. Serviço autoritativo hospedado para partidas.
3. Autenticação e identidade persistente.
4. Banco com políticas de acesso e migrations.
5. Realtime/WebSocket protegido.
6. Logs, backups e monitoramento.

GitHub Pages atende apenas ao frontend estático. Ele não hospeda o servidor autoritativo.

