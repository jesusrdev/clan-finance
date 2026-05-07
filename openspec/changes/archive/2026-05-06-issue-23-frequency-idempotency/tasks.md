# Tasks: Issue 23 — Frequency Idempotency

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 260–360 |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR by work units (foundation+service, hook+UI, docs+checks) |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|---|---|---|---|
| 1 | UTC windows + domain error + service conflict contract | PR 1 | Incluye pruebas de servicio/helper |
| 2 | Hook/UI wiring for conflict UX and in-flight disable | PR 1 | Depende de Unit 1 |
| 3 | Docs + typecheck verification | PR 1 | Cierra criterios de spec |

## Phase 1: Foundation (dominio y tiempo UTC)

- [x] 1.1 Crear `src/features/quests/services/questErrors.ts` con `QuestDomainError` y código `TASK_ALREADY_COMPLETED_IN_WINDOW`.
  - Done: error tipado exportado + type guard utilizable desde hook/UI. Prueba: `npx tsc --noEmit`.
- [x] 1.2 Crear `src/features/quests/services/questFrequencyWindow.ts` con `buildFrequencyWindowUtc(daily|weekly|monthly|once)` y límites UTC exactos.
  - Done: daily corta 00:00 UTC, weekly lunes ISO 00:00 UTC, monthly día 1 00:00 UTC, `once => null`. Prueba: tests de fronteras.
- [x] 1.3 Crear `src/features/quests/services/questFrequencyWindow.test.ts` para escenarios daily next day, weekly ISO, monthly UTC month.
  - Done: cubre escenarios del spec sin flakiness temporal. Prueba: runner disponible del repo o ejecución manual documentada.

## Phase 2: Core Implementation (idempotencia en service)

- [x] 2.1 Crear `src/features/quests/services/QuestService.ts` con `completeTask` (pre-check `task_logs` en ventana [start,end) + insert si no conflicto).
  - Done: para conflicto devuelve `QuestDomainError(TASK_ALREADY_COMPLETED_IN_WINDOW)`; no usa error genérico.
- [x] 2.2 Crear `src/features/quests/services/QuestService.idempotency.test.ts` con casos conflicto y éxito fuera de ventana.
  - Done: valida mapping de error y camino de insert; mocks deterministas de cliente DB.

## Phase 3: Integration (hook + pantalla Quests)

- [x] 3.1 Crear `src/features/quests/hooks/useCompleteTask.ts` con `completeTask`, `isCompleting`, `lastErrorCode` y mapeo de domain error.
  - Done: API del hook estable para UI; estado pending expuesto para mitigar doble submit.
- [x] 3.2 Modificar `src/app/(tabs)/quests.tsx` para usar hook, deshabilitar acción durante in-flight y mostrar copy: "Ya completaste esta tarea en este período.".
  - Done: conflicto muestra mensaje específico; éxito/error no-conflicto mantienen comportamiento esperado.

## Phase 4: Verification & Docs

- [x] 4.1 Actualizar `docs/DESARROLLO.md` con regla UTC por frecuencia, limitación de carrera pre-check/insert y contrato de error.
  - Done: sección Quests documenta decisiones D1–D4 relevantes para mantenimiento.
- [x] 4.2 Verificar cobertura de escenarios del spec + chequeo de tipos (`npx tsc --noEmit`) y registrar evidencia en PR.
  - Done: se agregaron tests runtime para copy de conflicto y disabled in-flight en `quests.behavior.test.tsx`, y conflictos `weekly`/`monthly` explícitos en `QuestService.idempotency.test.ts`; typecheck OK.
