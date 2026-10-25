import type { CSSProperties, DragEvent } from 'react';
import { getCard } from '../data/cards';
import type { Attack, CardModel, MonsterCard, MonsterInstance } from '../types';
import { ATTACK_LABEL, FACTION_LABEL, RARITY_LABEL } from '../types';
import { CARD_ASSETS } from '../data/assets';
import { artworkLayout } from '../data/artLayout';
import { statusVisual } from '../data/statusVisuals';
import { attackBreakdown, type AttackBreakdown } from '../engine/attack';
import { equipmentCompatibility, equipmentTargetLabel } from '../engine/equipment';
import AttackIcon from './AttackIcon';
import CardArt from './CardArt';
import StatusMarker from './StatusMarker';

export const CARD_ATTACK_ICON: Record<string, string> = { melee: '⚔', ranged: '➶', magic: '✦', chaos: '☄' };
export const ATTACK_ICON = CARD_ATTACK_ICON;
const LONG_NAME = 18;

type Props = {
  card: CardModel; selected?: boolean; onClick?: () => void; compact?: boolean; disabled?: boolean; unit?: MonsterInstance;
  allies?: MonsterInstance[]; equipTarget?: MonsterCard | null; showDiscardValue?: boolean; draggable?: boolean;
  onDragStart?: (event: DragEvent<HTMLButtonElement>) => void; onDragEnd?: () => void;
  onDrop?: (event: DragEvent<HTMLButtonElement>) => void; onDragOver?: (event: DragEvent<HTMLButtonElement>) => void;
};

function AbilityStrip({ card }: { card: CardModel }) {
  const abilities = card.category === 'monster' ? card.abilities : card.category === 'equipment' ? card.effects : [
    { id: card.effect, name: card.name, description: card.description, value: card.value },
  ];
  return abilities.length > 0 ? <div className="card-abilities" aria-label="Habilidades da carta">
    {abilities.slice(0, 4).map(ability => { const visual = statusVisual(ability.id); return <span className="ability-chip" key={ability.id} style={{ '--ability-color': visual.color } as CSSProperties}><StatusMarker id={ability.id} ability={ability} value={ability.duration} /></span>; })}
    {abilities.length > 4 && <span className="ability-more" title={`${abilities.length - 4} habilidades adicionais`}>+{abilities.length - 4}</span>}
  </div> : null;
}

export const signed = (value: number) => value > 0 ? `+${value}` : `−${Math.abs(value)}`;
export const attackTrend = (b: AttackBreakdown) => b.total > b.base ? 'up' : b.total < b.base ? 'down' : 'flat';
export const attackFormula = (b: AttackBreakdown) => [String(b.base), ...b.modifiers.map(m => signed(m.value).replace(/^([+−])/, '$1 '))].join(' ') + ` = ${b.total}`;

function AttackPlaque({ breakdown, compact }: { breakdown: AttackBreakdown; compact: boolean }) {
  const trend = attackTrend(breakdown); const net = breakdown.total - breakdown.base;
  const detail = [`${ATTACK_LABEL[breakdown.type]}: base ${breakdown.base}`, ...breakdown.modifiers.map(m => `${m.label} ${signed(m.value)}`), `Ataque efetivo ${breakdown.total}`].join(' · ');
  return <span className={`attack-plaque trend-${trend}`} title={detail} aria-label={detail}>
    {!compact && breakdown.modifiers.length > 0 && <span className="attack-formula">{attackFormula(breakdown)}</span>}
    <span className="attack-medallion"><AttackIcon type={breakdown.type} /></span>
    <span className="attack-value"><small>ATQ</small><strong>{breakdown.total}</strong></span>
    {trend !== 'flat' && <span className="attack-trend">{trend === 'up' ? '▲' : '▼'}{signed(net)}</span>}
  </span>;
}

// Moldura universal full-art: cabeçalho em grid, arte em largura total, habilidades sobre a borda e atributos no rodapé.
export default function CardView({ card, selected, onClick, compact = false, disabled = false, unit, allies, equipTarget = null, showDiscardValue = false, draggable = false, onDragStart, onDragEnd, onDrop, onDragOver }: Props) {
  const asset = CARD_ASSETS[card.id];
  const targetCompatibility = card.category === 'equipment' && equipTarget ? equipmentCompatibility(card, equipTarget) : null;
  const monster = card.category === 'monster' ? card : null;
  const attack = monster?.attacks[0];
  const canAttack = !unit || !monster || !attack ? true : !unit.stunned && (attack.type === 'magic' || attack.type === 'chaos' || (attack.type === 'melee' ? unit.position === 1 : unit.position !== 1) || monster.abilities.some(a => a.id === 'reach'));
  const breakdowns = monster ? monster.attacks.map((a: Attack) => unit ? attackBreakdown(unit, a, allies ?? [unit]) : { type: a.type, base: a.damage, modifiers: [], total: a.damage }) : [];
  const hp = unit ? unit.hp : monster?.maxHp ?? 0;
  const layout = artworkLayout(card.id);
  const artStyle = { '--art-image': asset?.status === 'ready' ? `url("${asset.illustration}")` : 'none', '--art-scale': layout.scale, '--art-x': `${layout.offsetX}%`, '--art-y': `${layout.offsetY}%`, '--art-position': layout.objectPosition } as CSSProperties;
  const className = ['card', compact ? 'compact' : '', selected ? 'selected' : '', unit ? 'on-field' : '', unit && !canAttack ? 'idle' : '', unit && !unit.alive ? 'defeated' : ''].filter(Boolean).join(' ');
  return <button title={`${card.name}: ${card.description}`} data-faction={card.faction} data-rarity={card.rarity} data-category={card.category} data-name-length={card.name.length > LONG_NAME ? 'long' : 'short'} data-poisoned={unit?.poison ? '' : undefined} data-stunned={unit?.stunned ? '' : undefined} className={className} style={{ '--accent': card.art.factionColor } as CSSProperties} onClick={onClick} disabled={disabled} draggable={draggable && !disabled} onDragStart={onDragStart} onDragEnd={onDragEnd} onDrop={onDrop} onDragOver={onDragOver}>
    <div className="card-art" style={artStyle}>
      {asset?.status === 'ready' ? <img className="card-art-img" src={asset.illustration} alt="" /> : <CardArt card={card} />}
      <div className="art-shine" />
    </div>
    <div className="card-header">
      <span className="card-cost" aria-label={`Custo ${card.cost}`}><strong>{card.cost}</strong></span>
      <div className="card-banner"><strong>{card.name}</strong><small>{FACTION_LABEL[card.faction]}</small></div>
      <span className="card-rarity-badge" role="img" aria-label={`Raridade: ${RARITY_LABEL[card.rarity]}`} title={`Raridade: ${RARITY_LABEL[card.rarity]}`}><i /></span>
    </div>
    <AbilityStrip card={card} />
    {unit && <div className="card-status">
      {unit.barrier > 0 && <StatusMarker id="barrier" value={unit.barrier} className="status-barrier" />}
      {unit.poison > 0 && <StatusMarker id="poison" value={unit.poison} className="status-poison" />}
      {unit.stunned > 0 && <StatusMarker id="stun" value={unit.stunned} className="status-stun" />}
      {unit.equipmentIds.map(id => <span className="status-icon status-equipment" key={id} title={getCard(id).name}>{getCard(id).art.fallbackIcon}</span>)}
    </div>}
    {card.category === 'equipment' && <span className={`equipment-hint ${targetCompatibility ? (targetCompatibility.compatible ? 'compatible' : 'incompatible') : ''}`} title={targetCompatibility?.reason ?? equipmentTargetLabel(card)}>{targetCompatibility ? (targetCompatibility.compatible ? '✓ Compatível' : '× Incompatível') : equipmentTargetLabel(card)}</span>}
    {monster ? <div className="card-footer">
      <span className="footer-side">{unit && <span className="card-position" title={canAttack ? 'Pode atacar' : 'Ataque inativo nesta posição'}>{unit.position}º{canAttack ? '' : ' · inativo'}</span>}</span>
      <span className="attack-group">{breakdowns.map((b, i) => <AttackPlaque key={`${b.type}-${i}`} breakdown={b} compact={compact} />)}</span>
      <span className={`hp-badge ${unit && unit.hp < unit.maxHp ? 'hurt' : ''}`} title={unit ? `Vida ${unit.hp} de ${unit.maxHp}` : `Vida ${hp}`}><small>VIDA</small><strong>{hp}</strong></span>
    </div> : <div className="card-kind">{card.category === 'equipment' ? 'EQUIPAMENTO' : 'FLASH'}</div>}
    {unit && <div className="card-hp" role="meter" aria-label="Vida" aria-valuenow={unit.hp} aria-valuemin={0} aria-valuemax={unit.maxHp}><i style={{ width: `${Math.max(0, unit.hp / unit.maxHp * 100)}%` }} className={unit.hp / unit.maxHp <= .35 ? 'low' : ''} /></div>}
  </button>;
}
