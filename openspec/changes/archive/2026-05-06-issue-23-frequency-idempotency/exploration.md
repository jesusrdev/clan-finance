## Exploration: issue-23-frequency-idempotency

### Current State
El módulo Quests no está implementado en código productivo todavía: `src/app/(tabs)/quests.tsx` es un placeholder visual sin lectura/escritura de `tasks` o `task_logs`. La base de datos sí tiene soporte (`tasks.frequency`, `task_logs.completed_at`) y la documentación ya define la validación crítica de “1 vez por frecuencia” en app (`docs/DESARROLLO.md`), pero hoy no existe `useCompleteTask.ts` ni flujo real de CU-21 en `src/`.

### Affected Areas
- `src/app/(tabs)/quests.tsx` — futura integración de UX de completar tarea y surface de errores de idempotencia.
- `src/features/quests/hooks/useCompleteTask.ts` (nuevo) — punto de menor riesgo para pre-validación temporal daily/weekly/monthly antes de insertar `task_logs`.
- `src/features/quests/services/QuestService.ts` (nuevo) — encapsular cálculo de ventana temporal y consulta de conflicto reusable/testeable.
- `src/lib/supabase/constants.ts` — ya expone `TASKS` y `TASK_LOGS`; sin cambios estructurales esperados.
- `src/types/database.types.ts` — ya tipa `tasks.frequency` (`daily|weekly|monthly|once`) y `task_logs.completed_at`; base suficiente.
- `docs/DESARROLLO.md` — ya documenta la regla, pero deberá alinearse con la implementación final y mensaje UX exacto.
- `docs/database/supabase-schema.sql` — hoy no hay constraint único por frecuencia; la idempotencia será de aplicación salvo refuerzo SQL futuro.

### Approaches
1. **Validación idempotente en cliente (hook + servicio Quests)** — consultar `task_logs` por `task_id`, `user_id` y ventana temporal según `frequency`; si existe, abortar con error de dominio.
   - Pros: Menor riesgo, acoplado al flujo de completar tarea, fácil de testear por unidad/integración de servicio.
   - Cons: Sin garantía fuerte ante concurrencia (doble tap/red lenta/dispositivos múltiples) si no hay lock o constraint DB.
   - Effort: Medium.

2. **Validación en base de datos (RPC/constraint por ventana)** — mover la regla al backend para atomicidad.
   - Pros: Garantía fuerte de idempotencia bajo concurrencia y múltiples clientes.
   - Cons: Más complejidad (SQL/RPC, migraciones, timezone/date_trunc por frecuencia), mayor riesgo de rollout.
   - Effort: High.

### Recommendation
Implementar **Approach 1** ahora (menor riesgo y encaja con alcance de Issue #23) con diseño preparado para evolucionar a backend-atomicidad. Concretamente: crear `useCompleteTask` + `QuestService` que calculen ventana por frecuencia (`daily`, `weekly`, `monthly`), hagan pre-check, y devuelvan error de dominio tipado (`TASK_ALREADY_COMPLETED_IN_WINDOW`) para UX clara. Como mitigación, deshabilitar botón durante submit para reducir doble envío.

### Risks
- **Concurrencia**: pre-check + insert en cliente no es atómico; puede haber duplicados en carrera.
- **Timezone**: `completed_at` es `timestamptz`; definición de inicio de día/semana/mes debe ser explícita (ideal UTC o timezone de clan) para evitar falsos conflictos.
- **Semana calendario**: ambigüedad lunes vs domingo como inicio puede romper expectativas.
- **UX inconsistente**: si no se tipa error de conflicto, puede mostrarse mensaje genérico y frustrar al usuario.

### Ready for Proposal
Yes — avanzar a `sdd-propose` definiendo explícitamente: ventanas temporales por frecuencia, contrato de error UX de conflicto, y decisión temporal de timezone.
