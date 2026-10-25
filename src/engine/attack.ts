import { CARD_MAP, getCard } from '../data/cards';
import type { Attack, AttackType, MonsterCard, MonsterInstance } from '../types';

export interface AttackModifier { source: 'buff' | 'enrage' | 'aura' | 'equipment'; label: string; value: number; }
export interface AttackBreakdown { type: AttackType; base: number; modifiers: AttackModifier[]; total: number; }

// Fonte única do ataque efetivo: o combate e a carta leem o mesmo cálculo, sem alterar o atributo base.
export function attackBreakdown(unit: MonsterInstance, attack: Attack, allies: MonsterInstance[]): AttackBreakdown {
  const model = getCard(unit.modelId) as MonsterCard;
  const modifiers: AttackModifier[] = [];
  if (unit.attackBuff) modifiers.push({ source: 'buff', label: unit.attackBuff > 0 ? 'Bônus de ataque' : 'Penalidade de ataque', value: unit.attackBuff });
  const enrage = model.abilities.find(a => a.id === 'enrage');
  if (enrage && unit.hp < unit.maxHp / 2) modifiers.push({ source: 'enrage', label: enrage.name, value: enrage.value ?? 2 });
  const aura = allies.find(m => m.instanceId !== unit.instanceId && m.alive && (getCard(m.modelId) as MonsterCard).abilities.some(a => a.id === 'supportAura'));
  if (aura) modifiers.push({ source: 'aura', label: `Aura de ${getCard(aura.modelId).name}`, value: 1 });
  for (const id of unit.equipmentIds) {
    const eq = CARD_MAP.get(id);
    if (eq?.category === 'equipment' && eq.attackModifier && eq.attackModifier.attackType === attack.type) modifiers.push({ source: 'equipment', label: eq.name, value: eq.attackModifier.value });
  }
  return { type: attack.type, base: attack.damage, modifiers, total: attack.damage + modifiers.reduce((sum, m) => sum + m.value, 0) };
}
