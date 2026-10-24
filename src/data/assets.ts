import { CARDS } from './cards';
export interface CardAssetManifest { illustration: string; thumbnail: string; portrait: string; status: 'placeholder' | 'ready'; }
const assetBase = import.meta.env.BASE_URL;
const placeholder = `${assetBase}assets/ui/card-placeholder.svg`;
// Monsters use illustrations cropped from the finished portrait cards (frame and text removed, webp).
const READY_ART = new Set(CARDS.filter(card => card.category === 'monster').map(card => card.id));
export const CARD_ASSETS: Record<string, CardAssetManifest> = Object.fromEntries(CARDS.map(card => {
  const art = READY_ART.has(card.id) ? `${assetBase}assets/cards/illustrations/${card.id}.webp` : placeholder;
  return [card.id, { illustration: art, thumbnail: art, portrait: art, status: READY_ART.has(card.id) ? 'ready' : 'placeholder' }];
}));
export const REFERENCE_ASSETS = [{ path: `${assetBase}assets/cards/reference/pinguim-guerreiro.webp`, format: 'WEBP', usage: 'referência visual aprovada; não é usada como carta final porque contém moldura e atributos incorporados', status: 'reference-only' }, { path: `${assetBase}assets/cards/reference/pinguim-arqueiro.webp`, format: 'WEBP', usage: 'carta-conceito do Arqueiro Élfico; a ilustração recortada é usada na carta', status: 'reference-only' }];
