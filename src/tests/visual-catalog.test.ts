import { describe, expect, it } from 'vitest';
import { CARD_ASSETS } from '../data/assets';
import { CARDS, ENEMY_CARDS } from '../data/cards';
import { STATUS_VISUALS } from '../data/statusVisuals';

describe('catálogo visual padronizado', () => {
  it('possui manifesto para todas as cartas auditadas', () => {
    for (const card of [...CARDS, ...ENEMY_CARDS]) expect(CARD_ASSETS[card.id]).toBeDefined();
  });

  it('mantém ilustrações prontas no catálogo-base e manifesto para a expansão', () => {
    const monsters = CARDS.filter(card => card.category === 'monster');
    expect(monsters).toHaveLength(59);
    expect(monsters.filter(card => CARD_ASSETS[card.id].source === 'illustration')).toHaveLength(24);
    expect(monsters.every(card => CARD_ASSETS[card.id])).toBe(true);
  });

  it('mantém arte pronta para inimigos-base e placeholders auditáveis para a expansão', () => {
    const enemies = ENEMY_CARDS.filter(card => card.category === 'monster');
    expect(enemies).toHaveLength(60);
    expect(enemies.filter(card => CARD_ASSETS[card.id].source === 'illustration')).toHaveLength(25);
    expect(new Set(enemies.map(card => CARD_ASSETS[card.id].illustration)).size).toBeGreaterThan(25);
  });

  it('mantém todos os status implementados na biblioteca única', () => {
    const abilityIds = [...CARDS, ...ENEMY_CARDS].flatMap(card => card.category === 'monster' ? card.abilities.map(a => a.id) : card.category === 'equipment' ? card.effects.map(a => a.id) : [card.effect]);
    expect(abilityIds.every(id => STATUS_VISUALS[id])).toBe(true);
  });
});
