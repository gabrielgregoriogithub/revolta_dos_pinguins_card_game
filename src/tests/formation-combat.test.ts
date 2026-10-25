import { describe, expect, it } from 'vitest';
import { STARTER_DECKS, getCard } from '../data/cards';
import { attackBreakdown } from '../engine/attack';
import { createGame, createReplay, damage, endPreparation, getPlayer, playEffect, startTurn } from '../engine/core';
import { applyVisualEvent, buildVisualEvents } from '../engine/visual';
import type { GameState, MonsterCard, MonsterInstance } from '../types';

let serial = 0;
function unit(modelId: string, overrides: Partial<MonsterInstance> = {}): MonsterInstance {
  const card = getCard(modelId) as MonsterCard;
  return { instanceId: `${modelId}_${++serial}`, modelId, hp: card.maxHp, maxHp: card.maxHp, position: 0, alive: true, stunned: 0, silenced: 0, poison: 0, attackBuff: 0, armorBreak: 0, barrier: 0, equipmentIds: [], ...overrides };
}
function battle(own: MonsterInstance[], enemy: MonsterInstance[], active: 'player' | 'ai' = 'player'): GameState {
  const state = createGame(STARTER_DECKS[0].cards, STARTER_DECKS[1].cards, 'formacao');
  state.activePlayerId = active; state.phase = 'PREPARATION'; state.eventLog = [];
  getPlayer(state, 'player').battlefield = own.map((m, i) => ({ ...m, position: i + 1 }));
  getPlayer(state, 'ai').battlefield = enemy.map((m, i) => ({ ...m, position: i + 1 }));
  return state;
}
const attacksBy = (state: GameState, attackerId: string) => state.eventLog.filter(e => e.type === 'ATTACK_DECLARED' && e.data?.attackerId === attackerId).map(e => String(e.data?.targetId));
const layout = (state: GameState, id: 'player' | 'ai') => getPlayer(state, id).battlefield.map(m => [m.modelId, m.position]);
const goblins = () => [unit('enemy_goblin_warrior'), unit('enemy_goblin_archer'), unit('enemy_swamp_witch')];

describe('prioridade de alvo dos ataques à distância', () => {
  it('arqueiro na posição 2 ataca a posição 1, não a posição equivalente', () => {
    const enemy = goblins(); const archer = unit('ice_scout');
    const s = battle([unit('iron_knight'), archer], enemy);
    endPreparation(s, 'player');
    expect(attacksBy(s, archer.instanceId)).toEqual([enemy[0].instanceId]);
  });
  it('arqueiro na posição 3 também ataca a posição 1', () => {
    const enemy = [unit('enemy_troll'), unit('enemy_goblin_archer'), unit('enemy_swamp_witch')]; const archer = unit('ice_scout');
    const s = battle([unit('iron_knight'), unit('frost_sage'), archer], enemy);
    endPreparation(s, 'player');
    expect(attacksBy(s, archer.instanceId)).toEqual([enemy[0].instanceId]);
  });
  it('após eliminar a frente, o próximo ataque atinge quem avançou para a posição 1', () => {
    const enemy = goblins(); enemy[0].hp = 1; const archer = unit('ice_scout');
    const s = battle([unit('iron_knight'), archer], enemy);
    endPreparation(s, 'player');
    expect(attacksBy(s, archer.instanceId)).toEqual([enemy[1].instanceId]);
    expect(layout(s, 'ai')).toEqual([['enemy_goblin_archer', 1], ['enemy_swamp_witch', 2]]);
  });
  it('a IA segue a mesma regra contra a formação do jogador', () => {
    const own = [unit('iron_knight'), unit('ice_scout'), unit('frost_sage')]; const archer = unit('enemy_goblin_archer');
    const s = battle(own, [unit('enemy_goblin_warrior'), archer], 'ai');
    endPreparation(s, 'ai');
    expect(attacksBy(s, archer.instanceId)).toEqual([own[0].instanceId]);
  });
  it('Provocar continua sendo exceção documentada à prioridade frontal', () => {
    const enemy = [unit('enemy_goblin_warrior'), unit('glacier_guardian')]; const archer = unit('ice_scout');
    const s = battle([unit('iron_knight'), archer], enemy);
    endPreparation(s, 'player');
    expect(attacksBy(s, archer.instanceId)).toEqual([enemy[1].instanceId]);
  });
});

describe('reorganização da formação após mortes', () => {
  it('morte na posição 1 faz 2 e 3 avançarem mantendo a ordem, equipamentos e efeitos', () => {
    const s = battle([], [unit('enemy_goblin_warrior'), unit('enemy_goblin_archer', { poison: 2, equipmentIds: ['reinforced_bow'] }), unit('enemy_swamp_witch', { barrier: 3 })]);
    const [front, middle, back] = getPlayer(s, 'ai').battlefield;
    damage(s, 'ai', front.instanceId, 99, 'effect');
    expect(layout(s, 'ai')).toEqual([['enemy_goblin_archer', 1], ['enemy_swamp_witch', 2]]);
    expect(getPlayer(s, 'ai').battlefield[0]).toBe(middle);
    expect(middle.poison).toBe(2); expect(middle.equipmentIds).toEqual(['reinforced_bow']); expect(back.barrier).toBe(3);
  });
  it('morte na posição 2 faz apenas a posição 3 avançar', () => {
    const s = battle([], goblins());
    damage(s, 'ai', getPlayer(s, 'ai').battlefield[1].instanceId, 99, 'effect');
    expect(layout(s, 'ai')).toEqual([['enemy_goblin_warrior', 1], ['enemy_swamp_witch', 2]]);
  });
  it('morte na posição 3 não move os demais', () => {
    const s = battle([], goblins());
    damage(s, 'ai', getPlayer(s, 'ai').battlefield[2].instanceId, 99, 'effect');
    expect(layout(s, 'ai')).toEqual([['enemy_goblin_warrior', 1], ['enemy_goblin_archer', 2]]);
  });
  it('mortes sucessivas deixam o sobrevivente na posição 1 sem lacunas', () => {
    const s = battle([], goblins());
    const [a, b] = getPlayer(s, 'ai').battlefield;
    damage(s, 'ai', a.instanceId, 99, 'effect'); damage(s, 'ai', b.instanceId, 99, 'effect');
    expect(layout(s, 'ai')).toEqual([['enemy_swamp_witch', 1]]);
  });
  it('morte por contra-ataque recalcula a elegibilidade dos atacantes seguintes', () => {
    // Espinhos derrubam o duelista; o cavaleiro avança e ataca corpo a corpo, o arqueiro passa a ser frente e fica inativo.
    const duelist = unit('tundra_duelist', { hp: 1 }); const knight = unit('iron_knight'); const archer = unit('ice_scout');
    const s = battle([duelist, knight, archer], [unit('orc_warrior')]);
    endPreparation(s, 'player');
    expect(s.eventLog.some(e => e.type === 'MONSTER_DIED' && e.data?.targetId === duelist.instanceId)).toBe(true);
    expect(attacksBy(s, knight.instanceId)).toHaveLength(1);
    expect(layout(s, 'player')).toEqual([['iron_knight', 1], ['ice_scout', 2]]);
  });
  it('morte por veneno no início do turno mantém o estado dos sobreviventes', () => {
    const s = battle([unit('iron_knight', { hp: 1, poison: 1 }), unit('frost_sage', { poison: 2 })], []);
    startTurn(s);
    const [sage] = getPlayer(s, 'player').battlefield;
    expect(layout(s, 'player')).toEqual([['frost_sage', 1]]);
    expect(sage.hp).toBe(5); expect(sage.poison).toBe(1);
  });
  it('morte por carta Flash reorganiza a formação inimiga', () => {
    const s = battle([], [unit('enemy_goblin_warrior', { hp: 2 }), unit('enemy_goblin_archer')]);
    getPlayer(s, 'player').hand = ['fireball']; getPlayer(s, 'player').crystals = 3;
    expect(playEffect(s, 'player', 'fireball')).toBeNull();
    expect(layout(s, 'ai')).toEqual([['enemy_goblin_archer', 1]]);
  });
  it('morte por reflexão reorganiza a formação do atacante', () => {
    const mage = unit('arcane_mage', { hp: 1 });
    const s = battle([unit('iron_knight'), mage, unit('ice_scout')], [unit('mirror_mage')]);
    endPreparation(s, 'player');
    expect(s.eventLog.some(e => e.type === 'MONSTER_DIED' && e.data?.targetId === mage.instanceId)).toBe(true);
    expect(layout(s, 'player')).toEqual([['iron_knight', 1], ['ice_scout', 2]]);
  });
  it('o replay visual reproduz a mesma formação final do motor', () => {
    const enemy = goblins(); enemy[0].hp = 1;
    const s = battle([unit('iron_knight'), unit('ice_scout'), unit('frost_sage')], enemy);
    const before = structuredClone(s);
    endPreparation(s, 'player');
    const replayed = buildVisualEvents(s.eventLog).reduce(applyVisualEvent, before);
    const summary = (state: GameState) => state.players.map(p => p.battlefield.map(m => [m.instanceId, m.position, m.hp]));
    expect(summary(replayed)).toEqual(summary(s));
    expect(summary(createReplay(s, [[], []]).finalState)).toEqual(summary(s));
  });
  it('o combate continua determinístico', () => {
    const run = () => { serial = 0; const s = battle([unit('iron_knight'), unit('ice_scout'), unit('shadow_wraith')], goblins()); endPreparation(s, 'player'); return s.eventLog.map(e => [e.type, e.data?.targetId]); };
    expect(run()).toEqual(run());
  });
});

describe('ataque efetivo com bônus e penalidades', () => {
  const attackOf = (m: MonsterInstance) => (getCard(m.modelId) as MonsterCard).attacks[0];
  const total = (m: MonsterInstance, allies: MonsterInstance[] = [m]) => attackBreakdown(m, attackOf(m), allies);
  it('equipamento +2 soma ao ataque base sem alterar o modelo', () => {
    const b = total(unit('orc_warrior', { equipmentIds: ['iron_sword'] }));
    expect([b.base, b.total]).toEqual([3, 5]); expect(b.modifiers).toEqual([{ source: 'equipment', label: 'Espada de Ferro', value: 2 }]);
    expect((getCard('orc_warrior') as MonsterCard).attacks[0].damage).toBe(3);
  });
  it('equipamento +1 de magia vale apenas para ataque mágico', () => {
    expect(total(unit('arcane_mage', { equipmentIds: ['reflection_staff'] })).total).toBe(5);
    expect(total(unit('orc_warrior', { equipmentIds: ['reinforced_bow'] })).modifiers).toEqual([]);
  });
  it('penalidades −1 e −2 reduzem o ataque efetivo', () => {
    expect(total(unit('berserker', { attackBuff: -1 })).total).toBe(4);
    expect(total(unit('berserker', { attackBuff: -2 })).total).toBe(3);
  });
  it('bônus e penalidade simultâneos produzem o resultado líquido', () => {
    const b = total(unit('orc_warrior', { attackBuff: -1, equipmentIds: ['iron_sword'] }));
    expect(b.modifiers.map(m => m.value)).toEqual([-1, 2]); expect(b.total).toBe(4);
  });
  it('remoção de equipamento e expiração do efeito voltam ao valor base', () => {
    const m = unit('orc_warrior', { attackBuff: 2, equipmentIds: ['iron_sword'] });
    expect(total(m).total).toBe(7);
    expect(total({ ...m, equipmentIds: [], attackBuff: 0 })).toMatchObject({ total: 3, modifiers: [] });
  });
  it('múltiplos equipamentos válidos são somados uma única vez cada', () => {
    expect(total(unit('orc_warrior', { equipmentIds: ['iron_sword', 'war_axe'] })).total).toBe(8);
  });
  it('aura de suporte e fúria entram no cálculo', () => {
    const druid = unit('elder_druid'); const duelist = unit('tundra_duelist', { hp: 2 });
    expect(total(duelist, [duelist, druid]).modifiers.map(m => m.source)).toEqual(['enrage', 'aura']);
  });
  it('o bônus registrado pelo motor é o mesmo exibido na carta', () => {
    const orc = unit('orc_warrior', { equipmentIds: ['iron_sword'], attackBuff: 1 });
    const s = battle([orc], [unit('enemy_ent')]);
    const expected = total(orc).total - 3;
    endPreparation(s, 'player');
    expect(s.eventLog.find(e => e.type === 'ATTACK_DECLARED')?.data?.bonus).toBe(expected);
  });
});
