# Sistema competitivo

O modo competitivo local usa a mesma autoridade de partida do multiplayer amistoso, mas acrescenta fila, confirmação, rating e histórico. A implementação atual é um serviço em memória (`src/server/competitive.ts`) adequado para desenvolvimento e testes; produção exige persistência transacional e autenticação no backend.

Fluxo: `QUEUE_RANKED` → pareamento por rating → confirmação dos dois jogadores → partida autoritativa → resultado idempotente → Elo e histórico.

Partidas canceladas por falha de infraestrutura não alteram rating. Uma partida concluída só pode aplicar rating uma vez.
