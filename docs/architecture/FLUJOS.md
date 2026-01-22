# Flujos de Casos de Uso - Clan Finance

## Flujo 1: Onboarding - Crear Familia

```mermaid
sequenceDiagram
    participant U as Usuario
    participant Auth as Supabase Auth
    participant App as Aplicación
    participant DB as Base de Datos

    U->>Auth: 1. Registrarse (email/password)
    Auth-->>U: Usuario creado (auth.users)

    U->>App: 2. Completar perfil inicial
    Note over App: display_name, avatar, tema
    App->>DB: INSERT profiles<br/>(sin clan_id, role='member')
    DB-->>App: Profile creado

    Note over DB: Trigger automático
    DB->>DB: INSERT wallets<br/>(balance=0)

    U->>App: 3. Elegir "Crear Familia"
    App->>DB: INSERT clans<br/>(admin_id = user.id)
    DB-->>App: Clan creado con join_code

    App->>DB: UPDATE profiles<br/>SET clan_id, role='admin'
    DB-->>App: Profile actualizado

    App-->>U: 4. Mostrar código de invitación
    Note over U: Puede compartir código<br/>vía WhatsApp/Telegram
```

## Flujo 2: Onboarding - Unirse con Código

```mermaid
sequenceDiagram
    participant U as Usuario
    participant Auth as Supabase Auth
    participant App as Aplicación
    participant DB as Base de Datos
    participant Admin as Admin del Clan

    U->>Auth: 1. Registrarse
    Auth-->>U: Usuario creado

    U->>App: 2. Completar perfil
    App->>DB: INSERT profiles
    DB-->>App: Profile creado
    DB->>DB: Trigger: INSERT wallets

    U->>App: 3. Ingresar código de invitación
    App->>DB: SELECT clans WHERE join_code = ?
    DB-->>App: Clan encontrado

    App->>DB: INSERT join_requests<br/>(status='pending')
    DB-->>App: Solicitud creada

    App->>Admin: 4. Notificación push
    Note over Admin: "Nueva solicitud de Juan"

    Admin->>App: 5. Revisar solicitud
    Admin->>DB: UPDATE join_requests<br/>SET status='approved'
    DB-->>App: Solicitud aprobada

    App->>DB: UPDATE profiles<br/>SET clan_id
    DB-->>App: Usuario agregado al clan

    App->>U: 6. Notificación
    Note over U: "¡Bienvenido al clan!"
```

## Flujo 3: Completar Tarea

```mermaid
sequenceDiagram
    participant M as Member
    participant App as Aplicación
    participant DB as Base de Datos
    participant Admin as Admin

    M->>App: 1. Ver tareas activas
    App->>DB: SELECT tasks<br/>WHERE clan_id = ? AND is_active = true
    DB-->>App: Lista de tareas
    App-->>M: Mostrar tareas

    M->>App: 2. Marcar "Lavar platos" como completada
    App->>DB: INSERT task_logs<br/>(status='pending')
    DB-->>App: Log creado

    App->>Admin: 3. Notificación
    Note over Admin: "Juan completó: Lavar platos"

    Admin->>App: 4. Revisar tarea
    Note over Admin: Verificar si se hizo bien

    Admin->>DB: UPDATE task_logs<br/>SET status='approved'
    DB-->>App: Tarea aprobada

    App->>DB: UPDATE profiles<br/>SET xp = xp + 10
    DB-->>App: XP actualizado

    App->>M: 5. Notificación
    Note over M: "+10 XP<br/>¡Tarea aprobada!"
```

## Flujo 4: Cálculo de Payout Mensual

```mermaid
flowchart TD
    Start([Fin de Mes]) --> GetMembers[Obtener miembros del clan]
    GetMembers --> ForEach{Para cada miembro}

    ForEach -->|Siguiente| CountTasks[Contar tareas activas del mes]
    CountTasks --> CountCompleted[Contar tareas completadas<br/>status='approved']
    CountCompleted --> CalcPercent[Calcular % completado]

    CalcPercent --> CheckPercent{% >= min_completion_percent?}
    CheckPercent -->|Sí| FullPayout[Payout = monthly_allowance]
    CheckPercent -->|No| PartialPayout[Payout = monthly_allowance * %]

    FullPayout --> CreatePayout[INSERT payout<br/>payout_type='monthly_allowance'<br/>status='calculated']
    PartialPayout --> CreatePayout

    CreatePayout --> ForEach
    ForEach -->|Fin| NotifyAdmin[Notificar Admin:<br/>"Payouts calculados"]
    NotifyAdmin --> End([Fin])
```

## Flujo 5: Registrar Gasto

```mermaid
sequenceDiagram
    participant M as Member
    participant App as Aplicación
    participant DB as Base de Datos

    M->>App: 1. Ir a Wallet
    App->>DB: SELECT wallets WHERE user_id = ?
    DB-->>App: Balance actual: $45.00
    App-->>M: Mostrar balance

    M->>App: 2. Registrar gasto
    Note over M: Monto: -$15.00<br/>Tipo: expense<br/>Descripción: "Snacks"

    App->>DB: INSERT transactions<br/>(amount=-15.00, type='expense')
    DB-->>App: Transaction creada

    Note over DB: Trigger automático
    DB->>DB: UPDATE wallets<br/>SET balance = balance + (-15.00)

    DB-->>App: Nuevo balance: $30.00
    App-->>M: 3. Confirmación
    Note over M: "Gasto registrado<br/>Balance: $30.00"
```

## Flujo 6: Marcar Payout como Pagado

```mermaid
sequenceDiagram
    participant Admin as Admin
    participant App as Aplicación
    participant DB as Base de Datos
    participant Member as Member

    Admin->>App: 1. Ver payouts del mes
    App->>DB: SELECT payouts<br/>WHERE month = ? AND year = ?<br/>AND status = 'calculated'
    DB-->>App: Lista de payouts pendientes
    App-->>Admin: Mostrar payouts

    Admin->>App: 2. Seleccionar payout de Juan
    Note over Admin: Monto: $50.00

    Admin->>App: 3. Confirmar "Pagado en efectivo"
    App->>DB: UPDATE payouts<br/>SET status='paid_in_person'
    DB-->>App: Payout actualizado

    App->>DB: INSERT transactions<br/>(amount=50.00, type='allowance_payout')
    DB-->>App: Transaction creada

    Note over DB: Trigger automático
    DB->>DB: UPDATE wallets<br/>SET balance = balance + 50.00

    App->>Member: 4. Notificación
    Note over Member: "¡Recibiste $50.00!"

    App-->>Admin: 5. Confirmación
    Note over Admin: "Payout marcado como pagado"
```

## Flujo 7: Cambiar Tema (Skin)

```mermaid
flowchart TD
    Start([Usuario en Perfil]) --> SelectTheme[Seleccionar nuevo tema]
    SelectTheme --> Preview[Vista previa del tema]
    Preview --> Confirm{¿Confirmar cambio?}

    Confirm -->|No| SelectTheme
    Confirm -->|Sí| UpdateDB[UPDATE profiles<br/>SET selected_theme = ?]

    UpdateDB --> UpdateRuntime[UnistylesRuntime.setTheme]
    UpdateRuntime --> ReloadUI[Recargar UI con nuevo tema]
    ReloadUI --> End([Tema aplicado])
```

## Flujo 8: Aprobar Solicitud de Unión

```mermaid
flowchart TD
    Start([Admin recibe notificación]) --> ViewRequest[Ver solicitud pendiente]
    ViewRequest --> CheckProfile[Revisar perfil del usuario]
    CheckProfile --> Decision{¿Aprobar?}

    Decision -->|Rechazar| Reject[UPDATE join_requests<br/>SET status='rejected']
    Decision -->|Aprobar| Approve[UPDATE join_requests<br/>SET status='approved']

    Approve --> AddToClan[UPDATE profiles<br/>SET clan_id]
    AddToClan --> NotifyUser[Notificar usuario:<br/>¡Bienvenido!]

    Reject --> NotifyReject[Notificar usuario:<br/>Solicitud rechazada]

    NotifyUser --> End([Fin])
    NotifyReject --> End
```

## Flujo 9: Crear Bono Especial

```mermaid
sequenceDiagram
    participant Admin as Admin
    participant App as Aplicación
    participant DB as Base de Datos
    participant Member as Member

    Admin->>App: 1. Ir a Payouts
    Admin->>App: 2. Crear nuevo payout
    Note over Admin: Tipo: bonus<br/>Monto: $20.00<br/>Descripción: "Bono de cumpleaños"

    App->>DB: INSERT payouts<br/>(payout_type='bonus',<br/>description='Bono de cumpleaños',<br/>status='calculated')
    DB-->>App: Payout creado

    Admin->>App: 3. Marcar como pagado
    App->>DB: UPDATE payouts<br/>SET status='paid_in_person'
    DB-->>App: Actualizado

    App->>DB: INSERT transactions<br/>(amount=20.00, type='allowance_payout')
    DB-->>App: Transaction creada

    Note over DB: Trigger
    DB->>DB: UPDATE wallets<br/>balance += 20.00

    App->>Member: 4. Notificación
    Note over Member: "¡Bono de cumpleaños: $20!"
```

---

## Notas Importantes

### Triggers Automáticos

- **Crear wallet**: Al insertar profile, se crea wallet automáticamente
- **Actualizar balance**: Al insertar transaction, el balance se actualiza automáticamente
- **Updated_at**: Todas las tablas actualizan `updated_at` automáticamente

### Notificaciones

- Implementadas con Expo Notifications
- Push notifications para eventos importantes
- Notificaciones locales para recordatorios diarios

### Validaciones

- RLS policies validan permisos en cada operación
- Constraints de BD validan integridad de datos
- Validaciones de negocio en la aplicación
