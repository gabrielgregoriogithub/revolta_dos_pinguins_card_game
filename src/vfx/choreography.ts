import { CARD_MAP } from '../data/cards';
import type { CombatVisualEvent, VisualEventType } from '../types';
import { ATTACK_FX_PROFILES, attackProfileFor, type AttackFXProfile, type FxElement, type FxMotion } from './profiles';

// Coreografia de combate: transforma a fila de eventos do motor em um plano audiovisual por evento.
// Função pura — só lê o que o motor já decidiu (alvo, dano, bloqueio, morte); nunca calcula resultado.
export type HitReaction = 'light' | 'medium' | 'heavy' | 'boss';
export type ShakeScope = 'none' | 'card' | 'row' | 'arena';
export type NumberStyle = FxElement | 'heal' | 'drain' | 'absorbed' | 'blocked' | 'miss' | 'thorns' | 'reflect';
export type StatusFx = 'freeze' | 'stun' | 'poison' | 'barrier' | 'buff' | 'cleanse';
export interface FxLink { fromId: string; toId: string; kind: 'reflect' | 'thorns' | 'drain'; }
export interface SoundCue { id: string; atMs: number; }
export interface FxPlan {
  profileId: string; element: FxElement; motion: FxMotion; boss: boolean;
  durationMs: number; windupMs: number; travelMs: number; impactDelayMs: number; hitStopMs: number;
  reaction?: HitReaction; shake: ShakeScope; numberStyle?: NumberStyle;
  strike: number; slashAngle: number; pierce: boolean; armorBreak: boolean;
  link?: FxLink; deathStyle?: FxElement; statusFx?: StatusFx; sounds: SoundCue[];
}

const WINDUP_MS: Record<FxMotion, number> = { slash: 240, heavy: 360, quick: 170, thrust: 220, smash: 380, claw: 200, bite: 220, fist: 160, projectile: 300, bolt: 260, breath: 420 };
const TRAVEL_MS: Record<FxMotion, number> = { slash: 170, heavy: 190, quick: 130, thrust: 150, smash: 200, claw: 150, bite: 160, fist: 140, projectile: 300, bolt: 170, breath: 420 };
const MAGIC_TRAVEL_MS = 380;
const BOSS_WINDUP_BONUS_MS = 260;
const FOLLOW_UP_WINDUP = .6;
const HIT_STOP_MS: Record<HitReaction, number> = { light: 38, medium: 58, heavy: 85, boss: 115 };
const SHAKE_BY_REACTION: Record<HitReaction, ShakeScope> = { light: 'card', medium: 'card', heavy: 'row', boss: 'arena' };
const REACTION_MS = 380; const NUMBER_TAIL_MS = 260;
const LINK_TRAVEL_MS: Record<FxLink['kind'], number> = { reflect: 320, thorns: 220, drain: 420 };
const BASE_MS: Record<VisualEventType, number> = { ATTACK: 600, DAMAGE: 760, BLOCK: 760, MISS: 680, HEAL: 700, STATUS: 680, DEATH: 960, SUMMON: 900, EQUIP: 760, EFFECT: 900, FORMATION: 600, START: 900, END: 450 };
const SLASH_ANGLES = [-32, 28, -8];
const HEAVY_MOTIONS: FxMotion[] = ['heavy', 'smash'];
const SPELL_ELEMENT: Record<string, FxElement> = { fireball: 'fire', crystal_burst: 'ice', water_burst: 'water', wind_burst: 'wind' };
const DAMAGE_ELEMENT: Record<string, FxElement> = { poison: 'poison', thorns: 'nature', reflected: 'arcane' };

const isHit = (e: CombatVisualEvent | undefined) => e?.type === 'DAMAGE' || e?.type === 'BLOCK';
const isBoss = (modelId?: string) => { const card = modelId ? CARD_MAP.get(modelId) : undefined; return card?.category === 'monster' && card.rarity === 'legendary' && card.ownership === 'enemy'; };
const hasAbility = (modelId: string | undefined, id: string) => { const card = modelId ? CARD_MAP.get(modelId) : undefined; return card?.category === 'monster' && card.abilities.some(a => a.id === id); };

function reactionFor(amount: number, boss: boolean, motion: FxMotion): HitReaction {
  if (boss) return 'boss';
  const level: HitReaction = amount >= 6 ? 'heavy' : amount >= 3 ? 'medium' : 'light';
  if (!HEAVY_MOTIONS.includes(motion)) return level;
  return level === 'light' ? 'medium' : 'heavy';
}

// O elemento de um dano vem do golpe que o originou: perfil do atacante, tipo especial (veneno, espinhos, reflexo) ou carta Flash.
function damageElement(events: CombatVisualEvent[], index: number, profile: AttackFXProfile | null): FxElement {
  const event = events[index];
  if (event.attackType && DAMAGE_ELEMENT[event.attackType]) return DAMAGE_ELEMENT[event.attackType];
  if (profile) return profile.element;
  const spell = events.slice(index + 1, index + 4).find(e => e.type === 'EFFECT');
  return SPELL_ELEMENT[spell?.cardId ?? ''] ?? (event.attackType === 'magic' ? 'arcane' : 'physical');
}

function strikeNumber(events: CombatVisualEvent[], index: number) {
  let strike = 1;
  for (let i = index - 1; i >= 0 && events[i].type !== 'START' && events[i].type !== 'END'; i--) if (events[i].type === 'ATTACK' && events[i].sourceCardInstanceId === events[index].sourceCardInstanceId) strike++;
  return strike;
}

function attackPlan(events: CombatVisualEvent[], index: number, base: FxPlan): FxPlan {
  const event = events[index]; const profile = attackProfileFor(event); const boss = isBoss(event.sourceModelId);
  const strike = strikeNumber(events, index);
  const windupMs = Math.round(WINDUP_MS[profile.motion] * (strike > 1 ? FOLLOW_UP_WINDUP : 1) + (boss ? BOSS_WINDUP_BONUS_MS : 0));
  const travelMs = profile.motion === 'projectile' && profile.attackType !== 'ranged' ? MAGIC_TRAVEL_MS : TRAVEL_MS[profile.motion];
  return { ...base, profileId: profile.id, element: profile.element, motion: profile.motion, boss, windupMs, travelMs, durationMs: windupMs + travelMs, strike,
    slashAngle: SLASH_ANGLES[(event.sequence + strike) % SLASH_ANGLES.length] * (strike % 2 === 0 ? -1 : 1),
    pierce: hasAbility(event.sourceModelId, 'piercing'), armorBreak: hasAbility(event.sourceModelId, 'armorBreak'),
    sounds: [{ id: boss ? 'boss-roar' : profile.windupSound, atMs: 0 }, { id: profile.releaseSound, atMs: windupMs }] };
}

function linkFor(events: CombatVisualEvent[], index: number): FxLink | undefined {
  const event = events[index]; const previous = events[index - 1]; const target = event.targetCardInstanceId;
  if (!target) return undefined;
  if (event.type === 'DAMAGE' && event.attackType === 'reflected' && event.sourceCardInstanceId) return { fromId: event.sourceCardInstanceId, toId: target, kind: 'reflect' };
  if (event.type === 'DAMAGE' && event.attackType === 'thorns' && isHit(previous) && previous.targetCardInstanceId) return { fromId: previous.targetCardInstanceId, toId: target, kind: 'thorns' };
  if (event.type === 'HEAL' && event.engineEvent.message.startsWith('Roubo de vida') && isHit(previous) && previous.targetCardInstanceId) return { fromId: previous.targetCardInstanceId, toId: target, kind: 'drain' };
  return undefined;
}

function hitPlan(events: CombatVisualEvent[], index: number, base: FxPlan): FxPlan {
  const event = events[index]; const attack = [...events.slice(0, index)].reverse().find(e => e.type === 'ATTACK');
  const fromAttack = !!event.sourceCardInstanceId && attack?.sourceCardInstanceId === event.sourceCardInstanceId && !['thorns', 'reflected'].includes(event.attackType ?? '');
  const profile = fromAttack ? attackProfileFor(attack!) : null;
  const element = damageElement(events, index, profile); const boss = fromAttack && isBoss(attack!.sourceModelId);
  const link = linkFor(events, index); const impactDelayMs = link ? LINK_TRAVEL_MS[link.kind] : 0;
  const amount = event.damage ?? 0;
  const numberStyle: NumberStyle = event.type === 'BLOCK' && amount === 0 ? 'absorbed' : amount === 0 ? 'blocked' : event.attackType === 'thorns' ? 'thorns' : event.attackType === 'reflected' ? 'reflect' : element;
  const reaction = amount === 0 ? 'light' : reactionFor(amount, boss, profile?.motion ?? 'projectile');
  const hitStopMs = HIT_STOP_MS[reaction];
  const impactSound = amount === 0 ? (event.type === 'BLOCK' ? 'absorb-shield' : 'block-metal') : profile?.impactSound ?? `${element}-hit`;
  const sounds: SoundCue[] = [...(link ? [{ id: `${link.kind}-launch`, atMs: 0 }] : []), { id: impactSound, atMs: impactDelayMs }, ...(event.type === 'BLOCK' && amount > 0 ? [{ id: 'absorb-shield', atMs: impactDelayMs + 40 }] : []), ...(reaction === 'heavy' || reaction === 'boss' ? [{ id: 'heavy-thud', atMs: impactDelayMs + 20 }] : [])];
  return { ...base, profileId: profile?.id ?? base.profileId, element, motion: profile?.motion ?? base.motion, boss, link, impactDelayMs, hitStopMs, reaction, numberStyle,
    shake: amount === 0 ? 'card' : SHAKE_BY_REACTION[reaction], pierce: !!profile && hasAbility(attack?.sourceModelId, 'piercing'), armorBreak: !!profile && hasAbility(attack?.sourceModelId, 'armorBreak'),
    durationMs: impactDelayMs + hitStopMs + REACTION_MS + NUMBER_TAIL_MS, sounds };
}

function deathStyle(events: CombatVisualEvent[], plans: FxPlan[], index: number): FxElement {
  const target = events[index].targetCardInstanceId;
  for (let i = index - 1; i >= 0; i--) if (isHit(events[i]) && events[i].targetCardInstanceId === target) return plans[i].element;
  return 'physical';
}

function statusPlan(events: CombatVisualEvent[], index: number, base: FxPlan): FxPlan {
  const event = events[index]; const attack = [...events.slice(0, index)].reverse().find(e => e.type === 'ATTACK');
  const element = attack ? attackProfileFor(attack).element : base.element;
  const statusFx: StatusFx | undefined = event.abilityId === 'stun' ? (element === 'ice' ? 'freeze' : 'stun') : event.abilityId === 'poison' ? 'poison' : event.abilityId === 'barrier' ? 'barrier' : event.abilityId === 'attackBuff' ? 'buff' : event.abilityId === 'cleanse' ? 'cleanse' : undefined;
  const sound: Record<StatusFx, string> = { freeze: 'freeze', stun: 'stun', poison: 'poison-bubble', barrier: 'absorb-shield', buff: 'buff', cleanse: 'heal' };
  return { ...base, element, statusFx, sounds: statusFx ? [{ id: sound[statusFx], atMs: 0 }] : [] };
}

const SIMPLE_SOUND: Partial<Record<VisualEventType, string>> = { MISS: 'miss', SUMMON: 'summon', EQUIP: 'equip' };

export function planCombatFx(events: CombatVisualEvent[]): FxPlan[] {
  const plans: FxPlan[] = [];
  events.forEach((event, index) => {
    const base: FxPlan = { profileId: ATTACK_FX_PROFILES.sword.id, element: 'physical', motion: 'slash', boss: false, durationMs: BASE_MS[event.type], windupMs: 0, travelMs: 0, impactDelayMs: 0, hitStopMs: 0, shake: 'none', strike: 1, slashAngle: 0, pierce: false, armorBreak: false, sounds: SIMPLE_SOUND[event.type] ? [{ id: SIMPLE_SOUND[event.type]!, atMs: 0 }] : [] };
    let plan = base;
    if (event.type === 'ATTACK') plan = attackPlan(events, index, base);
    else if (isHit(event)) plan = hitPlan(events, index, base);
    else if (event.type === 'MISS') plan = { ...base, numberStyle: 'miss' };
    else if (event.type === 'HEAL') { const link = linkFor(events, index); const impactDelayMs = link ? LINK_TRAVEL_MS[link.kind] : 0; plan = { ...base, link, impactDelayMs, element: link ? 'shadow' : 'nature', numberStyle: link ? 'drain' : 'heal', durationMs: BASE_MS.HEAL + impactDelayMs, sounds: [...(link ? [{ id: 'drain-launch', atMs: 0 }] : []), { id: 'heal', atMs: impactDelayMs }] }; }
    else if (event.type === 'STATUS') plan = statusPlan(events, index, base);
    // A morte herda o elemento do golpe final, já planejado acima nesta mesma fila.
    else if (event.type === 'DEATH') { const style = deathStyle(events, plans, index); plan = { ...base, element: style, deathStyle: style, sounds: [{ id: `death-${style}`, atMs: 0 }] }; }
    plans.push(plan);
  });
  return plans;
}
