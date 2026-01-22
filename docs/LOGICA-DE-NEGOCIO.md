# Lógica de Negocio - Clan Finance

## Flujos Principales

### 1. Unión a un Clan

**Proceso:**

1. El Admin genera un código de invitación desde la app (`clans.join_code`)
2. El Admin comparte el código vía WhatsApp/Telegram usando Expo Sharing
3. El Miembro ingresa el código en la app
4. Se crea una `join_request` con estado `pending`
5. El Admin recibe una notificación push
6. El Admin revisa y aprueba la solicitud
7. El sistema asigna `clan_id` al perfil del miembro
8. El miembro recibe notificación de bienvenida

**Validaciones:**

- El código debe existir y ser válido
- El usuario no puede estar ya en un clan
- No puede haber solicitudes duplicadas (UNIQUE constraint)

### 2. Cierre Mensual (Cálculo del 85%)

**Proceso de Evaluación:**

Al final de cada mes, el sistema evalúa el desempeño de cada miembro:

```
1. Contar tareas activas del mes (is_active = true)
2. Contar tareas completadas y aprobadas (status = 'approved')
3. Calcular porcentaje: (completadas / activas) * 100
4. Determinar tipo de payout
```

**Reglas de Payout:**

#### Caso A: Éxito (≥ min_completion_percent)

- **Condición:** % completado >= 85% (o valor configurado)
- **Payout:** `monthly_allowance` completo
- **Ejemplo:** 85% completado → $50.00 (allowance completo)

#### Caso B: Parcial (< min_completion_percent)

- **Condición:** % completado < 85%
- **Payout:** Suma de `reward_value` de cada tarea aprobada
- **Ejemplo:** 60% completado → $30.00 (suma de recompensas)

**Flujo de Pago:**

```
1. Sistema crea payout:
   - payout_type = 'monthly_allowance'
   - status = 'calculated'
   - amount = [monto calculado]

2. Admin revisa payouts calculados

3. Admin marca como pagado:
   - status = 'paid_in_person'
   - Se crea transaction (allowance_payout)
   - Balance de wallet se actualiza (trigger automático)

4. Miembro recibe notificación
```

### 3. Bonos Adicionales

**Tipos de Bonos:**

#### Bono Semestral (Julio/Diciembre)

- **Condición:** Cumplir meta de ahorro o % alto durante 6 meses
- **Proceso:**

  ```
  1. Admin crea payout:
     - payout_type = 'bonus'
     - description = 'Bono semestral por 90% cumplimiento'
     - amount = [monto del bono]

  2. Admin marca como pagado
  3. Se crea transaction y actualiza balance
  ```

#### Bono Especial

- **Ejemplos:** Cumpleaños, logro especial, evento familiar
- **Proceso:**

  ```
  1. Admin crea payout:
     - payout_type = 'special'
     - description = 'Bono de cumpleaños'
     - amount = [monto]

  2. Marcar como pagado
  ```

**Nota:** No hay límite de payouts por mes, permitiendo múltiples bonos.

### 4. Ahorro y Dinero Externo (Manual Incomes)

**Escenario:** Niño recibe dinero de regalo (tío, abuelo, etc.)

**Proceso:**

```
1. Miembro registra ingreso:
   - Tipo: manual_income
   - Monto: $20.00
   - Descripción: "Regalo del tío"

2. Sistema crea transaction

3. Trigger actualiza wallet:
   - balance += $20.00

4. Miembro puede:
   - Dejar en wallet (disponible)
   - Mover a meta de ahorro (savings_transfer)
```

**Diferencia con Allowance:**

- **Manual Income:** No requiere aprobación del admin
- **Allowance Payout:** Requiere que admin marque como pagado

### 5. Registro de Gastos

**Proceso:**

```
1. Miembro registra gasto:
   - Tipo: expense
   - Monto: -$15.00 (negativo)
   - Descripción: "Snacks"

2. Sistema crea transaction

3. Trigger actualiza wallet:
   - balance -= $15.00

4. Validación:
   - Si balance < 0 → Error (constraint)
   - Miembro debe tener fondos suficientes
```

### 6. Sistema de XP y Niveles

**Ganancia de XP:**

```
1. Tarea completada y aprobada:
   - XP base: 10 puntos por tarea
   - Bonus por racha: +5 puntos si completa 7 días seguidos

2. Sistema actualiza profile:
   - xp += puntos ganados

3. Cálculo de nivel:
   - Nivel = floor(xp / 100)
   - Ejemplo: 250 XP = Nivel 2
```

**Uso de XP:**

- Desbloquear avatares especiales
- Badges de logros
- Ranking familiar (futuro)

### 7. Notificaciones Programadas

#### Recordatorio Diario (8 PM)

```
Título: "¡No dejes que tu racha muera!"
Mensaje: "Marca tus tareas antes de las 8 PM"
Acción: Deep link a /quests
```

#### Estado de Bono (Quincenal)

```
Título: "Estado de tu bono mensual"
Mensaje: "Llevas un 60% de tareas hechas. ¡Necesitas el 85% para el bono de $50!"
Acción: Deep link a /quests
```

#### Solicitudes Pendientes (Admin)

```
Título: "Nueva solicitud de unión"
Mensaje: "Juan quiere unirse a tu clan"
Acción: Deep link a /clan/requests
```

## Reglas de Negocio

### Validaciones Críticas

1. **Balance Positivo:**

   ```sql
   CHECK (balance >= 0)
   ```

   - No se permite balance negativo
   - Gastos deben validarse antes de crear transaction

2. **Porcentaje de Completado:**

   ```sql
   CHECK (min_completion_percent >= 0 AND min_completion_percent <= 100)
   ```

   - Debe estar entre 0% y 100%

3. **Mes y Año de Payout:**

   ```sql
   CHECK (month >= 1 AND month <= 12)
   CHECK (year >= 2024)
   ```

4. **Monto de Payout:**
   ```sql
   CHECK (amount >= 0)
   ```

   - Los payouts siempre son positivos

### Constraints de Unicidad

1. **Join Code:**

   ```sql
   UNIQUE (join_code)
   ```

   - Cada clan tiene código único

2. **Join Request:**

   ```sql
   UNIQUE (clan_id, user_id)
   ```

   - Un usuario no puede solicitar dos veces al mismo clan

3. **Wallet por Usuario:**
   ```sql
   UNIQUE (user_id)
   ```

   - Un usuario tiene una sola wallet

### Triggers Automáticos

1. **Actualizar updated_at:**
   - Se ejecuta en UPDATE de cualquier tabla
   - Actualiza `updated_at = NOW()`

2. **Actualizar Balance:**
   - Se ejecuta al INSERT en transactions
   - Actualiza `wallets.balance += transaction.amount`

3. **Crear Wallet:**
   - Se ejecuta al INSERT en profiles
   - Crea wallet con balance = 0

## Casos Especiales

### Cambio de Admin

**Escenario:** El admin actual quiere transferir el rol

**Proceso:**

```
1. Admin actual selecciona nuevo admin
2. Sistema actualiza:
   - clans.admin_id = nuevo_admin_id
   - profiles[antiguo].role = 'member'
   - profiles[nuevo].role = 'admin'
3. Notificar a ambos usuarios
```

### Salir del Clan

**Escenario:** Miembro quiere salir del clan

**Proceso:**

```
1. Verificar balance = 0 (debe gastar o transferir primero)
2. Actualizar profile:
   - clan_id = NULL
   - role = 'member'
3. Eliminar join_requests relacionadas
```

### Eliminar Clan

**Escenario:** Admin quiere eliminar el clan

**Proceso:**

```
1. Verificar que todos los miembros tengan balance = 0
2. CASCADE DELETE:
   - Elimina tasks
   - Elimina task_logs
   - Elimina join_requests
   - Actualiza profiles (clan_id = NULL)
3. Elimina clan
```

## Métricas y Analytics (Futuro)

### Dashboard del Admin

**Métricas a mostrar:**

- Total de tareas completadas (mes actual)
- % promedio de completado del clan
- Balance total del clan
- Gastos totales del mes
- Tendencia de ahorro

### Dashboard del Miembro

**Métricas a mostrar:**

- Racha actual (días consecutivos)
- % de completado del mes
- Proyección de payout
- Balance disponible
- Gastos del mes

---

**Versión:** 1.0  
**Última actualización:** Enero 2026
