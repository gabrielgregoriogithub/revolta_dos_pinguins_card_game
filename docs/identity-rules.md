# Identidade de raças e ownership

O universo segue uma divisão explícita:

- `player` controla exclusivamente monstros com `race: penguin`.
- `enemy` é reservado ao PvE e usa criaturas de outras raças.
- PvP continua usando baralhos de pinguins dos dois jogadores.
- Equipamentos e cartas Flash não possuem raça e seguem as regras próprias do catálogo.

O catálogo jogável está em `CARDS`; criaturas PvE estão em `ENEMY_CARDS` e seus baralhos em `ENEMY_DECKS`. `validateDeck(cards, ownership)` aplica as restrições no motor, e `auditCatalog()` falha conceitualmente quando encontra uma combinação inválida.

As artes dos pinguins aprovadas ficam em `public/assets/cards/player/penguins`. Inimigos devem receber artes em `public/assets/cards/enemies` quando forem produzidos; enquanto isso, usam o placeholder sem serem expostos à coleção do jogador.

Salvamentos de campanha anteriores são migrados para a versão 2. A coleção inicial passa a ser `STORY_STARTER_DECK`, com oito pinguins e oito itens, e recompensas de monstros inimigos nunca são inseridas no baralho do jogador.
