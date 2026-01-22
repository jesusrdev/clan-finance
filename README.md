# Clan Finance: Quest & Savings - Especificación Técnica Maestra v2.0

## 1. Visión y Concepto

Aplicación de finanzas familiares gamificada. Las tareas del hogar son "Quests" y el ahorro se visualiza como "Poder" o "Nivel". Diseño basado en temas de cultura pop (Anime/Series) usando un sistema de diseño modular y "Skins".

## 2. Stack Tecnológico Detallado

| Capa           | Tecnología             | Implementación Específica                             |
| -------------- | ---------------------- | ----------------------------------------------------- |
| Framework      | Expo (React Native)    | SDK 50+, Expo Router (File-based navigation)          |
| Estilos        | React Native Unistyles | Temas dinámicos con UnistylesRegistry                 |
| Componentes    | Gluestack UI v2        | Adaptación de Shadcn para Native con estilos de juego |
| Backend        | Supabase               | PostgreSQL + Auth + Realtime                          |
| Query Layer    | TanStack Query v5      | Gestión de caché y persistencia offline               |
| Gráficos       | Victory Native XL      | Visualización de progreso y distribución de gastos    |
| Notificaciones | Expo Notifications     | Recordatorios locales (diarios/quincenales/mensuales) |
| Compartir      | Expo Sharing           | Generación de enlaces/códigos de invitación al clan   |

## 3. Arquitectura de Diseño (Skins)

| Tema            | Color Primario | Color Fondo | Estilo UI                                      |
| --------------- | -------------- | ----------- | ---------------------------------------------- |
| One Piece       | `#D91E1E`      | `#FDF5E6`   | Bordes gruesos (2px), estilo carteles "Wanted" |
| Demon Slayer    | `#2D5F5D`      | `#121212`   | Patrones Hamon, bordes rectos y elegantes      |
| Naruto          | `#FF9F1C`      | `#FFFFFF`   | Estilo pergamino, sombras suaves               |
| Dragon Ball     | `#F28F08`      | `#253294`   | Relieves, fuentes Bold y colores saturados     |
| Stranger Things | `#E20713`      | `#0B0B0B`   | Brillo neón, estética años 80                  |

## 4. Diccionario de Datos (Modelo de Base de Datos)

### Módulo de Clan e Identidad

#### `clans`

| Campo                    | Tipo         | Descripción                                     |
| ------------------------ | ------------ | ----------------------------------------------- |
| `id`                     | uuid, PK     | Identificador único                             |
| `name`                   | text         | Nombre del clan                                 |
| `admin_id`               | uuid, FK     | Usuario que gestiona y paga                     |
| `currency_code`          | text         | Ej. "PEN", "USD". Una sola para toda la familia |
| `monthly_allowance`      | numeric      | Monto total mensual planeado (ej. 50.00)        |
| `min_completion_percent` | int          | Porcentaje para bono completo (default 85)      |
| `join_code`              | text, unique | Código de 6-8 caracteres para invitaciones      |

#### `profiles`

| Campo            | Tipo     | Descripción                        |
| ---------------- | -------- | ---------------------------------- |
| `id`             | uuid, PK | Relación con auth.users            |
| `clan_id`        | uuid, FK | Clan actual                        |
| `display_name`   | text     | Nombre visible en la app           |
| `avatar_url`     | text     | Imagen de perfil (o emoji elegido) |
| `role`           | enum     | `admin` \| `member`                |
| `selected_theme` | text     | Skin activa                        |
| `xp`             | int      | Experiencia acumulada              |

#### `join_requests` (Nuevo: Sistema de Invitación)

| Campo     | Tipo     | Descripción                           |
| --------- | -------- | ------------------------------------- |
| `id`      | uuid, PK | Identificador único                   |
| `clan_id` | uuid, FK | Clan al que se desea unir             |
| `user_id` | uuid, FK | Usuario que desea unirse              |
| `status`  | enum     | `pending` \| `approved` \| `rejected` |

### Módulo de Quests (Tareas)

#### `tasks`

| Campo          | Tipo     | Descripción                                |
| -------------- | -------- | ------------------------------------------ |
| `id`           | uuid, PK | Identificador único                        |
| `clan_id`      | uuid, FK | Clan propietario de la tarea               |
| `title`        | text     | Título de la tarea                         |
| `reward_value` | numeric  | Pago por cumplimiento individual           |
| `frequency`    | enum     | `daily` \| `weekly` \| `monthly` \| `once` |
| `is_active`    | boolean  | Si la tarea cuenta para el mes actual      |

#### `task_logs`

| Campo          | Tipo      | Descripción                           |
| -------------- | --------- | ------------------------------------- |
| `id`           | uuid, PK  | Identificador único                   |
| `task_id`      | uuid, FK  | Tarea completada                      |
| `user_id`      | uuid, FK  | Usuario que completó la tarea         |
| `status`       | enum      | `pending` \| `approved` \| `rejected` |
| `completed_at` | timestamp | Fecha y hora de completado            |

### Módulo de Economía y Wallet

#### `wallets`

Saldo líquido disponible. Contiene `user_id` y `balance`.

#### `transactions`

Historial contable detallado.

| Campo       | Tipo     | Descripción                     |
| ----------- | -------- | ------------------------------- |
| `id`        | uuid, PK | Identificador único             |
| `wallet_id` | uuid, FK | Billetera relacionada           |
| `amount`    | numeric  | Positivo o negativo             |
| `type`      | enum     | Tipo de transacción (ver abajo) |

**Tipos de Transacción:**

- `allowance_payout`: Pago mensual por tareas
- `manual_income`: Dinero externo agregado por el usuario para ahorrar
- `expense`: Gastos reales registrados
- `savings_transfer`: Dinero movido de wallet a meta de ahorro

#### `payouts` (Nuevo: Registro de Pagos del Admin)

| Campo     | Tipo     | Descripción                      |
| --------- | -------- | -------------------------------- |
| `id`      | uuid, PK | Identificador único              |
| `user_id` | uuid, FK | Usuario que recibe el pago       |
| `amount`  | numeric  | Monto final pagado               |
| `month`   | int      | Mes evaluado                     |
| `year`    | int      | Año evaluado                     |
| `status`  | enum     | `calculated` \| `paid_in_person` |

## 5. Lógica de Negocio y Flujos

### A. Unión a un Clan

1. El Admin genera un enlace o código desde la app (`clans.join_code`)
2. El Miembro ingresa el código y se crea una `join_request` con estado `pending`
3. El Admin recibe una notificación y aprueba al miembro, asignándole el `clan_id`

### B. El Cierre Mensual (Cálculo del 85%)

Al final del mes, el sistema evalúa los `task_logs` aprobados contra el total de tareas `is_active`:

- **Éxito (≥ `min_completion_percent`)**: Se genera un `payout` por el valor de `monthly_allowance`
- **Fallo (< `min_completion_percent`)**: Se suma el `reward_value` de cada tarea aprobada

**Flujo de Pago:**

1. El estado del pago queda como `calculated`
2. Cuando el Admin entrega el dinero físico, marca `paid_in_person`
3. El saldo se suma a la `wallet` del niño

### C. Ahorro y Dinero Externo (Manual Incomes)

Si un niño recibe dinero extra (ej. regalo de un tío):

1. Lo registra como `manual_income`
2. Esto aumenta su `wallet.balance` directamente sin pasar por aprobación del admin
3. El niño puede elegir "Mover a Meta de Ahorro", lo cual resta de `wallet` y suma a `savings_goal.current_amount`

## 6. Notificaciones Locales y Alertas

- **Check de Tareas (Diario)**: "¡No dejes que tu racha muera! Marca tus tareas antes de las 8 PM"
- **Estado de Bono (Quincenal)**: "Llevas un 60% de tareas hechas. ¡Necesitas el 85% para el bono de [Moneda] [Monto]!"
- **Solicitudes Pendientes**: Alerta al Admin si hay nuevos miembros esperando unirse

## 7. Instrucciones para la IA (Desarrollo Optimizado)

- **Contexto de Wallet**: "El saldo de la billetera es un valor derivado pero persistente. Cada transacción debe actualizar el balance mediante un Trigger de Base de Datos para evitar discrepancias."

- **Sistema de Temas**: "Usa el `UnistylesRegistry` para inyectar el tema basado en `profiles.selected_theme`. Los componentes de Gluestack deben consumir los tokens de color del tema activo."

- **Invitaciones**: "Usa `expo-sharing` para permitir que el admin comparta el `join_code` por WhatsApp o Telegram de forma nativa."

- **Validación Semestral**: "Crea una vista de 'Auditoría de Héroe' que compare ingresos vs ahorros de los últimos 6 meses para sugerir bonos de julio/diciembre."
