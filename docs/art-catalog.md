# Catálogo de arte — Alpha

Formato esperado: `public/assets/cards/{id}.webp`, miniatura em `public/assets/cards/thumbs/{id}.webp` e retrato em `public/assets/cards/portraits/{id}.webp`. A proporção recomendada é 2:3; o fallback atual é o ícone definido em `CardArt`.

## Monstros

| ID | Nome | Classe visual | Tema |
|---|---|---|---|
| orc_warrior | Guerreiro Orc | guerreiro | guerra glacial |
| iron_knight | Cavaleiro de Ferro | tanque | fortaleza |
| berserker | Berserker | agressor | arena |
| stone_golem | Golem de Pedra | colosso | montanha |
| elven_archer | Arqueiro Élfico | arqueiro | floresta nevada |
| goblin_hunter | Caçador Goblin | caçador | cavernas |
| forest_scout | Batedora da Floresta | batedora | taiga |
| arcane_mage | Mago Arcano | mago | observatório |
| elder_druid | Druida Ancião | suporte | bosque ancestral |
| necromancer | Necromante | veneno | ruínas |
| shadow_wraith | Espectro Sombrio | caos | noite polar |
| wandering_demon | Demônio Errante | caos | tempestade |
| glacier_guardian | Guardião Glacial | tanque | geleira |
| tundra_duelist | Duelista da Tundra | duelista | tundra |
| icebreaker | Quebra-Gelo | atacante | campo de batalha |
| sacrifice_knight | Cavaleiro do Juramento | reativo | altar de gelo |
| ice_scout | Batedor do Gelo | arqueiro | penhasco |
| aurora_sniper | Atiradora Aurora | sniper | aurora |
| moss_hunter | Caçadora de Musgo | veneno | pântano congelado |
| frost_sage | Sábio do Gelo | mago defensivo | biblioteca |
| mirror_mage | Maga do Espelho | refletora | salão rúnico |
| healing_seer | Vidente da Aurora | curandeira | templo |
| frost_witch | Bruxa da Geada | controle | círculo glacial |
| storm_imp | Duende da Tempestade | caos | nuvem elétrica |

## Equipamentos e Flash

As 24 cartas de item usam os IDs `iron_sword`, `war_axe`, `reinforced_bow`, `arcane_staff`, `iron_shield`, `runic_armor`, `regen_amulet`, `heavy_sword`, `longbow`, `reinforced_shield`, `reflection_staff`, `thorn_armor`, `minor_heal`, `fireball`, `concentrated_poison`, `magic_barrier`, `battle_blessing`, `vital_amulet`, `poison_dagger`, `cleanse_wave`, `crystal_burst`, `guarding_oath`, `chaos_relic` e `resource_surge`. Para cada arquivo, preserve exatamente o ID; o tipo, facção, habilidade e descrição permanecem no catálogo TypeScript.
