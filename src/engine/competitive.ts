import type { CompetitiveProfile, League, RankedHistory, RankedResult, RankedSeason } from '../types';
export const LEAGUES: League[] = [
  { id: 'bronze', name: 'Bronze', minRating: 0, maxRating: 899, color: '#a56d4d' },
  { id: 'silver', name: 'Prata', minRating: 900, maxRating: 1099, color: '#b9c5d1' },
  { id: 'gold', name: 'Ouro', minRating: 1100, maxRating: 1299, color: '#e0bd54' },
  { id: 'platinum', name: 'Platina', minRating: 1300, maxRating: 1499, color: '#56c7c5' },
  { id: 'diamond', name: 'Diamante', minRating: 1500, maxRating: 1699, color: '#71b8ff' },
  { id: 'master', name: 'Mestre', minRating: 1700, maxRating: 1899, color: '#b783e8' },
  { id: 'grandmaster', name: 'Grão-Mestre', minRating: 1900, maxRating: null, color: '#f27b91' }
];
export const DEFAULT_SEASON: RankedSeason = { id: 'season-1', name: 'Primeira Aurora', startsAt: '2026-10-01T00:00:00.000Z', endsAt: '2026-11-30T00:00:00.000Z', status: 'ACTIVE', rulesetVersion: 'alpha-0.3', cardsetVersion: 'cardset-48' };
export const createCompetitiveProfile = (playerId: string): CompetitiveProfile => ({ playerId, rating: 1000, peakRating: 1000, wins: 0, losses: 0, draws: 0, placementMatches: 0, updatedAt: new Date().toISOString() });
export const getLeague = (rating: number) => LEAGUES.find(l => rating >= l.minRating && (l.maxRating === null || rating <= l.maxRating)) ?? LEAGUES[0];
export const expectedScore = (rating: number, opponentRating: number) => 1 / (1 + 10 ** ((opponentRating - rating) / 400));
export const kFactor = (profile: CompetitiveProfile) => profile.placementMatches < 20 ? 40 : 24;
export function calculateElo(profile: CompetitiveProfile, opponentRating: number, result: RankedResult) { if (result === 'CANCELLED') return 0; const score = result === 'WIN' ? 1 : result === 'DRAW' ? .5 : 0; return Math.round(kFactor(profile) * (score - expectedScore(profile.rating, opponentRating))); }
export function applyRankedResult(profile: CompetitiveProfile, opponentRating: number, result: RankedResult): { profile: CompetitiveProfile; change: number } { const change = calculateElo(profile, opponentRating, result); const next = { ...profile, rating: Math.max(0, profile.rating + change), peakRating: Math.max(profile.peakRating, profile.rating + change), placementMatches: profile.placementMatches + (result === 'CANCELLED' ? 0 : 1), updatedAt: new Date().toISOString() }; if (result === 'WIN') next.wins++; if (result === 'LOSS') next.losses++; if (result === 'DRAW') next.draws++; return { profile: next, change }; }
export interface QueueEntry { id: string; playerId: string; deckId: string; rating: number; joinedAt: number; status: 'QUEUED'|'RESERVED'|'CANCELLED'|'MATCHED'; }
export function allowedRatingGap(waitMs: number) { if (waitMs < 15000) return 100; if (waitMs < 30000) return 200; if (waitMs < 60000) return 350; return Math.min(800, 350 + Math.floor((waitMs - 60000) / 15000) * 100); }
export function findMatch(entries: QueueEntry[], now = Date.now()): [QueueEntry, QueueEntry] | null { for (let i = 0; i < entries.length; i++) for (let j = i + 1; j < entries.length; j++) { const a = entries[i], b = entries[j]; if (a.playerId === b.playerId || a.status !== 'QUEUED' || b.status !== 'QUEUED') continue; const gap = Math.abs(a.rating - b.rating); if (gap <= Math.min(allowedRatingGap(now - a.joinedAt), allowedRatingGap(now - b.joinedAt))) return [a, b]; } return null; }
export function createHistory(matchId: string, seasonId: string, playerId: string, opponentId: string, result: RankedResult, previousRating: number, ratingChange: number, newRating: number): RankedHistory { return { id: `${matchId}:${playerId}`, matchId, seasonId, playerId, opponentId, result, previousRating, ratingChange, newRating, createdAt: new Date().toISOString() }; }
