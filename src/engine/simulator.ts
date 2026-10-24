import { STARTER_DECKS, getCard } from '../data/cards';
import { aiTurn, createGame, endPreparation, getPlayer, sacrifice, summon } from './core';

const argIndex = process.argv.indexOf('--games');
const games = Number(argIndex >= 0 ? process.argv[argIndex + 1] : 100) || 100;
let playerWins = 0, aiWins = 0, draws = 0, turns = 0;
for (let i = 0; i < games; i++) {
  const state = createGame(STARTER_DECKS[0].cards, STARTER_DECKS[1].cards, `sim-${i}`);
  let guard = 0;
  while (!state.winnerId && guard++ < 200) {
    if (state.activePlayerId === 'ai') aiTurn(state, i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'normal' : 'hard');
    else {
      const p = getPlayer(state, 'player');
      const monster = p.hand.find(id => getCard(id).category === 'monster' && getCard(id).cost <= p.crystals);
      if (monster && p.battlefield.length < 3) summon(state, 'player', monster);
      else { const item = p.hand.find(id => getCard(id).category !== 'monster'); if (item) sacrifice(state, 'player', item); }
      endPreparation(state, 'player');
    }
  }
  turns += state.turnNumber;
  if (state.winnerId === 'player') playerWins++; else if (state.winnerId === 'ai') aiWins++; else draws++;
}
console.log(JSON.stringify({ games, playerWins, aiWins, draws, averageTurns: Number((turns / games).toFixed(2)) }, null, 2));
