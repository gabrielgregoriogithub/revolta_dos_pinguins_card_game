import { describe, expect, it } from 'vitest';
import { CARDS, STARTER_DECKS } from '../data/cards';
import { createDraftSession, pickDraftCard, survivalDifficulty, updateSurvival } from '../engine/modes';

describe('modos locais', () => {
  it('gera Draft reproduzível com oito monstros e oito itens possíveis', () => {
    let session = createDraftSession('seed-fixed');
    const first = createDraftSession('seed-fixed');
    expect(session.options).toEqual(first.options);
    for (let i = 0; i < 16; i++) session = pickDraftCard(session, session.options[i][0]);
    expect(session.status).toBe('READY');
    expect(session.deck.filter(id => CARDS.find(card => card.id === id)?.category === 'monster')).toHaveLength(8);
  });
  it('atualiza recorde de sobrevivência sem misturar rating', () => {
    expect(survivalDifficulty(0)).toBe('easy'); expect(survivalDifficulty(2)).toBe('normal'); expect(survivalDifficulty(4)).toBe('hard');
    const record = updateSurvival({ bestStreak: 2, attempts: 1, totalBattles: 2, lastDeckId: null, updatedAt: '' }, 4, STARTER_DECKS[0].id);
    expect(record.bestStreak).toBe(4); expect(record.totalBattles).toBe(6); expect(record.lastDeckId).toBe(STARTER_DECKS[0].id);
  });
});
