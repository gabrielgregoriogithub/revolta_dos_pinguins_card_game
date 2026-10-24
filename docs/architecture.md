# Arquitetura

`types.ts` define o contrato. `data/cards.ts` é um catálogo declarativo. `engine/core.ts` concentra comandos puros sobre um `GameState` serializável, com eventos e um RNG com seed. React apenas dispara comandos e renderiza o resultado. A IA chama os mesmos comandos públicos usados pelo jogador.
