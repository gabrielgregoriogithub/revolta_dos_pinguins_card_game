import { CARDS } from './cards';
export interface CardAssetManifest { illustration: string; thumbnail: string; portrait: string; status: 'placeholder' | 'ready'; }
const assetBase = import.meta.env.BASE_URL;
const placeholder = `${assetBase}assets/ui/card-placeholder.svg`;
export const CARD_ASSETS: Record<string, CardAssetManifest> = Object.fromEntries(CARDS.map(card => [card.id, { illustration: placeholder, thumbnail: placeholder, portrait: placeholder, status: 'placeholder' }]));
export const REFERENCE_ASSETS = [{ path: `${assetBase}assets/cards/reference/pinguim-guerreiro.webp`, format: 'WEBP', usage: 'referência visual aprovada; não é usada como carta final porque contém moldura e atributos incorporados', status: 'reference-only' }];
