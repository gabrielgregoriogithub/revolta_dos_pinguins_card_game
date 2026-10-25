import { describe, expect, it } from 'vitest';
import { SHOWCASES, runShowcase } from '../app/VfxLab';

const expectations: Record<string, (types: string[], fx: Record<string, unknown>[]) => void> = {
  axe: (_, fx) => expect(fx.filter(f => f.strike === 2)).toHaveLength(1),
  shadow: (_, fx) => expect(fx.some(f => f.numberStyle === 'drain')).toBe(true),
  reflect: (_, fx) => expect(fx.some(f => f.numberStyle === 'reflect')).toBe(true),
  thorns: (_, fx) => expect(fx.some(f => f.numberStyle === 'thorns')).toBe(true),
  absorb: (_, fx) => expect(fx.some(f => f.numberStyle === 'absorbed')).toBe(true),
  blocked: (_, fx) => expect(fx.some(f => f.numberStyle === 'blocked')).toBe(true),
  pierce: (_, fx) => expect(fx.some(f => f.pierce === true)).toBe(true),
  'armor-break': (_, fx) => expect(fx.some(f => f.armorBreak === true)).toBe(true),
  miss: types => expect(types).toContain('MISS'),
  ice: (_, fx) => expect(fx.some(f => f.statusFx === 'freeze')).toBe(true),
  'kill-physical': (_, fx) => expect(fx.some(f => f.deathStyle === 'physical')).toBe(true),
  'kill-fire': (_, fx) => expect(fx.some(f => f.deathStyle === 'fire')).toBe(true),
  'kill-ice': (_, fx) => expect(fx.some(f => f.deathStyle === 'ice')).toBe(true),
  'kill-poison': (_, fx) => expect(fx.some(f => f.deathStyle === 'poison')).toBe(true),
  'kill-shadow': (_, fx) => expect(fx.some(f => f.deathStyle === 'shadow')).toBe(true),
  'boss-fire': (_, fx) => expect(fx.some(f => f.shake === 'arena')).toBe(true),
};

describe('vitrine de combate do laboratório', () => {
  it.each(SHOWCASES.map(s => [s.id, s] as const))('%s roda no motor real com ataque e resultado', (id, showcase) => {
    const { events } = runShowcase(showcase);
    const types = events.map(e => e.type); const fx = events.map(e => e.fx as unknown as Record<string, unknown>);
    expect(types).toContain('ATTACK');
    expect(types.some(t => ['DAMAGE', 'BLOCK', 'MISS'].includes(t))).toBe(true);
    expectations[id]?.(types, fx);
  });
});
