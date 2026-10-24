import { describe, expect, it } from 'vitest';
import { BetaAccessStore, ErrorReporter, FeedbackStore, TelemetryClient, featureEnabled } from '../beta/contracts';

describe('infraestrutura local do beta', () => {
  it('cria, resgata, expira e revoga convites', () => {
    let now = 1_000_000; const access = new BetaAccessStore(() => now); const invite = access.createInvite(1000);
    expect(access.redeem(invite.code, 'player-1').betaEnabled).toBe(true); expect(() => access.redeem(invite.code, 'player-2')).toThrow('BETA_INVITE_UNAVAILABLE');
    const second = access.createInvite(1000); now += 1001; expect(() => access.redeem(second.code, 'player-2')).toThrow('BETA_INVITE_EXPIRED');
    const third = access.createInvite(); access.revoke(third.id); expect(() => access.redeem(third.code, 'player-3')).toThrow('BETA_INVITE_UNAVAILABLE');
  });
  it('não coleta telemetria opcional sem consentimento e limita o lote', () => {
    const storage = new Map<string, string>(); const fakeStorage = { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) } as unknown as Storage;
    const telemetry = new TelemetryClient(fakeStorage); expect(telemetry.track('game_opened')).toBe(false); telemetry.setConsent('granted'); expect(telemetry.track('game_opened', { source: 'test' }, { sessionId: 's' })).toBe(true); expect(telemetry.pending()).toHaveLength(1);
  });
  it('valida feedback, diagnóstico sanitizado e feature flags', () => {
    const feedback = new FeedbackStore(); expect(() => feedback.submit({ category: 'bug', severity: 'high', description: ' ' })).toThrow('FEEDBACK_DESCRIPTION_REQUIRED'); expect(feedback.submit({ category: 'bug', severity: 'high', description: 'A carta não responde.' }).status).toBe('open');
    const reporter = new ErrorReporter(); const error = reporter.report(new Error('falha de teste'), 'engine'); expect(error.code).toBe('GAME-100'); expect(error.module).toBe('engine'); expect(featureEnabled('tournaments')).toBe(false); expect(featureEnabled('tournaments', { tournaments: true })).toBe(true);
  });
});
