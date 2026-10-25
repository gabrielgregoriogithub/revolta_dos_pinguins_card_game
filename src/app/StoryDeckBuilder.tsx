import { useState } from 'react';
import { getCard } from '../data/cards';
import { toggleStoryDeckCard } from '../engine/campaign';
import { validateDeck } from '../engine/core';
import type { CampaignBattle, CampaignSave } from '../types';
import CardView from './CardView';

type Props = { save: CampaignSave; onSave: (save: CampaignSave) => void; nextBattle: CampaignBattle | null; onPlayNext: (battle: CampaignBattle) => void; onBack: () => void };
// Baralho do modo história: só cartas desbloqueadas na campanha, com as mesmas regras de montagem do construtor.
export default function StoryDeckBuilder({ save, onSave, nextBattle, onPlayNext, onBack }: Props) {
  const [message, setMessage] = useState('');
  const pool = [...new Set(save.unlockedCards)];
  const deck = save.storyDeck; const monsters = deck.filter(id => getCard(id).category === 'monster').length;
  const errors = validateDeck(deck, 'player');
  const toggle = (id: string) => { const result = toggleStoryDeckCard(save, id, deck.includes(id) ? 'remove' : 'add'); setMessage(result.error ?? ''); if (!result.error) onSave(result.save); };
  const add = (id: string) => { const result = toggleStoryDeckCard(save, id, 'add'); setMessage(result.error ?? ''); if (!result.error) onSave(result.save); };
  return <main className="shell story-deck"><header className="topbar"><button onClick={onBack}>← Mapa</button><h2>Baralho da história</h2><div>{nextBattle && <button className="primary" disabled={errors.length > 0} title={errors.join(' ')} onClick={() => onPlayNext(nextBattle)}>Jogar {nextBattle.name} →</button>}</div></header>
    <div className="builder-summary"><b>Seu baralho</b><span>MONSTROS {monsters}/8</span><span>ITENS {deck.length - monsters}/8</span><span>TOTAL {deck.length}/16</span></div>
    {message && <div className="error">{message}</div>}{!message && errors.length > 0 && <div className="warning">💡 {errors.join(' ')}</div>}
    <section className="collection-grid">{pool.map(id => { const copies = deck.filter(card => card === id).length; return <div className="collection-card" key={id}><CardView card={getCard(id)} selected={copies > 0} compact onClick={() => toggle(id)} /><span className="collection-action">{copies > 0 ? `− remover${copies > 1 ? ` (×${copies})` : ''}` : '+ adicionar'}</span>{copies === 1 && <button className="collection-action" onClick={() => add(id)}>+ 2ª cópia</button>}</div>; })}</section>
  </main>;
}
