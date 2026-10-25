import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import CardView from '../app/CardView';
import { CARDS, ENEMY_CARDS, getCard } from '../data/cards';
import type { MonsterCard, MonsterInstance } from '../types';

function unit(modelId: string, overrides: Partial<MonsterInstance> = {}): MonsterInstance {
  const card = getCard(modelId) as MonsterCard;
  return { instanceId: modelId, modelId, hp: card.maxHp, maxHp: card.maxHp, position: 1, alive: true, stunned: 0, silenced: 0, poison: 0, attackBuff: 0, armorBreak: 0, barrier: 0, equipmentIds: [], ...overrides };
}
const render = (modelId: string, overrides?: Partial<MonsterInstance>, compact = false) => renderToStaticMarkup(<CardView card={getCard(modelId)} unit={overrides ? unit(modelId, overrides) : undefined} compact={compact} />);

describe('carta: ataque efetivo visível', () => {
  it('bônus de equipamento mostra a soma e o resultado em verde', () => {
    const html = render('orc_warrior', { equipmentIds: ['iron_sword'] });
    expect(html).toContain('trend-up'); expect(html).toContain('3 + 2 = 5'); expect(html).toContain('▲+2');
  });
  it('penalidade mostra a subtração e o resultado em vermelho', () => {
    const html = render('berserker', { attackBuff: -2 });
    expect(html).toContain('trend-down'); expect(html).toContain('5 − 2 = 3'); expect(html).toContain('▼−2');
  });
  it('bônus e penalidade simultâneos usam o resultado líquido', () => {
    const html = render('orc_warrior', { attackBuff: -1, equipmentIds: ['iron_sword'] });
    expect(html).toContain('3 − 1 + 2 = 4'); expect(html).toContain('trend-up');
  });
  it('sem modificadores não exibe fórmula nem indicador', () => {
    const html = render('orc_warrior', {});
    expect(html).toContain('trend-flat'); expect(html).not.toContain('attack-formula'); expect(html).not.toContain('attack-trend');
  });
  it('modo compacto mantém o indicador e deixa o detalhamento no título', () => {
    const html = render('orc_warrior', { equipmentIds: ['iron_sword'] }, true);
    expect(html).not.toContain('attack-formula'); expect(html).toContain('▲+2'); expect(html).toContain('Espada de Ferro +2');
  });
});

describe('carta: estrutura do layout', () => {
  it('toda carta tem cabeçalho com custo, nome e raridade em áreas separadas', () => {
    for (const card of [...CARDS, ...ENEMY_CARDS]) {
      const html = renderToStaticMarkup(<CardView card={card} />);
      expect(html).toMatch(/class="card-header"><span class="card-cost"[^>]*><strong>\d+<\/strong><\/span><div class="card-banner">/);
      expect(html).toContain('class="card-rarity-badge"');
    }
  });
  it('nomes longos recebem tipografia própria', () => {
    expect(renderToStaticMarkup(<CardView card={getCard('shadow_wraith')} />)).toContain('data-name-length="long"');
    expect(renderToStaticMarkup(<CardView card={getCard('orc_warrior')} />)).toContain('data-name-length="short"');
  });
  it('habilidades ficam fora do corpo da arte e o ataque fica no centro do rodapé', () => {
    const html = render('elder_druid', {});
    expect(html.indexOf('card-abilities')).toBeGreaterThan(html.indexOf('card-header'));
    expect(html).toMatch(/class="card-footer"><span class="footer-side">.*<\/span><span class="attack-group">.*<\/span><span class="hp-badge/);
  });
  it('carta sem habilidades não renderiza a faixa de habilidades', () => {
    expect(renderToStaticMarkup(<CardView card={getCard('enemy_goblin_warrior')} />)).not.toContain('card-abilities');
  });
});
