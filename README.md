# Revolta dos Pinguins — Card Battle

MVP jogável de um card battle estratégico por turnos, com combate automático, cristais, formação de três posições, equipamentos, efeitos, IA e baralhos iniciais.

## Executar

Requer Node.js 20+.

```bash
npm install
npm run dev
```

Validações disponíveis: `npm run typecheck`, `npm test`, `npm run build` e `npm run simulate -- --games 100`.

O motor em `src/engine` não depende do React e trabalha com estado serializável, seed reproduzível e comandos validados. A interface é provisória e usa ícones/fundos CSS; o sistema de arte está separado por `CardArt`.

## Estrutura

- `src/data`: catálogo de 24 cartas e baralhos iniciais.
- `src/engine`: estado, recursos, combate, turnos, IA e simulação.
- `src/app`: telas de menu, batalha e construtor.
- `docs`: regras, arquitetura, schema de cartas e produção de arte.

## Limites atuais do MVP

O construtor oferece os dois baralhos iniciais e a batalha vertical está completa. Persistência local de baralhos editáveis, mulligan, trilha sonora e artes finais ficam preparados para a próxima iteração; o núcleo já possui cartas, custos, tipos de ataque, morte/formação, habilidades de catálogo, IA e histórico.
