# Guia PWA

## Arquivos

- `public/manifest.webmanifest`: nome, escopo, tema e instalação.
- `public/icons/penguin.svg`: ícone original reutilizável.
- `public/sw.js`: cache versionado do shell e assets públicos.
- `src/main.tsx`: registra o service worker somente em produção.

## Teste local

```bash
npm run build
npm run preview
```

Abra o endereço HTTPS ou localhost em um navegador compatível e verifique o painel de instalação. O Safari/iOS pode exigir “Adicionar à Tela de Início” manualmente.

## Limites de cache

O service worker não grava respostas autenticadas, mãos privadas, partidas online ou resultados oficiais. A partida contra IA pode continuar disponível enquanto o bundle e seus dados locais estiverem carregados, mas a disponibilidade offline deve ser considerada parcial até ser validada em cada navegador.

Ao publicar uma nova versão, altere `CACHE_NAME` em `public/sw.js`. O worker remove caches antigos durante `activate`.

