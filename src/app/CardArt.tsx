import { useId, type ReactElement } from 'react';
import { CARD_ASSETS } from '../data/assets';
import type { CardModel, Faction, MonsterCard } from '../types';

type Weapon = 'sword' | 'axe' | 'hammer' | 'bow' | 'staff' | 'orb' | 'scythe' | 'shield';
type Hat = 'helm' | 'horns' | 'hood' | 'wizard' | 'leaf' | 'bandana' | 'crown' | 'witch';
type Look = { hat?: Hat; weapons: Weapon[]; mood: 'fierce' | 'calm' | 'grin'; body?: 'stone' | 'ghost'; beard?: boolean; tusks?: boolean; glow?: boolean };

// Visual identity of each monster: what the penguin wears and wields.
const LOOKS: Record<string, Look> = {
  orc_warrior: { hat: 'helm', weapons: ['axe'], mood: 'fierce', tusks: true },
  iron_knight: { hat: 'helm', weapons: ['sword', 'shield'], mood: 'calm' },
  berserker: { hat: 'horns', weapons: ['axe'], mood: 'fierce' },
  stone_golem: { weapons: [], mood: 'calm', body: 'stone' },
  elven_archer: { hat: 'leaf', weapons: ['bow'], mood: 'calm' },
  goblin_hunter: { hat: 'hood', weapons: ['bow'], mood: 'grin', tusks: true },
  forest_scout: { hat: 'hood', weapons: ['bow'], mood: 'fierce' },
  arcane_mage: { hat: 'wizard', weapons: ['staff'], mood: 'calm' },
  elder_druid: { hat: 'leaf', weapons: ['staff'], mood: 'calm', beard: true },
  necromancer: { hat: 'hood', weapons: ['scythe'], mood: 'fierce', glow: true },
  shadow_wraith: { hat: 'hood', weapons: [], mood: 'fierce', body: 'ghost', glow: true },
  wandering_demon: { hat: 'horns', weapons: ['orb'], mood: 'grin', glow: true },
  glacier_guardian: { hat: 'helm', weapons: ['hammer', 'shield'], mood: 'calm' },
  tundra_duelist: { hat: 'bandana', weapons: ['sword'], mood: 'fierce' },
  icebreaker: { hat: 'helm', weapons: ['hammer'], mood: 'fierce' },
  sacrifice_knight: { hat: 'helm', weapons: ['sword', 'shield'], mood: 'fierce' },
  ice_scout: { hat: 'bandana', weapons: ['bow'], mood: 'grin' },
  aurora_sniper: { hat: 'crown', weapons: ['bow'], mood: 'calm' },
  moss_hunter: { hat: 'leaf', weapons: ['bow'], mood: 'grin' },
  frost_sage: { hat: 'wizard', weapons: ['staff'], mood: 'calm', beard: true },
  mirror_mage: { hat: 'wizard', weapons: ['orb'], mood: 'calm' },
  healing_seer: { hat: 'crown', weapons: ['staff'], mood: 'calm' },
  frost_witch: { hat: 'witch', weapons: ['orb'], mood: 'grin', glow: true },
  storm_imp: { hat: 'horns', weapons: ['orb'], mood: 'grin' },
};
const fallbackLook = (card: MonsterCard): Look => ({ weapons: [({ melee: 'sword', ranged: 'bow', magic: 'staff', chaos: 'orb' } as const)[card.attacks[0].type]], mood: 'fierce' });

const SKY: Record<Faction, [string, string]> = { war: ['#c9634f', '#3a1520'], nature: ['#7fd3a8', '#123a33'], balance: ['#8fd0ff', '#173a66'], fortune: ['#ffd57a', '#5a3714'], chaos: ['#9a62d6', '#1d1035'], neutral: ['#b9c8d8', '#2b3a4c'] };
const SCARF: Record<Faction, string> = { war: '#d64545', nature: '#3fae6e', balance: '#3c8fe0', fortune: '#e0aa2e', chaos: '#9b4fd1', neutral: '#7f8ea3' };

function Scene({ faction }: { faction: Faction }) {
  if (faction === 'war') return <g fill="#2a0f17" opacity=".75"><path d="M14 80V50h8v-6h6v6h8v-6h6v6h8v36z" /><path d="M118 80V40h6v-6h6v6h6v-6h6v46z" /><path d="M132 34v-14l10 4-10 4" fill="#d64545" /></g>;
  if (faction === 'nature') return <g fill="#0f3a2c" opacity=".8">{[8, 26, 128, 146].map((x, i) => <path key={x} d={`M${x} 86l12-${34 + (i % 2) * 10} 12 ${34 + (i % 2) * 10}z`} />)}</g>;
  if (faction === 'balance') return <g fill="#d8f2ff" opacity=".55"><path d="M16 84l8-40 8 40zM30 84l5-24 5 24zM126 84l8-46 8 46zM118 84l5-22 5 22z" /></g>;
  if (faction === 'fortune') return <g><circle cx="80" cy="30" r="22" fill="#fff1b8" opacity=".55" />{[0, 30, 60, 90, 120, 150].map(a => <rect key={a} x="79" y="-6" width="2" height="72" fill="#fff6d0" opacity=".25" transform={`rotate(${a} 80 30)`} />)}</g>;
  if (faction === 'chaos') return <g><circle cx="128" cy="22" r="11" fill="#f1d9ff" opacity=".8" /><circle cx="133" cy="19" r="10" fill="#2a1645" /><path d="M10 40c20-18 40 10 20 18s-30-6-10-14" stroke="#c99bf0" strokeWidth="2" fill="none" opacity=".5" /></g>;
  return <g fill="#6b7d92" opacity=".7"><path d="M-4 86l34-46 24 30 18-20 40 36z" /><path d="M24 48l6-8 6 8z" fill="#eef6ff" /></g>;
}

function WeaponShape({ kind, glow }: { kind: Weapon; glow: string }) {
  switch (kind) {
    case 'sword': return <g><path d="M-2.5-2V-36L0-42 2.5-36V-2z" fill="#e6eef5" stroke="#5d6f80" strokeWidth=".8" /><rect x="-9" y="-3" width="18" height="4" rx="1.5" fill="#e0aa2e" /><rect x="-1.5" y="1" width="3" height="8" fill="#6b3f1f" /><circle cy="10.5" r="2.2" fill="#e0aa2e" /></g>;
    case 'axe': return <g><rect x="-1.5" y="-38" width="3" height="52" rx="1.5" fill="#7a4a24" /><path d="M1-37c14-4 19 9 14 18-4-4-8-4-14-2z" fill="#d7e1ea" stroke="#5d6f80" strokeWidth=".8" /></g>;
    case 'hammer': return <g><rect x="-1.5" y="-30" width="3" height="44" rx="1.5" fill="#7a4a24" /><rect x="-11" y="-42" width="22" height="13" rx="3" fill="#9aa8b6" stroke="#4d5b69" strokeWidth=".8" /></g>;
    case 'bow': return <g><path d="M4-32Q20 0 4 32" stroke="#8a5528" strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M4-32V32" stroke="#efe6cf" strokeWidth=".8" /><path d="M-16 0H12" stroke="#c9b48a" strokeWidth="1.5" /><path d="M12-3l5 3-5 3z" fill="#d7e1ea" /></g>;
    case 'staff': return <g><rect x="-1.5" y="-38" width="3" height="58" rx="1.5" fill="#7a4a24" /><circle cy="-42" r="6" fill={glow} /><circle cy="-42" r="9" fill={glow} opacity=".3" /><circle cx="-2" cy="-44" r="1.6" fill="#fff" /></g>;
    case 'orb': return <g><circle cy="-8" r="11" fill={glow} opacity=".3" /><circle cy="-8" r="7" fill={glow} /><circle cx="-2.5" cy="-10.5" r="2" fill="#fff" opacity=".9" /></g>;
    case 'scythe': return <g><rect x="-1.5" y="-40" width="3" height="58" rx="1.5" fill="#4a3424" /><path d="M0-40c-18-2-27 10-29 19 9-9 19-12 29-12z" fill="#cfd8e3" stroke="#5d6f80" strokeWidth=".8" /></g>;
    case 'shield': return <g><circle r="14" fill="#8a5a30" stroke="#a9b6c3" strokeWidth="3" /><path d="M0-8l3 6h6l-5 4 2 7-6-4-6 4 2-7-5-4h6z" fill="#e0aa2e" /></g>;
  }
}

function HatShape({ hat, color }: { hat: Hat; color: string }) {
  switch (hat) {
    case 'helm': return <g><path d="M59 38a21 21 0 0 1 42 0v4H59z" fill="#a9b6c3" stroke="#4d5b69" strokeWidth="1" /><rect x="78.5" y="28" width="3" height="17" rx="1" fill="#8a97a5" /><path d="M80 21c6-8 14-8 18-4-6 0-12 2-18 8z" fill={color} /></g>;
    case 'horns': return <g fill="#efe3c4" stroke="#7a6a48" strokeWidth=".8"><path d="M64 30c-10-4-12-14-8-20 1 8 6 12 12 14z" /><path d="M96 30c10-4 12-14 8-20-1 8-6 12-12 14z" /></g>;
    case 'hood': return <path d="M56 54c-4-24 8-38 24-38s28 14 24 38c-4-6-8-10-10-16H66c-2 6-6 10-10 16z" fill={color} stroke="#0008" strokeWidth="1" />;
    case 'wizard': return <g fill={color} stroke="#0006" strokeWidth=".8"><ellipse cx="80" cy="27" rx="25" ry="5" /><path d="M64 27L86 2l10 25z" /><path d="M85 13l1.5 3 3 .5-2.2 2 .6 3.2-2.9-1.6-2.9 1.6.6-3.2-2.2-2 3-.5z" fill="#ffe28a" stroke="none" /></g>;
    case 'witch': return <g fill="#2a1645" stroke="#0006" strokeWidth=".8"><ellipse cx="80" cy="27" rx="26" ry="5" /><path d="M66 27c4-12 8-20 26-24-8 6-6 14-4 24z" /><rect x="67" y="22" width="26" height="4" fill={color} stroke="none" /></g>;
    case 'leaf': return <g fill="#4fbf72" stroke="#1d5a34" strokeWidth=".7">{[-34, -16, 0, 16, 34].map(a => <ellipse key={a} cx="80" cy="18" rx="4" ry="8" transform={`rotate(${a} 80 40)`} />)}</g>;
    case 'bandana': return <g fill={color}><path d="M61 34c12-6 26-6 38 0v6c-12-5-26-5-38 0z" /><path d="M99 36l10-2-4 8z" /></g>;
    case 'crown': return <path d="M66 24l4-12 6 8 4-12 4 12 6-8 4 12z" fill="#ffd257" stroke="#9a6b12" strokeWidth="1" />;
  }
}

function Penguin({ look, faction, glow }: { look: Look; faction: Faction; glow: string }) {
  const dark = look.body === 'stone' ? '#66717d' : look.body === 'ghost' ? '#3b2a5c' : '#1d2430';
  const belly = look.body === 'stone' ? '#a7b0b9' : look.body === 'ghost' ? '#cbbcf0' : '#f7f1df';
  const pupil = look.glow ? glow : '#10161f';
  const brows = look.mood === 'fierce' ? 'M67 33l9 4M93 33l-9 4' : look.mood === 'grin' ? 'M67 35q4-3 8 0M85 35q4-3 8 0' : 'M68 35h7M85 35h7';
  const hasShield = look.weapons.includes('shield');
  const hand = look.weapons.filter(w => w !== 'shield');
  return <g opacity={look.body === 'ghost' ? .88 : 1}>
    <ellipse cx="80" cy="105" rx="30" ry="4" fill="#0006" />
    {look.body !== 'ghost' && <><ellipse cx="71" cy="103" rx="8" ry="3.5" fill="#f6a23a" /><ellipse cx="89" cy="103" rx="8" ry="3.5" fill="#f6a23a" /></>}
    <ellipse cx="56" cy="76" rx="6" ry="16" fill={dark} transform="rotate(20 56 76)" />
    <path d={look.body === 'ghost' ? 'M55 74c0-22 50-22 50 0v28l-6-5-6 6-7-6-6 6-7-6-6 6-6-5-6 5z' : 'M55 74a25 30 0 0 0 50 0a25 30 0 0 0-50 0'} fill={dark} />
    <ellipse cx="80" cy="80" rx="17" ry="22" fill={belly} />
    {look.body === 'stone' && <path d="M66 70l6 6-3 6M92 64l-5 8 4 5M78 90l4 6" stroke="#4d5763" strokeWidth="1.4" fill="none" />}
    <circle cx="80" cy="40" r="19" fill={dark} />
    <path d="M64 44a9 9 0 0 1 16-6 9 9 0 0 1 16 6c0 8-7 13-16 13s-16-5-16-13z" fill={belly} />
    <circle cx="73" cy="41" r="4.2" fill="#fff" /><circle cx="87" cy="41" r="4.2" fill="#fff" />
    <circle cx="74.5" cy="41.5" r="2.3" fill={pupil} /><circle cx="85.5" cy="41.5" r="2.3" fill={pupil} />
    <path d={brows} stroke="#10161f" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d={look.mood === 'grin' ? 'M74 46h12l-6 8z' : 'M75 46h10l-5 7z'} fill="#f6a23a" stroke="#b86a12" strokeWidth=".6" />
    {look.tusks && <path d="M73 48l-1 5 3-3zM87 48l1 5-3-3z" fill="#fff" />}
    {look.beard && <path d="M70 52c2 12 18 12 20 0-4 4-16 4-20 0z" fill="#eef3f7" />}
    <path d="M60 56c12 6 28 6 40 0v6c-12 6-28 6-40 0z" fill={SCARF[faction]} />
    <path d="M94 60l6 14-7-2z" fill={SCARF[faction]} />
    {look.hat && <HatShape hat={look.hat} color={SCARF[faction]} />}
    <ellipse cx="104" cy="70" rx="6" ry="15" fill={dark} transform="rotate(-35 104 70)" />
    {hand.map(w => <g key={w} transform="translate(110 62)"><WeaponShape kind={w} glow={glow} /></g>)}
    {hasShield && <g transform="translate(52 80)"><WeaponShape kind="shield" glow={glow} /></g>}
  </g>;
}

function ItemArt({ card, glow }: { card: CardModel; glow: string }) {
  if (card.category === 'equipment') {
    const weapon: Weapon | null = card.subtype === 'weapon' ? (card.attackModifier?.attackType === 'ranged' ? 'bow' : card.id.includes('axe') ? 'axe' : 'sword') : card.subtype === 'staff' ? 'staff' : card.subtype === 'shield' ? 'shield' : null;
    if (weapon) return <g transform={`translate(80 ${weapon === 'shield' ? 60 : 78}) scale(${weapon === 'shield' ? 2.2 : 1.35}) rotate(${weapon === 'bow' || weapon === 'shield' ? 0 : 30})`}><WeaponShape kind={weapon} glow={glow} /></g>;
    if (card.subtype === 'armor') return <g transform="translate(80 58)"><path d="M-22-22l10-6h24l10 6 8 14-10 6v34h-40V-2l-10-6z" fill="#a9b6c3" stroke="#4d5b69" strokeWidth="1.5" /><path d="M-10-28c4 8 16 8 20 0" stroke="#4d5b69" fill="none" /><circle cy="4" r="6" fill={glow} /></g>;
    return <g transform="translate(80 54)"><path d="M-16-22Q0 0 16-22" stroke="#e0aa2e" strokeWidth="2" fill="none" /><path d="M0-6l12 14L0 26-12 8z" fill={glow} stroke="#fff8" strokeWidth="1.5" /><path d="M0-6l5 14-5 18" fill="#fff4" /></g>;
  }
  if (card.category !== 'effect') return null;
  const glyph: Record<string, ReactElement> = {
    heal: <path d="M-7-22h14v15h15V7H7v15H-7V7h-15V-7h15z" fill="#7cf0a8" stroke="#1d7a48" strokeWidth="2" />,
    directDamage: <g><path d="M0-26c10 12 18 18 18 30a18 18 0 0 1-36 0c0-8 6-12 8-20 4 6 6 8 10 8z" fill="#ff8a3d" /><path d="M0-6c5 6 8 9 8 14a8 8 0 0 1-16 0c0-4 4-8 8-14z" fill="#ffe28a" /></g>,
    poison: <g><path d="M-10-24h20v8l10 18a14 14 0 0 1-12 22H-8a14 14 0 0 1-12-22l10-18z" fill="#6fdc6f" opacity=".9" stroke="#1d5a34" strokeWidth="2" /><circle cx="-4" cy="6" r="3" fill="#d8ffd8" /><circle cx="5" cy="12" r="2" fill="#d8ffd8" /></g>,
    attackBuff: <g><path d="M0-28l8 16H3v26h-6V-12h-5z" fill="#ffd257" stroke="#9a6b12" strokeWidth="1.5" /><path d="M-16 20h32" stroke="#ff8a3d" strokeWidth="4" strokeLinecap="round" /></g>,
    cleanse: <path d="M-24 4c8-10 16 10 24 0s16 10 24 0M-24 16c8-10 16 10 24 0s16 10 24 0" stroke="#a8ecff" strokeWidth="4" fill="none" strokeLinecap="round" />,
    resource: <path d="M0-26l16 18L0 26-16-8z" fill="#7de0f7" stroke="#e9fbff" strokeWidth="2" />,
  };
  const shape = glyph[card.effect] ?? <path d="M-22 10a22 22 0 0 1 44 0z" fill="#8fd0ff88" stroke="#e9fbff" strokeWidth="2" />;
  return <g transform="translate(80 58)"><circle r="30" fill={glow} opacity=".22" /><circle r="22" fill="none" stroke={glow} strokeWidth="1.5" strokeDasharray="3 4" />{shape}</g>;
}

export default function CardArt({ card }: { card: CardModel }) {
  const uid = useId().replace(/:/g, '');
  const [top, bottom] = SKY[card.faction];
  const glow = card.art.factionColor;
  const asset = CARD_ASSETS[card.id];
  if (asset?.status === 'ready') return <img className="card-art-img" src={asset.illustration} alt={card.name} loading="lazy" />;
  return <svg className="card-art-svg" viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice" role="img" aria-label={card.name}>
    <defs><linearGradient id={`sky${uid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="1" stopColor={bottom} /></linearGradient></defs>
    <rect width="160" height="110" fill={`url(#sky${uid})`} />
    <Scene faction={card.faction} />
    <path d="M-10 110c20-24 60-28 90-22s60-2 90 22z" fill="#e8f4fb" opacity=".9" />
    {card.category === 'monster' ? <g transform="translate(9.6 -1) scale(.88)"><Penguin look={LOOKS[card.id] ?? fallbackLook(card)} faction={card.faction} glow={glow} /></g> : <ItemArt card={card} glow={glow} />}
  </svg>;
}
