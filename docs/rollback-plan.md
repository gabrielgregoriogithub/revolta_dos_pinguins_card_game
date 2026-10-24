# Plano de rollback

1. Interromper a publicação da versão problemática.
2. Preservar logs e o identificador da versão.
3. Reverter o frontend para o último artefato validado.
4. Não alterar regras de partidas já iniciadas.
5. Migrar salvamentos somente com migration reversível ou backup confirmado.
6. Invalidar o cache do service worker por incremento de `CACHE_NAME`.
7. Reexecutar typecheck, testes e build antes de liberar novamente.

Nenhuma etapa destrutiva deve ser executada sem backup e autorização operacional.

