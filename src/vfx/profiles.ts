import type { AttackType, CombatVisualEvent } from '../types';
import { CARD_MAP } from '../data/cards';

export type FXIntensity = 'light' | 'medium' | 'heavy' | 'ultimate';
export type FxElement = 'physical' | 'fire' | 'ice' | 'lightning' | 'poison' | 'shadow' | 'nature' | 'light' | 'arcane' | 'chaos' | 'water' | 'wind';
// Como o golpe se move: corpo a corpo (slash…fist) ou projétil/feixe (projectile, bolt, breath).
export type FxMotion = 'slash' | 'heavy' | 'quick' | 'thrust' | 'smash' | 'claw' | 'bite' | 'fist' | 'projectile' | 'bolt' | 'breath';
export type FxProjectile = 'arrow' | 'orb' | 'shard' | 'leaf' | 'skull' | 'spark' | 'vortex' | 'breath' | 'wave' | 'gust';
export interface AttackFXProfile { id: string; attackType: AttackType | string; weapon?: string; element: FxElement; motion: FxMotion; projectile?: FxProjectile; windupEffect: string; travelEffect?: string; impactEffect: string; windupSound: string; releaseSound: string; impactSound: string; hitStopMs: number; shakeIntensity: number; visualIntensity: FXIntensity; }

const melee = (id: string, weapon: string, motion: FxMotion, hitStopMs: number, shakeIntensity: number, visualIntensity: FXIntensity, sound = id): AttackFXProfile =>
  ({ id, attackType: 'melee', weapon, element: 'physical', motion, windupEffect: `${id}-windup`, impactEffect: `${id}-impact`, windupSound: `${sound}-windup`, releaseSound: `${sound}-swish`, impactSound: `${sound}-hit`, hitStopMs, shakeIntensity, visualIntensity });
const rangedSounds: Partial<Record<FxElement, [windup: string, release: string]>> = {
  physical: ['bow-draw', 'arrow-release'],
  fire: ['fire-charge', 'fire-release'],
  ice: ['ice-charge', 'ice-release'],
  lightning: ['lightning-charge', 'lightning-release'],
  poison: ['poison-charge', 'poison-release'],
  light: ['light-charge', 'light-release'],
};
const ranged = (id: string, element: FxElement, impactSound: string): AttackFXProfile => {
  const [windupSound, releaseSound] = rangedSounds[element] ?? ['bow-draw', 'arrow-release'];
  return { id, attackType: 'ranged', weapon: 'bow', element, motion: 'projectile', projectile: 'arrow', windupEffect: 'charge-bow', travelEffect: `${id}-trail`, impactEffect: `${id}-impact`, windupSound, releaseSound, impactSound, hitStopMs: 34, shakeIntensity: .08, visualIntensity: 'medium' };
};
const spell = (id: string, attackType: AttackType, element: FxElement, motion: FxMotion, projectile: FxProjectile, hitStopMs: number, shakeIntensity: number, visualIntensity: FXIntensity, sound = id): AttackFXProfile =>
  ({ id, attackType, element, motion, projectile, windupEffect: `${sound}-charge`, travelEffect: `${sound}-trail`, impactEffect: `${sound}-impact`, windupSound: `${sound}-charge`, releaseSound: `${sound}-release`, impactSound: `${sound}-impact`, hitStopMs, shakeIntensity, visualIntensity });

export const ATTACK_FX_PROFILES: Record<string, AttackFXProfile> = {
  sword: melee('sword', 'sword', 'slash', 38, .12, 'medium'),
  axe: melee('axe', 'axe', 'heavy', 82, .3, 'heavy'),
  katana: melee('katana', 'katana', 'quick', 62, .2, 'heavy'),
  spear: melee('spear', 'spear', 'thrust', 52, .16, 'medium'),
  hammer: melee('hammer', 'hammer', 'smash', 92, .34, 'heavy'),
  monk: melee('monk', 'fist', 'fist', 28, .1, 'medium'),
  claw: melee('claw', 'claws', 'claw', 44, .14, 'medium'),
  bite: melee('bite', 'fangs', 'bite', 50, .16, 'medium'),
  arrow: ranged('arrow', 'physical', 'arrow-hit'),
  arrow_fire: ranged('arrow_fire', 'fire', 'fire-impact'),
  arrow_ice: ranged('arrow_ice', 'ice', 'ice-impact'),
  arrow_poison: ranged('arrow_poison', 'poison', 'poison-impact'),
  arrow_light: ranged('arrow_light', 'light', 'light-impact'),
  arrow_lightning: ranged('arrow_lightning', 'lightning', 'lightning-impact'),
  fireball: spell('fireball', 'magic', 'fire', 'projectile', 'orb', 76, .24, 'heavy', 'fire'),
  ice: spell('ice', 'magic', 'ice', 'projectile', 'shard', 58, .16, 'medium'),
  nature: spell('nature', 'magic', 'nature', 'projectile', 'leaf', 48, .1, 'medium'),
  shadow: spell('shadow', 'magic', 'shadow', 'projectile', 'skull', 62, .18, 'heavy'),
  poison: spell('poison', 'magic', 'poison', 'projectile', 'orb', 48, .12, 'medium'),
  arcane: spell('arcane', 'magic', 'arcane', 'projectile', 'orb', 54, .14, 'medium'),
  light: spell('light', 'magic', 'light', 'projectile', 'spark', 54, .14, 'medium'),
  water: spell('water', 'magic', 'water', 'projectile', 'wave', 56, .15, 'medium', 'water'),
  wind: spell('wind', 'magic', 'wind', 'projectile', 'gust', 48, .12, 'medium', 'wind'),
  lightning: spell('lightning', 'chaos', 'lightning', 'bolt', 'spark', 66, .2, 'heavy'),
  chaos: spell('chaos', 'chaos', 'chaos', 'projectile', 'vortex', 70, .2, 'heavy'),
  dragon_fire: spell('dragon_fire', 'chaos', 'fire', 'breath', 'breath', 110, .45, 'ultimate', 'breath'),
  dragon_ice: spell('dragon_ice', 'magic', 'ice', 'breath', 'breath', 105, .42, 'ultimate', 'breath'),
};

// Mapa explícito carta → perfil: a arte de cada personagem define a arma e o elemento do golpe.
const PROFILE_BY_CARD: Record<string, string> = {
  orc_warrior: 'sword', iron_knight: 'sword', berserker: 'axe', stone_golem: 'hammer', elven_archer: 'arrow', goblin_hunter: 'arrow', forest_scout: 'arrow',
  arcane_mage: 'fireball', elder_druid: 'nature', necromancer: 'shadow', shadow_wraith: 'shadow', wandering_demon: 'chaos', glacier_guardian: 'hammer',
  tundra_duelist: 'katana', icebreaker: 'axe', sacrifice_knight: 'spear', ice_scout: 'arrow_ice', aurora_sniper: 'arrow_light', moss_hunter: 'arrow_poison',
  frost_sage: 'ice', mirror_mage: 'arcane', healing_seer: 'light', frost_witch: 'ice', storm_imp: 'lightning',
  enemy_goblin_warrior: 'sword', enemy_goblin_archer: 'arrow', enemy_wolf: 'bite', enemy_ent: 'hammer', enemy_orc: 'sword', enemy_troll: 'hammer',
  enemy_stone_golem: 'hammer', enemy_iron_colossus: 'hammer', enemy_sand_scorpion: 'claw', enemy_mummy: 'shadow', enemy_sand_elemental: 'arcane',
  enemy_skeleton: 'sword', enemy_zombie: 'claw', enemy_swamp_witch: 'poison', enemy_undead_king: 'shadow', enemy_ice_elemental: 'ice', enemy_yeti: 'claw',
  enemy_ice_dragon: 'dragon_ice', enemy_salamander: 'fireball', enemy_fire_elemental: 'fireball', enemy_demon: 'chaos', enemy_volcanic_dragon: 'dragon_fire',
  enemy_arcane_construct: 'arcane', enemy_rune_guardian: 'arcane', enemy_void_guardian: 'chaos',
};
const FALLBACK_BY_TYPE: Record<string, string> = { melee: 'sword', ranged: 'arrow', magic: 'arcane', chaos: 'chaos' };

export function attackProfileFor(event: Pick<CombatVisualEvent, 'sourceModelId'|'attackType'|'abilityId'>): AttackFXProfile {
  const byCard = PROFILE_BY_CARD[event.sourceModelId ?? ''];
  if (byCard) return ATTACK_FX_PROFILES[byCard];
  const card = event.sourceModelId ? CARD_MAP.get(event.sourceModelId) : undefined;
  const type = event.attackType ?? (card?.category === 'monster' ? card.attacks[0].type : 'melee');
  const id = (event.sourceModelId ?? '').toLowerCase();
  if (type === 'melee' && /lance|spear/.test(id)) return ATTACK_FX_PROFILES.spear;
  if (type === 'melee' && /hammer|golem|giant|titan|bear|crab/.test(id)) return ATTACK_FX_PROFILES.hammer;
  if (type === 'melee' && /samurai|katana|duelist/.test(id)) return ATTACK_FX_PROFILES.katana;
  if (type === 'melee' && /claw|spider|scorpion|serpent|wolf|shark|chimera/.test(id)) return ATTACK_FX_PROFILES.claw;
  if (type === 'ranged' && /fire|ember|flame/.test(id)) return ATTACK_FX_PROFILES.arrow_fire;
  if (type === 'ranged' && /ice|frost/.test(id)) return ATTACK_FX_PROFILES.arrow_ice;
  if (type === 'ranged' && /poison|venom|toxic/.test(id)) return ATTACK_FX_PROFILES.arrow_poison;
  if (type === 'magic' && /fire|ember|magma|flame/.test(id)) return ATTACK_FX_PROFILES.fireball;
  if (type === 'magic' && /ice|frost|glacial/.test(id)) return ATTACK_FX_PROFILES.ice;
  if (type === 'magic' && /poison|venom|toxic|swamp/.test(id)) return ATTACK_FX_PROFILES.poison;
  if (type === 'magic' && /shadow|void|lich|undead/.test(id)) return ATTACK_FX_PROFILES.shadow;
  if (type === 'magic' && /storm|lightning|thunder/.test(id)) return ATTACK_FX_PROFILES.lightning;
  if (type === 'magic' && /water|tide|sea/.test(id)) return ATTACK_FX_PROFILES.water;
  if (type === 'magic' && /wind|harpy|owl/.test(id)) return ATTACK_FX_PROFILES.wind;
  if (type === 'magic' && /druid|moss|nature/.test(id)) return ATTACK_FX_PROFILES.nature;
  return ATTACK_FX_PROFILES[FALLBACK_BY_TYPE[type] ?? 'sword'];
}

export function hasCardProfile(cardId: string) { return CARD_MAP.get(cardId)?.category === 'monster'; }
