export interface CardArtworkLayout { objectPosition: string; scale: number; offsetX: number; offsetY: number; }

// As ilustrações são paisagem (640×441) e enquadram o personagem da cintura para cima, com arma e acessórios
// encostados nas laterais. Por padrão a arte ocupa a largura da carta com zoom leve (≈4% de corte por lado, preservando armas) e o restante
// é preenchido por uma extensão desfocada da própria imagem. Ajustes individuais entram aqui, com o motivo.
const DEFAULT_LAYOUT: CardArtworkLayout = { objectPosition: '50% 50%', scale: 1.08, offsetX: 0, offsetY: 0 };
const LAYOUT_OVERRIDES: Record<string, Partial<CardArtworkLayout>> = {
  iron_sword: { scale: .88, objectPosition: '50% 50%' }, heavy_sword: { scale: .82, objectPosition: '50% 50%' },
  war_axe: { scale: .9, objectPosition: '50% 50%' }, reinforced_bow: { scale: .86, objectPosition: '50% 50%' }, longbow: { scale: .82, objectPosition: '50% 50%' },
  arcane_staff: { scale: .84, objectPosition: '50% 50%' }, reflection_staff: { scale: .86, objectPosition: '50% 50%' },
  regen_amulet: { scale: 1.02, objectPosition: '50% 50%' }, minor_heal: { scale: 1.02, objectPosition: '50% 50%' }, resource_surge: { scale: 1.02, objectPosition: '50% 50%' },
};

export function artworkLayout(cardId: string): CardArtworkLayout {
  return { ...DEFAULT_LAYOUT, ...LAYOUT_OVERRIDES[cardId] };
}
