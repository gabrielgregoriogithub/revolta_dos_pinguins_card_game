import { describe, expect, it } from 'vitest';
import { STARTER_DECKS } from '../data/cards';
import { createGame, endPreparation, equip, getPlayer, playEffect, summon } from '../engine/core';
import { applyVisualEvent, buildVisualEvents } from '../engine/visual';

function combat(seed: string) {
  const state = createGame(STARTER_DECKS[0].cards, STARTER_DECKS[1].cards, seed);
  state.activePlayerId = 'player'; state.phase = 'PREPARATION';
  getPlayer(state, 'player').hand = ['orc_warrior']; getPlayer(state, 'player').crystals = 3;
  getPlayer(state, 'ai').hand = ['orc_warrior']; getPlayer(state, 'ai').crystals = 3;
  summon(state, 'player', 'orc_warrior'); state.activePlayerId = 'ai'; state.phase = 'PREPARATION'; summon(state, 'ai', 'orc_warrior'); state.activePlayerId = 'player';
  const before = structuredClone(state); const marker = state.eventLog.length; endPreparation(state, 'player');
  return { before, after: state, events: buildVisualEvents(state.eventLog.slice(marker)) };
}

describe('reprodução visual do combate', () => {
  it('mantém a ordem cronológica e IDs únicos', () => { const result = combat('visual-sequencia'); expect(result.events.length).toBeGreaterThan(1); expect(result.events[0].sequence).toBe(1); expect(result.events.map(e => e.sequence)).toEqual([...result.events.keys()].map(i => i + 1)); expect(new Set(result.events.map(e => e.id)).size).toBe(result.events.length); expect(result.events.some(e => e.type === 'ATTACK')).toBe(true); });
  it('não altera o resultado real enquanto a cópia visual avança', () => { const result = combat('visual-pause'); const originalHp = result.after.players[1].battlefield[0]?.hp; const firstVisual = applyVisualEvent(result.before, result.events[0]); expect(result.after.players[1].battlefield[0]?.hp).toBe(originalHp); expect(firstVisual).not.toBe(result.after); });
  it('reproduz a mesma fila para a mesma seed', () => { const a = combat('same-seed').events.map(e => [e.type, e.description, e.damage, e.hpAfter]); const b = combat('same-seed').events.map(e => [e.type, e.description, e.damage, e.hpAfter]); expect(a).toEqual(b); });
  it('mostra a carta invocada no campo durante a reprodução e a remove da mão', () => { const state = createGame(STARTER_DECKS[0].cards, STARTER_DECKS[1].cards, 'visual-summon'); state.activePlayerId = 'player'; state.phase = 'PREPARATION'; const p = getPlayer(state, 'player'); p.hand = ['orc_warrior', 'iron_sword']; p.crystals = 10; const before = structuredClone(state); const marker = state.eventLog.length; summon(state, 'player', 'orc_warrior'); const unitId = p.battlefield[0].instanceId; equip(state, 'player', 'iron_sword', unitId); const events = buildVisualEvents(state.eventLog.slice(marker)); expect(events.map(e => e.type)).toEqual(['SUMMON', 'EQUIP']); const afterSummon = applyVisualEvent(before, events[0]); const visualPlayer = getPlayer(afterSummon, 'player'); expect(visualPlayer.battlefield.map(m => m.instanceId)).toEqual([unitId]); expect(visualPlayer.hand).toEqual(['iron_sword']); expect(visualPlayer.crystals).toBe(7); const afterEquip = getPlayer(applyVisualEvent(afterSummon, events[1]), 'player'); expect(afterEquip.battlefield[0].equipmentIds).toEqual(['iron_sword']); expect(afterEquip.hand).toEqual([]); });
  it('aplica veneno de feitiço no estado visual', () => { const state = createGame(STARTER_DECKS[0].cards, STARTER_DECKS[1].cards, 'visual-status'); state.activePlayerId = 'ai'; state.phase = 'PREPARATION'; getPlayer(state, 'ai').hand = ['orc_warrior']; getPlayer(state, 'ai').crystals = 3; summon(state, 'ai', 'orc_warrior'); state.activePlayerId = 'player'; const p = getPlayer(state, 'player'); p.hand = ['concentrated_poison']; p.crystals = 5; const before = structuredClone(state); const marker = state.eventLog.length; playEffect(state, 'player', 'concentrated_poison'); const status = buildVisualEvents(state.eventLog.slice(marker)).find(e => e.type === 'STATUS')!; expect(status.abilityId).toBe('poison'); expect(getPlayer(applyVisualEvent(before, status), 'ai').battlefield[0].poison).toBe(2); });
});
