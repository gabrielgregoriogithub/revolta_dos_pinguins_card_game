import type { CSSProperties } from 'react';
import { getCard } from '../data/cards';
import { CARD_ASSETS } from '../data/assets';
import type { CardModel, MonsterInstance } from '../types';
import { ATTACK_LABEL, FACTION_LABEL, RARITY_LABEL } from '../types';
import CardArt from './CardArt';

export const ATTACK_ICON: Record<string, string> = { melee: '⚔️', ranged: '🏹', magic: '✨', chaos: '🌀' };

type Props = { card: CardModel; selected?: boolean; onClick?: () => void; compact?: boolean; disabled?: boolean; unit?: MonsterInstance };

// One card component for collection, deck, hand and battlefield. On the field `unit` adds live HP, buffs and status.
export default function CardView({ card, selected, onClick, compact = false, disabled = false, unit }: Props) {
  const monster = card.category === 'monster' ? card : null;
  const asset = CARD_ASSETS[card.id];
  const attack = monster?.attacks[0];
  const canAttack = !unit || !monster || !attack ? true : !unit.stunned && (attack.type === 'magic' || attack.type === 'chaos' || (attack.type === 'melee' ? unit.position === 1 : unit.position !== 1) || monster.abilities.some(a => a.id === 'reach'));
  const atk = (attack?.damage ?? 0) + (unit?.attackBuff ?? 0);
  const hp = unit ? unit.hp : monster?.maxHp ?? 0;
  const className = ['card', compact ? 'compact' : '', selected ? 'selected' : '', unit ? 'on-field' : '', unit && !canAttack ? 'idle' : '', unit && !unit.alive ? 'defeated' : ''].filter(Boolean).join(' ');
  return <button title={`${card.name}: ${card.description}`} data-faction={card.faction} data-rarity={card.rarity} data-category={card.category} className={className} style={{ '--accent': card.art.factionColor } as CSSProperties} onClick={onClick} disabled={disabled}>
    <span className="card-cost" aria-label={`Custo ${card.cost}`}>{card.cost}</span>
    {unit && <span className="card-position" title={canAttack ? 'Pode atacar' : 'Ataque inativo nesta posição'}>{unit.position}º{canAttack ? '' : ' · inativo'}</span>}
    <div className="card-art">{asset.status === 'ready' ? <img src={asset.illustration} alt="" /> : <CardArt card={card} />}<div className="art-shine" />
      {unit && <div className="card-status">{unit.barrier > 0 && <span title="Barreira">🛡️{unit.barrier}</span>}{unit.poison > 0 && <span title="Veneno">☠️{unit.poison}</span>}{unit.stunned > 0 && <span title="Atordoado">💫</span>}{unit.equipmentIds.map(id => <span key={id} title={getCard(id).name}>{getCard(id).art.fallbackIcon}</span>)}</div>}
    </div>
    <div className="card-banner"><strong>{card.name}</strong></div>
    <div className="card-tags"><i>{FACTION_LABEL[card.faction]}</i><i>{RARITY_LABEL[card.rarity]}</i></div>
    {monster && attack ? <div className="card-medals">
      <span className={`medal atk ${unit?.attackBuff ? 'buffed' : ''}`} title="Ataque"><small>ATQ</small>{atk}</span>
      <span className="medal kind" title={ATTACK_LABEL[attack.type]}>{ATTACK_ICON[attack.type]}</span>
      <span className={`medal hp ${unit && unit.hp < unit.maxHp ? 'hurt' : ''}`} title="Vida"><small>VIDA</small>{hp}</span>
    </div> : <div className="card-kind">{card.category === 'equipment' ? 'Equipamento' : 'Feitiço'}</div>}
    {unit && <div className="card-hp" role="meter" aria-label="Vida" aria-valuenow={unit.hp} aria-valuemin={0} aria-valuemax={unit.maxHp}><i style={{ width: `${Math.max(0, unit.hp / unit.maxHp * 100)}%` }} className={unit.hp / unit.maxHp <= .35 ? 'low' : ''} /></div>}
    <small className="card-text">{card.description}</small>
    {monster && monster.abilities.length > 0 && <div className="card-abilities">{monster.abilities.map(a => <span key={a.id} title={a.description}>{a.name}</span>)}</div>}
  </button>;
}
