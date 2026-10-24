# Modo Aventura

O modo campanha usa o mesmo motor de combate do modo livre. `src/data/campaign.ts` configura oito regiões, cinco batalhas por região (3 normais, 1 elite e 1 chefe), inimigo, dificuldade, seed e recompensa. A primeira região começa desbloqueada; a vitória contra o chefe libera a seguinte.

`src/engine/campaign.ts` mantém o save versionado, concede ouro/fragmentos uma única vez e preserva a possibilidade de rejogar batalhas concluídas. O estado é salvo em `pinguins-campaign-v1` no LocalStorage.
