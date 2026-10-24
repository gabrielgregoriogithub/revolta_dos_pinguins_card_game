import { describe, expect, it } from 'vitest';
import { CAMPAIGN_BATTLES, CAMPAIGN_REGIONS } from '../data/campaign';
import { completeCampaignBattle, defaultCampaignSave, unlockNextRegion } from '../engine/campaign';

describe('campanha PvE', () => {
  it('configura oito regiões e quarenta batalhas reais', () => { expect(CAMPAIGN_REGIONS).toHaveLength(8); expect(CAMPAIGN_BATTLES).toHaveLength(40); expect(CAMPAIGN_REGIONS.every(r => r.battles.length === 5)).toBe(true); });
  it('libera apenas a primeira região no início', () => { const save = defaultCampaignSave(); expect(save.unlockedRegions).toEqual(['forest']); expect(save.completedBattles).toHaveLength(0); });
  it('concede uma recompensa única e desbloqueia a próxima região após o chefe', () => { let save = defaultCampaignSave(); const first = CAMPAIGN_REGIONS[0]; const boss = first.battles[4]; save = completeCampaignBattle(save, boss); save = unlockNextRegion(save, boss, CAMPAIGN_BATTLES); const again = completeCampaignBattle(save, boss); expect(save.gold).toBe(boss.reward.gold); expect(save.unlockedRegions).toContain('mountains'); expect(again.gold).toBe(save.gold); expect(again.claimedRewards).toHaveLength(1); });
});
