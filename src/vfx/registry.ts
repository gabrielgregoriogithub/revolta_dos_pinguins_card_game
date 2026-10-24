import type { AttackType, CombatVisualEvent, VisualEventType } from '../types';
export interface VFXDefinition { id: string; category: string; animation: string; duration: number; color: string; impactEffect?: string; }
export const VFX: Record<string, VFXDefinition> = {
  meleeSlash: { id: 'meleeSlash', category: 'attack', animation: 'slash', duration: 520, color: '#f6ce65', impactEffect: 'impact-heavy' },
  rangedArrow: { id: 'rangedArrow', category: 'projectile', animation: 'arrow', duration: 620, color: '#d7f2ff', impactEffect: 'impact-pierce' },
  magicArcane: { id: 'magicArcane', category: 'projectile', animation: 'orb', duration: 680, color: '#a975ff', impactEffect: 'impact-magic' },
  chaosBolt: { id: 'chaosBolt', category: 'projectile', animation: 'chaos', duration: 700, color: '#d56cff', impactEffect: 'impact-chaos' },
  damagePhysical: { id: 'damagePhysical', category: 'damage', animation: 'float', duration: 600, color: '#ff6f7d' },
  damageMagic: { id: 'damageMagic', category: 'damage', animation: 'float', duration: 600, color: '#d28cff' },
  heal: { id: 'heal', category: 'healing', animation: 'rise', duration: 650, color: '#69e49a' },
  block: { id: 'block', category: 'shield', animation: 'pulse', duration: 550, color: '#8fd7ff' },
  miss: { id: 'miss', category: 'defense', animation: 'fade', duration: 550, color: '#d9e9f2' },
  death: { id: 'death', category: 'death', animation: 'fall', duration: 850, color: '#ff7381' },
  formation: { id: 'formation', category: 'formation', animation: 'slide', duration: 500, color: '#f6ce65' },
  effect: { id: 'effect', category: 'effect', animation: 'burst', duration: 650, color: '#70c7ef' }
};
export function vfxForEvent(event: CombatVisualEvent): VFXDefinition { return VFX[event.vfxId ?? 'effect'] ?? VFX.effect; }
export function attackVfx(type?: AttackType | string): string { return type === 'melee' ? 'meleeSlash' : type === 'ranged' ? 'rangedArrow' : type === 'magic' ? 'magicArcane' : type === 'chaos' ? 'chaosBolt' : 'effect'; }
export function visualCategory(type: VisualEventType, attackType?: AttackType | string): string { if (type === 'ATTACK') return attackVfx(attackType); if (type === 'DAMAGE') return attackType === 'magic' ? 'damageMagic' : 'damagePhysical'; if (type === 'BLOCK') return 'block'; if (type === 'MISS') return 'miss'; if (type === 'HEAL') return 'heal'; if (type === 'DEATH') return 'death'; if (type === 'FORMATION') return 'formation'; return 'effect'; }
