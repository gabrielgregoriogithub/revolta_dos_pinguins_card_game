# Alpha — evolução global

## Entregue

- Interface com seleção explícita de carta e unidade, prévia de custo/posição, feedback de ataque inativo por posição e controle visual 1×/2×/sem animação.
- Coleção filtrável e construtor editável com limites de 8 monstros, 8 itens, 16 cartas e persistência em LocalStorage.
- Tutorial inicial persistido, tela de resultado com estatísticas derivadas dos eventos e duplicação de baralhos.
- Motor com RNG reproduzível avançado, veneno corrigido para o dono correto, barreira, perfuração, lifesteal, enrage, aura de suporte, taunt, invocação e gatilho de morte.
- Empate por impasse quando ambos os lados permanecem seis turnos sem progresso possível.

## Contratos para arte

`CardArt` continua separado das regras. Cada carta possui `imagePath`, `fallbackIcon` e `factionColor`; a interface usa fallback quando não existe ilustração. A área `.card-art` é a região reservada para ilustração futura, mantendo nome, custo, tags, atributos e habilidades em regiões próprias.

## Pendências conhecidas

Mulligan, animações temporizadas por evento, áudio, multiplayer, silêncio/cleanse com duração e arte final ainda não estão implementados. A IA continua baseada em heurísticas e a simulação serve para diagnóstico, não para alterar cartas automaticamente.
