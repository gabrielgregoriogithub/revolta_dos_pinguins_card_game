# Guia de animação

O motor resolve primeiro e emite eventos; `src/engine/visual.ts` converte eventos em `CombatVisualEvent`. A interface reproduz uma cópia visual do estado e nunca calcula dano durante uma animação.

- Ataque: destaque pulsante no atacante e no alvo, seguido de callout com tipo e dano.
- Dano: vida anterior → vida posterior e indicador de bloqueio.
- Morte: vida zero, remoção e reindexação da formação.
- Raridade: brilho sutil apenas em épicas/lendárias.

Velocidade normal usa aproximadamente 900 ms por evento, rápida 350 ms e modo sem animação aplica o resultado. Pausa congela a fila; próximo evento aplica somente um item; pular troca para o estado resolvido. `prefers-reduced-motion` deve ser respeitado ao adicionar efeitos futuros.
