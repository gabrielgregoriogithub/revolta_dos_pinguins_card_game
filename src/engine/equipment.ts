import type { EquipmentCard, MonsterCard } from '../types';
import { FACTION_LABEL } from '../types';

export function equipmentCompatibility(equipment: EquipmentCard, monster: MonsterCard): { compatible: boolean; label: string; reason: string } {
  if (equipment.faction === 'neutral') return { compatible: true, label: 'Universal', reason: 'Pode ser equipado em qualquer monstro.' };
  const compatible = equipment.faction === monster.faction;
  return compatible
    ? { compatible: true, label: FACTION_LABEL[equipment.faction], reason: `Compatível com monstros da facção ${FACTION_LABEL[equipment.faction]}.` }
    : { compatible: false, label: FACTION_LABEL[equipment.faction], reason: `Requer facção ${FACTION_LABEL[equipment.faction]}; este monstro é ${FACTION_LABEL[monster.faction]}.` };
}

export function equipmentTargetLabel(card: EquipmentCard): string { return card.faction === 'neutral' ? 'Universal' : `Facção: ${FACTION_LABEL[card.faction]}`; }
