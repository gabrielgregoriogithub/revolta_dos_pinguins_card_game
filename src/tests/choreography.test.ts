import { describe, expect, it } from 'vitest';
import { CARDS, ENEMY_CARDS, STARTER_DECKS, getCard } from '../data/cards';
import { createGame, endPreparation, getPlayer, playEffect, startTurn } from '../engine/core';
import { buildVisualEvents } from '../engine/visual';
import { attackProfileFor, hasCardProfile } from '../vfx/profiles';
import type { CombatVisualEvent, GameState, MonsterCard, MonsterInstance } from '../types';

let serial = 0;
function unit(modelId: string, overrides: Partial<MonsterInstance> = {}): MonsterInstance {
  const card = getCard(modelId) as MonsterCard;
  return { instanceId: `${modelId}_${++serial}`, modelId, hp: card.maxHp, maxHp: card.maxHp, position: 0, alive: true, stunned: 0, silenced: 0, poison: 0, attackBuff: 0, armorBreak: 0, barrier: 0, equipmentIds: [], ...overrides };
}
function duel(own: MonsterInstance[], enemy: MonsterInstance[], seed = 'coreografia'): { state: GameState; events: CombatVisualEvent[] } {
  const state = createGame(STARTER_DECKS[0].cards, STARTER_DECKS[1].cards, seed);
  state.activePlayerId = 'player'; state.phase = 'PREPARATION';
  getPlayer(state, 'player').battlefield = own.map((m, i) => ({ ...m, position: i + 1 }));
  getPlayer(state, 'ai').battlefield = enemy.map((m, i) => ({ ...m, position: i + 1 }));
  const marker = state.eventLog.length; endPreparation(state, 'player');
  return { state, events: buildVisualEvents(state.eventLog.slice(marker)) };
}
const first = (events: CombatVisualEvent[], type: CombatVisualEvent['type'], predicate: (e: CombatVisualEvent) => boolean = () => true) => events.find(e => e.type === type && predicate(e))!;

describe('identidade de cada ataque', () => {
  it('todo monstro do jogo tem um perfil audiovisual explícito', () => {
    const monsters = [...CARDS, ...ENEMY_CARDS].filter(c => c.category === 'monster');
    expect(monsters.filter(c => !hasCardProfile(c.id)).map(c => c.id)).toEqual([]);
  });
  it('armas e elementos diferentes recebem movimentos e elementos diferentes', () => {
    const cases: [string, string, string][] = [['orc_warrior', 'sword', 'slash'], ['berserker', 'axe', 'heavy'], ['sacrifice_knight', 'spear', 'thrust'], ['stone_golem', 'hammer', 'smash'], ['tundra_duelist', 'katana', 'quick'], ['enemy_yeti', 'claw', 'claw'], ['enemy_wolf', 'bite', 'bite'], ['elven_archer', 'arrow', 'projectile'], ['ice_scout', 'arrow_ice', 'projectile'], ['moss_hunter', 'arrow_poison', 'projectile'], ['arcane_mage', 'fireball', 'projectile'], ['storm_imp', 'lightning', 'bolt'], ['enemy_volcanic_dragon', 'dragon_fire', 'breath']];
    for (const [card, profile, motion] of cases) expect([card, attackProfileFor({ sourceModelId: card }).id, attackProfileFor({ sourceModelId: card }).motion]).toEqual([card, profile, motion]);
    expect(new Set(['ice_scout', 'moss_hunter', 'aurora_sniper', 'elven_archer'].map(id => attackProfileFor({ sourceModelId: id }).element)).size).toBe(4);
  });
});

describe('coreografia derivada do motor', () => {
  it('o ataque termina no contato e o impacto mostra exatamente o dano do motor', () => {
    const { state, events } = duel([unit('orc_warrior')], [unit('enemy_troll')]);
    const attack = first(events, 'ATTACK'); const hit = first(events, 'DAMAGE');
    expect(attack.fx!.durationMs).toBe(attack.fx!.windupMs + attack.fx!.travelMs);
    const engine = state.eventLog.find(e => e.type === 'DAMAGE_APPLIED')!;
    expect(hit.damage).toBe(engine.data?.amount); expect(hit.hpBefore! - hit.hpAfter!).toBe(hit.damage);
    expect(hit.fx).toMatchObject({ numberStyle: 'physical', reaction: 'medium', element: 'physical' });
    expect(attack.fx!.sounds).toEqual([{ id: 'sword-windup', atMs: 0 }, { id: 'sword-swish', atMs: attack.fx!.windupMs }]);
  });
  it('golpes comuns ficam dentro do orçamento de tempo; chefes ganham mais, com limite', () => {
    const normal = duel([unit('orc_warrior')], [unit('enemy_troll')]).events;
    const total = (events: CombatVisualEvent[]) => first(events, 'ATTACK').fx!.durationMs + events.find(e => e.type === 'DAMAGE' || e.type === 'BLOCK')!.fx!.durationMs;
    expect(total(normal)).toBeGreaterThanOrEqual(900); expect(total(normal)).toBeLessThanOrEqual(1900);
    const dragon = duelAsAi([unit('enemy_volcanic_dragon')], [unit('iron_knight')]);
    expect(first(dragon, 'ATTACK').fx).toMatchObject({ boss: true, motion: 'breath' });
    expect(first(dragon, 'ATTACK').fx!.sounds[0].id).toBe('boss-roar');
    expect(first(dragon, 'DAMAGE').fx).toMatchObject({ reaction: 'boss', shake: 'arena' });
    expect(total(dragon)).toBeLessThanOrEqual(2600);
  });
  it('barreira que absorve tudo vira número de absorção, sem perda de vida', () => {
    const { events } = duel([unit('orc_warrior')], [unit('enemy_troll', { barrier: 20 })]);
    const block = first(events, 'BLOCK');
    expect(block.damage).toBe(0); expect(block.hpAfter).toBe(block.hpBefore); expect(block.fx!.numberStyle).toBe('absorbed');
    expect(block.fx!.sounds.map(s => s.id)).toContain('absorb-shield');
  });
  it('proteção que zera o golpe vira bloqueio com zero de dano', () => {
    const { events } = duelAsAiFull([unit('enemy_goblin_warrior')], [unit('iron_knight', { equipmentIds: ['iron_shield'] })]);
    const hit = first(events, 'DAMAGE');
    expect(hit.damage).toBe(0); expect(hit.fx!.numberStyle).toBe('blocked'); expect(hit.fx!.sounds[0].id).toBe('block-metal');
  });
  it('ataque duplo produz dois golpes distinguíveis', () => {
    const { events } = duel([unit('berserker')], [unit('enemy_iron_colossus')]);
    const [a, b] = events.filter(e => e.type === 'ATTACK');
    expect([a.fx!.strike, b.fx!.strike]).toEqual([1, 2]);
    expect(Math.sign(a.fx!.slashAngle)).not.toBe(Math.sign(b.fx!.slashAngle));
    expect(b.fx!.windupMs).toBeLessThan(a.fx!.windupMs);
  });
  it('roubo de vida liga o alvo drenado ao atacante', () => {
    const necro = unit('necromancer', { hp: 2 }); const target = unit('enemy_troll');
    const { events } = duel([necro], [target]);
    const heal = first(events, 'HEAL');
    expect(heal.fx).toMatchObject({ numberStyle: 'drain', link: { fromId: target.instanceId, toId: necro.instanceId, kind: 'drain' } });
    expect(heal.fx!.impactDelayMs).toBeGreaterThan(0);
  });
  it('reflexão devolve a energia do refletor ao atacante', () => {
    const mage = unit('arcane_mage'); const mirror = unit('mirror_mage');
    const { events } = duel([mage], [mirror]);
    const reflected = first(events, 'DAMAGE', e => e.attackType === 'reflected');
    expect(reflected.fx).toMatchObject({ numberStyle: 'reflect', link: { fromId: mirror.instanceId, toId: mage.instanceId, kind: 'reflect' } });
  });
  it('espinhos aparecem como contra-ataque vindo da unidade atingida', () => {
    const duelist = unit('tundra_duelist'); const orc = unit('orc_warrior');
    const { events } = duel([duelist], [orc]);
    const thorns = first(events, 'DAMAGE', e => e.attackType === 'thorns');
    expect(thorns.fx).toMatchObject({ numberStyle: 'thorns', link: { fromId: orc.instanceId, toId: duelist.instanceId, kind: 'thorns' } });
  });
  it('a morte herda o elemento do golpe final', () => {
    expect(first(duel([unit('arcane_mage')], [unit('enemy_goblin_warrior', { hp: 1 })]).events, 'DEATH').fx!.deathStyle).toBe('fire');
    expect(first(duel([unit('frost_sage')], [unit('enemy_goblin_warrior', { hp: 1 })]).events, 'DEATH').fx!.deathStyle).toBe('ice');
    expect(first(duel([unit('orc_warrior')], [unit('enemy_goblin_warrior', { hp: 1 })]).events, 'DEATH').fx!.deathStyle).toBe('physical');
  });
  it('morte por veneno no início do turno usa a dissolução venenosa', () => {
    const state = createGame(STARTER_DECKS[0].cards, STARTER_DECKS[1].cards, 'veneno');
    state.activePlayerId = 'player'; getPlayer(state, 'player').battlefield = [{ ...unit('iron_knight', { hp: 1, poison: 1 }), position: 1 }];
    const marker = state.eventLog.length; startTurn(state);
    expect(first(buildVisualEvents(state.eventLog.slice(marker)), 'DEATH').fx!.deathStyle).toBe('poison');
  });
  it('congelamento de gelo e atordoamento sombrio têm efeitos de status distintos', () => {
    expect(first(duel([unit('frost_witch')], [unit('enemy_troll')]).events, 'STATUS').fx!.statusFx).toBe('freeze');
    expect(first(duel([unit('iron_knight'), unit('shadow_wraith')], [unit('enemy_troll')]).events, 'STATUS').fx!.statusFx).toBe('stun');
  });
  it('carta Flash de fogo gera impacto de fogo mesmo sem atacante', () => {
    const state = createGame(STARTER_DECKS[0].cards, STARTER_DECKS[1].cards, 'flash');
    state.activePlayerId = 'player'; state.phase = 'PREPARATION';
    getPlayer(state, 'ai').battlefield = [{ ...unit('enemy_troll'), position: 1 }];
    getPlayer(state, 'player').hand = ['fireball']; getPlayer(state, 'player').crystals = 3;
    const marker = state.eventLog.length; playEffect(state, 'player', 'fireball');
    expect(first(buildVisualEvents(state.eventLog.slice(marker)), 'DAMAGE').fx!.element).toBe('fire');
  });
  it('a coreografia é determinística e não altera os eventos do motor', () => {
    const run = () => { serial = 0; return duel([unit('berserker'), unit('necromancer')], [unit('enemy_troll'), unit('mirror_mage')]).events; };
    const a = run(); const b = run();
    expect(a.map(e => e.fx)).toEqual(b.map(e => e.fx));
    expect(a.map(e => [e.type, e.damage, e.hpAfter])).toEqual(b.map(e => [e.type, e.damage, e.hpAfter]));
  });
});

function duelAsAi(attackers: MonsterInstance[], defenders: MonsterInstance[]) { return duelAsAiFull(attackers, defenders).events; }
function duelAsAiFull(attackers: MonsterInstance[], defenders: MonsterInstance[]) {
  const state = createGame(STARTER_DECKS[0].cards, STARTER_DECKS[1].cards, 'ia');
  state.activePlayerId = 'ai'; state.phase = 'PREPARATION';
  getPlayer(state, 'ai').battlefield = attackers.map((m, i) => ({ ...m, position: i + 1 }));
  getPlayer(state, 'player').battlefield = defenders.map((m, i) => ({ ...m, position: i + 1 }));
  const marker = state.eventLog.length; endPreparation(state, 'ai');
  return { state, events: buildVisualEvents(state.eventLog.slice(marker)) };
}
