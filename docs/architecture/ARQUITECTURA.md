# Arquitectura del Sistema - Clan Finance

## Visión General

Clan Finance es una aplicación móvil multiplataforma (iOS/Android) construida con React Native y Expo, que utiliza Supabase como backend. La arquitectura sigue principios de **Clean Architecture** con separación clara de responsabilidades.

## Principios Arquitectónicos

### 1. Separación de Responsabilidades

- **Presentation**: UI y navegación
- **Application**: Lógica de negocio y casos de uso
- **Domain**: Modelos y reglas de negocio
- **Infrastructure**: Servicios externos (Supabase, notificaciones)

### 2. Dependency Inversion

- Las capas superiores no dependen de las inferiores
- Uso de interfaces y abstracciones
- Inyección de dependencias mediante hooks

### 3. Single Source of Truth

- TanStack Query como única fuente de verdad para datos del servidor
- Supabase como única fuente de verdad para persistencia
- UnistylesRuntime para estado del tema

## Capas de la Arquitectura

### Capa de Presentación (Presentation Layer)

**Responsabilidad:** Interfaz de usuario y navegación

**Componentes:**

- `src/app/` - Rutas de Expo Router
- `src/components/ui/` - Componentes UI reutilizables
- `src/components/layout/` - Componentes de layout
- `src/theme/` - Sistema de temas con Unistyles

**Tecnologías:**

- React Native
- Expo Router (navegación file-based)
- Gluestack UI (componentes)
- React Native Unistyles (temas)

**Flujo:**

```
Usuario → UI Component → Hook → TanStack Query → Supabase
```

### Capa de Aplicación (Application Layer)

**Responsabilidad:** Lógica de negocio y orquestación

**Componentes:**

- `src/features/` - Módulos por funcionalidad
  - `auth/` - Autenticación
  - `clan/` - Gestión de clanes
  - `quests/` - Sistema de tareas
  - `wallet/` - Billetera y transacciones
  - `profile/` - Perfil de usuario
- `src/hooks/` - Custom hooks
- `src/constants/` - Constantes y configuración

**Patrón de Features:**

```
features/
└── auth/
    ├── hooks/
    │   └── useAuth.ts
    ├── components/
    │   ├── LoginForm.tsx
    │   └── RegisterForm.tsx
    └── screens/
        └── LoginScreen.tsx
```

**Responsabilidades de cada feature:**

- Hooks personalizados para lógica de negocio
- Componentes específicos del feature
- Screens/pantallas del feature

### Capa de Dominio (Domain Layer)

**Responsabilidad:** Modelos de negocio y reglas

**Componentes:**

- `src/types/database.types.ts` - Tipos generados de Supabase
- `src/types/models.ts` - Tipos de modelos de negocio
- `src/types/dto.ts` - Data Transfer Objects

**Principios:**

- Tipos inmutables
- Sin lógica de infraestructura
- Independiente de frameworks

### Capa de Infraestructura (Infrastructure Layer)

**Responsabilidad:** Servicios externos y persistencia

**Componentes:**

- `src/lib/supabase/` - Cliente Supabase
- `src/lib/query/` - Cliente TanStack Query
- Expo Notifications
- Expo Sharing

**Servicios:**

- Autenticación (Supabase Auth)
- Base de datos (PostgreSQL vía Supabase)
- Caché (TanStack Query)
- Notificaciones locales (Expo Notifications)

## Patrones de Diseño

### 1. Repository Pattern (Implícito)

Supabase actúa como repository:

```typescript
// Ejemplo de uso
const { data: tasks } = await supabase
  .from("tasks")
  .select("*")
  .eq("clan_id", clanId);
```

### 2. Observer Pattern

TanStack Query implementa observer para reactividad:

```typescript
const { data, isLoading } = useQuery({
  queryKey: ["tasks", clanId],
  queryFn: () => fetchTasks(clanId),
});
```

### 3. Strategy Pattern

Temas dinámicos con Unistyles:

```typescript
UnistylesRuntime.setTheme("naruto");
```

### 4. Factory Pattern

Creación de queries con factory functions:

```typescript
export const QUERY_KEYS = {
  tasks: {
    all: (clanId: string) => ["tasks", clanId],
    detail: (id: string) => ["tasks", id],
  },
};
```

## Flujo de Datos

### Lectura de Datos

```
1. Component renderiza
2. Hook llama a useQuery
3. TanStack Query verifica caché
4. Si no está en caché, ejecuta queryFn
5. queryFn llama a Supabase
6. Supabase ejecuta query con RLS
7. Datos retornan a TanStack Query
8. Query actualiza caché
9. Component re-renderiza con datos
```

### Escritura de Datos

```
1. Usuario interactúa (ej: completar tarea)
2. Component llama a hook
3. Hook ejecuta useMutation
4. Mutation llama a Supabase
5. Supabase valida con RLS
6. Supabase ejecuta INSERT/UPDATE
7. Triggers automáticos se ejecutan
8. Mutation invalida queries relacionadas
9. TanStack Query re-fetch automático
10. UI se actualiza
```

## Gestión de Estado

### Estado del Servidor (Server State)

**Herramienta:** TanStack Query

**Responsabilidades:**

- Caché de datos del servidor
- Sincronización automática
- Revalidación en background
- Optimistic updates

**Configuración:**

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      cacheTime: 1000 * 60 * 30, // 30 minutos
      retry: 2,
    },
  },
});
```

### Estado de la UI (UI State)

**Herramienta:** React State (useState, useReducer)

**Responsabilidades:**

- Estado de formularios
- Modales abiertos/cerrados
- Tabs activos
- Animaciones

### Estado Global (Global State)

**Herramientas:**

- UnistylesRuntime (tema actual)
- Supabase Auth (sesión del usuario)

**Evitamos:**

- Redux (innecesario con TanStack Query)
- Context API para datos del servidor

## Seguridad

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado:

```sql
-- Ejemplo: Solo ver tu propia wallet
CREATE POLICY "Los usuarios pueden ver su propia wallet"
  ON wallets FOR SELECT
  USING (user_id = auth.uid());
```

**Beneficios:**

- Seguridad a nivel de base de datos
- No se puede bypasear desde el cliente
- Políticas declarativas y auditables

### Autenticación

**Flujo:**

```
1. Usuario ingresa credenciales
2. Supabase Auth valida
3. Retorna JWT token
4. Token se almacena en AsyncStorage
5. Todas las requests incluyen token
6. RLS valida token en cada query
```

## Escalabilidad

### Caché Inteligente

TanStack Query reduce llamadas al servidor:

- Datos en caché se reutilizan
- Background refetch para datos frescos
- Invalidación selectiva

### Optimistic Updates

Actualizar UI antes de confirmar servidor:

```typescript
const mutation = useMutation({
  mutationFn: completeTask,
  onMutate: async (newTask) => {
    // Cancelar queries en curso
    await queryClient.cancelQueries(["tasks"]);

    // Guardar snapshot
    const previous = queryClient.getQueryData(["tasks"]);

    // Actualizar optimísticamente
    queryClient.setQueryData(["tasks"], (old) => [...old, newTask]);

    return { previous };
  },
  onError: (err, newTask, context) => {
    // Revertir en caso de error
    queryClient.setQueryData(["tasks"], context.previous);
  },
});
```

### Paginación y Lazy Loading

Para listas grandes:

```typescript
const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ["transactions"],
  queryFn: ({ pageParam = 0 }) => fetchTransactions(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```

## Performance

### Optimizaciones Implementadas

1. **Code Splitting**: Expo Router carga rutas bajo demanda
2. **Memoization**: React.memo para componentes pesados
3. **Virtual Lists**: FlatList para listas largas
4. **Image Optimization**: Expo Image con caché
5. **Query Deduplication**: TanStack Query evita requests duplicadas

### Métricas Objetivo

- **Time to Interactive**: < 2s
- **First Contentful Paint**: < 1s
- **Query Response Time**: < 500ms (con caché)
- **Smooth Animations**: 60 FPS

## Testing (Futuro)

### Estrategia de Testing

1. **Unit Tests**: Hooks y funciones puras
2. **Integration Tests**: Features completos
3. **E2E Tests**: Flujos críticos (login, completar tarea)

### Herramientas Recomendadas

- Jest (unit tests)
- React Native Testing Library (component tests)
- Detox (E2E tests)

## Deployment

### Entornos

- **Development**: Local con Expo Go
- **Staging**: TestFlight (iOS) / Internal Testing (Android)
- **Production**: App Store / Google Play

### CI/CD (Futuro)

1. Push a GitHub
2. GitHub Actions ejecuta tests
3. Build con EAS Build
4. Deploy a TestFlight/Internal Testing
5. Aprobación manual
6. Release a producción

---

## Decisiones Arquitectónicas Clave

### ¿Por qué Expo?

- Desarrollo multiplataforma con un solo código
- Actualizaciones OTA (Over The Air)
- Ecosistema maduro y bien documentado

### ¿Por qué Supabase?

- PostgreSQL (base de datos relacional robusta)
- RLS para seguridad a nivel de BD
- Realtime subscriptions
- Auth integrado
- Escalable y open-source

### ¿Por qué TanStack Query?

- Gestión de caché sofisticada
- Sincronización automática
- Optimistic updates
- DevTools excelentes

### ¿Por qué Unistyles?

- Temas dinámicos sin re-renders
- Performance superior a StyleSheet
- TypeScript first
- Responsive design fácil

---

**Versión:** 1.0  
**Última actualización:** Enero 2026
