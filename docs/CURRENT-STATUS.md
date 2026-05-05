# Estado Actual del Proyecto (real)

_Última actualización: Mayo 2026_

## Resumen ejecutivo

- **Módulo más avanzado:** `Profile`.
- **Base operativa:** autenticación y navegación principal.
- **Pendiente/placeholder:** `Quests`, `Wallet` y `Clan`.

## Estado por módulo

| Módulo | Estado | Evidencia rápida |
| --- | --- | --- |
| Auth | 🟡 Base operativa | Login/registro y cierre de sesión en flujo activo |
| Profile | ✅ Más desarrollado | Pantalla de perfil, stats, avatar emoji, selección de skin y logout |
| Quests | 🚧 Placeholder | Pantalla con mensaje “Próximamente más misiones...” |
| Wallet | 🚧 Placeholder | Pantalla estática de wallet sin flujos funcionales |
| Clan | 🚧 Pending | Estructura creada, sin implementación funcional visible |

## Nota de verificación manual web reciente

Se validó manualmente en Web, de forma puntual (NO exhaustiva), el flujo:

1. login,
2. profile,
3. theme-selection,
4. logout,
5. fix de retorno a home/login tras logout.

Esta verificación confirma el comportamiento básico del flujo de sesión y perfil, pero **no** reemplaza un plan formal de QA/E2E.
