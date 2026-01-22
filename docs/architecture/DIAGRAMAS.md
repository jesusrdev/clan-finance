# Diagramas de Arquitectura - Clan Finance

## Diagrama UML de Clases

```mermaid
classDiagram
    class Clan {
        +UUID id
        +String name
        +UUID admin_id
        +String currency_code
        +Decimal monthly_allowance
        +Integer min_completion_percent
        +String join_code
        +Timestamp created_at
        +Timestamp updated_at
    }

    class Profile {
        +UUID id
        +UUID clan_id
        +String display_name
        +String avatar_url
        +UserRole role
        +String selected_theme
        +Integer xp
        +Timestamp created_at
        +Timestamp updated_at
    }

    class JoinRequest {
        +UUID id
        +UUID clan_id
        +UUID user_id
        +RequestStatus status
        +Timestamp created_at
        +Timestamp updated_at
    }

    class Task {
        +UUID id
        +UUID clan_id
        +String title
        +Decimal reward_value
        +TaskFrequency frequency
        +Boolean is_active
        +Timestamp created_at
        +Timestamp updated_at
    }

    class TaskLog {
        +UUID id
        +UUID task_id
        +UUID user_id
        +RequestStatus status
        +Timestamp completed_at
        +Timestamp created_at
    }

    class Wallet {
        +UUID id
        +UUID user_id
        +Decimal balance
        +Timestamp created_at
        +Timestamp updated_at
    }

    class Transaction {
        +UUID id
        +UUID wallet_id
        +Decimal amount
        +TransactionType type
        +Timestamp created_at
    }

    class Payout {
        +UUID id
        +UUID user_id
        +Decimal amount
        +Integer month
        +Integer year
        +PayoutType payout_type
        +String description
        +PayoutStatus status
        +Timestamp created_at
        +Timestamp updated_at
    }

    Clan "1" --> "*" Profile : has members
    Clan "1" --> "*" Task : owns tasks
    Clan "1" --> "*" JoinRequest : receives requests
    Profile "1" --> "1" Wallet : has wallet
    Profile "1" --> "*" TaskLog : completes tasks
    Profile "1" --> "*" Payout : receives payouts
    Profile "1" --> "*" JoinRequest : sends requests
    Task "1" --> "*" TaskLog : generates logs
    Wallet "1" --> "*" Transaction : has transactions
```

## Diagrama ER (Entidad-Relación)

```mermaid
erDiagram
    CLANS ||--o{ PROFILES : "has members"
    CLANS ||--o{ TASKS : "owns tasks"
    CLANS ||--o{ JOIN_REQUESTS : "receives requests"
    PROFILES ||--|| WALLETS : "has wallet"
    PROFILES ||--o{ TASK_LOGS : "completes tasks"
    PROFILES ||--o{ PAYOUTS : "receives payouts"
    PROFILES ||--o{ JOIN_REQUESTS : "sends requests"
    TASKS ||--o{ TASK_LOGS : "generates logs"
    WALLETS ||--o{ TRANSACTIONS : "has transactions"

    CLANS {
        uuid id PK
        string name
        uuid admin_id FK
        string currency_code
        decimal monthly_allowance
        int min_completion_percent
        string join_code UK
        timestamp created_at
        timestamp updated_at
    }

    PROFILES {
        uuid id PK
        uuid clan_id FK
        string display_name
        string avatar_url
        enum role
        string selected_theme
        int xp
        timestamp created_at
        timestamp updated_at
    }

    JOIN_REQUESTS {
        uuid id PK
        uuid clan_id FK
        uuid user_id FK
        enum status
        timestamp created_at
        timestamp updated_at
    }

    TASKS {
        uuid id PK
        uuid clan_id FK
        string title
        decimal reward_value
        enum frequency
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    TASK_LOGS {
        uuid id PK
        uuid task_id FK
        uuid user_id FK
        enum status
        timestamp completed_at
        timestamp created_at
    }

    WALLETS {
        uuid id PK
        uuid user_id FK
        decimal balance
        timestamp created_at
        timestamp updated_at
    }

    TRANSACTIONS {
        uuid id PK
        uuid wallet_id FK
        decimal amount
        enum type
        timestamp created_at
    }

    PAYOUTS {
        uuid id PK
        uuid user_id FK
        decimal amount
        int month
        int year
        enum payout_type
        string description
        enum status
        timestamp created_at
        timestamp updated_at
    }
```

## Diagrama de Arquitectura de Capas

```mermaid
graph TB
    subgraph "Presentation Layer"
        UI[UI Components<br/>Gluestack UI]
        Themes[Theming System<br/>Unistyles]
        Router[Navigation<br/>Expo Router]
    end

    subgraph "Application Layer"
        Features[Features Modules<br/>auth, clan, quests, wallet, profile]
        Hooks[Custom Hooks<br/>useAuth, useClan, useTasks]
        State[State Management<br/>TanStack Query]
    end

    subgraph "Domain Layer"
        Models[Domain Models<br/>types/models.ts]
        DTOs[Data Transfer Objects<br/>types/dto.ts]
        Constants[Constants & Config<br/>constants/index.ts]
    end

    subgraph "Infrastructure Layer"
        SupabaseClient[Supabase Client<br/>lib/supabase/client.ts]
        QueryClient[Query Client<br/>lib/query/client.ts]
        Cache[Query Cache]
    end

    subgraph "Backend - Supabase"
        Auth[Authentication<br/>Supabase Auth]
        DB[(PostgreSQL<br/>Database)]
        RLS[Row Level Security<br/>Policies]
        Triggers[Database Triggers<br/>& Functions]
    end

    UI --> Router
    UI --> Themes
    Router --> Features
    Features --> Hooks
    Hooks --> State
    State --> Models
    State --> DTOs
    Features --> Constants
    State --> QueryClient
    QueryClient --> Cache
    QueryClient --> SupabaseClient
    SupabaseClient --> Auth
    SupabaseClient --> DB
    DB --> RLS
    DB --> Triggers
```

## Diagrama de Flujo de Datos

```mermaid
flowchart LR
    User[Usuario]
    UI[UI Layer]
    Hook[Custom Hook]
    Query[TanStack Query]
    Supabase[Supabase Client]
    DB[(Database)]

    User -->|Interactúa| UI
    UI -->|Llama| Hook
    Hook -->|usa| Query
    Query -->|Ejecuta| Supabase
    Supabase -->|Query SQL| DB
    DB -->|Datos| Supabase
    Supabase -->|Cache| Query
    Query -->|Estado| Hook
    Hook -->|Renderiza| UI
    UI -->|Muestra| User
```

## Diagrama de Componentes

```mermaid
graph TB
    subgraph "Mobile App"
        App[App Entry Point<br/>app/_layout.tsx]

        subgraph "Routes"
            Auth[Auth Routes<br/>(auth)/]
            Tabs[Tab Routes<br/>(tabs)/]
        end

        subgraph "Features"
            AuthFeature[Auth Feature]
            ClanFeature[Clan Feature]
            QuestsFeature[Quests Feature]
            WalletFeature[Wallet Feature]
            ProfileFeature[Profile Feature]
        end

        subgraph "Shared"
            UIComponents[UI Components]
            LayoutComponents[Layout Components]
            ThemeSystem[Theme System]
        end

        subgraph "Services"
            SupabaseService[Supabase Service]
            QueryService[Query Service]
            NotificationService[Notification Service]
        end
    end

    App --> Auth
    App --> Tabs
    Auth --> AuthFeature
    Tabs --> ClanFeature
    Tabs --> QuestsFeature
    Tabs --> WalletFeature
    Tabs --> ProfileFeature

    AuthFeature --> UIComponents
    ClanFeature --> UIComponents
    QuestsFeature --> UIComponents
    WalletFeature --> UIComponents
    ProfileFeature --> UIComponents

    UIComponents --> ThemeSystem

    AuthFeature --> SupabaseService
    ClanFeature --> QueryService
    QuestsFeature --> QueryService
    WalletFeature --> QueryService
    ProfileFeature --> QueryService

    QueryService --> SupabaseService
```

---

## Leyenda

### Tipos de Relaciones

- `-->` : Dependencia / Usa
- `||--o{` : Uno a muchos
- `||--||` : Uno a uno

### Cardinalidades

- `1` : Exactamente uno
- `*` : Cero o muchos
- `o{` : Cero o muchos
- `||` : Exactamente uno

### Tipos de Nodos

- **Rectángulo**: Clase / Componente
- **Cilindro**: Base de datos
- **Rombo**: Decisión
- **Círculo**: Inicio/Fin
