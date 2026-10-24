# Changelog

## Não lançado

- Corrigido texto corrompido (acentos, ◆, emojis) na interface de batalha.
- Fontes Cinzel e Nunito empacotadas localmente; funcionam offline e no GitHub Pages.
- Arte SVG única por carta substitui o placeholder idêntico; nova moldura inspirada na carta-conceito (faixa de título, gema de custo, medalhões ATQ/VIDA, pergaminho).
- Unidades em campo com retrato, barra de vida, números de dano/cura flutuantes e animações de ataque.
- Partida rápida sorteia o baralho adversário; fase e histórico traduzidos.
- Corrigidas keys duplicadas na mão e o alvo da Explosão Cristalina.
- Cache do service worker renovado.
- Batalha em palco de resolução fixa que escala para caber inteira na janela, sem rolagem.
- Mesma carta na coleção, no baralho, na mão e no campo (com vida, buffs e status ao vivo).
- Campo em triângulo (1ª posição à frente e ao centro, 2ª e 3ª atrás) e mão em leque.
- Reprodução na própria tela de batalha: invocação animada, ataques distintos por tipo (golpe, flecha, orbe mágico, orbe caótico), linha de mira, alvo destacado e popup do efeito (dano, bloqueio, esquiva, cura, veneno, atordoamento, barreira, derrota).
- Reprodução mais lenta (~1,5–1,9 s por evento; modo rápido pela metade).
- Corrigido: monstros invocados não apareciam no campo durante a reprodução.

## 1.0.0-rc.1

- Adicionada identidade de Release Candidate versionada.
- Adicionado manifest instalável e ícone original da aplicação.
- Adicionado service worker com cache limitado ao shell e assets públicos.
- Adicionado registro seguro do service worker apenas em build de produção.
- Atualizados metadados básicos, favicon e Open Graph.
- Documentadas limitações reais de multiplayer, ranking, PWA e produção.

