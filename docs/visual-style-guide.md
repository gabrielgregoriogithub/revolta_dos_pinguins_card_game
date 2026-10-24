# Guia visual — Revolta dos Pinguins

Direção: fantasia medieval cartunesca, personagens expressivos, silhuetas legíveis em miniatura, contornos definidos e cores vibrantes sobre um cenário polar discreto. A carta é o foco; o campo deve usar contraste e iluminação sem competir com ela.

## Tokens

| Facção | Cor principal | Material |
|---|---|---|
| Guerra | `#b94c4c` | bronze e metal |
| Natureza | `#4dbb83` | madeira e folhas |
| Equilíbrio | `#67aee4` | prata e cristais |
| Fortuna | `#d5ac4c` | ouro e tecido |
| Caos | `#a263d0` | energia arcana |
| Neutra | `#8290a4` | pedra e aço |

Raridades usam acabamento simples, brilho metálico, brilho ornamentado e halo luminoso respectivamente. O componente `CardView` recebe os dados da carta e aplica `data-faction`/`data-rarity`; nenhum atributo é duplicado em CSS por personagem.

Tipografia: Barlow Condensed para títulos e atributos, Nunito para descrições e controles. A cor nunca é o único indicador: facção e raridade aparecem também como texto.
