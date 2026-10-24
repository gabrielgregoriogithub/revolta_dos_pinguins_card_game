import { describe, expect, it } from 'vitest';
import { CompetitiveService } from '../server/competitive';
import { DEFAULT_SEASON, calculateElo, createCompetitiveProfile, getLeague } from '../engine/competitive';

describe('rating e ligas', () => {
  it('calcula Elo conhecido e usa K maior em colocação', () => {
    const p = createCompetitiveProfile('a');
    expect(calculateElo(p, 1000, 'WIN')).toBe(20);
    expect(calculateElo(p, 1000, 'LOSS')).toBe(-20);
    expect(calculateElo({ ...p, placementMatches: 20 }, 1000, 'WIN')).toBe(12);
  });
  it('resolve fronteiras das ligas', () => {
    expect(getLeague(899).id).toBe('bronze');
    expect(getLeague(900).id).toBe('silver');
    expect(getLeague(1900).id).toBe('grandmaster');
  });
});

describe('fila competitiva local', () => {
  it('pareia por rating, exclui a própria conta e exige confirmação', () => {
    const service = new CompetitiveService(DEFAULT_SEASON);
    service.profile('a').rating = 1000; service.profile('a2').rating = 1600; service.profile('b').rating = 1050;
    service.enqueue('a', 'deck-a', 0); service.enqueue('a2', 'deck-a2', 0); service.enqueue('b', 'deck-b', 0);
    const match = service.matchmake(1000); expect(match).not.toBeNull(); expect([match!.playerA, match!.playerB]).toEqual(expect.arrayContaining(['a', 'b']));
    expect(match!.status).toBe('PROPOSED'); service.confirm(match!.id, match!.playerA); expect(match!.status).toBe('PROPOSED'); service.confirm(match!.id, match!.playerB); expect(match!.status).toBe('ACTIVE');
  });
  it('finaliza uma vez e registra duas linhas de histórico', () => {
    const service = new CompetitiveService(DEFAULT_SEASON); service.enqueue('a', 'deck-a', 0); service.enqueue('b', 'deck-b', 0);
    const match = service.matchmake(1000)!; service.confirm(match.id, match.playerA); service.confirm(match.id, match.playerB);
    service.finish(match.id, match.playerA); service.finish(match.id, match.playerA);
    expect(service.history).toHaveLength(2); expect(service.profile(match.playerA).wins).toBe(1); expect(service.profile(match.playerB).losses).toBe(1);
  });
  it('pagina o ranking e permite cancelar a fila', () => {
    const service = new CompetitiveService(DEFAULT_SEASON); service.profile('a'); service.profile('b'); service.profile('c'); service.profiles.get('b')!.rating = 1200;
    expect(service.leaderboard(1, 2).entries).toHaveLength(2); service.enqueue('a', 'deck-a'); expect(service.cancel('a')).toBe(true); expect(service.cancel('a')).toBe(false);
  });
});
