# Inventário de artes — criaturas não pinguins

Atualização visual integrada ao catálogo em 25/10/2026.

## Resultado

- 25 monstros PvE auditados.
- 25 ilustrações individuais integradas em `public/assets/cards/illustrations/enemies/`.
- 0 inimigos usando arte de pinguim.
- 0 placeholders para monstros inimigos.
- Molduras, atributos, nomes e habilidades continuam sendo renderizados pelo jogo.

## Catálogo

Goblin Guerreiro, Goblin Arqueiro, Lobo Selvagem, Ent Ancestral, Orc Guerreiro, Troll da Montanha, Golem de Pedra, Colosso de Ferro, Escorpião Gigante, Múmia das Dunas, Elemental de Areia, Esqueleto, Zumbi do Brejo, Bruxa do Pântano, Rei dos Mortos, Elemental de Gelo, Yeti, Dragão Glacial, Salamandra, Elemental de Fogo, Demônio Guerreiro, Dragão Vulcânico, Construto Arcano, Guardião Rúnico e Guardião do Caos.

## Integração

O manifesto em `src/data/assets.ts` encaminha cartas com `ownership: 'enemy'` para a pasta `enemies` e mantém os pinguins na pasta principal de ilustrações. O teste `visual-catalog.test.ts` verifica quantidade, origem e unicidade dos assets.
