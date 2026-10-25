import { describe, expect, it } from 'vitest';
import { STORY_STARTER_DECK, getCard } from '../data/cards';
import { CAMPAIGN_REGIONS, getCampaignBattle } from '../data/campaign';
import { completeCampaignBattle, defaultCampaignSave, nextCampaignBattle, toggleStoryDeckCard, unlockNextRegion } from '../engine/campaign';
import { CAMPAIGN_BATTLES } from '../data/campaign';
import { validateDeck } from '../engine/core';

const win = (save: ReturnType<typeof defaultCampaignSave>, id: string) => { const battle = getCampaignBattle(id); return unlockNextRegion(completeCampaignBattle(save, battle), battle, CAMPAIGN_BATTLES); };

describe('avançar para a próxima fase após vencer', () => {
  it('a próxima fase é a seguinte do mesmo mundo', () => {
    const save = win(defaultCampaignSave(), 'forest-1');
    expect(nextCampaignBattle(save, getCampaignBattle('forest-1'))?.id).toBe('forest-2');
  });
  it('após o chefe segue pela trilha principal, não pelo segredo', () => {
    let save = defaultCampaignSave();
    for (const id of ['forest-1', 'forest-2', 'forest-3', 'forest-4', 'forest-5']) save = win(save, id);
    expect(nextCampaignBattle(save, getCampaignBattle('forest-5'))?.id).toBe('forest-6');
  });
  it('a última fase do mundo leva ao primeiro mundo seguinte já liberado', () => {
    let save = defaultCampaignSave();
    for (let i = 1; i <= 9; i++) save = win(save, `forest-${i}`);
    expect(nextCampaignBattle(save, getCampaignBattle('forest-9'))?.id).toBe(`${CAMPAIGN_REGIONS[1].id}-1`);
  });
  it('não oferece fase já concluída nem inexistente no fim da campanha', () => {
    let save = defaultCampaignSave();
    for (const region of CAMPAIGN_REGIONS) for (const battle of region.battles) save = win(save, battle.id);
    const last = CAMPAIGN_REGIONS[CAMPAIGN_REGIONS.length - 1].battles.at(-1)!;
    expect(nextCampaignBattle(save, last)).toBeNull();
  });
});

describe('refazer o baralho da história', () => {
  it('remove e adiciona cartas respeitando 16 cartas, 8 monstros e 8 itens', () => {
    const save = defaultCampaignSave();
    const removed = toggleStoryDeckCard(save, 'orc_warrior', 'remove');
    expect(removed.error).toBeNull(); expect(removed.save.storyDeck).toHaveLength(15);
    expect(save.storyDeck).toHaveLength(16);
    const full = toggleStoryDeckCard(save, 'orc_warrior', 'add');
    expect(full.error).toContain('16 cartas');
    const readded = toggleStoryDeckCard(removed.save, 'iron_knight', 'add');
    expect(readded.error).toBeNull(); expect(validateDeck(readded.save.storyDeck)).toEqual([]);
  });
  it('só aceita cartas desbloqueadas na campanha', () => {
    const save = toggleStoryDeckCard(defaultCampaignSave(), 'orc_warrior', 'remove').save;
    const locked = ['berserker', 'aurora_sniper'].find(id => !save.unlockedCards.includes(id))!;
    expect(toggleStoryDeckCard(save, locked, 'add').error).toContain('desbloqueada');
  });
  it('limita cópias e equilíbrio entre monstros e itens', () => {
    const save = toggleStoryDeckCard(defaultCampaignSave(), 'iron_sword', 'remove').save;
    const monster = STORY_STARTER_DECK.cards.find(id => getCard(id).category === 'monster')!;
    expect(toggleStoryDeckCard(save, monster, 'add').error).toContain('8 monstros');
  });
});
