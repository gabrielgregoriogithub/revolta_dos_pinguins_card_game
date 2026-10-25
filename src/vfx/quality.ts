export type FxQuality = 'high' | 'medium' | 'low';
export const FX_QUALITY_LABEL: Record<FxQuality, string> = { high: 'Efeitos: Alto', medium: 'Efeitos: Médio', low: 'Efeitos: Baixo' };
// Partículas por impacto em cada nível; "baixo" mantém só flash, reação e número.
export const PARTICLES_BY_QUALITY: Record<FxQuality, number> = { high: 12, medium: 6, low: 0 };
const KEY = 'pinguins-fx-quality';
const ORDER: FxQuality[] = ['high', 'medium', 'low'];

export function prefersReducedMotion() { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } }

export function loadFxQuality(): FxQuality {
  try { const saved = localStorage.getItem(KEY); if (saved && ORDER.includes(saved as FxQuality)) return saved as FxQuality; } catch { /* preferência opcional */ }
  return prefersReducedMotion() ? 'low' : 'high';
}
export function saveFxQuality(quality: FxQuality) { try { localStorage.setItem(KEY, quality); } catch { /* preferência opcional */ } }
export const nextFxQuality = (quality: FxQuality): FxQuality => ORDER[(ORDER.indexOf(quality) + 1) % ORDER.length];
