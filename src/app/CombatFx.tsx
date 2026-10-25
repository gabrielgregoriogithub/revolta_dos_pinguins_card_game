import { useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react';
import { getCard } from '../data/cards';
import type { CombatVisualEvent } from '../types';
import type { FxPlan } from '../vfx/choreography';
import { PARTICLES_BY_QUALITY, type FxQuality } from '../vfx/quality';

export type PlaybackSpeed = 'normal' | 'fast' | 'off';
export const SPEED_FACTOR: Record<PlaybackSpeed, number> = { normal: 1, fast: .5, off: 0 };
const FALLBACK_MS = 700;
export const eventDuration = (event: CombatVisualEvent, speed: PlaybackSpeed) => Math.round((event.fx?.durationMs ?? FALLBACK_MS) * SPEED_FACTOR[speed]);

const MELEE_MOTIONS = ['slash', 'heavy', 'quick', 'thrust', 'smash', 'claw', 'bite', 'fist'];
export const isMelee = (plan?: FxPlan) => !!plan && MELEE_MOTIONS.includes(plan.motion);

// Variáveis de tempo compartilhadas por golpe, impacto, reação e número (escaladas pela velocidade da reprodução).
export function fxTimingVars(plan: FxPlan | undefined, speed: PlaybackSpeed): CSSProperties {
  const f = SPEED_FACTOR[speed] || 1; const ms = (v = 0) => `${Math.round(v * f)}ms`;
  return { '--windup-ms': ms(plan?.windupMs), '--travel-ms': ms(plan?.travelMs), '--impact-delay': ms(plan?.impactDelayMs), '--hitstop': ms(plan?.hitStopMs), '--slash-angle': `${plan?.slashAngle ?? 0}deg` } as CSSProperties;
}

// Partículas determinísticas (mesma semente → mesmo desenho), espalhadas em leque ao redor do impacto.
export function particleSpecs(count: number, seed: number) {
  return Array.from({ length: count }, (_, i) => {
    const r = Math.abs(Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453) % 1;
    return { angle: Math.round(i * (360 / count) + r * 24 - 12), distance: Math.round(38 + r * 46), size: Math.round(4 + r * 6), delay: Math.round(r * 90) };
  });
}
function Particles({ count, seed, className = 'fx-particles' }: { count: number; seed: number; className?: string }) {
  if (!count) return null;
  return <span className={className} aria-hidden="true">{particleSpecs(count, seed).map((p, i) => <i key={i} style={{ '--a': `${p.angle}deg`, '--d': `${p.distance}px`, '--s': `${p.size}px`, '--pd': `${p.delay}ms` } as CSSProperties} />)}</span>;
}

type Popup = { value: string; label: string; tone: string };
const STATUS_POPUP: Record<string, (v: number) => Popup> = {
  poison: v => ({ value: `☠️ +${v}`, label: 'Veneno', tone: 'status poison' }),
  stun: () => ({ value: '💫', label: 'Atordoado', tone: 'status' }),
  barrier: v => ({ value: `🛡️ +${v}`, label: 'Barreira', tone: 'absorbed' }),
  attackBuff: v => ({ value: `🔥 +${v}`, label: 'Ataque', tone: 'buff' }),
  cleanse: () => ({ value: '✨', label: 'Purificado', tone: 'heal' }),
};
const NUMBER_LABEL: Record<string, string> = { physical: 'Golpe', fire: 'Fogo', ice: 'Gelo', lightning: 'Raio', poison: 'Veneno', shadow: 'Sombra', nature: 'Natureza', light: 'Luz', arcane: 'Arcano', chaos: 'Caos', thorns: 'Espinhos · contra-ataque', reflect: 'Reflexo', drain: 'Roubo de vida', heal: 'Cura' };

export function popupFor(event: CombatVisualEvent | undefined, id: string): Popup | null {
  if (!event || event.targetCardInstanceId !== id) return null;
  const style = event.fx?.numberStyle;
  if (event.type === 'DAMAGE' || event.type === 'BLOCK') {
    const amount = event.damage ?? 0;
    if (style === 'absorbed') return { value: `🛡 ${event.blocked ?? 0}`, label: 'Absorvido', tone: 'absorbed' };
    if (style === 'blocked') return { value: '0', label: 'Bloqueado', tone: 'blocked' };
    const absorbed = event.type === 'BLOCK' && event.blocked ? ` · ${event.blocked} absorvido` : '';
    return { value: `-${amount}`, label: `${NUMBER_LABEL[style ?? 'physical'] ?? 'Dano'}${absorbed}`, tone: `damage num-${style ?? 'physical'} react-${event.fx?.reaction ?? 'light'}` };
  }
  if (event.type === 'MISS') return { value: 'ESQUIVA', label: 'Sem dano', tone: 'miss' };
  if (event.type === 'HEAL') return { value: `+${event.healing ?? 0}`, label: NUMBER_LABEL[style ?? 'heal'], tone: style === 'drain' ? 'drain' : 'heal' };
  if (event.type === 'STATUS') return STATUS_POPUP[event.abilityId ?? '']?.(event.value ?? 1) ?? null;
  if (event.type === 'DEATH') return { value: '💀', label: 'Derrotado', tone: 'death' };
  if (event.type === 'SUMMON') return { value: 'Invocado!', label: `Posição ${event.engineEvent.data?.position ?? ''}`, tone: 'summon' };
  if (event.type === 'EQUIP' && event.cardId) return { value: getCard(event.cardId).art.fallbackIcon, label: getCard(event.cardId).name, tone: 'buff' };
  return null;
}

// Classes do slot: quem ataca, quem é atingido e com qual intensidade, elemento e consequência.
export function slotRole(event: CombatVisualEvent | undefined, id: string) {
  if (!event) return '';
  const fx = event.fx;
  if (event.type === 'SUMMON' && event.targetCardInstanceId === id) return 'fx-enter';
  if (event.type === 'ATTACK') return event.sourceCardInstanceId === id ? `fx-attacker fx-${event.attackType} motion-${fx?.motion ?? 'slash'} el-${fx?.element ?? 'physical'}${fx?.boss ? ' fx-boss' : ''}${(fx?.strike ?? 1) > 1 ? ' fx-strike-2' : ''}` : event.targetCardInstanceId === id ? 'fx-targeted' : '';
  if (event.targetCardInstanceId !== id) return fx?.link?.fromId === id ? `fx-link-source link-${fx.link.kind}` : '';
  if (event.type === 'DAMAGE' || event.type === 'BLOCK') return `fx-hit fx-hit-${event.type.toLowerCase()} react-${fx?.reaction ?? 'light'} el-${fx?.element ?? 'physical'} num-${fx?.numberStyle ?? 'physical'}`;
  if (event.type === 'DEATH') return `fx-hit-death fx-death el-${fx?.deathStyle ?? 'physical'}`;
  if (event.type === 'STATUS') return `fx-hit-status st-${fx?.statusFx ?? 'generic'}`;
  return `fx-hit-${event.type.toLowerCase()}`;
}

const SWIPE_PARTS: Record<string, number> = { slash: 1, heavy: 1, quick: 2, thrust: 1, smash: 1, claw: 3, bite: 2, fist: 1 };
// Sobreposição dentro do slot da carta: impacto, cura, status, esquiva e destruição.
export function SlotFx({ event, unitId, quality }: { event?: CombatVisualEvent; unitId: string; quality: FxQuality }) {
  const fx = event?.fx; if (!event || !fx) return null;
  const particles = PARTICLES_BY_QUALITY[quality]; const seed = event.sequence;
  if (event.targetCardInstanceId !== unitId) return null;
  if (event.type === 'DAMAGE' || event.type === 'BLOCK') {
    const guarded = fx.numberStyle === 'absorbed' || fx.numberStyle === 'blocked';
    return <div className={`impact-fx el-${fx.element} react-${fx.reaction ?? 'light'} motion-${fx.motion}${guarded ? ' guarded' : ''}${fx.pierce ? ' pierce' : ''}${fx.armorBreak ? ' shatter' : ''}`} aria-hidden="true">
      <span className="impact-core" /><span className="impact-ring" />{quality !== 'low' && <span className="impact-rays"><i /><i /><i /><i /></span>}
      {(guarded || fx.pierce || fx.armorBreak) && <span className="impact-shield"><b /><b /><b /></span>}
      {!guarded && <Particles count={fx.reaction === 'heavy' || fx.reaction === 'boss' ? particles : Math.ceil(particles * .6)} seed={seed} />}
    </div>;
  }
  if (event.type === 'HEAL') return <div className={`heal-fx ${fx.numberStyle === 'drain' ? 'drain' : ''}`} aria-hidden="true"><Particles count={Math.ceil(particles * .7)} seed={seed} className="fx-particles rising" /></div>;
  if (event.type === 'STATUS' && fx.statusFx) return <div className={`status-fx st-${fx.statusFx}`} aria-hidden="true"><Particles count={Math.ceil(particles * .6)} seed={seed} className="fx-particles rising" />{fx.statusFx === 'freeze' && <span className="frost-layer" />}</div>;
  if (event.type === 'DEATH') return <div className={`death-fx el-${fx.deathStyle ?? 'physical'}`} aria-hidden="true">{fx.deathStyle === 'physical' && <svg className="death-cracks" viewBox="0 0 100 150"><path d="M50 0 44 38 58 60 40 92 54 150M44 38 20 52M58 60 84 70M40 92 16 112" /></svg>}<Particles count={particles + 4} seed={seed} className="fx-particles death" /></div>;
  if (event.type === 'MISS') return <div className="miss-fx" aria-hidden="true"><i /><i /></div>;
  return null;
}

type Geometry = { x1: number; y1: number; x2: number; y2: number };
// Trajetória entre duas cartas no palco (projétil, feixe, sopro ou energia de reflexão/espinhos/dreno), medida das cartas renderizadas.
export function AttackFx({ event, arenaRef, quality = 'high', speed = 'normal' }: { event?: CombatVisualEvent; arenaRef: RefObject<HTMLElement | null>; quality?: FxQuality; speed?: PlaybackSpeed }) {
  const [geo, setGeo] = useState<Geometry | null>(null);
  const link = event?.fx?.link;
  const fromId = event?.type === 'ATTACK' ? event.sourceCardInstanceId : link?.fromId;
  const toId = event?.type === 'ATTACK' ? event.targetCardInstanceId : link?.toId;
  useLayoutEffect(() => {
    const root = arenaRef.current;
    const source = fromId ? root?.querySelector<HTMLElement>(`[data-slot="${fromId}"]`) : null;
    const target = toId ? root?.querySelector<HTMLElement>(`[data-slot="${toId}"]`) : null;
    if (!root || !source || !target) { setGeo(null); return; }
    // O palco é escalado por CSS: converte pixels de tela de volta às coordenadas da arena.
    const r = root.getBoundingClientRect(); const a = source.getBoundingClientRect(); const b = target.getBoundingClientRect();
    const scale = r.width / root.offsetWidth || 1; const slotScale = a.width / source.offsetWidth || 1;
    source.style.setProperty('--dx', `${(b.left + b.width / 2 - a.left - a.width / 2) * .6 / slotScale}px`);
    source.style.setProperty('--dy', `${(b.top + b.height / 2 - a.top - a.height / 2) * .6 / slotScale}px`);
    setGeo({ x1: (a.left + a.width / 2 - r.left) / scale, y1: (a.top + a.height / 2 - r.top) / scale, x2: (b.left + b.width / 2 - r.left) / scale, y2: (b.top + b.height / 2 - r.top) / scale });
  }, [event, arenaRef, fromId, toId]);
  if (!event || !geo || !event.fx || (event.type !== 'ATTACK' && !link)) return null;
  const fx = event.fx; const dx = geo.x2 - geo.x1; const dy = geo.y2 - geo.y1; const len = Math.hypot(dx, dy) || 1;
  const vars = { '--x1': `${geo.x1}px`, '--y1': `${geo.y1}px`, '--x2': `${geo.x2}px`, '--y2': `${geo.y2}px`, '--dx': `${dx}px`, '--dy': `${dy}px`, '--len': `${len}px`, '--px': `${-dy / len * 70}px`, '--py': `${dx / len * 70}px`, '--angle': `${Math.atan2(dy, dx)}rad`, ...fxTimingVars(fx, speed) } as CSSProperties;
  if (link) return <div className={`attack-fx link-fx link-${link.kind}`} style={vars} key={event.id} aria-hidden="true">
    <span className="link-trail" />{Array.from({ length: link.kind === 'drain' ? 5 : 1 }, (_, i) => <span className="link-orb" key={i} style={{ '--i': i } as CSSProperties} />)}
  </div>;
  const kind = event.attackType ?? 'melee'; const melee = isMelee(fx);
  return <div className={`attack-fx fx-${kind} motion-${fx.motion} el-${fx.element} fx-profile-${fx.profileId}${fx.boss ? ' is-boss' : ''} q-${quality}`} style={vars} key={event.id} aria-hidden="true">
    <span className="windup"><i /><i /></span>
    {!melee && <svg className="aim-line"><line x1={geo.x1} y1={geo.y1} x2={geo.x2} y2={geo.y2} /></svg>}
    {fx.motion === 'bolt' && <svg className="bolt-path" style={{ left: geo.x1, top: geo.y1 }}><polyline className="glow" points={boltPoints(len, event.sequence)} /><polyline points={boltPoints(len, event.sequence)} /></svg>}
    {fx.motion === 'breath' && <span className="breath-cone"><i /><i /><i /></span>}
    {fx.motion === 'projectile' && <span className={`projectile shape-${projectileShape(fx.profileId)}`}><i /><b /><em /></span>}
    {melee && <span className={`melee-swipe motion-${fx.motion}`}>{Array.from({ length: SWIPE_PARTS[fx.motion] ?? 1 }, (_, i) => <i key={i} />)}</span>}
  </div>;
}

const projectileShape = (profileId: string) => profileId.startsWith('arrow') ? 'arrow' : profileId === 'ice' ? 'shard' : profileId === 'nature' ? 'leaf' : profileId === 'shadow' ? 'skull' : profileId === 'chaos' ? 'vortex' : profileId === 'light' ? 'spark' : 'orb';
// Raio em zigue-zague determinístico ao longo do eixo do ataque (rotacionado por CSS).
function boltPoints(length: number, seed: number) {
  const steps = 7; return Array.from({ length: steps + 1 }, (_, i) => { const jitter = i === 0 || i === steps ? 0 : (Math.abs(Math.sin(seed * 7.1 + i * 3.7)) * 2 - 1) * 16; return `${Math.round(length * i / steps)},${Math.round(jitter)}`; }).join(' ');
}
