import { randomUUID } from 'node:crypto';
import {
  applyRankedResult,
  createCompetitiveProfile,
  createHistory,
  findMatch,
  getLeague,
  type QueueEntry
} from '../engine/competitive';
import type { CompetitiveProfile, RankedHistory, RankedResult, RankedSeason } from '../types';

export type RankedMatchStatus = 'PROPOSED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export interface RankedMatch {
  id: string;
  seasonId: string;
  playerA: string;
  playerB: string;
  deckA: string;
  deckB: string;
  status: RankedMatchStatus;
  confirmations: Set<string>;
  result: RankedResult | null;
  createdAt: number;
  completedAt?: number;
}

export class CompetitiveService {
  readonly season: RankedSeason;
  readonly profiles = new Map<string, CompetitiveProfile>();
  readonly queue = new Map<string, QueueEntry>();
  readonly matches = new Map<string, RankedMatch>();
  readonly history: RankedHistory[] = [];

  constructor(season: RankedSeason) { this.season = season; }

  profile(playerId: string) {
    const existing = this.profiles.get(playerId);
    if (existing) return existing;
    const created = createCompetitiveProfile(playerId);
    this.profiles.set(playerId, created);
    return created;
  }

  enqueue(playerId: string, deckId: string, now = Date.now()) {
    if (this.queue.has(playerId)) throw new Error('ALREADY_IN_QUEUE');
    if ([...this.matches.values()].some(m => (m.playerA === playerId || m.playerB === playerId) && (m.status === 'PROPOSED' || m.status === 'ACTIVE'))) throw new Error('PLAYER_IN_MATCH');
    const entry: QueueEntry = { id: randomUUID(), playerId, deckId, rating: this.profile(playerId).rating, joinedAt: now, status: 'QUEUED' };
    this.queue.set(playerId, entry);
    return entry;
  }

  cancel(playerId: string) {
    const entry = this.queue.get(playerId);
    if (!entry) return false;
    entry.status = 'CANCELLED';
    this.queue.delete(playerId);
    return true;
  }

  matchmake(now = Date.now()) {
    const pair = findMatch([...this.queue.values()], now);
    if (!pair) return null;
    pair[0].status = 'RESERVED'; pair[1].status = 'RESERVED';
    const match: RankedMatch = { id: randomUUID(), seasonId: this.season.id, playerA: pair[0].playerId, playerB: pair[1].playerId, deckA: pair[0].deckId, deckB: pair[1].deckId, status: 'PROPOSED', confirmations: new Set(), result: null, createdAt: now };
    this.matches.set(match.id, match);
    this.queue.delete(pair[0].playerId); this.queue.delete(pair[1].playerId);
    return match;
  }

  confirm(matchId: string, playerId: string) {
    const match = this.requireMatch(matchId);
    if (match.status !== 'PROPOSED') throw new Error('MATCH_NOT_CONFIRMABLE');
    if (playerId !== match.playerA && playerId !== match.playerB) throw new Error('PLAYER_NOT_AUTHORIZED');
    match.confirmations.add(playerId);
    if (match.confirmations.size === 2) match.status = 'ACTIVE';
    return match;
  }

  finish(matchId: string, winnerId: string | null, reason: 'NORMAL' | 'FORFEIT' | 'SERVER_FAILURE' = 'NORMAL') {
    const match = this.requireMatch(matchId);
    if (match.status === 'COMPLETED' || match.status === 'CANCELLED') return match;
    if (reason === 'SERVER_FAILURE' || match.status === 'PROPOSED') { match.status = 'CANCELLED'; match.result = 'CANCELLED'; return match; }
    if (winnerId !== match.playerA && winnerId !== match.playerB && winnerId !== null) throw new Error('INVALID_WINNER');
    const resultA: RankedResult = winnerId === null ? 'DRAW' : winnerId === match.playerA ? 'WIN' : 'LOSS';
    const resultB: RankedResult = resultA === 'WIN' ? 'LOSS' : resultA === 'LOSS' ? 'WIN' : 'DRAW';
    const aBefore = this.profile(match.playerA); const bBefore = this.profile(match.playerB);
    const a = applyRankedResult(aBefore, bBefore.rating, resultA); const b = applyRankedResult(bBefore, aBefore.rating, resultB);
    this.profiles.set(match.playerA, a.profile); this.profiles.set(match.playerB, b.profile);
    this.history.push(createHistory(match.id, match.seasonId, match.playerA, match.playerB, resultA, aBefore.rating, a.change, a.profile.rating));
    this.history.push(createHistory(match.id, match.seasonId, match.playerB, match.playerA, resultB, bBefore.rating, b.change, b.profile.rating));
    match.status = 'COMPLETED'; match.result = resultA; match.completedAt = Date.now();
    return match;
  }

  leaderboard(page = 1, pageSize = 25) {
    const safePage = Math.max(1, Math.floor(page)); const safeSize = Math.min(100, Math.max(1, Math.floor(pageSize)));
    const all = [...this.profiles.values()].sort((a, b) => b.rating - a.rating || a.playerId.localeCompare(b.playerId));
    return { page: safePage, pageSize: safeSize, total: all.length, entries: all.slice((safePage - 1) * safeSize, safePage * safeSize).map((profile, index) => ({ position: (safePage - 1) * safeSize + index + 1, profile, league: getLeague(profile.rating) })) };
  }

  historyFor(playerId: string) { return this.history.filter(item => item.playerId === playerId); }
  private requireMatch(id: string) { const match = this.matches.get(id); if (!match) throw new Error('RANKED_MATCH_NOT_FOUND'); return match; }
}
