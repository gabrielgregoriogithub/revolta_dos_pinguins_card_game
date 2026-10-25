# Padrão visual das cartas

As referências oficiais analisadas são `Carta do Pinguim Arqueiro.png` e `Guia de Status e Habilidades Fantásticas.png`.

## Template universal

- Carta vertical 2:3, moldura dourada ornamentada e acento de facção.
- Cristal de custo no canto superior esquerdo.
- Raridade em selo no canto superior direito.
- Faixa de nome em pergaminho logo abaixo do topo.
- Ilustração separada na área central; atributos não são incorporados na arte.
- Ícones de habilidade em faixa compacta, com tooltip para descrição completa.
- Ataque, tipo de ataque e vida na base.
- Equipamentos e Flash usam a mesma moldura, mas exibem apenas os campos aplicáveis.

## Biblioteca de status

`src/data/statusVisuals.ts` é a fonte única dos ícones, cores, categorias e rótulos. O mesmo registro é usado no cartão em combate e no tooltip, sem criar ícones paralelos por tela.

## Estado da migração

- As 24 cartas de pinguins já utilizam ilustrações separadas existentes em `public/assets/cards/illustrations`.
- Duas cartas inimigas possuem ilustração reaproveitada mapeada; os demais inimigos continuam com placeholder registrado no manifesto.
- Equipamentos e Flash já usam o template universal, mas ainda precisam de ilustrações individuais definitivas.
- Os PNGs de cartas achatadas permanecem preservados como material aprovado/referência e não são mais usados dentro da área dinâmica de arte.

## Redesign full-art

Foram avaliadas três composições para a carta do Arqueiro:

- **A — Full-Art Clássica:** moldura forte e atributos nos cantos inferiores; ótima leitura, mas ainda cria blocos visuais.
- **B — Full-Art Premium (escolhida):** ilustração como camada de fundo integral, controles translúcidos e moldura fina sobreposta; maximiza o personagem e funciona melhor em tamanhos diferentes.
- **C — Fantasia Ornamentada:** medalhões e ornamentos maiores; expressiva, porém ocupa mais espaço e reduz a arte em cartas compactas.

A Proposta B foi implementada no `card-reference.css`. O indicador permanente de cristais ganhos ao descartar foi removido do `CardView`; o motor de sacrifício e a confirmação contextual continuam inalterados.
