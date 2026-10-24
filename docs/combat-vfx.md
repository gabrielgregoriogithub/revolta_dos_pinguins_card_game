# VFX de combate

O motor produz `GameEvent`; `src/engine/visual.ts` transforma somente eventos oficiais em `CombatVisualEvent`; `src/vfx/registry.ts` associa cada evento a uma definição de VFX. A interface continua responsável apenas por reproduzir a fila.

Mapeamentos atuais:

- `melee` → `meleeSlash`
- `ranged` → `rangedArrow`
- `magic` → `magicArcane`
- `chaos` → `chaosBolt`
- dano físico/mágico → números com cores distintas
- bloqueio, esquiva, morte e formação → efeitos próprios

O estado visual só é alterado por `applyVisualEvent`. Velocidade, pausa e pular a reprodução não alteram o estado oficial.

## Limitação atual

O reprodutor existente ainda apresenta o ataque principalmente no painel de combate; a trajetória física de projéteis e âncoras DOM entre cartas é uma etapa posterior. Não há sprites ou sons específicos no repositório, portanto os efeitos atuais são CSS/registro sem assets externos.
