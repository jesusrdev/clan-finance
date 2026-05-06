# Estado Actual del Proyecto (real)

_Última actualización: Mayo 2026_

## Resumen ejecutivo

- **Módulo más avanzado:** `Profile` (con pulidos recientes de UX mobile).
- **Base operativa:** autenticación y navegación principal.
- **Pendiente/placeholder:** `Quests`, `Wallet` y `Clan`.
- **SDD:** artefactos de `profile-phase2-completion` existen; verify en estado bloqueado por ausencia de tests automatizados de runtime.

## Estado por módulo

| Módulo | Estado | Evidencia rápida |
| --- | --- | --- |
| Auth | 🟡 Base operativa | Login/registro y cierre de sesión en flujo activo |
| Profile | ✅ Fase 2 completada en código + UX mobile | Editar nombre (`/profile/edit`) con feedback toast, métricas mensuales + `MonthlyProgressCard`, pull-to-refresh, flujo loading/error/contenido más robusto, avatar emoji normalizado con soft migration a default |
| Quests | 🚧 Placeholder | Pantalla con mensaje “Próximamente más misiones...” |
| Wallet | 🚧 Placeholder | Pantalla estática de wallet sin flujos funcionales |
| Clan | 🚧 Pending | Estructura creada, sin implementación funcional visible |

## Verificación y límites de evidencia

Se validó manualmente (puntual, NO exhaustivo) el flujo:

1. login,
2. profile,
3. theme-selection,
4. logout,
5. fix de retorno a home/login tras logout.
6. edición de nombre visible,
7. visualización de progreso mensual (incluyendo estado en cero).
8. visibilidad y estilos base del tabbar (íconos restaurados).
9. corrección de layout mobile en Profile (`SafeAreaView` con `style={{ flex: 1 }}`).

Esto confirma comportamiento funcional base de sesión + perfil, pero **no** reemplaza QA formal ni evidencia automatizada de runtime.

## Estado SDD: `profile-phase2-completion`

- Artefactos disponibles en `openspec/changes/profile-phase2-completion/` (proposal, spec, design, tasks, apply-progress, verify-report).
- `verify-report.md` marca **FAIL** por 9/9 escenarios sin pruebas ejecutables (`UNTESTED`), aunque la implementación estructural/manual está completa.
