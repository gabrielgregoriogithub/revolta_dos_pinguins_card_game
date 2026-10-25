import type { CombatVisualEvent } from '../types';
import { ATTACK_FX_PROFILES } from '../vfx/profiles';

type AudioSettings = { master: number; effects: number; muted: boolean };
const DEFAULTS: AudioSettings = { master: .7, effects: .75, muted: false };

// Sons sintetizados (originais, sem assets externos): cada efeito é uma pilha de camadas de tom e ruído.
type Layer = { tone: [from: number, to: number | null, type: OscillatorType]; volume: number; duration: number; delay?: number } | { noise: number; volume: number; duration: number; delay?: number };
const t = (from: number, to: number | null, type: OscillatorType, volume: number, duration: number, delay = 0): Layer => ({ tone: [from, to, type], volume, duration, delay });
const n = (filter: number, volume: number, duration: number, delay = 0): Layer => ({ noise: filter, volume, duration, delay });
const bubbles = (from: number, delay = 0) => [t(from, from * 1.8, 'sine', .07, .07, delay), t(from * 1.2, from * 2, 'sine', .06, .06, delay + .07), t(from * .9, from * 1.6, 'sine', .06, .07, delay + .15)];

export const SOUNDS: Record<string, Layer[]> = {
  'sword-windup': [t(180, 280, 'triangle', .12, .12)], 'sword-swish': [n(1800, .16, .18)], 'sword-hit': [t(110, 70, 'square', .18, .12), n(900, .15, .08), t(1800, 900, 'triangle', .06, .05)],
  'axe-windup': [t(90, 55, 'sawtooth', .14, .22)], 'axe-swish': [n(700, .24, .25)], 'axe-hit': [t(70, 38, 'square', .26, .2), n(450, .2, .13)],
  'katana-windup': [t(660, 980, 'sine', .12, .16)], 'katana-swish': [n(3200, .2, .12)], 'katana-hit': [t(900, 240, 'triangle', .2, .13)],
  'spear-windup': [t(240, 380, 'triangle', .1, .12)], 'spear-swish': [n(2600, .2, .1)], 'spear-hit': [t(420, 160, 'triangle', .18, .1), n(2200, .14, .05)],
  'hammer-windup': [t(70, 45, 'sawtooth', .16, .3)], 'hammer-swish': [n(500, .22, .22)], 'hammer-hit': [t(55, 30, 'square', .3, .28), n(260, .28, .25)],
  'monk-windup': [t(220, 420, 'sine', .1, .12)], 'monk-swish': [n(1500, .2, .1)], 'monk-hit': [t(140, 80, 'square', .2, .08)],
  'claw-windup': [t(300, 520, 'triangle', .1, .1)], 'claw-swish': [n(3000, .18, .09), n(3000, .16, .09, .05), n(3000, .14, .09, .1)], 'claw-hit': [n(1600, .16, .08), t(160, 90, 'square', .14, .1)],
  'bite-windup': [t(140, 90, 'sawtooth', .12, .15)], 'bite-swish': [n(1200, .14, .08)], 'bite-hit': [t(90, 60, 'square', .22, .09), n(700, .2, .05)],
  'bow-draw': [t(260, 540, 'triangle', .14, .18)], 'arrow-release': [n(2400, .14, .1)], 'arrow-hit': [t(210, 80, 'triangle', .17, .1), n(1700, .12, .06)],
  'fire-charge': [t(120, 460, 'sawtooth', .15, .3)], 'fire-release': [n(1100, .2, .18)], 'fire-impact': [t(80, 35, 'sawtooth', .28, .3), n(500, .25, .28)],
  'ice-charge': [t(880, 1440, 'sine', .14, .24)], 'ice-release': [n(3500, .12, .12)], 'ice-impact': [t(1200, 240, 'triangle', .22, .23), t(2400, 1600, 'triangle', .06, .08, .05)],
  'nature-charge': [t(330, 520, 'sine', .13, .28)], 'nature-release': [n(1000, .12, .2)], 'nature-impact': [t(200, 70, 'triangle', .18, .18), n(1200, .08, .15)],
  'shadow-charge': [t(70, 30, 'sawtooth', .18, .34)], 'shadow-release': [n(350, .15, .24)], 'shadow-impact': [t(55, 25, 'square', .24, .3), t(220, 90, 'sine', .08, .3)],
  'poison-charge': [t(260, 180, 'sine', .12, .3)], 'poison-release': [n(900, .14, .2)], 'poison-impact': [n(600, .18, .3), ...bubbles(400, .05)],
  'arcane-charge': [t(440, 880, 'sine', .13, .28)], 'arcane-release': [n(2600, .14, .14)], 'arcane-impact': [t(660, 220, 'triangle', .2, .2), t(990, 330, 'sine', .1, .18)],
  'light-charge': [t(660, 1320, 'sine', .12, .3)], 'light-release': [n(4000, .1, .12)], 'light-impact': [t(1320, null, 'sine', .14, .35), t(1760, null, 'sine', .1, .35, .05)],
  'water-charge': [t(180, 620, 'sine', .12, .28), n(900, .06, .2)], 'water-release': [n(1200, .14, .16)], 'water-impact': [n(420, .18, .24), t(260, 110, 'sine', .1, .2)],
  'wind-charge': [n(700, .1, .28), t(260, 520, 'triangle', .08, .25)], 'wind-release': [n(2600, .18, .16)], 'wind-impact': [n(1800, .14, .18), t(400, 160, 'sine', .08, .2)],
  'lightning-charge': [n(5000, .12, .3), t(120, 900, 'sawtooth', .1, .3)], 'lightning-release': [n(3800, .28, .12)], 'lightning-impact': [n(2500, .3, .2), t(80, 40, 'square', .2, .18)],
  'chaos-charge': [t(180, 720, 'sawtooth', .15, .3)], 'chaos-release': [n(1400, .2, .2)], 'chaos-impact': [t(100, 45, 'square', .24, .24), t(560, 180, 'sawtooth', .13, .16)],
  'breath-charge': [t(60, 140, 'sawtooth', .2, .45), n(400, .14, .4)], 'breath-release': [n(700, .3, .5)], 'breath-impact': [t(50, 28, 'square', .32, .4), n(350, .3, .4)],
  'boss-roar': [t(70, 48, 'sawtooth', .26, .55), t(105, 70, 'sawtooth', .16, .55), n(300, .16, .5)],
  'heavy-thud': [t(48, 30, 'sine', .3, .22)], 'absorb-shield': [t(520, 880, 'sine', .16, .22), t(780, 1040, 'triangle', .08, .18)],
  'block-metal': [t(1400, 900, 'triangle', .18, .12), n(3000, .14, .06), t(220, null, 'square', .1, .08)],
  'reflect-launch': [t(880, 1760, 'triangle', .14, .2)], 'thorns-launch': [n(2400, .16, .06), t(500, 250, 'triangle', .12, .1)], 'drain-launch': [t(300, 150, 'sawtooth', .12, .4), t(600, 300, 'sine', .08, .4)],
  heal: [t(520, 1040, 'sine', .16, .35), t(780, 1300, 'sine', .08, .35, .08)], stun: [t(900, 600, 'triangle', .1, .15), t(900, 600, 'triangle', .08, .15, .16)],
  freeze: [t(1600, 700, 'triangle', .18, .3), n(6000, .12, .2)], 'poison-bubble': bubbles(300), buff: [t(330, 660, 'sawtooth', .1, .25)],
  block: [t(240, 620, 'triangle', .18, .2)], miss: [n(300, .1, .12), t(600, 900, 'sine', .06, .1)], death: [t(110, 38, 'sawtooth', .18, .4)],
  summon: [t(300, 680, 'sine', .15, .3)], equip: [n(1300, .14, .12)],
  'death-physical': [t(110, 38, 'sawtooth', .18, .4), n(500, .2, .3)], 'death-fire': [n(900, .25, .5), t(90, 40, 'sawtooth', .14, .5)],
  'death-ice': [t(2000, 800, 'triangle', .16, .2), t(2400, 900, 'triangle', .12, .2, .08), t(1800, 700, 'triangle', .1, .2, .16), n(5000, .18, .3)],
  'death-lightning': [n(3500, .3, .3), t(200, 60, 'square', .16, .3)], 'death-poison': [t(200, 80, 'sine', .16, .6), ...bubbles(260, .1)], 'death-water': [n(500, .18, .34), t(260, 90, 'sine', .1, .3)], 'death-wind': [n(1900, .14, .35), t(360, 120, 'triangle', .08, .3)],
  'death-shadow': [t(80, 30, 'sawtooth', .2, .7), t(160, 60, 'sine', .1, .7)], 'death-nature': [n(1200, .14, .4), t(300, 150, 'sine', .12, .4)],
  'death-light': [t(1200, 300, 'sine', .14, .5)], 'death-arcane': [t(1200, 300, 'sine', .14, .5)], 'death-chaos': [t(120, 40, 'sawtooth', .18, .5), t(700, 200, 'sawtooth', .1, .4)],
};
// Impacto genérico por elemento (danos sem atacante, como cartas Flash e veneno).
const ALIASES: Record<string, string> = { 'physical-hit': 'sword-hit', 'fire-hit': 'fire-impact', 'ice-hit': 'ice-impact', 'lightning-hit': 'lightning-impact', 'poison-hit': 'poison-impact', 'shadow-hit': 'shadow-impact', 'nature-hit': 'nature-impact', 'light-hit': 'light-impact', 'arcane-hit': 'arcane-impact', 'chaos-hit': 'chaos-impact', 'monk-strike': 'monk-swish' };
export const resolveSound = (id: string) => SOUNDS[id] ? id : ALIASES[id] && SOUNDS[ALIASES[id]] ? ALIASES[id] : null;

const VOICE_WINDOW_MS = 120;
const VARIATION = .06;

class AudioManager {
  private context: AudioContext | null = null;
  private ambientTimer: number | null = null;
  private settings: AudioSettings = this.load();
  private lastEvent = '';
  private recentVoices: number[] = [];
  private cueTimers = new Set<number>();
  private load(): AudioSettings { try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('pinguins-audio') ?? '{}') }; } catch { return DEFAULTS; } }
  private save() { try { localStorage.setItem('pinguins-audio', JSON.stringify(this.settings)); } catch { /* storage is optional */ } }
  private getContext() { if (!this.context) this.context = new AudioContext(); if (this.context.state === 'suspended') void this.context.resume(); return this.context; }
  setMuted(muted: boolean) { this.settings.muted = muted; this.save(); }
  isMuted() { return this.settings.muted; }
  effectsVolume() { return this.settings.effects; }
  setEffects(volume: number) { this.settings.effects = Math.max(0, Math.min(1, volume)); this.save(); }
  // Limita o volume quando muitos sons disparam juntos (ataques múltiplos), evitando ruído acumulado.
  private voiceGain() { const now = performance.now(); this.recentVoices = this.recentVoices.filter(at => now - at < VOICE_WINDOW_MS); this.recentVoices.push(now); return 1 / (1 + .35 * (this.recentVoices.length - 1)); }
  private clearQueuedCues() { for (const timer of this.cueTimers) window.clearTimeout(timer); this.cueTimers.clear(); }
  private layer(c: AudioContext, layer: Layer, pitch: number, gainScale: number) {
    const start = c.currentTime + (layer.delay ?? 0); const volume = Math.max(.0001, layer.volume * gainScale * this.settings.master * this.settings.effects); const gain = c.createGain();
    if ('tone' in layer) {
      const [from, to, type] = layer.tone; const osc = c.createOscillator(); osc.type = type;
      osc.frequency.setValueAtTime(from * pitch, start); if (to) osc.frequency.exponentialRampToValueAtTime(Math.max(20, to * pitch), start + layer.duration);
      gain.gain.setValueAtTime(.0001, start); gain.gain.exponentialRampToValueAtTime(volume, start + .008); gain.gain.exponentialRampToValueAtTime(.0001, start + layer.duration);
      osc.connect(gain).connect(c.destination); osc.start(start); osc.stop(start + layer.duration + .02); return;
    }
    const buffer = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * layer.duration)), c.sampleRate); const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const source = c.createBufferSource(); const filter = c.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = layer.noise * pitch;
    gain.gain.value = volume; source.buffer = buffer; source.connect(filter).connect(gain).connect(c.destination); source.start(start);
  }
  play(id: string) {
    const resolved = resolveSound(id); if (!resolved || this.settings.muted) return;
    try {
      const c = this.getContext(); const pitch = 1 + (Math.random() * 2 - 1) * VARIATION; const gainScale = this.voiceGain() * (.9 + Math.random() * .2);
      for (const layer of SOUNDS[resolved]) this.layer(c, layer, pitch, gainScale);
    } catch { /* áudio é opcional: falhas nunca interrompem a partida */ }
  }
  previewProfile(profileId: string) { const profile = ATTACK_FX_PROFILES[profileId] ?? ATTACK_FX_PROFILES.sword; this.play(profile.windupSound); window.setTimeout(() => this.play(profile.releaseSound), 220); window.setTimeout(() => this.play(profile.impactSound), 520); }
  startAmbient(biomeId: string) { this.stopAmbient(); const notes: Record<string, number> = { forest: 220, mountains: 150, desert: 180, swamp: 110, peaks: 300, volcano: 70, ruins: 260, castle: 90 }; const note = notes[biomeId] ?? 180; this.ambientTimer = window.setInterval(() => { if (!this.settings.muted) this.play('ambient'); }, 1900); SOUNDS.ambient = [t(note, note * 1.02, 'sine', .018, .55)]; }
  stopAmbient() { if (this.ambientTimer !== null) { window.clearInterval(this.ambientTimer); this.ambientTimer = null; } }
  // Toca as deixas sonoras planejadas pela coreografia, no mesmo ritmo da animação (escalado pela velocidade).
  playVisualEvent(event: CombatVisualEvent, speedFactor = 1) {
    if (!event) return;
    if (speedFactor === 0) { this.clearQueuedCues(); return; }
    if (event.id === this.lastEvent) return;
    this.clearQueuedCues(); this.lastEvent = event.id;
    for (const cue of event.fx?.sounds ?? []) {
      if (cue.atMs === 0) this.play(cue.id);
      else {
        const timer = window.setTimeout(() => { this.cueTimers.delete(timer); this.play(cue.id); }, cue.atMs * speedFactor);
        this.cueTimers.add(timer);
      }
    }
  }
}
export const audioManager = new AudioManager();
