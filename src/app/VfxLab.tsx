import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { audioManager } from '../audio/AudioManager';
import { STARTER_DECKS, getCard } from '../data/cards';
import { createGame, endPreparation, getPlayer } from '../engine/core';
import { applyVisualEvent, buildVisualEvents } from '../engine/visual';
import type { CombatVisualEvent, GameState, MonsterCard, MonsterInstance } from '../types';
import { FX_QUALITY_LABEL, loadFxQuality, nextFxQuality, saveFxQuality } from '../vfx/quality';
import { FormationRow } from './Battlefield';
import { AttackFx, eventDuration, SPEED_FACTOR, type PlaybackSpeed } from './CombatFx';

// Vitrine de combate: cada demonstração é um duelo real resolvido pelo motor e reproduzido pelo mesmo pipeline da batalha.
type Side = 'player' | 'ai';
type Showcase = { id: string; group: string; label: string; attackers: string[]; defenders: string[]; side?: Side; tweak?: (attackers: MonsterInstance[], defenders: MonsterInstance[]) => void; needs?: CombatVisualEvent['type'] };
export const SHOWCASES: Showcase[] = [
  { id: 'sword', group: 'Corpo a corpo', label: 'Espada', attackers: ['orc_warrior'], defenders: ['enemy_orc'] },
  { id: 'axe', group: 'Corpo a corpo', label: 'Machado · golpe duplo', attackers: ['berserker'], defenders: ['enemy_iron_colossus'] },
  { id: 'katana', group: 'Corpo a corpo', label: 'Katana', attackers: ['tundra_duelist'], defenders: ['enemy_goblin_warrior'] },
  { id: 'spear', group: 'Corpo a corpo', label: 'Lança', attackers: ['sacrifice_knight'], defenders: ['enemy_troll'] },
  { id: 'hammer', group: 'Corpo a corpo', label: 'Martelo', attackers: ['stone_golem'], defenders: ['enemy_skeleton'] },
  { id: 'claw', group: 'Corpo a corpo', label: 'Garras (Yeti)', attackers: ['enemy_yeti'], defenders: ['iron_knight'], side: 'ai' },
  { id: 'bite', group: 'Corpo a corpo', label: 'Mordida (Lobo)', attackers: ['enemy_wolf'], defenders: ['orc_warrior'], side: 'ai' },
  { id: 'arrow', group: 'Distância', label: 'Flecha', attackers: ['iron_knight', 'elven_archer'], defenders: ['enemy_goblin_warrior'] },
  { id: 'arrow-ice', group: 'Distância', label: 'Flecha de gelo', attackers: ['iron_knight', 'ice_scout'], defenders: ['enemy_goblin_warrior'] },
  { id: 'arrow-poison', group: 'Distância', label: 'Flecha venenosa', attackers: ['iron_knight', 'moss_hunter'], defenders: ['enemy_troll'] },
  { id: 'arrow-light', group: 'Distância', label: 'Flecha de luz', attackers: ['iron_knight', 'aurora_sniper'], defenders: ['enemy_troll'] },
  { id: 'fire', group: 'Magia', label: 'Bola de fogo', attackers: ['arcane_mage'], defenders: ['enemy_ent'] },
  { id: 'ice', group: 'Magia', label: 'Gelo · congelamento', attackers: ['frost_witch'], defenders: ['enemy_troll'] },
  { id: 'nature', group: 'Magia', label: 'Natureza', attackers: ['elder_druid'], defenders: ['enemy_goblin_warrior'] },
  { id: 'shadow', group: 'Magia', label: 'Sombra · roubo de vida', attackers: ['necromancer'], defenders: ['enemy_troll'], tweak: a => { a[0].hp = 2; } },
  { id: 'light', group: 'Magia', label: 'Luz', attackers: ['healing_seer'], defenders: ['enemy_skeleton'] },
  { id: 'lightning', group: 'Magia', label: 'Raio', attackers: ['storm_imp'], defenders: ['enemy_troll'] },
  { id: 'chaos', group: 'Magia', label: 'Caos', attackers: ['wandering_demon'], defenders: ['enemy_troll'] },
  { id: 'reflect', group: 'Especiais', label: 'Reflexão', attackers: ['arcane_mage'], defenders: ['mirror_mage'] },
  { id: 'thorns', group: 'Especiais', label: 'Espinhos (contra-ataque)', attackers: ['tundra_duelist'], defenders: ['orc_warrior'] },
  { id: 'absorb', group: 'Especiais', label: 'Barreira absorve', attackers: ['orc_warrior'], defenders: ['enemy_troll'], tweak: (_, d) => { d[0].barrier = 10; } },
  { id: 'blocked', group: 'Especiais', label: 'Bloqueio total', attackers: ['enemy_goblin_warrior'], defenders: ['iron_knight'], side: 'ai', tweak: (_, d) => { d[0].equipmentIds = ['iron_shield']; } },
  { id: 'pierce', group: 'Especiais', label: 'Perfuração', attackers: ['iron_knight', 'forest_scout'], defenders: ['iron_knight'] },
  { id: 'armor-break', group: 'Especiais', label: 'Ruptura de armadura', attackers: ['icebreaker'], defenders: ['iron_knight'] },
  { id: 'miss', group: 'Especiais', label: 'Esquiva', attackers: ['orc_warrior'], defenders: ['elven_archer'], needs: 'MISS' },
  { id: 'kill-physical', group: 'Destruição', label: 'Derrota física', attackers: ['orc_warrior'], defenders: ['enemy_goblin_warrior', 'enemy_goblin_archer'], tweak: (_, d) => { d[0].hp = 2; } },
  { id: 'kill-fire', group: 'Destruição', label: 'Derrota por fogo', attackers: ['arcane_mage'], defenders: ['enemy_goblin_warrior', 'enemy_goblin_archer'], tweak: (_, d) => { d[0].hp = 3; } },
  { id: 'kill-ice', group: 'Destruição', label: 'Derrota por gelo', attackers: ['frost_sage'], defenders: ['enemy_goblin_warrior', 'enemy_goblin_archer'], tweak: (_, d) => { d[0].hp = 3; } },
  { id: 'kill-poison', group: 'Destruição', label: 'Derrota por veneno', attackers: ['iron_knight', 'moss_hunter'], defenders: ['enemy_goblin_warrior'], tweak: (_, d) => { d[0].hp = 4; } },
  { id: 'kill-shadow', group: 'Destruição', label: 'Derrota sombria', attackers: ['necromancer'], defenders: ['enemy_goblin_warrior', 'enemy_goblin_archer'], tweak: (_, d) => { d[0].hp = 3; } },
  { id: 'boss-fire', group: 'Chefes', label: 'Dragão Vulcânico', attackers: ['enemy_volcanic_dragon'], defenders: ['glacier_guardian', 'ice_scout'], side: 'ai' },
  { id: 'boss-ice', group: 'Chefes', label: 'Dragão Glacial', attackers: ['enemy_ice_dragon'], defenders: ['glacier_guardian'], side: 'ai' },
  { id: 'boss-lich', group: 'Chefes', label: 'Rei dos Mortos', attackers: ['enemy_undead_king'], defenders: ['stone_golem'], side: 'ai', tweak: a => { a[0].hp = 6; } },
  { id: 'boss-void', group: 'Chefes', label: 'Guardião do Caos', attackers: ['enemy_void_guardian'], defenders: ['stone_golem'], side: 'ai' },
];
const GROUPS = [...new Set(SHOWCASES.map(s => s.group))];
const MAX_SEED_TRIES = 60;

function unit(modelId: string, key: string): MonsterInstance {
  const card = getCard(modelId) as MonsterCard;
  return { instanceId: `lab-${key}-${modelId}`, modelId, hp: card.maxHp, maxHp: card.maxHp, position: 0, alive: true, stunned: 0, silenced: 0, poison: 0, attackBuff: 0, armorBreak: 0, barrier: 0, equipmentIds: [] };
}
// Monta o duelo: só a última unidade atacante age (as demais ficam atordoadas para não poluir a demonstração).
export function runShowcase(showcase: Showcase): { before: GameState; events: CombatVisualEvent[] } {
  const side: Side = showcase.side ?? 'player'; const other: Side = side === 'player' ? 'ai' : 'player';
  for (let attempt = 0; attempt < MAX_SEED_TRIES; attempt++) {
    const state = createGame(STARTER_DECKS[0].cards, STARTER_DECKS[1].cards, `lab-${showcase.id}-${attempt}`);
    const attackers = showcase.attackers.map((id, i) => ({ ...unit(id, `a${i}`), stunned: i < showcase.attackers.length - 1 ? 9 : 0 }));
    const defenders = showcase.defenders.map((id, i) => unit(id, `d${i}`));
    showcase.tweak?.(attackers, defenders);
    state.activePlayerId = side; state.phase = 'PREPARATION';
    getPlayer(state, side).battlefield = attackers.map((m, i) => ({ ...m, position: i + 1 }));
    getPlayer(state, other).battlefield = defenders.map((m, i) => ({ ...m, position: i + 1 }));
    const before = structuredClone(state); const marker = state.eventLog.length;
    endPreparation(state, side);
    const events = buildVisualEvents(state.eventLog.slice(marker)).filter(e => e.type !== 'END' && e.type !== 'START');
    if (!showcase.needs || events.some(e => e.type === showcase.needs)) return { before, events };
  }
  throw new Error(`Demonstração sem resultado: ${showcase.id}`);
}

type Playback = { showcase: Showcase; visual: GameState; events: CombatVisualEvent[]; index: number };
export default function VfxLab({ onBack }: { onBack: () => void }) {
  const [playback, setPlayback] = useState<Playback | null>(null);
  const [speed, setSpeed] = useState<PlaybackSpeed>('normal');
  const [quality, setQuality] = useState(loadFxQuality);
  const [muted, setMuted] = useState(audioManager.isMuted());
  const [paused, setPaused] = useState(false);
  const arenaRef = useRef<HTMLElement>(null);
  const event = playback && playback.index < playback.events.length ? playback.events[playback.index] : undefined;

  const advance = () => setPlayback(prev => { if (!prev || prev.index >= prev.events.length) return prev; const next = prev.events[prev.index + 1]; return { ...prev, index: prev.index + 1, visual: next ? applyVisualEvent(prev.visual, next) : prev.visual }; });
  const play = (showcase: Showcase) => { const { before, events } = runShowcase(showcase); setPlayback({ showcase, visual: events.length ? applyVisualEvent(before, events[0]) : before, events, index: 0 }); };
  useEffect(() => {
    if (!playback || !event) return;
    audioManager.playVisualEvent(event, SPEED_FACTOR[speed]);
    if (paused) return;
    const timer = window.setTimeout(advance, eventDuration(event, speed) || 1);
    return () => window.clearTimeout(timer);
  }, [playback?.index, playback?.events, speed, paused]);

  const visual = playback?.visual; const fx = event?.fx;
  const arenaStyle = { '--event-ms': `${event ? eventDuration(event, speed) || 1 : 1000}ms` } as CSSProperties;
  return <main className="shell vfx-lab"><header className="topbar"><button onClick={onBack}>← Menu</button><div><p className="eyebrow">VITRINE DE COMBATE</p><h2>Laboratório de efeitos</h2></div>
    <div className="top-controls"><button onClick={() => setQuality(q => { const next = nextFxQuality(q); saveFxQuality(next); return next; })}>✨ {FX_QUALITY_LABEL[quality]}</button><button onClick={() => setSpeed(s => s === 'normal' ? 'fast' : 'normal')}>{speed === 'normal' ? '🐢 Normal' : '🐇 Rápido'}</button><button onClick={() => setPaused(p => !p)}>{paused ? '▶ Continuar' : 'Ⅱ Pausar'}</button><button onClick={advance} disabled={!paused || !event}>Próximo ›</button><button onClick={() => { audioManager.setMuted(!muted); setMuted(!muted); }}>{muted ? '🔇 Mudo' : '🔊 Som'}</button></div></header>
    <section className="lab-layout">
      <div className="lab-stage">
        <section className={`lab-arena fxq-${quality}${fx?.shake === 'arena' && quality === 'high' ? ' fx-shake-arena' : ''}`} ref={arenaRef} style={arenaStyle}>
          {visual ? <>
            <FormationRow player={getPlayer(visual, 'ai')} enemy event={event} speed={speed} quality={quality} />
            <div className="lab-caption">{event ? <><b>{playback!.showcase.label}</b><span>{event.description}</span></> : <><b>{playback!.showcase.label}</b><span>Fim da demonstração · clique para repetir</span></>}</div>
            <FormationRow player={getPlayer(visual, 'player')} event={event} speed={speed} quality={quality} />
            <AttackFx event={event} arenaRef={arenaRef} quality={quality} speed={speed} />
          </> : <p className="lab-empty">Escolha um ataque à direita para ver o duelo resolvido pelo motor.</p>}
        </section>
        {fx && <div className="lab-profile"><b>{fx.profileId}</b><span>{event!.type} · elemento {fx.element} · movimento {fx.motion}{fx.reaction ? ` · reação ${fx.reaction}` : ''}{fx.boss ? ' · chefe' : ''}</span><small>Preparação {fx.windupMs} ms · trajetória {fx.travelMs} ms · hit stop {fx.hitStopMs} ms · tremor {fx.shake} · duração {fx.durationMs} ms</small><small>Sons: {fx.sounds.map(s => `${s.id}@${s.atMs}ms`).join(', ') || '—'}</small></div>}
      </div>
      <aside className="lab-controls">{GROUPS.map(group => <div className="lab-group" key={group}><h3>{group}</h3><div className="lab-buttons">{SHOWCASES.filter(s => s.group === group).map(s => <button key={s.id} className={playback?.showcase.id === s.id ? 'primary' : ''} onClick={() => play(s)}>{s.label}</button>)}</div></div>)}
        <p>O motor decide alvo, dano, bloqueio, morte e status; a animação só representa o resultado.</p></aside>
    </section></main>;
}
