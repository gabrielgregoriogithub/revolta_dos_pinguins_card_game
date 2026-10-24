import { useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react';
import { getCard } from '../data/cards';
import type { CombatVisualEvent, PlayerState, VisualEventType } from '../types';
import CardView from './CardView';

export type PlaybackSpeed = 'normal' | 'fast' | 'off';

// Slow enough to follow who attacked whom; "fast" halves it.
const EVENT_MS: Record<VisualEventType, number> = { ATTACK: 1900, DAMAGE: 1600, BLOCK: 1600, MISS: 1500, HEAL: 1500, STATUS: 1600, DEATH: 1700, SUMMON: 1600, EQUIP: 1500, EFFECT: 1400, FORMATION: 800, START: 1200, END: 700 };
export const eventDuration = (event: CombatVisualEvent, speed: PlaybackSpeed) => speed === 'off' ? 0 : EVENT_MS[event.type] * (speed === 'fast' ? .5 : 1);

type Popup = { value: string; label: string; tone: string };
const STATUS_POPUP: Record<string, (v: number) => Popup> = {
  poison: v => ({ value: `☠️ +${v}`, label: 'Veneno', tone: 'status' }),
  stun: () => ({ value: '💫', label: 'Atordoado', tone: 'status' }),
  barrier: v => ({ value: `🛡️ +${v}`, label: 'Barreira', tone: 'block' }),
  attackBuff: v => ({ value: `🔥 +${v}`, label: 'Ataque', tone: 'buff' }),
  cleanse: () => ({ value: '✨', label: 'Purificado', tone: 'heal' }),
};
const DAMAGE_LABEL: Record<string, string> = { magic: 'Dano mágico', chaos: 'Dano caótico', poison: 'Veneno', thorns: 'Espinhos', reflected: 'Reflexo', ranged: 'Flechada', melee: 'Golpe' };

export function popupFor(event: CombatVisualEvent | undefined, id: string): Popup | null {
  if (!event || event.targetCardInstanceId !== id) return null;
  if (event.type === 'DAMAGE') return { value: `-${event.damage ?? 0}`, label: DAMAGE_LABEL[event.attackType ?? ''] ?? 'Dano', tone: 'damage' };
  if (event.type === 'BLOCK') return { value: event.damage ? `-${event.damage}` : '🛡️', label: `${event.blocked ?? 0} bloqueado`, tone: 'block' };
  if (event.type === 'MISS') return { value: 'Esquivou!', label: 'Sem dano', tone: 'miss' };
  if (event.type === 'HEAL') return { value: `+${event.healing ?? 0}`, label: 'Vida', tone: 'heal' };
  if (event.type === 'STATUS') return STATUS_POPUP[event.abilityId ?? '']?.(event.value ?? 1) ?? null;
  if (event.type === 'DEATH') return { value: '💀', label: 'Derrotado', tone: 'death' };
  if (event.type === 'SUMMON') return { value: 'Invocado!', label: `Posição ${event.engineEvent.data?.position ?? ''}`, tone: 'summon' };
  if (event.type === 'EQUIP' && event.cardId) return { value: getCard(event.cardId).art.fallbackIcon, label: getCard(event.cardId).name, tone: 'buff' };
  return null;
}

function roleFor(event: CombatVisualEvent | undefined, id: string) {
  if (!event) return '';
  if (event.type === 'SUMMON' && event.targetCardInstanceId === id) return 'fx-enter';
  if (event.type === 'ATTACK') return event.sourceCardInstanceId === id ? `fx-attacker fx-${event.attackType}` : event.targetCardInstanceId === id ? 'fx-targeted' : '';
  if (event.targetCardInstanceId !== id) return '';
  return `fx-hit-${event.type.toLowerCase()}`;
}

type RowProps = { player: PlayerState; enemy?: boolean; event?: CombatVisualEvent; selectedId?: string | null; onSelect?: (id: string | null) => void };
export function FormationRow({ player, enemy = false, event, selectedId, onSelect }: RowProps) {
  return <div className={`formation ${enemy ? 'enemy' : 'own'}`}>{[0, 1, 2].map(i => {
    const unit = player.battlefield[i];
    if (!unit) return <div className="slot empty" data-pos={i + 1} key={`empty-${i}`}><span>+</span><small>{i + 1}ª posição</small></div>;
    const role = roleFor(event, unit.instanceId);
    const popup = popupFor(event, unit.instanceId);
    // Re-keying on each event the card takes part in restarts its CSS animation.
    return <div className={`slot ${role}`} data-pos={i + 1} data-slot={unit.instanceId} key={`${unit.instanceId}-${role ? event?.id : 'idle'}`}>
      <CardView card={getCard(unit.modelId)} unit={unit} selected={selectedId === unit.instanceId} onClick={onSelect ? () => onSelect(unit.instanceId) : undefined} />
      {popup && <div className={`fx-popup ${popup.tone}`}><b>{popup.value}</b><small>{popup.label}</small></div>}
    </div>;
  })}</div>;
}

type Geometry = { x1: number; y1: number; x2: number; y2: number };
// Draws the projectile/slash between attacker and target, measured from the rendered cards.
export function AttackFx({ event, arenaRef }: { event?: CombatVisualEvent; arenaRef: RefObject<HTMLElement | null> }) {
  const [geo, setGeo] = useState<Geometry | null>(null);
  useLayoutEffect(() => {
    const root = arenaRef.current;
    const source = event?.type === 'ATTACK' ? root?.querySelector<HTMLElement>(`[data-slot="${event.sourceCardInstanceId}"]`) : null;
    const target = event?.type === 'ATTACK' ? root?.querySelector<HTMLElement>(`[data-slot="${event.targetCardInstanceId}"]`) : null;
    if (!root || !source || !target) { setGeo(null); return; }
    // The battle stage is CSS-scaled: convert screen pixels back to the arena's own coordinates.
    const r = root.getBoundingClientRect(); const a = source.getBoundingClientRect(); const b = target.getBoundingClientRect();
    const scale = r.width / root.offsetWidth || 1; const slotScale = a.width / source.offsetWidth || 1;
    const next = { x1: (a.left + a.width / 2 - r.left) / scale, y1: (a.top + a.height / 2 - r.top) / scale, x2: (b.left + b.width / 2 - r.left) / scale, y2: (b.top + b.height / 2 - r.top) / scale };
    source.style.setProperty('--dx', `${(b.left + b.width / 2 - a.left - a.width / 2) * .6 / slotScale}px`);
    source.style.setProperty('--dy', `${(b.top + b.height / 2 - a.top - a.height / 2) * .6 / slotScale}px`);
    setGeo(next);
  }, [event, arenaRef]);
  if (!event || event.type !== 'ATTACK' || !geo) return null;
  const dx = geo.x2 - geo.x1; const dy = geo.y2 - geo.y1; const len = Math.hypot(dx, dy) || 1;
  const vars = { '--x1': `${geo.x1}px`, '--y1': `${geo.y1}px`, '--x2': `${geo.x2}px`, '--y2': `${geo.y2}px`, '--dx': `${dx}px`, '--dy': `${dy}px`, '--px': `${-dy / len * 70}px`, '--py': `${dx / len * 70}px`, '--angle': `${Math.atan2(dy, dx)}rad` } as CSSProperties;
  const kind = event.attackType ?? 'melee';
  return <div className={`attack-fx fx-${kind}`} style={vars} key={event.id} aria-hidden="true">
    <svg className="aim-line"><line x1={geo.x1} y1={geo.y1} x2={geo.x2} y2={geo.y2} /></svg>
    {kind !== 'melee' && <span className="projectile"><i /></span>}
    <span className="impact"><i /><i /><i /></span>
  </div>;
}
