# Design: Issue 23 — Frequency Idempotency

## Technical Approach

Implementar la validación idempotente en cliente con arquitectura en 3 capas: UI (`quests.tsx`) → hook (`useCompleteTask`) → service (`QuestService`).
`QuestService` calcula ventana UTC por frecuencia (`daily|weekly|monthly`) y hace pre-check en `task_logs` antes del insert. Si encuentra registro en ventana activa, devuelve error de dominio `TASK_ALREADY_COMPLETED_IN_WINDOW`; si no, inserta completion.

## Architecture Decisions

| Decision | Option | Tradeoff | Selected |
|---|---|---|---|
| D1: Dónde validar idempotencia | Cliente (pre-check + insert) vs RPC/constraint DB | Cliente no es atómico, pero respeta out-of-scope y no requiere migración | Cliente con `QuestService` |
| D2: Límite de responsabilidades | UI con lógica de negocio vs hook/service | Más archivos, pero reglas testeables y UX consistente | Regla en service, orquestación en hook, UI solo render/acciones |
| D3: Temporalidad | Hora local dispositivo vs UTC explícito | UTC evita ambigüedad regional; requiere helper dedicado | UTC con inicios exactos de ventana |
| D4: Contrato de error | Error genérico string vs código tipado | Código exige mapeo extra, pero estabiliza UX | `TASK_ALREADY_COMPLETED_IN_WINDOW` |

## Data Flow

```text
QuestsScreen (tap Completar)
  -> useCompleteTask.completeTask(task)
    -> QuestService.completeTask({ userId, taskId, frequency, now? })
      -> buildFrequencyWindowUtc(frequency, now)
      -> query task_logs by user_id + task_id + completed_at in [start,end)
      -> if exists: throw DomainError(TASK_ALREADY_COMPLETED_IN_WINDOW)
      -> else: insert task_log(status="pending", completed_at=nowUTC)
    <- result|error
  -> hook maps domain error for UI signal
-> QuestsScreen shows toast conflict/success and keeps button disabled while pending
```

## File Changes

| File | Action | Description |
|---|---|---|
| `src/features/quests/services/QuestService.ts` | Create | Servicio de completitud: ventana UTC, pre-check idempotente, insert en `task_logs`. |
| `src/features/quests/services/questFrequencyWindow.ts` | Create | Helper puro para límites UTC (`daily`, lunes ISO para `weekly`, día 1 para `monthly`). |
| `src/features/quests/services/questErrors.ts` | Create | Error de dominio y type guard (`TASK_ALREADY_COMPLETED_IN_WINDOW`). |
| `src/features/quests/hooks/useCompleteTask.ts` | Create | `useMutation` que llama service, expone `completeTask`, `isCompleting`, `lastErrorCode`. |
| `src/app/(tabs)/quests.tsx` | Modify | Integrar CTA de completar, disabled durante in-flight, toast de conflicto con copy acordado. |
| `docs/DESARROLLO.md` | Modify | Documentar regla UTC y contrato de error/UX en sección Quests. |
| `src/features/quests/services/questFrequencyWindow.test.ts` | Create | Unit tests de fronteras UTC (día, semana ISO, mes). |
| `src/features/quests/services/QuestService.idempotency.test.ts` | Create | Unit/integration-light del flujo pre-check + conflicto + insert. |

## Interfaces / Contracts

```ts
// questErrors.ts
export type QuestDomainErrorCode = "TASK_ALREADY_COMPLETED_IN_WINDOW";

export class QuestDomainError extends Error {
  constructor(public code: QuestDomainErrorCode, message?: string) { super(message ?? code); }
}

// questFrequencyWindow.ts
export type QuestFrequency = "daily" | "weekly" | "monthly" | "once";
export type UtcWindow = { startIso: string; endIso: string };
export function buildFrequencyWindowUtc(frequency: QuestFrequency, now?: Date): UtcWindow | null;

// QuestService.ts
export type CompleteTaskInput = { userId: string; taskId: string; frequency: QuestFrequency; now?: Date };
export type CompleteTaskResult = { taskLogId: string; completedAtIso: string };
async function completeTask(input: CompleteTaskInput): Promise<CompleteTaskResult>;
```

Regla: `frequency=once` retorna `null` en ventana (sin guard de frecuencia en este cambio).

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | Cálculo de ventanas UTC | Tests deterministas con fechas fijas: daily rollover, lunes ISO, cambio de mes. |
| Unit | Contrato de conflicto | Mock de Supabase query devolviendo registro existente y assert de `QuestDomainError.code`. |
| Integration-light | Flujo hook+service | Mock de service en `useCompleteTask` verificando `isPending` y mapeo de `lastErrorCode`. |
| UI behavior | Doble submit mitigado | Test de `quests.tsx`: botón deshabilitado mientras `isCompleting=true`. |

## Migration / Rollout

No migration required.

## Open Questions

- [ ] Sin bloqueo: la carrera pre-check/insert queda documentada para futura evolución a RPC atómica.
