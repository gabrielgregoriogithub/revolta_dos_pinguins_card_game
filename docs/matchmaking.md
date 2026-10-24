# Matchmaking

A fila usa faixas graduais: 100 pontos até 15 s, 200 até 30 s, 350 até 60 s e expansão limitada depois disso. A função é determinística para uma lista e horário fornecidos; o serviço reserva os dois jogadores antes de criar a proposta.

O jogador só pode ter uma entrada ativa e não pode ser pareado consigo mesmo. Cancelamentos removem a entrada. A migration `002_competitive.sql` fornece a base para uma fila transacional em produção.
