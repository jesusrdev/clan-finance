# SDD Status (estado real)

_Última actualización: Mayo 2026_

## `testing-foundation` (archivado y consolidado)

- **Implementación en código:** ✅ completada.
- **Archive:** ✅ `openspec/changes/archive/2026-05-06-testing-foundation/`.
- **Specs finales (source of truth):**
  - `openspec/specs/test-foundation/spec.md`
  - `openspec/specs/ci-quality-gates/spec.md`
- **Verify:** ✅ PASS WITH WARNINGS (11/11 escenarios compliant; 19/19 tareas completas).

### Warnings no bloqueantes registrados

- `react-test-renderer` deprecado en tests.
- warnings de npm config: `node-linker`, `enable-pre-post-scripts`.

## `profile-phase2-completion`

- **Implementación en código:** ✅ completada (perfil fase 2).
- **Artefactos OpenSpec:** ✅ presentes en `openspec/changes/profile-phase2-completion/`.
- **Verify:** ⚠️ bloqueado.

### ¿Qué está implementado?

- Edición de nombre visible en perfil (`/profile/edit`).
- Feedback de edición con toasts (éxito, validación y error de guardado).
- Navegación de retorno explícita y segura en edición de perfil.
- Métricas mensuales y tarjeta de progreso (`MonthlyProgressCard`).
- Pull-to-refresh y separación de estados UX (`isInitialLoading`, `isRefreshing`, error duro).
- Ajustes mobile de layout/estética en Profile (root flex seguro, stats responsive, marcador de progreso centrado).
- Normalización de avatar por emoji con soft migration de valores inválidos/URL externa a avatar default (`👤`).

### ¿Qué falta para cerrar verify?

- Tests automatizados de runtime para escenarios del spec.

> Nota: hay validación funcional/manual y evidencia estructural, pero no reemplazan evidencia automatizada ejecutable.
