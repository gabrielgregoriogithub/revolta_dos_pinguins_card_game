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

Tipografia: Cinzel para títulos, nomes de carta e atributos; Nunito para descrições e controles. Ambas são servidas localmente via `@fontsource` (subconjunto latin, sem dependência do Google Fonts).

Arte provisória: `src/app/CardArt.tsx` desenha em SVG um pinguim único por monstro (elmo, capuz, chapéu ou chifres + arma por classe, cenário por facção) e ícones próprios para equipamentos e feitiços. Quando um asset final for marcado como `ready` em `src/data/assets.ts`, a imagem substitui o SVG automaticamente. A cor nunca é o único indicador: facção e raridade aparecem também como texto.
