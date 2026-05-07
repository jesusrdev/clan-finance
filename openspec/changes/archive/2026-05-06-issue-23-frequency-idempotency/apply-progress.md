# Apply Progress — issue-23-frequency-idempotency

## Status

- Mode: Standard (strict_tdd: false)
- Delivery strategy: ask-on-risk
- Workload guard: Decision needed before apply = No, Chained PRs recommended = No, 400-line risk = Medium
- Overall: 9/9 tasks complete

## Phase Progress

### Phase 1 — Foundation
- [x] 1.1 `questErrors.ts` creado con `QuestDomainError` + code `TASK_ALREADY_COMPLETED_IN_WINDOW` + type guard.
- [x] 1.2 `questFrequencyWindow.ts` creado con ventanas UTC para `daily|weekly|monthly|once`.
- [x] 1.3 `questFrequencyWindow.test.ts` agregado con fronteras daily/weekly ISO/monthly.

### Phase 2 — Core Implementation
- [x] 2.1 `QuestService.ts` creado con `completeTask`: pre-check en `[start,end)` y insert pending cuando no hay conflicto.
- [x] 2.2 `QuestService.idempotency.test.ts` agregado con casos conflicto y éxito.

### Phase 3 — Integration
- [x] 3.1 `useCompleteTask.ts` creado (`completeTask`, `isCompleting`, `lastErrorCode`) con mapeo de error de dominio.
- [x] 3.2 `quests.tsx` integrado con hook, disabled in-flight y feedback con copy de conflicto acordado.

### Phase 4 — Verification & Docs
- [x] 4.1 `docs/DESARROLLO.md` actualizado con regla UTC, contrato de error y limitación de carrera pre-check/insert.
- [x] 4.2 Validación ejecutada y evidencia registrada.

## Verification Evidence

```bash
npx vitest run src/features/quests/services/questFrequencyWindow.test.ts src/features/quests/services/QuestService.idempotency.test.ts
✓ 2 test files passed (6 tests)

npx tsc --noEmit
✓ completed without TypeScript errors
```

## Spec Coverage Mapping

| Spec Scenario | Evidence |
|---|---|
| Daily duplicate in same UTC day | `QuestService.idempotency.test.ts` (conflict path + domain error) |
| Daily completion in next UTC day | `questFrequencyWindow.test.ts` (daily boundary rollover) + service success case |
| Weekly duplicate in same ISO week | `questFrequencyWindow.test.ts` (ISO Monday boundary) + service uses computed window |
| Monthly duplicate in same UTC month | `questFrequencyWindow.test.ts` (month boundary) + service uses computed window |
| Domain conflict mapping | `QuestService.idempotency.test.ts` expects `TASK_ALREADY_COMPLETED_IN_WINDOW` |
| Conflict feedback copy | `quests.tsx` + `useCompleteTask.ts` maps code to toast copy exacta |
| Submit disabled during in-flight request | `quests.tsx` button `disabled={isCompleting}` |

## Deviations / Notes

- No se implementó guard atómico en DB (RPC/constraint). Se mantiene limitación documentada según diseño (out-of-scope).
