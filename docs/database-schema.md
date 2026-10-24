# Schema multiplayer

`supabase/migrations/001_multiplayer.sql` prepara `lobbies`, `matches`, `match_commands` e `match_events`, incluindo unicidade de `request_id` por partida e sequência de eventos. Antes de produção, adicione Auth, RLS, `match_players` e armazenamento privado de mãos somente acessível pela autoridade.
