import { useLayoutEffect, useRef, type DragEvent, type RefObject } from 'react';
import { getCard } from '../data/cards';
import type { CombatVisualEvent, PlayerState } from '../types';
import { prefersReducedMotion, type FxQuality } from '../vfx/quality';
import CardView from './CardView';
import { fxTimingVars, popupFor, slotRole, SlotFx, SPEED_FACTOR, type PlaybackSpeed } from './CombatFx';

export { AttackFx, eventDuration, type PlaybackSpeed } from './CombatFx';

const ADVANCE_MS = 520;
// Anima o avanço da formação (FLIP): mede a posição anterior de cada unidade e desliza até o novo slot.
function useFormationAdvance(battlefield: PlayerState['battlefield']) {
  const rowRef = useRef<HTMLDivElement>(null);
  const previous = useRef(new Map<string, { index: number; rect: DOMRect }>());
  useLayoutEffect(() => {
    const row = rowRef.current; if (!row) return;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const next = new Map<string, { index: number; rect: DOMRect }>();
    battlefield.forEach((unit, index) => {
      const slot = row.querySelector<HTMLElement>(`[data-slot="${unit.instanceId}"]`); if (!slot) return;
      const rect = slot.getBoundingClientRect(); next.set(unit.instanceId, { index, rect });
      const before = previous.current.get(unit.instanceId);
      if (!before || before.index === index || reduceMotion || !slot.animate) return;
      const scale = rect.width / slot.offsetWidth || 1;
      const dx = (before.rect.left - rect.left) / scale; const dy = (before.rect.top - rect.top) / scale;
      slot.querySelector<HTMLElement>('.unit-stack')?.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }], { duration: ADVANCE_MS, easing: 'cubic-bezier(.25,.9,.3,1.1)' });
    });
    previous.current = next;
  });
  return rowRef;
}

const ROW_SHAKE = [{ transform: 'translate(0, 0)' }, { transform: 'translate(-5px, 2px)' }, { transform: 'translate(4px, -2px)' }, { transform: 'translate(-2px, 1px)' }, { transform: 'translate(0, 0)' }];
// Golpes pesados fazem a fileira atingida tremer no instante do impacto (após o hit stop); leves ficam só na carta.
function useRowShake(rowRef: RefObject<HTMLDivElement | null>, event: CombatVisualEvent | undefined, player: PlayerState, quality: FxQuality, speed: PlaybackSpeed) {
  useLayoutEffect(() => {
    const row = rowRef.current; const fx = event?.fx;
    if (!row?.animate || !fx || fx.shake !== 'row' || quality === 'low' || prefersReducedMotion()) return;
    if (!player.battlefield.some(u => u.instanceId === event.targetCardInstanceId)) return;
    const f = SPEED_FACTOR[speed] || 1;
    row.animate(ROW_SHAKE, { duration: 260 * f, delay: (fx.impactDelayMs + fx.hitStopMs) * f, easing: 'ease-out' });
  }, [event?.id]);
}

type RowProps = { player: PlayerState; enemy?: boolean; event?: CombatVisualEvent; speed?: PlaybackSpeed; quality?: FxQuality; selectedId?: string | null; onSelect?: (id: string | null) => void; onDropCard?: (cardId: string, targetId?: string) => void; onInspectCard?: (cardId: string) => void };
export function FormationRow({ player, enemy = false, event, speed = 'normal', quality = 'high', selectedId, onSelect, onDropCard, onInspectCard }: RowProps) {
  const allowDrop = (dropEvent: DragEvent<HTMLElement>) => { if (onDropCard) dropEvent.preventDefault(); };
  const drop = (dropEvent: DragEvent<HTMLElement>, targetId?: string) => { if (!onDropCard) return; dropEvent.preventDefault(); const cardId = dropEvent.dataTransfer.getData('text/card-id'); if (cardId) onDropCard(cardId, targetId); };
  const rowRef = useFormationAdvance(player.battlefield);
  useRowShake(rowRef, event, player, quality, speed);
  const timing = fxTimingVars(event?.fx, speed);
  return <div ref={rowRef} className={`formation ${enemy ? 'enemy' : 'own'}`} onDragOver={allowDrop} onDrop={dropEvent => drop(dropEvent)}>{[0, 1, 2].map(i => {
    const unit = player.battlefield[i];
    if (!unit) return <div className="slot empty" data-pos={i + 1} key={`empty-${i}`}><span>+</span><small>{i + 1}ª posição</small></div>;
    const role = slotRole(event, unit.instanceId);
    const popup = popupFor(event, unit.instanceId);
    // Re-keying on each event the card takes part in restarts its CSS animation.
    return <div className={`slot ${role}`} style={role ? timing : undefined} data-pos={i + 1} data-slot={unit.instanceId} key={`${unit.instanceId}-${role ? event?.id : 'idle'}`}>
      <div className="unit-stack">{unit.equipmentIds.map((equipmentId, equipmentIndex) => <div className={`equipped-card equipped-card-${equipmentIndex}`} key={equipmentId} role="button" tabIndex={0} aria-label={`Equipamento equipado: ${getCard(equipmentId).name}. Clique para ver detalhes.`} title={`${getCard(equipmentId).name} · equipado`} onClick={() => onInspectCard?.(equipmentId)} onKeyDown={keyEvent => { if (keyEvent.key === 'Enter' || keyEvent.key === ' ') onInspectCard?.(equipmentId); }}><CardView card={getCard(equipmentId)} compact /></div>)}<CardView card={getCard(unit.modelId)} unit={unit} allies={player.battlefield} selected={selectedId === unit.instanceId} onClick={onSelect ? () => onSelect(unit.instanceId) : undefined} onDragOver={allowDrop} onDrop={dropEvent => drop(dropEvent, unit.instanceId)} /></div>
      <SlotFx event={event} unitId={unit.instanceId} quality={quality} />
      {popup && <div className={`fx-popup ${popup.tone}`}><b>{popup.value}</b><small>{popup.label}</small></div>}
    </div>;
  })}</div>;
}
