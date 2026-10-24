# Eventos de telemetria

Os eventos permitidos são uma união tipada em `src/beta/contracts.ts`. `TelemetryClient` exige consentimento explícito, limita o buffer a 100 eventos e nunca bloqueia o motor. Propriedades devem ser primitivas e não conter mão, baralho oculto, tokens ou segredos.
