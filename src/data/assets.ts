import { CARDS, ENEMY_CARDS } from './cards';
import { EXPANSION_ENEMY_CARDS } from './expansion';

export interface CardAssetManifest { illustration: string; thumbnail: string; portrait: string; status: 'placeholder' | 'ready'; source: 'illustration' | 'placeholder'; }
const assetBase = import.meta.env.BASE_URL;
const placeholder = `${assetBase}assets/ui/card-placeholder.svg`;
// Artes separadas do template: custo, nome, raridade, atributos e habilidades são renderizados pelo CardView.
const illustrationIds = new Set(['arcane_mage','aurora_sniper','berserker','elder_druid','elven_archer','forest_scout','frost_sage','frost_witch','glacier_guardian','goblin_hunter','healing_seer','icebreaker','ice_scout','iron_knight','mirror_mage','moss_hunter','necromancer','orc_warrior','sacrifice_knight','shadow_wraith','stone_golem','storm_imp','tundra_duelist','wandering_demon']);
const equipmentIllustrationIds = new Set(['iron_sword','war_axe','reinforced_bow','arcane_staff','iron_shield','runic_armor','regen_amulet','heavy_sword','longbow','reinforced_shield','reflection_staff','thorn_armor']);
const effectIllustrationIds = new Set(['minor_heal','fireball','concentrated_poison','magic_barrier','battle_blessing','vital_amulet','poison_dagger','cleanse_wave','crystal_burst','guarding_oath','chaos_relic','resource_surge']);
const expansionEnemyIds = new Set(EXPANSION_ENEMY_CARDS.map(card => card.id));
const enemyIllustrationIds = new Set(ENEMY_CARDS.filter(card => card.category === 'monster' && !expansionEnemyIds.has(card.id)).map(card => card.id));
const allCards = [...CARDS, ...ENEMY_CARDS];
export const CARD_ASSETS: Record<string, CardAssetManifest> = Object.fromEntries(allCards.map(card => {
  const enemy = card.category === 'monster' && card.ownership === 'enemy';
  const ready = (card.category === 'monster' && (illustrationIds.has(card.id) || enemyIllustrationIds.has(card.id))) || (card.category === 'equipment' && equipmentIllustrationIds.has(card.id)) || (card.category === 'effect' && effectIllustrationIds.has(card.id));
  const folder = enemy ? 'enemies' : card.category === 'equipment' ? 'equipment' : card.category === 'effect' ? 'effects' : '';
  const extension = folder ? 'png' : 'webp';
  const art = ready ? `${assetBase}assets/cards/illustrations/${folder ? `${folder}/` : ''}${card.id}.${extension}` : placeholder;
  return [card.id, { illustration: art, thumbnail: art, portrait: art, status: ready ? 'ready' : 'placeholder', source: ready ? 'illustration' : 'placeholder' }];
}));
export const REFERENCE_ASSETS = [
  { path: `${assetBase}assets/cards/reference/pinguim-guerreiro.webp`, format: 'WEBP', usage: 'referência visual aprovada; não é usada como carta final porque contém moldura e atributos incorporados', status: 'reference-only' },
  { path: `${assetBase}assets/cards/reference/pinguim-arqueiro.webp`, format: 'WEBP', usage: 'referência visual aprovada para a direção do Pinguim Arqueiro', status: 'reference-only' },
];
