import type { ReactElement } from 'react';
import type { AttackType } from '../types';

// Ícones desenhados no mesmo traço cartunesco das molduras: contorno escuro, metal dourado e brilho.
const OUTLINE = '#2a1706';
const GOLD = '#f6cf63';

function Sword() {
  return <g stroke={OUTLINE} strokeWidth="1.4" strokeLinejoin="round">
    <path d="M24.5 4.5 27.5 7.5 13 22 10 19z" fill="#e8f3fb" />
    <path d="M24.5 4.5 27.5 7.5 18 17" fill="none" stroke="#fff" strokeWidth=".9" opacity=".8" />
    <path d="M7.5 17.5 14.5 24.5 12.8 26.2 5.8 19.2z" fill={GOLD} />
    <path d="M10.4 23.3 8.7 21.6 4.6 25.7 6.3 27.4z" fill="#8a5326" />
    <circle cx="4.6" cy="27.4" r="2" fill={GOLD} />
  </g>;
}

function Bow() {
  return <g stroke={OUTLINE} strokeLinejoin="round" strokeLinecap="round">
    <path d="M11 3.5C22 7 22 25 11 28.5" fill="none" strokeWidth="4.6" />
    <path d="M11 3.5C22 7 22 25 11 28.5" fill="none" stroke="#b06a2c" strokeWidth="2.8" />
    <path d="M11 3.5V28.5" stroke="#f3ead0" strokeWidth="1" />
    <circle cx="11" cy="3.5" r="2" fill={GOLD} strokeWidth="1.1" />
    <circle cx="11" cy="28.5" r="2" fill={GOLD} strokeWidth="1.1" />
    <path d="M4 16H25" stroke={OUTLINE} strokeWidth="3" />
    <path d="M4 16H25" stroke="#7a4a20" strokeWidth="1.4" />
    <path d="M24 12.2 30 16 24 19.8z" fill="#e8f3fb" strokeWidth="1.2" />
    <path d="M4 16 2 12.5H6.5L8.5 16 6.5 19.5H2z" fill="#d93f3f" strokeWidth="1" />
  </g>;
}

function Magic() {
  return <g stroke={OUTLINE} strokeLinejoin="round" strokeWidth="1.3">
    <circle cx="16" cy="17" r="9.5" fill="#2f76d6" />
    <circle cx="16" cy="17" r="9.5" fill="url(#atk-magic-glow)" stroke="none" />
    <path d="M16 6.5 18.1 14.9 26.5 17 18.1 19.1 16 27.5 13.9 19.1 5.5 17 13.9 14.9z" fill="#f4fbff" />
    <circle cx="24.5" cy="7.5" r="1.6" fill={GOLD} strokeWidth="1" />
    <circle cx="7" cy="9" r="1.1" fill="#bfe9ff" strokeWidth=".8" />
  </g>;
}

function Chaos() {
  return <g stroke={OUTLINE} strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.3">
    <path d="M16 3.5 18.4 9.2 24.8 7.2 22.8 13.6 28.5 16 22.8 18.4 24.8 24.8 18.4 22.8 16 28.5 13.6 22.8 7.2 24.8 9.2 18.4 3.5 16 9.2 13.6 7.2 7.2 13.6 9.2z" fill="#7c2fc0" />
    <path d="M16 10.5c3.6 0 5.6 2.4 5.2 5.2-.4 2.6-3 3.8-5 3-1.8-.8-1.8-3-.4-3.6" fill="none" stroke="#ffd6ff" strokeWidth="1.8" />
    <circle cx="16" cy="16" r="1.4" fill="#ffe36a" strokeWidth=".8" />
  </g>;
}

const ICONS: Record<AttackType, () => ReactElement> = { melee: Sword, ranged: Bow, magic: Magic, chaos: Chaos };

export default function AttackIcon({ type }: { type: AttackType }) {
  const Icon = ICONS[type];
  return <svg className="attack-icon" viewBox="0 0 32 32" aria-hidden="true">
    <defs><radialGradient id="atk-magic-glow" cx="35%" cy="30%" r="70%"><stop offset="0" stopColor="#bfe9ff" stopOpacity=".9" /><stop offset="1" stopColor="#123a8a" stopOpacity="0" /></radialGradient></defs>
    <Icon />
  </svg>;
}
