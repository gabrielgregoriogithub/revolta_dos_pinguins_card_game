# Protocolo realtime

Mensagens de cliente usam `requestId`, `expectedVersion`, tipo e payload. Comandos aceitos pelo servidor local: criação/entrada de lobby, pronto, início, invocação, equipamento, Flash, sacrifício, encerramento e recuperação de estado. A versão é incrementada somente após comando aceito; requisições repetidas pelo mesmo `requestId` retornam o mesmo resultado.
