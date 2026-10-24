# Rating

O rating inicial é 1.000. O Elo usa `R + K × (S − E)`, com `E = 1 / (1 + 10 ^ ((Roponente − R) / 400))`. O fator K é 40 antes de 20 partidas válidas e 24 depois. Vitória vale 1, derrota 0 e empate 0,5.

O cálculo está em `src/engine/competitive.ts` e não depende da interface.
