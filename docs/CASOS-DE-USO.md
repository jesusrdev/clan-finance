# Casos de Uso - Clan Finance

## Tabla de Casos de Uso

| ID        | Caso de Uso                         | Módulo         | Actor(es)     | Descripción                                      |
| --------- | ----------------------------------- | -------------- | ------------- | ------------------------------------------------ |
| **CU-01** | Registrar usuario                   | Autenticación  | Usuario       | Crear cuenta nueva con email/password            |
| **CU-02** | Iniciar sesión                      | Autenticación  | Usuario       | Autenticarse en la aplicación                    |
| **CU-03** | Cerrar sesión                       | Autenticación  | Usuario       | Terminar sesión actual                           |
| **CU-04** | Crear perfil                        | Perfil         | Usuario       | Configurar nombre, avatar y tema inicial         |
| **CU-05** | Editar perfil                       | Perfil         | Usuario       | Modificar nombre, avatar o tema                  |
| **CU-06** | Seleccionar tema                    | Perfil         | Usuario       | Cambiar entre los 5 skins disponibles            |
| **CU-07** | Ver estadísticas personales         | Perfil         | Usuario       | Ver XP, nivel y progreso personal                |
| **CU-08** | Crear clan                          | Clan           | Admin         | Crear nuevo clan con configuración inicial       |
| **CU-09** | Generar código de invitación        | Clan           | Admin         | Generar código único para invitar miembros       |
| **CU-10** | Compartir código de invitación      | Clan           | Admin         | Compartir código vía WhatsApp/Telegram           |
| **CU-11** | Solicitar unirse a clan             | Clan           | Member        | Ingresar código y enviar solicitud               |
| **CU-12** | Ver solicitudes pendientes          | Clan           | Admin         | Listar solicitudes de unión pendientes           |
| **CU-13** | Aprobar solicitud                   | Clan           | Admin         | Aceptar miembro al clan                          |
| **CU-14** | Rechazar solicitud                  | Clan           | Admin         | Denegar solicitud de unión                       |
| **CU-15** | Ver miembros del clan               | Clan           | Admin, Member | Listar todos los miembros del clan               |
| **CU-16** | Configurar clan                     | Clan           | Admin         | Editar nombre, moneda, allowance, % mínimo       |
| **CU-17** | Crear tarea                         | Quests         | Admin         | Crear nueva quest con recompensa y frecuencia    |
| **CU-18** | Editar tarea                        | Quests         | Admin         | Modificar título, recompensa o frecuencia        |
| **CU-19** | Activar/desactivar tarea            | Quests         | Admin         | Marcar tarea como activa o inactiva              |
| **CU-20** | Ver tareas del clan                 | Quests         | Admin, Member | Listar todas las tareas activas                  |
| **CU-21** | Completar tarea                     | Quests         | Member        | Marcar tarea como completada                     |
| **CU-22** | Ver tareas pendientes de aprobación | Quests         | Admin         | Listar task_logs con status pending              |
| **CU-23** | Aprobar tarea completada            | Quests         | Admin         | Cambiar status de task_log a approved            |
| **CU-24** | Rechazar tarea completada           | Quests         | Admin         | Cambiar status de task_log a rejected            |
| **CU-25** | Ver progreso personal               | Quests         | Member        | Ver % de tareas completadas del mes              |
| **CU-26** | Ver progreso del clan               | Quests         | Admin         | Ver % de completado de cada miembro              |
| **CU-27** | Ver balance de wallet               | Wallet         | Member        | Ver saldo actual disponible                      |
| **CU-28** | Ver historial de transacciones      | Wallet         | Member        | Listar todas las transacciones propias           |
| **CU-29** | Registrar ingreso manual            | Wallet         | Member        | Agregar dinero externo (regalo, etc.)            |
| **CU-30** | Registrar gasto                     | Wallet         | Member        | Registrar expense y reducir balance              |
| **CU-31** | Transferir a ahorro                 | Wallet         | Member        | Mover dinero de wallet a savings_goal            |
| **CU-32** | Ver balance del clan                | Wallet         | Admin         | Ver suma de balances de todos los miembros       |
| **CU-33** | Ver transacciones del clan          | Wallet         | Admin         | Ver todas las transacciones del mes              |
| **CU-34** | Calcular payout mensual             | Wallet         | Sistema       | Calcular pago basado en % de completado          |
| **CU-35** | Ver payouts calculados              | Wallet         | Admin         | Listar payouts con status calculated             |
| **CU-36** | Marcar payout como pagado           | Wallet         | Admin         | Cambiar status a paid_in_person                  |
| **CU-37** | Ver historial de payouts            | Wallet         | Member        | Ver pagos recibidos históricos                   |
| **CU-38** | Ver dashboard general               | Dashboard      | Admin         | Ver resumen del clan (miembros, balance, tareas) |
| **CU-39** | Ver gráfica de progreso             | Dashboard      | Admin         | Visualizar progreso de quests con gráficas       |
| **CU-40** | Ver gráfica de gastos               | Dashboard      | Admin         | Visualizar distribución de gastos por tipo       |
| **CU-41** | Configurar notificación diaria      | Notificaciones | Usuario       | Activar recordatorio de tareas (8 PM)            |
| **CU-42** | Recibir notificación de progreso    | Notificaciones | Member        | Recibir alerta quincenal de % completado         |
| **CU-43** | Recibir alerta de solicitudes       | Notificaciones | Admin         | Notificación de nuevas join_requests             |

## Matriz de Permisos por Caso de Uso

| Caso de Uso                               | Admin | Member | Sistema |
| ----------------------------------------- | ----- | ------ | ------- |
| CU-01 a CU-07                             | ✅    | ✅     | -       |
| CU-08 a CU-10                             | ✅    | ❌     | -       |
| CU-11                                     | ❌    | ✅     | -       |
| CU-12 a CU-14                             | ✅    | ❌     | -       |
| CU-15                                     | ✅    | ✅     | -       |
| CU-16                                     | ✅    | ❌     | -       |
| CU-17 a CU-19                             | ✅    | ❌     | -       |
| CU-20                                     | ✅    | ✅     | -       |
| CU-21, CU-25                              | ❌    | ✅     | -       |
| CU-22 a CU-24, CU-26                      | ✅    | ❌     | -       |
| CU-27 a CU-31, CU-37                      | ❌    | ✅     | -       |
| CU-32, CU-33, CU-35, CU-36, CU-38 a CU-40 | ✅    | ❌     | -       |
| CU-34                                     | -     | -      | ✅      |
| CU-41                                     | ✅    | ✅     | -       |
| CU-42                                     | ❌    | ✅     | ✅      |
| CU-43                                     | ✅    | ❌     | ✅      |

## Descripción Detallada por Módulo

### Módulo: Autenticación

#### CU-01: Registrar usuario

- **Precondición**: Usuario no registrado
- **Flujo**: Email → Password → Confirmación → Crear cuenta
- **Postcondición**: Usuario creado en auth.users

#### CU-02: Iniciar sesión

- **Precondición**: Usuario registrado
- **Flujo**: Email → Password → Validar → Crear sesión
- **Postcondición**: Usuario autenticado, token JWT generado

#### CU-03: Cerrar sesión

- **Precondición**: Usuario autenticado
- **Flujo**: Confirmar → Invalidar sesión → Redirigir a login
- **Postcondición**: Sesión terminada

### Módulo: Clan

#### CU-08: Crear clan

- **Precondición**: Usuario autenticado sin clan
- **Flujo**: Nombre → Moneda → Allowance → % mínimo → Generar código → Crear
- **Postcondición**: Clan creado, usuario es admin

#### CU-11: Solicitar unirse a clan

- **Precondición**: Usuario sin clan, código válido
- **Flujo**: Ingresar código → Validar → Crear join_request
- **Postcondición**: Solicitud creada con status pending

#### CU-13: Aprobar solicitud

- **Precondición**: Admin, solicitud pending
- **Flujo**: Seleccionar solicitud → Aprobar → Asignar clan_id
- **Postcondición**: Usuario agregado al clan, status = approved

### Módulo: Quests

#### CU-17: Crear tarea

- **Precondición**: Admin autenticado
- **Flujo**: Título → Recompensa → Frecuencia → Guardar
- **Postcondición**: Tarea creada con is_active = true

#### CU-21: Completar tarea

- **Precondición**: Member, tarea activa
- **Flujo**: Seleccionar tarea → Marcar completada → Crear task_log
- **Postcondición**: task_log creado con status = pending

#### CU-23: Aprobar tarea completada

- **Precondición**: Admin, task_log pending
- **Flujo**: Revisar → Aprobar → Actualizar status
- **Postcondición**: task_log.status = approved, XP sumado

### Módulo: Wallet

#### CU-29: Registrar ingreso manual

- **Precondición**: Member autenticado
- **Flujo**: Monto → Descripción → Crear transaction (manual_income)
- **Postcondición**: Balance incrementado, transaction creada

#### CU-34: Calcular payout mensual

- **Precondición**: Fin de mes
- **Flujo**: Contar task_logs approved → Calcular % → Determinar monto → Crear payout
- **Postcondición**: Payout creado con status = calculated

#### CU-36: Marcar payout como pagado

- **Precondición**: Admin, payout calculated
- **Flujo**: Seleccionar payout → Confirmar pago → Actualizar status
- **Postcondición**: status = paid_in_person, balance actualizado

### Módulo: Dashboard (Admin)

#### CU-38: Ver dashboard general

- **Precondición**: Admin autenticado
- **Flujo**: Cargar datos → Calcular totales → Mostrar resumen
- **Datos mostrados**:
  - Total de miembros
  - Balance total del clan
  - Tareas activas
  - Solicitudes pendientes

#### CU-39: Ver gráfica de progreso

- **Precondición**: Admin autenticado
- **Flujo**: Obtener task_logs del mes → Calcular % por usuario → Renderizar gráfica
- **Visualización**: Gráfica de barras con % de completado por miembro

#### CU-40: Ver gráfica de gastos

- **Precondición**: Admin autenticado
- **Flujo**: Obtener transactions → Agrupar por tipo → Renderizar gráfica
- **Visualización**: Gráfica de pie/dona con distribución de gastos

---

**Total de casos de uso**: 43  
**Casos de uso por rol**:

- Admin exclusivo: 18
- Member exclusivo: 12
- Compartidos: 10
- Sistema automático: 3
