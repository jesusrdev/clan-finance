# Guía de Desarrollo - Clan Finance

> Estado real actualizado: ver [CURRENT-STATUS.md](CURRENT-STATUS.md) para una foto fiel del código hoy.

## ⚠️ Estado real vs roadmap

Este documento mantiene el **roadmap objetivo**. El estado real implementado actualmente es:

- ✅ **Profile**: módulo más desarrollado actualmente.
- ✅ **Testing Foundation + CI Quality Gates**: establecidos y archivados vía `testing-foundation` (verify PASS WITH WARNINGS, 11/11 escenarios).
- 🚧 **Quests / Wallet / Clan**: todavía en placeholder o pendiente de implementación funcional.

Tomá esta guía como plan de ejecución, no como evidencia de completitud actual.

## 🔗 Trazabilidad Roadmap → GitHub Issues

Para ejecución diaria usar GitHub como fuente operativa (issue -> branch -> PR).

- Fase 1 (Auth): #1
- Fase 2 (Profile): #2
- Fase 3 (Clan): #3 (subissues: #11, #12, #13)
- Fase 4 (Quests): #4 (subissues: #14, #15, #16, #17)
- Fase 5 (Wallet): #5 (subissues: #18, #19, #20, #21)
- Fase 6 (Notifications): #6
- Fase 7 (Pulido): #7
- Release checklist: #8
- Soporte web dashboard: #9
- Validaciones críticas app: #10 (subissues: #22, #23, #24, #25, #26)

Issue de gobernanza GitHub (templates + policy): #29

## 📋 Orden de Implementación Recomendado

Esta guía presenta las tareas de desarrollo en el orden sugerido. Marca cada item como completado a medida que avanzas.

---

## Fase 1: Autenticación (`src/features/auth/`)

### Setup Inicial

- [x] Crear estructura de carpetas del feature
- [x] Configurar tipos TypeScript para auth

### Implementación

- [x] Implementar login con Supabase Auth
  - [x] Crear `LoginScreen.tsx`
  - [x] Crear `LoginForm.tsx` component
  - [x] Integrar Login con Email/Password
  - [/] Integrar Login con Google (OAuth) (UI lista, falta config dashboard)
    - [x] Configurar Provider en Supabase Dashboard
    - [x] Implementar flujo nativo con `expo-auth-session` o similar
  - [x] Validación de formulario
  - [x] Manejo de errores
- [x] Implementar registro de usuarios
  - [x] Crear `RegisterScreen.tsx`
  - [x] Crear `RegisterForm.tsx` component
  - [x] Validación de email y password
  - [x] Confirmación de password
- [x] Crear hook `useAuth`
  - [x] `login(email, password)`
  - [x] `register(email, password)`
  - [x] `logout()`
  - [x] `getCurrentUser()`
- [/] Implementar logout
  - [x] Botón de logout en perfil (Por implementar en UI)
  - [x] Limpiar caché al logout
  - [x] Redireccionar a login
- [x] Proteger rutas con autenticación
  - [x] Crear `ProtectedRoute` component (Gestionado en `_layout.tsx`)
  - [x] Aplicar a rutas de tabs

### Testing

- [ ] Probar registro de nuevo usuario
- [ ] Probar login con credenciales correctas (Email)
- [ ] Probar login con Google
- [ ] Probar login con credenciales incorrectas
- [ ] Probar logout
- [ ] Verificar redirección de rutas protegidas

---

## Fase 2: Perfil (`src/features/profile/`)

### Setup Inicial

- [x] Crear estructura de carpetas del feature
- [x] Configurar tipos para Profile

### Implementación

- [x] Crear/editar perfil de usuario (alcance actual)
  - [x] Crear `ProfileScreen.tsx`
  - [x] Crear `EditProfileScreen` vía ruta `src/app/profile/edit.tsx`
  - [x] Formulario de edición de nombre visible
  - [x] Feedback de guardado/error con toast en edición de nombre
  - [x] Navegación explícita de retorno en edición (barra superior + fallback seguro)
  - [x] Avatar por emoji normalizado (sin upload de imagen)
  - [ ] Upload de imagen (opcional, fuera de alcance actual)
- [x] Implementar selección de tema (5 skins)
  - [x] Crear `ThemeSelectorScreen.tsx` (en `app/theme-selection.tsx`)
  - [x] Grid de temas con preview
  - [x] Aplicar tema seleccionado
  - [x] Persistir en profile
- [ ] Sistema de XP y niveles
  - [ ] Mostrar XP actual
  - [ ] Barra de progreso a siguiente nivel
  - [ ] Cálculo de nivel basado en XP
- [x] Visualización de estadísticas (perfil fase 2)
  - [x] Tareas completadas este mes
  - [x] Porcentaje de completado
  - [x] Balance actual
  - [x] Tarjeta de progreso mensual (`MonthlyProgressCard`)
  - [x] Layout responsive para "Aventura actual" en pantallas pequeñas
  - [x] Pull-to-refresh para refrescar datos de perfil manualmente
  - [x] Flujo de estados más robusto: loading inicial -> error duro -> contenido

### Testing

- [ ] Crear perfil nuevo
- [x] Editar nombre y avatar emoji (normalización incluida)
- [ ] Cambiar tema y verificar aplicación
- [ ] Verificar cálculo de XP
- [x] Verificar estadísticas de progreso mensual (manual)

### Nota SDD de Fase 2

- Cambio OpenSpec: `profile-phase2-completion` con artefactos completos en `openspec/changes/profile-phase2-completion/`.
- Estado de verify: **bloqueado por falta de tests automatizados de runtime** (hay validación funcional/manual y evidencia estructural).

---

## Fase 3: Clan (`src/features/clan/`)

### Setup Inicial

- [ ] Crear estructura de carpetas del feature
- [ ] Configurar tipos para Clan

### Onboarding

- [ ] Crear nuevo clan (solo admin)
  - [ ] Crear `CreateClanScreen.tsx`
  - [ ] Formulario (nombre, moneda, allowance, %)
  - [ ] Generar join_code automático
  - [ ] Actualizar profile a role='admin'
- [ ] Generar código de invitación
  - [ ] Mostrar código en pantalla
  - [ ] Botón para copiar código
  - [ ] Regenerar código (opcional)
- [ ] Unirse a clan con código
  - [ ] Crear `JoinClanScreen.tsx`
  - [ ] Input para código
  - [ ] Buscar clan por código
  - [ ] Crear join_request
- [ ] Sistema de solicitudes (join_requests)
  - [ ] Crear `JoinRequestsScreen.tsx` (admin)
  - [ ] Listar solicitudes pendientes
  - [ ] Botones aprobar/rechazar
  - [ ] Actualizar profile al aprobar

### Gestión

- [ ] Gestión de miembros (admin)
  - [ ] Crear `MembersScreen.tsx`
  - [ ] Listar todos los miembros
  - [ ] Ver perfil de miembro
  - [ ] Remover miembro (opcional)
- [ ] Compartir código vía Expo Sharing
  - [ ] Botón "Compartir código"
  - [ ] Integrar Expo Sharing
  - [ ] Formato de mensaje

### Testing

- [ ] Crear clan como admin
- [ ] Generar y copiar código
- [ ] Unirse a clan con código (otro usuario)
- [ ] Aprobar solicitud como admin
- [ ] Verificar miembro agregado
- [ ] Compartir código por WhatsApp

---

## Fase 4: Quests (`src/features/quests/`)

### Regla de idempotencia por frecuencia (Issue 23)

- La completitud de tareas `daily`, `weekly` y `monthly` se valida contra ventanas **UTC** explícitas:
  - `daily`: `[00:00:00 UTC del día, 00:00:00 UTC del día siguiente)`
  - `weekly`: `[lunes ISO 00:00:00 UTC, lunes siguiente 00:00:00 UTC)`
  - `monthly`: `[día 1 00:00:00 UTC, día 1 del mes siguiente 00:00:00 UTC)`
- Si ya existe `task_logs` para `user_id + task_id` en la ventana activa, el service devuelve `QuestDomainError` con código `TASK_ALREADY_COMPLETED_IN_WINDOW`.
- Contrato UX: ante ese código, la UI muestra **"Ya completaste esta tarea en este período."** y evita copy genérico.
- Mitigación de doble submit: el botón de completar permanece deshabilitado mientras la request está in-flight.
- Limitación conocida: el enfoque actual cliente (pre-check + insert) **no es atómico**; puede haber carrera en alta concurrencia. Evolución futura: RPC/constraint atómico en DB.

### Setup Inicial

- [ ] Crear estructura de carpetas del feature
- [ ] Configurar tipos para Task y TaskLog

### Gestión de Tareas (Admin)

- [ ] Listar tareas del clan
  - [ ] Crear `TasksListScreen.tsx`
  - [ ] Filtrar por activas/inactivas
  - [ ] Ordenar por frecuencia
- [ ] Crear nueva quest
  - [ ] Crear `CreateTaskScreen.tsx`
  - [ ] Formulario (título, recompensa, frecuencia)
  - [ ] Validaciones
- [ ] Editar tarea
  - [ ] Crear `EditTaskScreen.tsx`
  - [ ] Cargar datos existentes
  - [ ] Actualizar tarea
- [ ] Activar/desactivar tarea
  - [ ] Toggle en lista
  - [ ] Actualizar is_active

### Completar Tareas (Member)

- [ ] Ver tareas del clan
  - [ ] Crear `QuestsScreen.tsx`
  - [ ] Listar tareas activas
  - [ ] Mostrar recompensa
- [ ] Marcar tarea como completada
  - [ ] Botón "Completar"
  - [ ] Crear task_log
  - [ ] Mostrar confirmación
- [ ] Ver tareas pendientes de aprobación
  - [ ] Sección "Pendientes"
  - [ ] Estado de cada tarea

### Aprobación (Admin)

- [ ] Ver tareas pendientes de aprobación
  - [ ] Crear `ApproveTasksScreen.tsx`
  - [ ] Listar task_logs pending
  - [ ] Mostrar usuario y tarea
- [ ] Aprobar tarea completada
  - [ ] Botón "Aprobar"
  - [ ] Actualizar status a approved
  - [ ] Sumar XP al usuario
- [ ] Rechazar tarea completada
  - [ ] Botón "Rechazar"
  - [ ] Actualizar status a rejected
  - [ ] Opcional: agregar razón

### Progreso

- [ ] Ver progreso personal
  - [ ] Mostrar % completado del mes
  - [ ] Tareas completadas / total
  - [ ] Proyección de payout
- [ ] Ver progreso del clan (admin)
  - [ ] Dashboard con todos los miembros
  - [ ] % de cada miembro
  - [ ] Gráfica de barras

### Testing

- [ ] Crear tarea como admin
- [ ] Completar tarea como member
- [ ] Aprobar tarea como admin
- [ ] Verificar XP sumado
- [ ] Verificar progreso actualizado
- [ ] Calcular % del mes

---

## Fase 5: Wallet (`src/features/wallet/`)

### Setup Inicial

- [ ] Crear estructura de carpetas del feature
- [ ] Configurar tipos para Wallet, Transaction, Payout

### Visualización

- [ ] Ver balance de wallet
  - [ ] Crear `WalletScreen.tsx`
  - [ ] Mostrar balance actual
  - [ ] Mostrar moneda del clan
- [ ] Ver historial de transacciones
  - [ ] Lista de transactions
  - [ ] Filtrar por tipo
  - [ ] Ordenar por fecha

### Transacciones

- [ ] Registrar ingreso manual
  - [ ] Crear `AddIncomeScreen.tsx`
  - [ ] Input de monto
  - [ ] Descripción opcional
  - [ ] Crear transaction (manual_income)
- [ ] Registrar gasto
  - [ ] Crear `AddExpenseScreen.tsx`
  - [ ] Input de monto (negativo)
  - [ ] Categoría/descripción
  - [ ] Crear transaction (expense)
- [ ] Transferir a ahorro (futuro)
  - [ ] Crear `TransferSavingsScreen.tsx`
  - [ ] Input de monto
  - [ ] Crear transaction (savings_transfer)

### Payouts

- [ ] Ver payouts calculados (admin)
  - [ ] Crear `PayoutsScreen.tsx`
  - [ ] Listar payouts del mes
  - [ ] Filtrar por status
- [ ] Marcar payout como pagado (admin)
  - [ ] Botón "Marcar como pagado"
  - [ ] Actualizar status
  - [ ] Crear transaction
- [ ] Ver historial de payouts (member)
  - [ ] Lista de payouts recibidos
  - [ ] Mostrar mes/año y monto

### Dashboard (Admin)

- [ ] Ver balance del clan
  - [ ] Suma de todos los balances
  - [ ] Balance promedio
- [ ] Ver transacciones del clan
  - [ ] Todas las transactions del mes
  - [ ] Agrupar por tipo
- [ ] Gráficos con Victory Native
  - [ ] Gráfica de pie (distribución de gastos)
  - [ ] Gráfica de línea (tendencia mensual)
  - [ ] Gráfica de barras (balance por miembro)

### Testing

- [ ] Ver balance inicial (0)
- [ ] Registrar ingreso manual
- [ ] Verificar balance actualizado
- [ ] Registrar gasto
- [ ] Verificar balance reducido
- [ ] Crear payout como admin
- [ ] Marcar como pagado
- [ ] Verificar transaction creada

---

## Fase 6: Notificaciones

### Setup

- [ ] Configurar Expo Notifications
  - [ ] Solicitar permisos
  - [ ] Configurar listeners

### Notificaciones Locales

- [ ] Recordatorio diario de tareas (8 PM)
  - [ ] Programar notificación diaria
  - [ ] Mensaje personalizado
  - [ ] Deep link a quests
- [ ] Notificación quincenal de progreso
  - [ ] Calcular % completado
  - [ ] Programar cada 15 días
  - [ ] Mostrar proyección de payout
- [ ] Alertas de solicitudes pendientes (admin)
  - [ ] Notificar al crear join_request
  - [ ] Deep link a solicitudes

### Testing

- [ ] Verificar permisos solicitados
- [ ] Probar notificación diaria
- [ ] Probar notificación quincenal
- [ ] Probar deep links

---

## Fase 7: Pulido y Optimización

### UI/UX

- [ ] Animaciones con Reanimated
  - [ ] Transiciones de pantallas
  - [ ] Animaciones de botones
  - [ ] Skeleton loaders
- [ ] Estados de carga
  - [ ] Spinners
  - [ ] Skeleton screens
  - [ ] Pull to refresh
- [ ] Manejo de errores
  - [ ] Toast messages
  - [ ] Error boundaries
  - [ ] Retry buttons

### Performance

- [ ] Optimizar imágenes
  - [ ] Usar Expo Image
  - [ ] Lazy loading
- [ ] Optimizar listas
  - [ ] FlatList con virtualization
  - [ ] Memoization de items
- [ ] Code splitting
  - [ ] Lazy load de screens

### Testing Final

- [ ] Flujo completo de onboarding
- [ ] Flujo completo de quests
- [ ] Flujo completo de wallet
- [ ] Probar con datos reales
- [ ] Probar en dispositivo físico

---

## Checklist de Lanzamiento

### Pre-lanzamiento

- [ ] Configurar analytics (opcional)
- [ ] Configurar error tracking (Sentry)
- [ ] Configurar EAS Build
- [ ] Crear iconos y splash screen
- [ ] Configurar app.json para producción

### Testing

- [ ] TestFlight (iOS)
- [ ] Internal Testing (Android)
- [ ] Beta testers

### Lanzamiento

- [ ] App Store submission
- [ ] Google Play submission
- [ ] Landing page
- [ ] Documentación de usuario

---

## Notas

### Prioridades

- ✅ **Crítico**: Fases 1-4 (funcionalidad core)
- ⚠️ **Importante**: Fase 5 (wallet completo)
- 📌 **Nice to have**: Fases 6-7 (pulido)

### Estimación de Tiempo

- Fase 1: 1-2 semanas
- Fase 2: 1 semana
- Fase 3: 2 semanas
- Fase 4: 2-3 semanas
- Fase 5: 2-3 semanas
- Fase 6: 1 semana
- Fase 7: 1-2 semanas

**Total estimado**: 10-16 semanas

---

**Versión:** 1.1  
**Última actualización:** Enero 2026

### Soporte Web (Dashboard)

- [ ] Crear layout responsive (mobile vs web)
  - [ ] Tabs para mobile
  - [ ] Sidebar para web (opcional)
- [ ] Adaptar gráficas para pantallas grandes
- [ ] Probar dashboard en web (`npm run web`)
- [ ] Optimizar visualización de datos

---

## ⚠️ Validaciones Críticas en la App

### Estas validaciones DEBEN implementarse en el código (no están en SQL)

#### 1. Onboarding Forzado (Usuario sin Clan)

**Dónde:** `app/_layout.tsx` o middleware de autenticación

```typescript
// Verificar si usuario tiene clan
const { data: profile } = await supabase
  .from("profiles")
  .select("clan_id")
  .eq("id", user.id)
  .single();

if (!profile.clan_id) {
  // Redirigir a pantalla de onboarding
  router.replace("/onboarding");
  return;
}
```

**Razón:** Usuario NO puede usar la app sin clan

---

#### 2. Tarea Completada Solo 1 Vez por Frecuencia

**Dónde:** `features/quests/hooks/useCompleteTask.ts`

```typescript
// Antes de crear task_log, verificar si ya completó
const today = new Date();
const startOfDay = new Date(today.setHours(0, 0, 0, 0));
const endOfDay = new Date(today.setHours(23, 59, 59, 999));

const { data: existingLog } = await supabase
  .from("task_logs")
  .select("*")
  .eq("task_id", taskId)
  .eq("user_id", userId)
  .gte("completed_at", startOfDay.toISOString())
  .lte("completed_at", endOfDay.toISOString())
  .single();

if (existingLog) {
  throw new Error("Ya completaste esta tarea hoy");
}
```

**Razón:** Evitar completar la misma tarea múltiples veces al día

**Nota:** Para weekly/monthly, ajustar el rango de fechas

---

#### 3. Admin No Puede Salir del Clan

**Dónde:** `features/clan/hooks/useLeaveClan.ts`

```typescript
// Verificar si usuario es admin del clan
const { data: clan } = await supabase
  .from("clans")
  .select("admin_id")
  .eq("id", clanId)
  .single();

if (clan.admin_id === userId) {
  throw new Error(
    "El admin no puede salir del clan. Transfiere el rol primero.",
  );
}

// Si no es admin, permitir salir
await supabase.from("profiles").update({ clan_id: null }).eq("id", userId);
```

**Razón:** Proteger integridad del clan

---

#### 4. Validar Balance Antes de Gastos

**Dónde:** `features/wallet/hooks/useAddExpense.ts`

```typescript
// Obtener balance actual
const { data: wallet } = await supabase
  .from("wallets")
  .select("balance")
  .eq("user_id", userId)
  .single();

// Validar que hay fondos suficientes
if (wallet.balance + amount < 0) {
  // amount es negativo para gastos
  throw new Error("Saldos insuficientes");
}

// Si hay fondos, crear transacción
await supabase.from("transactions").insert({
  wallet_id: walletId,
  amount: amount, // negativo
  type: "expense",
  description: description,
});
```

**Razón:** Evitar race conditions con balance negativo

**Nota:** El constraint SQL rechazará la transacción si falla, pero mejor validar antes

---

### Resumen de Validaciones

| Validación          | Ubicación         | Prioridad  |
| ------------------- | ----------------- | ---------- |
| Onboarding forzado  | `app/_layout.tsx` | 🔴 Crítica |
| Tarea 1 vez por día | `useCompleteTask` | 🔴 Crítica |
| Admin no sale       | `useLeaveClan`    | 🟡 Alta    |
| Balance positivo    | `useAddExpense`   | 🟡 Alta    |
