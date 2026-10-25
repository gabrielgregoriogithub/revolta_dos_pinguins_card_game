import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import type { Ability, AbilityId } from '../types';
import { STATUS_DESCRIPTIONS, statusVisual } from '../data/statusVisuals';

const GAP = 8;
const MARGIN = 8;

// Posiciona o popover na camada global: acima do ícone, ou abaixo quando não há espaço, sempre dentro da janela.
function placePopover(anchor: DOMRect, pop: DOMRect): { style: CSSProperties; side: 'top' | 'bottom' } {
  const side = anchor.top - pop.height - GAP >= MARGIN ? 'top' : 'bottom';
  const top = side === 'top' ? anchor.top - pop.height - GAP : Math.min(anchor.bottom + GAP, window.innerHeight - pop.height - MARGIN);
  const center = anchor.left + anchor.width / 2;
  const left = Math.min(Math.max(center - pop.width / 2, MARGIN), window.innerWidth - pop.width - MARGIN);
  return { side, style: { top, left, '--arrow-x': `${center - left}px` } as CSSProperties };
}

type Props = { id: AbilityId; ability?: Ability; value?: number; className?: string };
export default function StatusMarker({ id, ability, value, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<ReturnType<typeof placePopover> | null>(null);
  const anchorRef = useRef<HTMLSpanElement>(null); const popRef = useRef<HTMLSpanElement>(null); const pointerType = useRef('mouse');
  const visual = statusVisual(id);

  useLayoutEffect(() => {
    if (!open) { setPlacement(null); return; }
    const anchor = anchorRef.current; const pop = popRef.current;
    if (anchor && pop) setPlacement(placePopover(anchor.getBoundingClientRect(), pop.getBoundingClientRect()));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => { if (!anchorRef.current?.contains(event.target as Node)) setOpen(false); };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    const close = () => setOpen(false);
    document.addEventListener('pointerdown', closeOutside); document.addEventListener('keydown', closeOnEscape);
    window.addEventListener('scroll', close, true); window.addEventListener('resize', close);
    return () => { document.removeEventListener('pointerdown', closeOutside); document.removeEventListener('keydown', closeOnEscape); window.removeEventListener('scroll', close, true); window.removeEventListener('resize', close); };
  }, [open]);

  const popover = <span ref={popRef} role="tooltip" className={`status-popover ${placement ? `placed side-${placement.side}` : ''}`} style={placement?.style}>
    <strong>{ability?.name ?? visual.label}</strong><span>{ability?.description ?? STATUS_DESCRIPTIONS[id]}</span>{ability?.duration && <small>Duração: {ability.duration}</small>}{value !== undefined && <small>Valor/acúmulos: {value}</small>}
  </span>;

  return <span ref={anchorRef} className={`status-marker ${className}`} role="button" tabIndex={0} aria-label={`${ability?.name ?? visual.label}: ${ability?.description ?? STATUS_DESCRIPTIONS[id]}`} aria-expanded={open}
    onPointerDown={event => { pointerType.current = event.pointerType; }}
    onPointerEnter={event => { if (event.pointerType === 'mouse') setOpen(true); }}
    onPointerLeave={event => { if (event.pointerType === 'mouse') setOpen(false); }}
    onClick={event => { event.stopPropagation(); setOpen(current => pointerType.current === 'mouse' ? true : !current); }}
    onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); setOpen(current => !current); } }}
    onFocus={event => { if (event.currentTarget.matches(':focus-visible')) setOpen(true); }}
    onBlur={() => setOpen(false)}>
    <b className="status-marker-icon" style={{ color: visual.color, borderColor: visual.color }}>{visual.icon}</b>{value !== undefined && <small>{value}</small>}
    {open && createPortal(popover, document.body)}
  </span>;
}
