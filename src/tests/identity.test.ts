import { describe, expect, it } from 'vitest';
import { ENEMY_CARDS, ENEMY_DECKS, STORY_STARTER_DECK, CARDS } from '../data/cards';
import { auditCatalog } from '../engine/catalog';
import { validateDeck } from '../engine/core';

describe('identidade de raças e ownership', () => {
  it('mantém todos os monstros jogáveis como pinguins', () => expect(CARDS.filter(card => card.category === 'monster').every(card => card.ownership === 'player' && card.race === 'penguin')).toBe(true));
  it('mantém os inimigos PvE fora da raça pinguim', () => expect(ENEMY_CARDS.every(card => card.ownership === 'enemy' && card.race !== 'penguin')).toBe(true));
  it('valida o baralho inicial de história e rejeita inimigos para jogadores', () => { expect(STORY_STARTER_DECK.cards).toHaveLength(16); expect(validateDeck(STORY_STARTER_DECK.cards)).toEqual([]); expect(validateDeck(ENEMY_DECKS[0].cards)).not.toEqual([]); expect(validateDeck(ENEMY_DECKS[0].cards, 'enemy')).toEqual([]); });
  it('não encontra violações no catálogo', () => expect(auditCatalog().invalid).toEqual([]));
});
