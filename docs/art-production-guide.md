# Guia de produção de arte

Cartas devem usar proporção aproximada 2:3. Recomenda-se ilustração principal em 768×1024 px (PNG/WebP) e miniatura em 256×341 px. Nomeie arquivos com o ID estável da carta, por exemplo `orc_warrior.webp`, em `public/assets/monsters/`. Equipamentos ficam em `equipment/` e efeitos em `effects/`.

As regras nunca importam a imagem: altere somente `CardArt.imagePath` ou adicione um arquivo com o mesmo ID. O fallback por ícone continua disponível. Molduras, fundos por facção e raridade devem ser CSS/tema, permitindo substituir artes sem tocar no motor.
