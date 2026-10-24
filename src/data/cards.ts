import type { Ability, CardModel, DeckList, Faction } from '../types';

const art = (faction: Faction, icon: string) => ({ imagePath: '', fallbackIcon: icon, factionColor: ({ war: '#e24a4a', nature: '#43b87a', balance: '#4b9de8', fortune: '#d7ae42', chaos: '#a75bd1', neutral: '#8290a4' } as Record<Faction, string>)[faction] });
const ability = (id: Ability['id'], name: string, description: string, value?: number, duration?: number): Ability => ({ id, name, description, value, duration });
const monster = (id: string, name: string, description: string, faction: Faction, cost: number, maxHp: number, attackType: 'melee'|'ranged'|'magic'|'chaos', damage: number, abilities: Ability[] = [], rarity: 'common'|'rare'|'epic'|'legendary' = 'common'): CardModel => ({ id, name, description, category: 'monster', faction, rarity, cost, level: 1, maxHp, attacks: [{ type: attackType, damage }], abilities, equipmentSlots: 1, art: art(faction, '🐧') });
const equipment = (id: string, name: string, description: string, faction: Faction, cost: number, subtype: 'weapon'|'armor'|'shield'|'staff'|'amulet', attackModifier?: { attackType?: 'melee'|'ranged'|'magic'|'chaos'; value: number }, effects: Ability[] = []): CardModel => ({ id, name, description, category: 'equipment', faction, rarity: cost >= 3 ? 'rare' : 'common', cost, subtype, effects, attackModifier, art: art(faction, subtype === 'weapon' ? '⚔️' : subtype === 'armor' ? '🛡️' : subtype === 'staff' ? '🪄' : '💠') });
const effect = (id: string, name: string, description: string, faction: Faction, cost: number, effectId: Ability['id'], value: number): CardModel => ({ id, name, description, category: 'effect', faction, rarity: cost >= 3 ? 'rare' : 'common', cost, effect: effectId, value, art: art(faction, effectId === 'heal' ? '💚' : effectId === 'poison' ? '☠️' : effectId === 'attackBuff' ? '🔥' : '✨') });

export const CARDS: CardModel[] = [
  monster('orc_warrior', 'Guerreiro Orc', 'Um combatente confiável da linha de frente.', 'war', 3, 8, 'melee', 3, [ability('thorns', 'Espinhos', 'Devolve 1 de dano após um ataque corpo a corpo.', 1)]),
  monster('iron_knight', 'Cavaleiro de Ferro', 'Defensor que reduz dano físico.', 'war', 4, 10, 'melee', 2, [ability('shield', 'Escudo', 'Reduz dano físico recebido.', 1)], 'rare'),
  monster('berserker', 'Berserker', 'Quanto mais arrisca, mais ameaça oferece.', 'war', 5, 7, 'melee', 5, [ability('doubleStrike', 'Fúria dupla', 'Ataca duas vezes se estiver na frente.', 1)], 'epic'),
  monster('stone_golem', 'Golem de Pedra', 'Uma muralha lenta e resistente.', 'war', 5, 14, 'melee', 2, [ability('barrier', 'Barreira pétrea', 'Começa o combate absorvendo 2 de dano.', 2), ability('armorBreak', 'Peso esmagador', 'Reduz a proteção inimiga.', 1)], 'rare'),
  monster('elven_archer', 'Arqueiro Élfico', 'Ataca da retaguarda com precisão.', 'nature', 3, 5, 'ranged', 4, [ability('flying', 'Passo leve', 'Possui chance de esquivar de ataques físicos.', 25)]),
  monster('goblin_hunter', 'Caçador Goblin', 'Uma ameaça barata para a retaguarda.', 'fortune', 2, 5, 'ranged', 3, [ability('attackBuff', 'Mira', 'Recebe +1 dano no primeiro ataque.', 1)]),
  monster('forest_scout', 'Batedora da Floresta', 'Rápida e precisa, mas frágil.', 'nature', 4, 6, 'ranged', 4, [ability('reach', 'Posição elevada', 'Mantém seu ataque de distância na frente.', 1), ability('piercing', 'Flechas perfurantes', 'Ignora 1 ponto de proteção.', 1)], 'rare'),
  monster('arcane_mage', 'Mago Arcano', 'Manipula magia sem depender da formação.', 'balance', 4, 6, 'magic', 4, [ability('reflect', 'Reflexo mágico', 'Reflete parte de ataques mágicos.', 1)]),
  monster('elder_druid', 'Druida Ancião', 'A natureza sustenta seus aliados.', 'nature', 5, 8, 'magic', 3, [ability('regeneration', 'Regeneração', 'Recupera 2 de vida no início do turno.', 2), ability('supportAura', 'Aura de seiva', 'Aliados recebem +1 dano enquanto o druida está em campo.', 1)], 'rare'),
  monster('necromancer', 'Necromante', 'Enfraquece o alvo com veneno.', 'chaos', 4, 6, 'magic', 3, [ability('poison', 'Veneno', 'Aplica 1 de dano por turno.', 1, 3), ability('lifesteal', 'Dreno', 'Recupera vida equivalente a parte do dano causado.', 1)]),
  monster('shadow_wraith', 'Espectro Sombrio', 'Um atacante imprevisível da retaguarda.', 'chaos', 3, 5, 'chaos', 4, [ability('stun', 'Pavor', 'Pode impedir o alvo de atacar.', 1)], 'rare'),
  monster('wandering_demon', 'Demônio Errante', 'O caos escolhe seu próprio alvo.', 'chaos', 5, 8, 'chaos', 5, [ability('doubleStrike', 'Frenesi', 'Pode atacar duas vezes.', 1), ability('enrage', 'Enfurecer', 'Recebe +2 dano quando está abaixo de metade da vida.', 2)], 'epic'),
  equipment('iron_sword', 'Espada de Ferro', '+2 dano corpo a corpo.', 'neutral', 2, 'weapon', { attackType: 'melee', value: 2 }),
  equipment('war_axe', 'Machado de Guerra', '+3 dano corpo a corpo, mas exige investimento.', 'war', 3, 'weapon', { attackType: 'melee', value: 3 }),
  equipment('reinforced_bow', 'Arco Reforçado', '+2 dano à distância.', 'neutral', 2, 'weapon', { attackType: 'ranged', value: 2 }),
  equipment('arcane_staff', 'Cajado Arcano', '+2 dano mágico.', 'balance', 2, 'staff', { attackType: 'magic', value: 2 }),
  equipment('iron_shield', 'Escudo de Ferro', 'Concede 2 de proteção física.', 'neutral', 2, 'shield', undefined, [ability('shield', 'Proteção', 'Reduz dano físico recebido.', 2)]),
  equipment('runic_armor', 'Armadura Rúnica', 'Concede 1 de proteção contra qualquer ataque.', 'balance', 3, 'armor', undefined, [ability('shield', 'Runas defensivas', 'Reduz dano recebido.', 1)]),
  equipment('regen_amulet', 'Amuleto de Regeneração', 'Regenera 2 de vida no início do turno.', 'nature', 3, 'amulet', undefined, [ability('regeneration', 'Regeneração', 'Recupera vida no início do turno.', 2)]),
  effect('minor_heal', 'Cura Menor', 'Restaura 4 de vida de um monstro aliado.', 'nature', 2, 'heal', 4),
  effect('fireball', 'Bola de Fogo', 'Causa 4 de dano mágico ao monstro da frente.', 'balance', 3, 'directDamage', 4),
  effect('concentrated_poison', 'Veneno Concentrado', 'Aplica 2 de veneno ao monstro da frente.', 'chaos', 2, 'poison', 2),
  effect('magic_barrier', 'Barreira Mágica', 'Concede 3 de escudo temporário ao monstro da frente.', 'balance', 2, 'shield', 3),
  effect('battle_blessing', 'Bênção de Batalha', 'Concede +2 dano ao monstro da frente neste turno.', 'fortune', 2, 'attackBuff', 2)
];
CARDS.push(
  monster('glacier_guardian', 'Guardião Glacial', 'Tanque que protege a formação com uma barreira inicial.', 'war', 4, 12, 'melee', 2, [ability('barrier', 'Muralha de gelo', 'Absorve 3 de dano no primeiro turno.', 3), ability('taunt', 'Provocar', 'Atrai a prioridade dos ataques.', 1)], 'rare'),
  monster('tundra_duelist', 'Duelista da Tundra', 'Atacante rápido que pune linhas de frente frágeis.', 'war', 3, 6, 'melee', 4, [ability('enrage', 'Ímpeto', 'Recebe +1 dano com pouca vida.', 1)]),
  monster('icebreaker', 'Quebra-Gelo', 'Golpe pesado que reduz proteções.', 'war', 5, 9, 'melee', 4, [ability('armorBreak', 'Ruptura', 'Ignora 2 de proteção.', 2)], 'rare'),
  monster('sacrifice_knight', 'Cavaleiro do Juramento', 'Transforma uma perda em proteção temporária.', 'war', 4, 9, 'melee', 3, [ability('deathTrigger', 'Último juramento', 'Ao morrer, concede barreira ao aliado da frente.', 2)], 'rare'),
  monster('ice_scout', 'Batedor do Gelo', 'Arqueiro econômico para abrir a retaguarda.', 'fortune', 2, 4, 'ranged', 3, [ability('piercing', 'Mira precisa', 'Ignora 1 de proteção.', 1)]),
  monster('aurora_sniper', 'Atiradora Aurora', 'Dano de distância com alcance ampliado.', 'fortune', 5, 5, 'ranged', 6, [ability('reach', 'Alcance longo', 'Ataca mesmo quando avança para a frente.', 1)], 'epic'),
  monster('moss_hunter', 'Caçadora de Musgo', 'Dispara veneno e sustenta combates longos.', 'nature', 3, 6, 'ranged', 3, [ability('poison', 'Flecha tóxica', 'Aplica 1 veneno ao alvo.', 1)]),
  monster('frost_sage', 'Sábio do Gelo', 'Mago defensivo com barreira de entrada.', 'balance', 3, 7, 'magic', 3, [ability('barrier', 'Círculo ártico', 'Absorve 2 de dano.', 2)]),
  monster('mirror_mage', 'Maga do Espelho', 'Responde a magia com reflexão.', 'balance', 5, 6, 'magic', 4, [ability('reflect', 'Espelho rúnico', 'Reflete parte da magia recebida.', 2)], 'epic'),
  monster('healing_seer', 'Vidente da Aurora', 'Suporte que cura aliados no início do turno.', 'nature', 4, 7, 'magic', 2, [ability('regeneration', 'Visão restauradora', 'Recupera 3 de vida.', 3), ability('supportAura', 'Aura vital', 'Aliados recebem +1 dano.', 1)], 'rare'),
  monster('frost_witch', 'Bruxa da Geada', 'Controle mágico que atrasa ameaças.', 'chaos', 4, 5, 'magic', 3, [ability('stun', 'Congelamento', 'Pode impedir o próximo ataque.', 1)]),
  monster('storm_imp', 'Duende da Tempestade', 'Caos barato que busca alvos na retaguarda.', 'chaos', 2, 4, 'chaos', 3, [ability('doubleStrike', 'Faísca dupla', 'Pode atacar duas vezes.', 1)]),
  equipment('heavy_sword', 'Espada Pesada', '+3 corpo a corpo, ideal para tanques agressivos.', 'war', 3, 'weapon', { attackType: 'melee', value: 3 }),
  equipment('longbow', 'Arco de Longo Alcance', '+2 distância e alcance estratégico.', 'neutral', 3, 'weapon', { attackType: 'ranged', value: 2 }),
  equipment('reinforced_shield', 'Escudo Reforçado', 'Concede 3 de barreira.', 'neutral', 3, 'shield', undefined, [ability('barrier', 'Barreira', 'Absorve dano.', 3)]),
  equipment('reflection_staff', 'Cajado de Reflexão', '+1 magia e proteção contra magia.', 'balance', 3, 'staff', { attackType: 'magic', value: 1 }, [ability('reflect', 'Reflexão', 'Reflete parte da magia.', 1)]),
  equipment('thorn_armor', 'Armadura de Espinhos', 'Reforça a resposta a ataques corpo a corpo.', 'nature', 3, 'armor', undefined, [ability('thorns', 'Espinhos', 'Devolve dano físico.', 2)]),
  effect('vital_amulet', 'Amuleto Vital', 'Cura 3 e concede regeneração.', 'nature', 3, 'heal', 3),
  effect('poison_dagger', 'Adaga Venenosa', 'Aplica 3 veneno ao inimigo da frente.', 'chaos', 3, 'poison', 3),
  effect('cleanse_wave', 'Onda Purificadora', 'Remove veneno e atordoamento do aliado.', 'nature', 2, 'cleanse', 1),
  effect('crystal_burst', 'Explosão Cristalina', 'Causa 5 de dano mágico ao inimigo da frente.', 'balance', 4, 'directDamage', 5),
  effect('guarding_oath', 'Juramento Guardião', 'Concede 4 de barreira ao aliado da frente.', 'war', 3, 'barrier', 4),
  effect('chaos_relic', 'Relíquia do Caos', 'Concede +1 ou +3 dano de forma reproduzível.', 'chaos', 2, 'attackBuff', 2),
  effect('resource_surge', 'Surto de Fortuna', 'Concede +1 cristal sem ultrapassar o limite.', 'fortune', 1, 'resource', 1)
);
export const CARD_MAP = new Map(CARDS.map(card => [card.id, card]));
export function cardTags(card: CardModel): string[] { if (card.tags?.length) return card.tags; const tags = [card.faction, card.category === 'equipment' ? 'equipment' : card.category === 'effect' ? 'magic' : '']; if (card.category === 'monster') tags.push(card.attacks[0].type === 'melee' ? 'warrior' : card.attacks[0].type === 'ranged' ? 'archer' : card.attacks[0].type === 'magic' ? 'mage' : 'chaos'); for (const a of card.category === 'monster' ? card.abilities : card.category === 'equipment' ? card.effects : [card]) { if ('id' in a && ['poison','regeneration','heal'].includes(a.id)) tags.push(a.id === 'regeneration' || a.id === 'heal' ? 'healing' : 'poison'); if ('id' in a && ['shield','barrier','taunt'].includes(a.id)) tags.push('defense'); if ('id' in a && ['supportAura','summonBonus'].includes(a.id)) tags.push('support'); } return [...new Set(tags.filter(Boolean))]; }
export const STARTER_DECKS: DeckList[] = [
  { id: 'icebreakers', name: 'Quebra-Gelos', cards: ['orc_warrior','iron_knight','berserker','stone_golem','elven_archer','goblin_hunter','arcane_mage','elder_druid','iron_sword','reinforced_bow','iron_shield','runic_armor','minor_heal','fireball','battle_blessing','regen_amulet'] },
  { id: 'tempestade', name: 'Tempestade Polar', cards: ['orc_warrior','stone_golem','elven_archer','forest_scout','arcane_mage','necromancer','shadow_wraith','wandering_demon','war_axe','arcane_staff','reinforced_bow','regen_amulet','concentrated_poison','magic_barrier','fireball','battle_blessing'] },
  { id: 'bastiao_verde', name: 'Bastião Verde', cards: ['glacier_guardian','iron_knight','stone_golem','elder_druid','healing_seer','moss_hunter','forest_scout','necromancer','reinforced_shield','thorn_armor','regen_amulet','iron_shield','minor_heal','vital_amulet','guarding_oath','concentrated_poison'] },
  { id: 'arcano', name: 'Círculo Arcano', cards: ['arcane_mage','frost_sage','mirror_mage','elder_druid','healing_seer','necromancer','orc_warrior','icebreaker','arcane_staff','reflection_staff','runic_armor','magic_barrier','fireball','crystal_burst','minor_heal','battle_blessing'] },
  { id: 'caos_polar', name: 'Caos Polar', cards: ['berserker','tundra_duelist','ice_scout','aurora_sniper','shadow_wraith','wandering_demon','frost_witch','storm_imp','heavy_sword','longbow','poison_dagger','chaos_relic','fireball','concentrated_poison','battle_blessing','resource_surge'] }
];
export function getCard(id: string): CardModel { const card = CARD_MAP.get(id); if (!card) throw new Error(`Carta desconhecida: ${id}`); return card; }
