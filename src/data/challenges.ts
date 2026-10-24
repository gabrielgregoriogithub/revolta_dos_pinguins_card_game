export interface TacticalChallenge { id: string; name: string; description: string; objective: string; difficulty: 'fácil'|'médio'|'difícil'; seed: string; reward: string; }
export const CHALLENGES: TacticalChallenge[] = [
  { id: 'last-crystal', name: 'Último Cristal', description: 'Recursos escassos exigem uma escolha.', objective: 'Use o último cristal para criar uma ameaça.', difficulty: 'fácil', seed: 'challenge-01', reward: 'Medalha de gelo' },
  { id: 'front-line', name: 'Linha de Frente', description: 'Proteja uma unidade de distância.', objective: 'Mantenha um arqueiro vivo por dois turnos.', difficulty: 'fácil', seed: 'challenge-02', reward: 'Medalha de gelo' },
  { id: 'counter', name: 'Contra-Ataque', description: 'Transforme a defesa em resposta.', objective: 'Vença usando uma habilidade reativa.', difficulty: 'médio', seed: 'challenge-03', reward: 'Medalha de prata' },
  { id: 'necessary-sacrifice', name: 'Sacrifício Necessário', description: 'Uma perda pode financiar a virada.', objective: 'Sacrifique uma carta e vença no mesmo turno.', difficulty: 'médio', seed: 'challenge-04', reward: 'Medalha de prata' },
  { id: 'poison-clock', name: 'Relógio de Veneno', description: 'O dano periódico é sua condição de vitória.', objective: 'Derrote a ameaça com veneno.', difficulty: 'médio', seed: 'challenge-05', reward: 'Medalha de prata' },
  { id: 'reflection', name: 'Reflexão', description: 'Magia sem cálculo pode voltar contra você.', objective: 'Vença sem perder o mago para reflexão.', difficulty: 'difícil', seed: 'challenge-06', reward: 'Medalha de ouro' },
  { id: 'arcane-angle', name: 'Ângulo Arcano', description: 'A magia não depende da linha de frente.', objective: 'Use a posição para manter o ataque ativo.', difficulty: 'fácil', seed: 'challenge-07', reward: 'Medalha de gelo' },
  { id: 'right-equipment', name: 'Equipamento Correto', description: 'A compatibilidade decide o valor do item.', objective: 'Equipe o alvo compatível e vença.', difficulty: 'médio', seed: 'challenge-08', reward: 'Medalha de prata' },
  { id: 'hold-the-line', name: 'Segure a Linha', description: 'Resista antes de contra-atacar.', objective: 'Sobreviva a três ataques.', difficulty: 'difícil', seed: 'challenge-09', reward: 'Medalha de ouro' },
  { id: 'one-turn', name: 'Vitória em Um Turno', description: 'A sequência certa encerra a batalha.', objective: 'Elimine a formação inimiga no combate atual.', difficulty: 'difícil', seed: 'challenge-10', reward: 'Medalha de ouro' }
];
