import { describe, expect, it } from 'vitest';
import { CAMPAIGN_BATTLES, CAMPAIGN_NODES, CAMPAIGN_REGIONS, CAMPAIGN_SECRET_BATTLES } from '../data/campaign';
import { completeCampaignBattle, defaultCampaignSave, unlockNextRegion } from '../engine/campaign';

describe('campanha PvE', () => {
  it('configura dez mundos, noventa fases principais e dez segredos reais', () => {
    expect(CAMPAIGN_REGIONS).toHaveLength(10);
    expect(CAMPAIGN_BATTLES).toHaveLength(90);
    expect(CAMPAIGN_SECRET_BATTLES).toHaveLength(10);
    expect(CAMPAIGN_NODES).toHaveLength(100);
    expect(CAMPAIGN_REGIONS.every(region => region.battles.length === 9)).toBe(true);
  });
  it('libera apenas o primeiro mundo no início', () => { const save = defaultCampaignSave(); expect(save.unlockedRegions).toEqual(['forest']); expect(save.completedBattles).toHaveLength(0); });
  it('concede uma recompensa única e desbloqueia o próximo mundo após o chefe', () => { let save = defaultCampaignSave(); const first = CAMPAIGN_REGIONS[0]; const boss = first.battles[4]; save = completeCampaignBattle(save, boss); save = unlockNextRegion(save, boss, CAMPAIGN_BATTLES); const again = completeCampaignBattle(save, boss); expect(save.gold).toBe(boss.reward.gold); expect(save.unlockedRegions).toContain('mountains'); expect(again.gold).toBe(save.gold); expect(again.claimedRewards).toHaveLength(1); });
});
