# Integração de assets

Adicione ilustrações em `public/assets/cards/{id}.webp`, miniaturas em `public/assets/cards/thumbnails/{id}.webp` e retratos em `public/assets/cards/portraits/{id}.webp`. O ID deve ser exatamente o ID do catálogo TypeScript. O manifesto em `src/data/assets.ts` gera os três caminhos e o `CardView` esconde automaticamente imagens ausentes, mantendo o fallback.

As ilustrações devem conter somente personagem/objeto: sem nome, custo, números, moldura ou ícones de interface. A moldura e os dados são renderizados pelo jogo para permitir traduções e balanceamento sem reexportar arte. Formato preferido WebP, PNG aceito; 768×1024 px para produção, 256×341 px para miniaturas, proporção 3:4 e área segura de 8% nas bordas.

O arquivo `Pinguim Guerreiro das Geleiras.png` é preservado como referência visual aprovada, mas contém uma carta inteira e não deve ser usado como ilustração recortada sem uma decisão artística posterior.
