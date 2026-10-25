import { describe, expect, it } from 'vitest';
import { attackProfileFor, ATTACK_FX_PROFILES } from '../vfx/profiles';
import { buildVisualEvents } from '../engine/visual';
import { resolveSound, SOUNDS } from '../audio/AudioManager';

describe('perfis audiovisuais de combate', () => {
  it('separa espada, machado, flecha, fogo e caos', () => {
    expect(attackProfileFor({ sourceModelId: 'orc_warrior', attackType: 'melee' }).id).toBe('sword');
    expect(attackProfileFor({ sourceModelId: 'berserker', attackType: 'melee' }).id).toBe('axe');
    expect(attackProfileFor({ sourceModelId: 'elven_archer', attackType: 'ranged' }).id).toBe('arrow');
    expect(attackProfileFor({ sourceModelId: 'arcane_mage', attackType: 'magic' }).id).toBe('fireball');
    expect(attackProfileFor({ sourceModelId: 'wandering_demon', attackType: 'chaos' }).id).toBe('chaos');
  });
  it('anexa perfil, hit stop e intensidade ao evento sem alterar o dano', () => {
    const [event] = buildVisualEvents([{ id: 'fx-1', type: 'ATTACK_DECLARED', turn: 1, message: 'ataque', data: { attackerId: 'a', targetId: 'b', sourceModelId: 'berserker', targetModelId: 'iron_knight', attackType: 'melee' } }]);
    expect(event.fxProfileId).toBe('axe'); expect(event.hitStopMs).toBe(82); expect(event.shakeIntensity).toBe(.3); expect(ATTACK_FX_PROFILES.axe.impactSound).toBe('axe-hit');
  });
  it('diferencia o áudio de flechas elementais e mantém todos os sons resolvíveis', () => {
    expect(ATTACK_FX_PROFILES.arrow.windupSound).toBe('bow-draw');
    expect(ATTACK_FX_PROFILES.arrow_ice.windupSound).toBe('ice-charge');
    expect(ATTACK_FX_PROFILES.arrow_poison.releaseSound).toBe('poison-release');
    expect(ATTACK_FX_PROFILES.arrow_light.releaseSound).toBe('light-release');
    for (const profile of Object.values(ATTACK_FX_PROFILES)) {
      expect(resolveSound(profile.windupSound)).toBe(profile.windupSound);
      expect(resolveSound(profile.releaseSound)).toBe(profile.releaseSound);
      expect(resolveSound(profile.impactSound)).toBe(profile.impactSound);
    }
    expect(SOUNDS['water-impact']).toBeDefined();
    expect(SOUNDS['wind-impact']).toBeDefined();
  });
});
