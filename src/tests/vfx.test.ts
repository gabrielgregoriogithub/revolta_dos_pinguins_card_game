import { describe, expect, it } from 'vitest';
import { buildVisualEvents } from '../engine/visual';
import { attackVfx, vfxForEvent } from '../vfx/registry';

describe('fila visual e VFX', () => {
  it('mapeia cada tipo de ataque para um efeito distinto', () => {
    expect(attackVfx('melee')).toBe('meleeSlash');
    expect(attackVfx('ranged')).toBe('rangedArrow');
    expect(attackVfx('magic')).toBe('magicArcane');
    expect(attackVfx('chaos')).toBe('chaosBolt');
  });
  it('preserva alvo, vida e efeito de esquiva do motor', () => {
    const events = buildVisualEvents([
      { id: 'a', type: 'ATTACK_DECLARED', turn: 1, message: 'ataque', data: { attackerId: 'u1', targetId: 'u2', sourceModelId: 'orc_warrior', targetModelId: 'iron_knight', attackType: 'melee' } },
      { id: 'm', type: 'ATTACK_MISSED', turn: 1, message: 'esquivou', data: { targetId: 'u2', targetModelId: 'iron_knight' } },
      { id: 'd', type: 'DAMAGE_APPLIED', turn: 1, message: 'dano', data: { targetId: 'u2', targetModelId: 'iron_knight', amount: 3, hpBefore: 7, hpAfter: 4, attackType: 'melee' } }
    ]);
    expect(events[0].vfxId).toBe('meleeSlash'); expect(events[1].type).toBe('MISS'); expect(events[1].description).toContain('ESQUIVOU');
    expect(vfxForEvent(events[2]).color).toBe('#ff6f7d'); expect(events[2].hpBefore).toBe(7); expect(events[2].hpAfter).toBe(4);
  });
});
