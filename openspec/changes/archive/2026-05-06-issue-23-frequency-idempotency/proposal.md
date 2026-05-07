# Proposal: Issue 23 — Frequency Idempotency

## Intent
Evitar que un usuario complete la misma tarea más de una vez dentro de su ventana de frecuencia, cerrando el gap entre la regla documentada y el comportamiento real del módulo Quests.

## Scope

### In Scope
- Implementar validación idempotente en app para `daily`, `weekly`, `monthly` antes de insertar en `task_logs`.
- Definir contrato de dominio + UX para conflicto (`TASK_ALREADY_COMPLETED_IN_WINDOW`).
- Integrar mitigación de doble envío (botón deshabilitado durante submit) y actualizar documentación funcional.

### Out of Scope
- Garantía atómica en base de datos (RPC/constraints/migraciones SQL).
- Cambios de modelo de datos (`tasks`, `task_logs`) o rediseño completo de Quests.

## Capabilities

### New Capabilities
- `quests-frequency-idempotency`: reglas de una-completitud-por-ventana y surface de error de conflicto en Quests.

### Modified Capabilities
- None.

## Approach
- Implementar Approach 1 (cliente) con `QuestService` + `useCompleteTask`.
- Ventanas explícitas en UTC:
  - `daily`: desde 00:00:00 UTC del día actual.
  - `weekly`: desde 00:00:00 UTC del lunes de la semana ISO actual.
  - `monthly`: desde 00:00:00 UTC del día 1 del mes actual.
- Contrato UX para conflicto: mapear `TASK_ALREADY_COMPLETED_IN_WINDOW` a mensaje no bloqueante y accionable: **"Ya completaste esta tarea en este período."**

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/features/quests/services/QuestService.ts` | New | Cálculo de ventanas + pre-check de conflicto |
| `src/features/quests/hooks/useCompleteTask.ts` | New | Orquestación submit, mapeo de errores de dominio |
| `src/app/(tabs)/quests.tsx` | Modified | Integración de UX de completitud y conflicto |
| `docs/DESARROLLO.md` | Modified | Alineación de regla y contrato de error |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Carrera entre pre-check e insert | Med | Deshabilitar submit + preparar evolución a RPC atómica |
| Ambigüedad temporal | Med | Definir UTC + lunes ISO explícitamente |
| Mensajería inconsistente | Low | Error tipado único y copy UX fijo |

## Rollback Plan
Revertir cambios de Quests hook/service/UI y volver al flujo previo sin pre-check; mantener esquema DB intacto facilita rollback limpio.

## Dependencies
- Supabase disponible para lectura/inserción en `task_logs`.

## Success Criteria
- [ ] Un usuario NO puede completar dos veces una tarea `daily/weekly/monthly` dentro de la misma ventana UTC.
- [ ] El conflicto muestra el mensaje UX acordado y no un error genérico.
- [ ] La documentación de desarrollo refleja exactamente la regla implementada.
