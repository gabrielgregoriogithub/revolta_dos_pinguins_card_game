import { CARDS } from './cards';
export interface CardAssetManifest { illustration: string; thumbnail: string; portrait: string; status: 'placeholder' | 'ready'; }
const assetBase = import.meta.env.BASE_URL;
export const CARD_ASSETS: Record<string, CardAssetManifest> = Object.fromEntries(CARDS.map(card => [card.id, { illustration: `${assetBase}assets/cards/${card.id}.webp`, thumbnail: `${assetBase}assets/cards/thumbs/${card.id}.webp`, portrait: `${assetBase}assets/cards/portraits/${card.id}.webp`, status: 'placeholder' }]));
export const REFERENCE_ASSETS = [{ path: `${assetBase}Pinguim Guerreiro das Geleiras.png`, format: 'PNG', usage: 'referência visual aprovada; não é usada como carta final porque contém moldura e atributos incorporados', status: 'reference-only' }];
