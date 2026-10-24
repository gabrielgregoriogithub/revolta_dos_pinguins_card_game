# Reconexão

O servidor local mantém lobby e partida em memória durante o processo. Um cliente pode reconectar e solicitar `GET_STATE` enquanto sua sessão ainda é conhecida. Persistência após reinício, relógio de servidor, abandono após 90 segundos e snapshots duráveis ainda precisam de banco/serviço de produção.
