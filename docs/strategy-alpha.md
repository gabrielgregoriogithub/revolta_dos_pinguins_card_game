# Diagnóstico estratégico — Passo 3

## Evidências do passe

O catálogo agora possui 48 modelos, distribuídos em 24 monstros e 24 itens. Há cinco baralhos iniciais com 8 monstros e 8 itens, todos validados pelo mesmo `validateDeck` usado para impedir partidas inválidas.

Em 1.000 simulações com a IA atualizada: 295 vitórias do jogador, 615 da IA, 90 empates e média de 40,66 turnos. A IA ainda possui vantagem, então os dados não justificam alterar cartas em massa; o próximo ajuste deve medir primeiro a vantagem do jogador inicial por seed e separar vitórias por arquétipo.

## Decisões implementadas

- Tags são derivadas do tipo, facção e habilidades, evitando condicionais por nome de carta.
- O valor heurístico da IA considera vida, dano, cristais, proteção e tags defensivas/de suporte.
- `tacticalPreview` informa elegibilidade, dano base, alvo conhecido e intervalo quando o tipo é caos, sem consumir RNG.
- `createReplay` preserva versão de regras, seed, baralhos, eventos e estado final.
- A expansão preserva os IDs das 24 cartas originais.

## Pendências conscientes

Os dez desafios possuem catálogo declarativo em `src/data/challenges.ts`, mas ainda precisam de uma tela e estados iniciais executáveis. O replay local já guarda eventos e estado final, enquanto os controles de reprodução usam a fila visual da batalha atual; rever uma partida após recarregar a página ainda requer uma tela dedicada. Equipamentos novos existem no catálogo e são aceitos pelo motor, mas alguns efeitos avançados (reflexão probabilística, silêncio e cleanse) ainda precisam de resoluções específicas no motor.
