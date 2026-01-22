# Seguridad y Permisos - Row Level Security (RLS)

## Introducción

Este documento describe las políticas de seguridad implementadas en Supabase usando Row Level Security (RLS) para garantizar que cada usuario solo pueda acceder a la información que le corresponde según su rol.

## Roles del Sistema

| Rol        | Descripción            | Permisos Generales                                                                                |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------------- |
| **Admin**  | Administrador del clan | Gestión completa del clan, ver información de todos los miembros, aprobar tareas, gestionar pagos |
| **Member** | Miembro del clan       | Ver y gestionar su propia información, completar tareas, gestionar su wallet                      |

## Matriz de Permisos por Tabla

### 1. profiles

| Operación                | Admin | Member |
| ------------------------ | ----- | ------ |
| Ver su propio perfil     | ✅    | ✅     |
| Editar su propio perfil  | ✅    | ✅     |
| Ver perfiles del clan    | ✅    | ✅     |
| Editar perfiles de otros | ❌    | ❌     |

**Políticas implementadas:**

- `Los usuarios pueden ver su propio perfil`
- `Los usuarios pueden actualizar su propio perfil`
- `Los usuarios pueden ver perfiles de su clan`

### 2. clans

| Operación                     | Admin | Member |
| ----------------------------- | ----- | ------ |
| Ver su clan                   | ✅    | ✅     |
| Editar configuración del clan | ✅    | ❌     |
| Ver otros clanes              | ❌    | ❌     |

**Políticas implementadas:**

- `Los usuarios pueden ver su clan`
- `Solo el admin puede actualizar el clan`

### 3. join_requests

| Operación                          | Admin | Member |
| ---------------------------------- | ----- | ------ |
| Ver sus propias solicitudes        | ✅    | ✅     |
| Ver todas las solicitudes del clan | ✅    | ❌     |
| Aprobar/rechazar solicitudes       | ✅    | ❌     |

**Políticas implementadas:**

- `Los usuarios pueden ver sus propias solicitudes`
- `El admin puede ver todas las solicitudes de su clan`
- `El admin puede actualizar solicitudes de su clan`

### 4. tasks

| Operación           | Admin | Member |
| ------------------- | ----- | ------ |
| Ver tareas del clan | ✅    | ✅     |
| Crear tareas        | ✅    | ❌     |
| Editar tareas       | ✅    | ❌     |
| Eliminar tareas     | ✅    | ❌     |

**Políticas implementadas:**

- `Los miembros del clan pueden ver las tareas`
- `Solo el admin puede crear/editar tareas`

### 5. task_logs

| Operación                      | Admin | Member |
| ------------------------------ | ----- | ------ |
| Ver sus propios logs           | ✅    | ✅     |
| Ver logs de todos los miembros | ✅    | ❌     |
| Crear logs propios             | ✅    | ✅     |
| Aprobar/rechazar logs          | ✅    | ❌     |

**Políticas implementadas:**

- `Los usuarios pueden ver sus propios logs`
- `El admin puede ver logs de todos los miembros de su clan`
- `Los usuarios pueden crear sus propios logs`
- `El admin puede aprobar/rechazar logs de su clan`

**Uso para Dashboard:**

- Admin puede ver progreso de todos los miembros
- Admin puede calcular % de completado para bonos

### 6. wallets

| Operación                         | Admin | Member |
| --------------------------------- | ----- | ------ |
| Ver su propia wallet              | ✅    | ✅     |
| Ver wallets de todos los miembros | ✅    | ❌     |
| Editar wallets                    | ❌    | ❌     |

**Políticas implementadas:**

- `Los usuarios pueden ver su propia wallet`
- `El admin puede ver wallets de todos los miembros de su clan`

**Uso para Dashboard:**

- Admin puede ver balance total del clan
- Admin puede crear gráficas de distribución de ahorro

### 7. transactions

| Operación                     | Admin | Member |
| ----------------------------- | ----- | ------ |
| Ver sus propias transacciones | ✅    | ✅     |
| Ver transacciones de todos    | ✅    | ❌     |
| Crear transacciones propias   | ✅    | ✅     |

**Políticas implementadas:**

- `Los usuarios pueden ver sus transacciones`
- `El admin puede ver transacciones de todos los miembros de su clan`
- `Los usuarios pueden crear transacciones en su wallet`

**Uso para Dashboard:**

- Admin puede ver gastos totales del clan
- Admin puede crear gráficas de gastos por tipo

### 8. payouts

| Operación                | Admin | Member |
| ------------------------ | ----- | ------ |
| Ver sus propios payouts  | ✅    | ✅     |
| Ver payouts de todos     | ✅    | ❌     |
| Crear/actualizar payouts | ✅    | ❌     |

**Políticas implementadas:**

- `Los usuarios pueden ver sus propios payouts`
- `El admin puede ver payouts de todos los miembros de su clan`
- `El admin puede crear/actualizar payouts de su clan`

**Uso para Dashboard:**

- Admin puede gestionar pagos mensuales
- Admin puede marcar payouts como pagados

## Principios de Seguridad

### 1. Aislamiento por Clan

- Cada admin solo puede ver información de **su propio clan**
- No hay acceso cross-clan
- Verificación mediante `clan_id` en todas las políticas

### 2. Verificación de Rol

- Todas las políticas de admin verifican `role = 'admin'`
- Los members no pueden acceder a funciones administrativas
- Validación en cada operación

### 3. Scope Limitado

- Los usuarios solo pueden modificar sus propios datos
- El admin puede ver pero no modificar datos de otros (excepto aprobaciones)
- Operaciones destructivas requieren ser admin

### 4. Políticas Duales

Muchas tablas tienen **múltiples políticas SELECT**:

- Una para usuarios viendo sus propios datos
- Una para admin viendo datos del clan

Supabase evalúa con `OR`, permitiendo acceso si cualquiera se cumple.

## Queries Recomendadas para Dashboard Admin

### 1. Resumen del Clan

```typescript
const { data } = await supabase
  .from("profiles")
  .select(
    `
    *,
    wallets (balance)
  `,
  )
  .eq("clan_id", clanId);
```

### 2. Progreso de Tareas

```typescript
const { data } = await supabase
  .from("task_logs")
  .select(
    `
    *,
    tasks (title, frequency),
    profiles (display_name)
  `,
  )
  .gte("completed_at", startOfMonth)
  .lte("completed_at", endOfMonth)
  .eq("status", "approved");
```

### 3. Transacciones del Mes

```typescript
const { data } = await supabase
  .from("transactions")
  .select(
    `
    *,
    wallets!inner (
      user_id,
      profiles!inner (
        display_name,
        clan_id
      )
    )
  `,
  )
  .eq("wallets.profiles.clan_id", clanId)
  .gte("created_at", startOfMonth);
```

### 4. Payouts Pendientes

```typescript
const { data } = await supabase
  .from("payouts")
  .select(
    `
    *,
    profiles (display_name)
  `,
  )
  .eq("status", "calculated")
  .eq("month", currentMonth)
  .eq("year", currentYear);
```

## Testing de Políticas

Para probar las políticas en el SQL Editor de Supabase:

```sql
-- Simular ser un usuario específico
SET request.jwt.claim.sub = 'user-uuid-here';

-- Probar queries como ese usuario
SELECT * FROM task_logs;
SELECT * FROM wallets;
```

## Resumen

✅ **Admin puede:**

- Ver dashboard completo con estadísticas
- Gestionar miembros y solicitudes
- Aprobar tareas y gestionar pagos
- Ver información de todos los miembros de su clan

✅ **Member puede:**

- Ver y gestionar su propia información
- Completar tareas
- Gestionar su wallet y transacciones
- Ver perfiles de miembros del clan

❌ **Nadie puede:**

- Acceder a información de otros clanes
- Modificar datos de otros usuarios directamente
- Bypasear las políticas de seguridad
