import type { AbilityId } from '../types';

export type StatusGroup = 'positive' | 'negative' | 'offensive' | 'tactical';
export interface StatusVisual { id: AbilityId; label: string; icon: string; group: StatusGroup; color: string; }
export type StatusDuration = 'permanent' | 'temporary' | 'instant';
export interface StatusRule { durationType: StatusDuration; stackable: boolean; showOnCard: boolean; priority: number; }

// Biblioteca única inspirada no guia oficial. Os ícones são visuais; as regras permanecem no motor.
export const STATUS_VISUALS: Record<AbilityId, StatusVisual> = {
  shield: { id: 'shield', label: 'Escudo', icon: '⬟', group: 'positive', color: '#4db7ff' },
  regeneration: { id: 'regeneration', label: 'Regeneração', icon: '♥', group: 'positive', color: '#58e36c' },
  thorns: { id: 'thorns', label: 'Espinhos', icon: '✦', group: 'positive', color: '#8df06f' },
  counter: { id: 'counter', label: 'Contra-ataque', icon: '⚔', group: 'offensive', color: '#ffb52e' },
  flying: { id: 'flying', label: 'Voo', icon: '➤', group: 'positive', color: '#8bd4ff' },
  doubleStrike: { id: 'doubleStrike', label: 'Ataque duplo', icon: '⚔⚔', group: 'offensive', color: '#ff8b33' },
  reach: { id: 'reach', label: 'Alcance', icon: '➶', group: 'offensive', color: '#ffd34e' },
  reflect: { id: 'reflect', label: 'Reflexão', icon: '◈', group: 'positive', color: '#b3ddff' },
  poison: { id: 'poison', label: 'Veneno', icon: '☠', group: 'negative', color: '#7dff38' },
  stun: { id: 'stun', label: 'Atordoamento', icon: '✦', group: 'negative', color: '#ffdd55' },
  heal: { id: 'heal', label: 'Cura', icon: '✚', group: 'tactical', color: '#53ff70' },
  attackBuff: { id: 'attackBuff', label: 'Aumento de ataque', icon: '↑', group: 'positive', color: '#ff9d35' },
  armorBreak: { id: 'armorBreak', label: 'Ruptura de armadura', icon: '⟐', group: 'offensive', color: '#ff5e5e' },
  lifesteal: { id: 'lifesteal', label: 'Roubo de vida', icon: '♥', group: 'offensive', color: '#ff5470' },
  taunt: { id: 'taunt', label: 'Provocação', icon: '!', group: 'tactical', color: '#ffbd55' },
  piercing: { id: 'piercing', label: 'Perfuração', icon: '➳', group: 'offensive', color: '#ff7855' },
  silence: { id: 'silence', label: 'Silêncio', icon: '⊘', group: 'negative', color: '#b78cff' },
  cleanse: { id: 'cleanse', label: 'Purificação', icon: '✧', group: 'tactical', color: '#fff08a' },
  barrier: { id: 'barrier', label: 'Barreira', icon: '⛨', group: 'tactical', color: '#69c8ff' },
  enrage: { id: 'enrage', label: 'Fúria', icon: '↑', group: 'offensive', color: '#ff642e' },
  summonBonus: { id: 'summonBonus', label: 'Invocação', icon: '♣', group: 'tactical', color: '#d57dff' },
  deathTrigger: { id: 'deathTrigger', label: 'Último efeito', icon: '☠', group: 'negative', color: '#d58cff' },
  supportAura: { id: 'supportAura', label: 'Aura de suporte', icon: '✦', group: 'tactical', color: '#fff082' },
  directDamage: { id: 'directDamage', label: 'Dano direto', icon: '✹', group: 'offensive', color: '#ff553d' },
  resource: { id: 'resource', label: 'Recurso', icon: '◆', group: 'tactical', color: '#62e8ff' },
};
export function statusVisual(id: AbilityId): StatusVisual { return STATUS_VISUALS[id]; }
export const STATUS_DESCRIPTIONS: Record<AbilityId, string> = { shield: 'Reduz dano físico recebido.', regeneration: 'Recupera vida no início do turno.', thorns: 'Devolve dano após ataques corpo a corpo.', counter: 'Permite responder a um ataque recebido.', flying: 'Concede chance de esquivar de ataques físicos.', doubleStrike: 'Permite realizar dois ataques.', reach: 'Permite atacar mesmo na linha de frente.', reflect: 'Reflete parte do dano mágico.', poison: 'Causa dano ao longo dos turnos.', stun: 'Impede ou atrasa a próxima ação.', heal: 'Restaura vida imediatamente.', attackBuff: 'Aumenta o dano causado.', armorBreak: 'Reduz ou ignora parte da proteção.', lifesteal: 'Converte parte do dano causado em cura.', taunt: 'Atrai a prioridade dos ataques.', piercing: 'Ignora parte da proteção do alvo.', silence: 'Impede habilidades especiais ou mágicas.', cleanse: 'Remove efeitos negativos selecionados.', barrier: 'Absorve uma quantidade fixa de dano.', enrage: 'Aumenta o dano quando a unidade está ferida.', summonBonus: 'Invoca uma unidade adicional.', deathTrigger: 'Ativa um efeito quando a unidade morre.', supportAura: 'Fortalece aliados enquanto permanece em campo.', directDamage: 'Aplica dano imediatamente.', resource: 'Altera a quantidade de cristais disponíveis.' };

export const STATUS_RULES: Record<AbilityId, StatusRule> = {
  shield: { durationType: 'permanent', stackable: false, showOnCard: true, priority: 3 }, regeneration: { durationType: 'temporary', stackable: false, showOnCard: true, priority: 4 }, thorns: { durationType: 'permanent', stackable: false, showOnCard: true, priority: 5 }, counter: { durationType: 'permanent', stackable: false, showOnCard: true, priority: 5 }, flying: { durationType: 'permanent', stackable: false, showOnCard: true, priority: 5 }, doubleStrike: { durationType: 'permanent', stackable: false, showOnCard: true, priority: 5 }, reach: { durationType: 'permanent', stackable: false, showOnCard: true, priority: 5 }, reflect: { durationType: 'permanent', stackable: false, showOnCard: true, priority: 5 }, poison: { durationType: 'temporary', stackable: true, showOnCard: true, priority: 1 }, stun: { durationType: 'temporary', stackable: false, showOnCard: true, priority: 0 }, heal: { durationType: 'instant', stackable: false, showOnCard: false, priority: 6 }, attackBuff: { durationType: 'temporary', stackable: true, showOnCard: true, priority: 3 }, armorBreak: { durationType: 'temporary', stackable: true, showOnCard: true, priority: 2 }, lifesteal: { durationType: 'permanent', stackable: false, showOnCard: true, priority: 5 }, taunt: { durationType: 'temporary', stackable: false, showOnCard: true, priority: 2 }, piercing: { durationType: 'permanent', stackable: false, showOnCard: true, priority: 5 }, silence: { durationType: 'temporary', stackable: false, showOnCard: true, priority: 0 }, cleanse: { durationType: 'instant', stackable: false, showOnCard: false, priority: 6 }, barrier: { durationType: 'temporary', stackable: true, showOnCard: true, priority: 2 }, enrage: { durationType: 'temporary', stackable: false, showOnCard: true, priority: 3 }, summonBonus: { durationType: 'instant', stackable: false, showOnCard: false, priority: 6 }, deathTrigger: { durationType: 'permanent', stackable: false, showOnCard: true, priority: 5 }, supportAura: { durationType: 'permanent', stackable: false, showOnCard: true, priority: 4 }, directDamage: { durationType: 'instant', stackable: false, showOnCard: false, priority: 6 }, resource: { durationType: 'instant', stackable: false, showOnCard: false, priority: 6 },
};
