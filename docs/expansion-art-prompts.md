# Expansão 1 — fila de arte

O catálogo da expansão já está integrado e jogável com placeholders auditáveis. Nenhuma imagem de referência com moldura, nome ou atributos foi reutilizada como arte final.

Para cada ID da expansão, gerar uma imagem vertical 2:3 com este prompt-base:

> Ilustração original para o card game cartunesco e fantasioso Revolta dos Pinguins, sem moldura, sem texto, sem números, sem ícones de raridade, personagem/objeto central totalmente visível, silhueta legível em miniatura, iluminação cinematográfica colorida, fundo simples do bioma, pose expressiva e acabamento limpo para navegador e celular.

Variações por grupo:

- Pinguins (`penguin_*`): acrescentar “pinguim antropomórfico, roupa e arma coerentes com a classe, corpo inteiro, expressão carismática”.
- Inimigos (`enemy_*`): acrescentar “espécie não-pinguim claramente identificável, anatomia coerente, sem aparência humana genérica, bioma correspondente”.
- Equipamentos: acrescentar “objeto isolado em três quartos, detalhes materiais e brilho elemental coerente, sem personagem segurando o objeto”.
- Flash: acrescentar “a magia em ação, trajetória e impacto legíveis, composição com espaço negativo, sem carta ou interface”.

IDs pendentes de arte final ficam automaticamente em `status: 'placeholder'` no manifesto `src/data/assets.ts`; substituir o arquivo pelo mesmo ID em `public/assets/cards/illustrations/` altera apenas a camada visual e não afeta regras, IDs ou salvamentos.
