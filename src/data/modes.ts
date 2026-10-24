import type { GameModeDefinition, WeeklyChallenge } from '../types';

export const GAME_MODES: GameModeDefinition[] = [
  { id: 'campaign', name: 'Campanha', description: 'Avance pelas regiões e enfrente chefes.', minPlayers: 1, maxPlayers: 1, teamMode: 'solo', rulesetId: 'campaign-v1', deckRulesId: 'standard-16', rewardPolicyId: 'campaign', enabled: true },
  { id: 'versus-ai', name: 'Contra a IA', description: 'Partida rápida contra um adversário controlado pelo motor.', minPlayers: 1, maxPlayers: 1, teamMode: 'versus', rulesetId: 'standard-v1', deckRulesId: 'standard-16', rewardPolicyId: 'none', enabled: true },
  { id: 'friendly', name: 'PvP Amistoso', description: 'Salas privadas sem alteração de rating.', minPlayers: 2, maxPlayers: 2, teamMode: 'versus', rulesetId: 'standard-v1', deckRulesId: 'standard-16', rewardPolicyId: 'friendly', enabled: true },
  { id: 'ranked', name: 'PvP Ranqueado', description: 'Fila competitiva com rating e temporadas.', minPlayers: 2, maxPlayers: 2, teamMode: 'versus', rulesetId: 'ranked-v1', deckRulesId: 'competitive-16', rewardPolicyId: 'ranked', enabled: true },
  { id: 'survival', name: 'Sobrevivência', description: 'Vença uma sequência crescente de batalhas contra a IA.', minPlayers: 1, maxPlayers: 1, teamMode: 'solo', rulesetId: 'survival-v1', deckRulesId: 'standard-16', rewardPolicyId: 'survival', enabled: true },
  { id: 'draft', name: 'Arena Draft', description: 'Monte um baralho escolhendo uma carta entre três opções.', minPlayers: 1, maxPlayers: 1, teamMode: 'solo', rulesetId: 'draft-v1', deckRulesId: 'draft-16', rewardPolicyId: 'draft', enabled: true },
  { id: 'weekly', name: 'Desafio Semanal', description: 'Batalha local com modificadores versionados.', minPlayers: 1, maxPlayers: 1, teamMode: 'solo', rulesetId: 'weekly-v1', deckRulesId: 'standard-16', rewardPolicyId: 'weekly', enabled: true },
  { id: 'tournament', name: 'Torneios', description: 'Chave eliminatória privada, preparada para o servidor.', minPlayers: 4, maxPlayers: 16, teamMode: 'versus', rulesetId: 'tournament-v1', deckRulesId: 'competitive-16', rewardPolicyId: 'tournament', enabled: false },
  { id: 'cooperative', name: 'Cooperativo', description: 'Dois jogadores contra um chefe, disponível após o backend cooperativo.', minPlayers: 2, maxPlayers: 2, teamMode: 'cooperative', rulesetId: 'coop-v1', deckRulesId: 'standard-16', rewardPolicyId: 'coop', enabled: false }
];

export const WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  { id: 'magic-week', name: 'Semana da Magia', description: 'Cartas de efeito custam 1 cristal a menos, sem custo negativo.', startsAt: '2026-10-19T00:00:00.000Z', endsAt: '2026-10-26T00:00:00.000Z', modeId: 'weekly', modifiers: [{ kind: 'category_cost', category: 'effect', delta: -1 }], rewardId: 'frame-arcane', version: 'weekly-1' },
  { id: 'nature-week', name: 'Semana da Natureza', description: 'Apenas cartas de Natureza e Neutras são permitidas.', startsAt: '2026-10-26T00:00:00.000Z', endsAt: '2026-11-02T00:00:00.000Z', modeId: 'weekly', modifiers: [{ kind: 'faction_restriction', factions: ['nature', 'neutral'] }], rewardId: 'frame-forest', version: 'weekly-1' }
];
