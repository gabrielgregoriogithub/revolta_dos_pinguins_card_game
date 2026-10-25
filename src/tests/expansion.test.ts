import { describe, expect, it } from 'vitest';
import { EXPANSION_ALL_CARDS, EXPANSION_CARDS, EXPANSION_EFFECTS, EXPANSION_ENEMY_CARDS, EXPANSION_EQUIPMENT, EXPANSION_PLAYER_CARDS } from '../data/expansion';
import { CARD_MAP } from '../data/cards';
import { validateDeck } from '../engine/core';

describe('expansão 1', () => {
  it('entrega a meta de 120 cartas por categoria', () => {
    expect(EXPANSION_PLAYER_CARDS).toHaveLength(35);
    expect(EXPANSION_ENEMY_CARDS).toHaveLength(35);
    expect(EXPANSION_EQUIPMENT).toHaveLength(25);
    expect(EXPANSION_EFFECTS).toHaveLength(25);
    expect(EXPANSION_CARDS).toHaveLength(85);
    expect(EXPANSION_ALL_CARDS).toHaveLength(120);
  });
  it('não duplica IDs e todas as cartas são resolvíveis pelo catálogo', () => {
    const ids = EXPANSION_ALL_CARDS.map(card => card.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every(id => CARD_MAP.has(id))).toBe(true);
    expect(EXPANSION_CARDS.every(card => !validateDeck([card.id], 'player').some(error => error.includes('desconhecida')))).toBe(true);
  });
});
