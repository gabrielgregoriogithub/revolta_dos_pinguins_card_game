export type Faction = 'war' | 'nature' | 'balance' | 'fortune' | 'chaos' | 'neutral';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
export type AttackType = 'melee' | 'ranged' | 'magic' | 'chaos';
export type CardCategory = 'monster' | 'equipment' | 'effect';
export type GamePhase = 'INITIALIZATION' | 'PREPARATION' | 'COMBAT' | 'RESOLUTION' | 'TURN_END' | 'GAME_OVER';
export type AbilityId = 'shield' | 'regeneration' | 'thorns' | 'counter' | 'flying' | 'doubleStrike' | 'reach' | 'reflect' | 'poison' | 'stun' | 'heal' | 'attackBuff' | 'armorBreak' | 'lifesteal' | 'taunt' | 'piercing' | 'silence' | 'cleanse' | 'barrier' | 'enrage' | 'summonBonus' | 'deathTrigger' | 'supportAura' | 'directDamage' | 'resource';

export interface Attack { type: AttackType; damage: number; accuracy?: number; }
export interface Ability { id: AbilityId; name: string; description: string; value?: number; duration?: number; }
export interface CardArt { imagePath: string; fallbackIcon: string; factionColor: string; }
export type CardTag = 'warrior' | 'archer' | 'mage' | 'nature' | 'poison' | 'healing' | 'defense' | 'sacrifice' | 'equipment' | 'magic' | 'chaos' | 'control' | 'support' | 'aggressive';
export interface BaseCard { id: string; name: string; description: string; category: CardCategory; faction: Faction; rarity: Rarity; cost: number; art: CardArt; tags?: CardTag[]; }
export interface MonsterCard extends BaseCard { category: 'monster'; level: number; maxHp: number; attacks: Attack[]; abilities: Ability[]; equipmentSlots: number; }
export interface EquipmentCard extends BaseCard { category: 'equipment'; subtype: 'weapon' | 'armor' | 'shield' | 'staff' | 'amulet'; effects: Ability[]; attackModifier?: { attackType?: AttackType; value: number }; }
export interface EffectCard extends BaseCard { category: 'effect'; effect: AbilityId; value: number; }
export type CardModel = MonsterCard | EquipmentCard | EffectCard;
export interface MonsterInstance { instanceId: string; modelId: string; hp: number; maxHp: number; position: number; alive: boolean; stunned: number; silenced: number; poison: number; attackBuff: number; armorBreak: number; barrier: number; equipmentIds: string[]; }
export interface PlayerState { id: string; deck: string[]; hand: string[]; battlefield: MonsterInstance[]; graveyard: string[]; discardPile: string[]; crystals: number; lostMonsters: string[]; sacrificesThisTurn: number; firstTurn: boolean; }
export interface GameEvent { id: string; type: string; turn: number; message: string; data?: Record<string, unknown>; }
export interface GameState { gameId: string; seed: string; phase: GamePhase; activePlayerId: string; turnNumber: number; players: [PlayerState, PlayerState]; eventLog: GameEvent[]; winnerId: string | null; draw: boolean; passStreak: number; rngState: number; }
export interface MatchStats { turns: number; monstersSummoned: number; monstersLost: number; damageDealt: number; damageReceived: number; crystalsSpent: number; sacrifices: number; mostDamagingCard: string | null; mostUsedAbility: string | null; }
export interface TacticalPreview { instanceId: string; cardId: string; name: string; position: number; canAttack: boolean; attackType: AttackType; baseDamage: number; estimatedDamage: string; targetName: string | null; reason: string; }
export interface GameReplay { version: string; seed: string; decks: [string[], string[]]; events: GameEvent[]; finalState: GameState; }
export interface CampaignBattle { id: string; regionId: string; name: string; kind: 'normal' | 'elite' | 'boss'; difficulty: 'easy'|'normal'|'hard'; enemyDeckId: string; enemyName: string; description: string; reward: { gold: number; shards: number; cardId?: string }; }
export interface CampaignRegion { id: string; name: string; theme: string; description: string; enemyStyle: string; battles: CampaignBattle[]; unlockAfter?: string; }
export interface CampaignSave { version: number; unlockedRegions: string[]; completedBattles: string[]; claimedRewards: string[]; unlockedCards: string[]; gold: number; shards: number; cardLevels: Record<string, number>; achievements: string[]; }
export type RankedResult = 'WIN'|'LOSS'|'DRAW'|'CANCELLED';
export interface League { id: string; name: string; minRating: number; maxRating: number | null; color: string; }
export interface CompetitiveProfile { playerId: string; rating: number; peakRating: number; wins: number; losses: number; draws: number; placementMatches: number; updatedAt: string; }
export interface RankedSeason { id: string; name: string; startsAt: string; endsAt: string; status: 'UPCOMING'|'ACTIVE'|'ENDED'; rulesetVersion: string; cardsetVersion: string; }
export interface RankedHistory { id: string; seasonId: string; matchId: string; playerId: string; opponentId: string; result: RankedResult; previousRating: number; ratingChange: number; newRating: number; createdAt: string; }
export type TeamMode = 'solo'|'versus'|'cooperative';
export type ModeModifier =
  | { kind: 'starting_crystals'; value: number }
  | { kind: 'category_cost'; category: CardCategory; delta: number }
  | { kind: 'faction_restriction'; factions: Faction[] }
  | { kind: 'rarity_restriction'; rarities: Rarity[] }
  | { kind: 'deck_size'; monsters: number; items: number };
export interface GameModeDefinition { id: string; name: string; description: string; minPlayers: number; maxPlayers: number; teamMode: TeamMode; rulesetId: string; deckRulesId: string; rewardPolicyId: string; enabled: boolean; modifiers?: ModeModifier[]; }
export interface WeeklyChallenge { id: string; name: string; description: string; startsAt: string; endsAt: string; modeId: string; modifiers: ModeModifier[]; rewardId: string; version: string; }
export interface SurvivalRecord { bestStreak: number; attempts: number; totalBattles: number; lastDeckId: string | null; updatedAt: string; }
export interface DraftSession { id: string; seed: string; picks: string[]; options: string[][]; status: 'DRAFTING'|'READY'|'ABANDONED'; deck: string[]; }
export interface TournamentMatch { id: string; round: number; playerA: string | null; playerB: string | null; winner: string | null; status: 'PENDING'|'READY'|'PLAYING'|'COMPLETED'; }
export interface Tournament { id: string; name: string; size: 4|8|16; status: 'REGISTRATION'|'IN_PROGRESS'|'COMPLETED'|'CANCELLED'; participants: string[]; matches: TournamentMatch[]; champion: string | null; }
export type VisualEventType = 'START' | 'ATTACK' | 'DAMAGE' | 'BLOCK' | 'HEAL' | 'EFFECT' | 'DEATH' | 'FORMATION' | 'MISS' | 'END' | 'SUMMON' | 'EQUIP' | 'STATUS';
export interface CombatVisualEvent { id: string; sequence: number; type: VisualEventType; sourceCardInstanceId?: string; targetCardInstanceId?: string; sourceModelId?: string; targetModelId?: string; attackType?: AttackType | string; damage?: number; healing?: number; blocked?: number; hpBefore?: number; hpAfter?: number; abilityId?: string; value?: number; playerId?: string; cardId?: string; vfxId?: string; description: string; engineEvent: GameEvent; }
export interface DeckList { id: string; name: string; cards: string[]; }

export const FACTION_LABEL: Record<Faction, string> = { war: 'Guerra', nature: 'Natureza', balance: 'Equilíbrio', fortune: 'Fortuna', chaos: 'Caos', neutral: 'Neutra' };
export const RARITY_LABEL: Record<Rarity, string> = { common: 'Comum', rare: 'Rara', epic: 'Épica', legendary: 'Lendária' };
export const ATTACK_LABEL: Record<AttackType, string> = { melee: 'Corpo a corpo', ranged: 'Distância', magic: 'Magia', chaos: 'Caos' };
