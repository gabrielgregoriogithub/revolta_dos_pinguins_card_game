export type AnalyticsEventName =
  | 'game_opened' | 'main_menu_viewed' | 'game_mode_selected' | 'deck_builder_opened' | 'collection_opened'
  | 'tutorial_started' | 'tutorial_step_completed' | 'tutorial_skipped' | 'tutorial_completed'
  | 'match_started' | 'match_finished' | 'match_abandoned' | 'turn_started' | 'turn_finished'
  | 'card_played' | 'card_equipped' | 'card_sacrificed' | 'flash_used' | 'attack_resolved'
  | 'ability_triggered' | 'monster_defeated' | 'damage_applied' | 'healing_applied'
  | 'battle_paused' | 'battle_speed_changed' | 'card_details_opened' | 'combat_log_opened'
  | 'client_error' | 'match_sync_error' | 'asset_load_error' | 'save_error' | 'network_error';

export interface AnalyticsEvent { eventId: string; eventName: AnalyticsEventName; anonymousPlayerId?: string; sessionId: string; timestamp: string; gameVersion: string; rulesetVersion?: string; matchId?: string; gameMode?: string; properties: Record<string, string | number | boolean | null>; }
export type TelemetryConsent = 'unknown' | 'granted' | 'denied';
export const TELEMETRY_KEY = 'pinguins-telemetry-v1';
const safeId = () => { try { return crypto.randomUUID(); } catch { return `local-${Date.now()}-${Math.random().toString(36).slice(2)}`; } };
export class TelemetryClient {
  private events: AnalyticsEvent[] = [];
  private readonly storage: Storage | null;
  constructor(storage?: Storage | null, private readonly gameVersion = '0.1.0') { this.storage = storage ?? (typeof localStorage === 'undefined' ? null : localStorage); }
  consent(): TelemetryConsent { return (this.storage?.getItem(TELEMETRY_KEY) as TelemetryConsent | null) ?? 'unknown'; }
  setConsent(value: Exclude<TelemetryConsent, 'unknown'>) { this.storage?.setItem(TELEMETRY_KEY, value); }
  track(eventName: AnalyticsEventName, properties: AnalyticsEvent['properties'] = {}, context: Pick<AnalyticsEvent, 'sessionId'|'anonymousPlayerId'|'rulesetVersion'|'matchId'|'gameMode'> = { sessionId: 'local-session' }) { if (this.consent() !== 'granted') return false; const event: AnalyticsEvent = { eventId: safeId(), eventName, sessionId: context.sessionId, anonymousPlayerId: context.anonymousPlayerId, timestamp: new Date().toISOString(), gameVersion: this.gameVersion, rulesetVersion: context.rulesetVersion, matchId: context.matchId, gameMode: context.gameMode, properties }; this.events.push(event); if (this.events.length > 100) this.events.shift(); return true; }
  pending() { return [...this.events]; }
  drain() { const batch = this.pending(); this.events = []; return batch; }
}

export type BetaInviteStatus = 'ACTIVE'|'REDEEMED'|'REVOKED'|'EXPIRED';
export interface BetaInvite { id: string; code: string; createdAt: string; expiresAt: string; maxUses: number; uses: number; status: BetaInviteStatus; players: string[]; }
export class BetaAccessStore {
  readonly invites = new Map<string, BetaInvite>();
  constructor(private readonly now: () => number = Date.now) {}
  createInvite(ttlMs = 7 * 24 * 60 * 60 * 1000, maxUses = 1) { const id = safeId(); const code = safeId().replaceAll('-', '').slice(0, 12).toUpperCase(); const invite: BetaInvite = { id, code, createdAt: new Date(this.now()).toISOString(), expiresAt: new Date(this.now() + ttlMs).toISOString(), maxUses, uses: 0, status: 'ACTIVE', players: [] }; this.invites.set(id, invite); return invite; }
  redeem(code: string, playerId: string) { const invite = [...this.invites.values()].find(item => item.code === code); if (!invite) throw new Error('BETA_INVITE_NOT_FOUND'); if (this.now() >= Date.parse(invite.expiresAt)) { invite.status = 'EXPIRED'; throw new Error('BETA_INVITE_EXPIRED'); } if (invite.status !== 'ACTIVE' || invite.uses >= invite.maxUses) throw new Error('BETA_INVITE_UNAVAILABLE'); if (!invite.players.includes(playerId)) { invite.players.push(playerId); invite.uses++; } if (invite.uses >= invite.maxUses) invite.status = 'REDEEMED'; return { inviteId: invite.id, playerId, betaEnabled: true }; }
  revoke(inviteId: string) { const invite = this.invites.get(inviteId); if (!invite) throw new Error('BETA_INVITE_NOT_FOUND'); invite.status = 'REVOKED'; return invite; }
}

export type FeedbackCategory = 'bug'|'visual'|'confusing_rule'|'balance'|'suggestion'|'performance'|'multiplayer'|'other';
export interface FeedbackReport { id: string; category: FeedbackCategory; severity: 'low'|'medium'|'high'|'critical'; description: string; screen?: string; matchId?: string; createdAt: string; status: 'open'|'triaged'|'resolved'; }
export class FeedbackStore { readonly reports: FeedbackReport[] = []; submit(input: Omit<FeedbackReport, 'id'|'createdAt'|'status'>) { if (!input.description.trim()) throw new Error('FEEDBACK_DESCRIPTION_REQUIRED'); const report: FeedbackReport = { ...input, id: safeId(), createdAt: new Date().toISOString(), status: 'open' }; this.reports.push(report); return report; } }
export interface DiagnosticError { id: string; code: string; module: string; message: string; version: string; createdAt: string; stack?: string; }
export class ErrorReporter { readonly errors: DiagnosticError[] = []; report(error: unknown, module: string, version = '0.1.0') { const source = error instanceof Error ? error : new Error(String(error)); const record: DiagnosticError = { id: safeId(), code: `GAME-${100 + this.errors.length}`, module, message: source.message.slice(0, 240), version, createdAt: new Date().toISOString(), stack: source.stack?.split('\n').slice(0, 4).join('\n') }; this.errors.push(record); return record; } }

export type FeatureFlag = 'campaign'|'friendlyPvp'|'rankedPvp'|'tournaments'|'cooperative'|'draft'|'survival'|'weeklyEvents'|'newCards'|'combatVfx';
export const DEFAULT_FLAGS: Record<FeatureFlag, boolean> = { campaign: true, friendlyPvp: true, rankedPvp: true, tournaments: false, cooperative: false, draft: true, survival: true, weeklyEvents: true, newCards: true, combatVfx: true };
export const featureEnabled = (flag: FeatureFlag, overrides: Partial<Record<FeatureFlag, boolean>> = {}) => overrides[flag] ?? DEFAULT_FLAGS[flag];
