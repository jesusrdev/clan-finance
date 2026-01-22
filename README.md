# Clan Finance: Quest & Savings

## 🎯 Visión

Aplicación móvil de finanzas familiares gamificada donde las tareas del hogar se convierten en "Quests" y el ahorro se visualiza como progreso de nivel. Diseñada con temas inspirados en cultura pop (Anime/Series) para hacer la gestión financiera familiar divertida y motivadora.

## 📚 Documentación

| Documento                                             | Descripción                                     |
| ----------------------------------------------------- | ----------------------------------------------- |
| **[Guía de Inicio](docs/INICIO.md)**                  | Instalación, configuración y primeros pasos     |
| **[Casos de Uso](docs/CASOS-DE-USO.md)**              | 43 casos de uso atómicos con matriz de permisos |
| **[Guía de Desarrollo](docs/DESARROLLO.md)**          | Roadmap de desarrollo con checkboxes por fase   |
| **[Arquitectura](docs/architecture/ARQUITECTURA.md)** | Principios, capas y patrones arquitectónicos    |
| **[Diagramas](docs/architecture/DIAGRAMAS.md)**       | UML, ER, flujo de datos y componentes           |
| **[Flujos](docs/architecture/FLUJOS.md)**             | Diagramas de secuencia de casos de uso críticos |
| **[Seguridad RLS](docs/database/SEGURIDAD-RLS.md)**   | Políticas de seguridad y permisos por tabla     |
| **[Schema SQL](docs/database/supabase-schema.sql)**   | Script completo para crear la base de datos     |
| **[Índice Completo](docs/README.md)**                 | Navegación completa de toda la documentación    |

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
bash install-dependencies.sh

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales de Supabase

# 3. Ejecutar script SQL en Supabase
# Copiar docs/database/supabase-schema.sql al SQL Editor

# 4. Iniciar proyecto
npm start
```

Ver [Guía de Inicio Completa](docs/INICIO.md) para más detalles.

## 🛠️ Stack Tecnológico

| Capa                 | Tecnología             | Propósito                              |
| -------------------- | ---------------------- | -------------------------------------- |
| **Framework**        | Expo (React Native)    | Desarrollo multiplataforma iOS/Android |
| **Navegación**       | Expo Router            | Navegación file-based con TypeScript   |
| **Estilos**          | React Native Unistyles | Temas dinámicos y responsive design    |
| **UI Components**    | Gluestack UI v2        | Componentes accesibles y customizables |
| **Backend**          | Supabase               | PostgreSQL + Auth + Realtime           |
| **State Management** | TanStack Query v5      | Caché y sincronización de datos        |
| **Gráficos**         | Victory Native XL      | Visualización de progreso y gastos     |
| **Notificaciones**   | Expo Notifications     | Recordatorios locales programados      |

## 🎨 Temas (Skins)

5 temas inspirados en cultura pop:

| Tema                | Paleta         | Estilo            |
| ------------------- | -------------- | ----------------- |
| **One Piece**       | Rojo/Beige     | Carteles "Wanted" |
| **Demon Slayer**    | Verde/Negro    | Patrones Hamon    |
| **Naruto**          | Naranja/Blanco | Estilo pergamino  |
| **Dragon Ball**     | Naranja/Azul   | Colores saturados |
| **Stranger Things** | Rojo/Negro     | Neón años 80      |

## 📱 Funcionalidades Principales

### Para Administradores (Padres)

- ✅ Crear y gestionar clan familiar
- ✅ Definir tareas con recompensas
- ✅ Aprobar/rechazar tareas completadas
- ✅ Gestionar pagos mensuales (allowances)
- ✅ Dashboard con estadísticas del clan
- ✅ Gráficas de progreso y gastos

### Para Miembros (Hijos)

- ✅ Completar tareas diarias/semanales
- ✅ Ganar XP y subir de nivel
- ✅ Ver balance de wallet
- ✅ Registrar gastos e ingresos
- ✅ Cambiar tema de la app
- ✅ Ver progreso mensual

## 🗂️ Estructura del Proyecto

```
clan-finance/
├── docs/                          # 📚 Documentación completa
│   ├── architecture/              # Arquitectura y diagramas
│   ├── database/                  # SQL y seguridad RLS
│   ├── CASOS-DE-USO.md           # 43 casos de uso
│   ├── DESARROLLO.md             # Guía con checkboxes
│   └── INICIO.md                 # Instalación y setup
├── src/
│   ├── app/                      # 🧭 Expo Router (navegación)
│   │   ├── (auth)/              # Autenticación
│   │   ├── (tabs)/              # Tabs principales
│   │   └── _layout.tsx          # Layout raíz
│   ├── features/                # 🎯 Módulos por funcionalidad
│   │   ├── auth/                # Login, registro
│   │   ├── clan/                # Gestión de clanes
│   │   ├── quests/              # Sistema de tareas
│   │   ├── wallet/              # Billetera y transacciones
│   │   └── profile/             # Perfil y configuración
│   ├── components/              # 🧩 Componentes reutilizables
│   │   ├── ui/                  # Componentes UI base
│   │   └── layout/              # Layouts compartidos
│   ├── lib/                     # 🔧 Servicios
│   │   ├── supabase/            # Cliente Supabase
│   │   └── query/               # Cliente TanStack Query
│   ├── types/                   # 📝 Tipos TypeScript
│   │   ├── database.types.ts    # Tipos de Supabase (generados)
│   │   ├── models.ts            # Tipos de negocio
│   │   └── dto.ts               # Data Transfer Objects
│   ├── hooks/                   # 🪝 Custom React hooks
│   ├── theme/                   # 🎨 Sistema de temas
│   │   ├── themes.ts            # 5 skins definidos
│   │   └── unistyles.ts         # Configuración Unistyles
│   └── constants/               # 🔢 Constantes y config
├── assets/                      # 🖼️ Imágenes y recursos
├── install-dependencies.sh      # Script de instalación
├── .env.example                # Template de variables
├── package.json
├── tsconfig.json               # TypeScript con path aliases
└── app.json                    # Configuración Expo
```

## 🔒 Seguridad

- **Row Level Security (RLS)**: Políticas a nivel de base de datos
- **Autenticación**: Supabase Auth con JWT
- **Aislamiento por Clan**: Cada admin solo ve su clan
- **Validaciones**: En BD, backend y frontend

Ver [Documentación de Seguridad](docs/database/SEGURIDAD-RLS.md) para detalles.

## 🧪 Testing (Futuro)

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e
```

## 📦 Scripts Disponibles

```bash
npm start              # Iniciar Expo Dev Server
npm run android        # Abrir en Android
npm run ios            # Abrir en iOS
npm run web            # Abrir en navegador
npx expo start -c      # Limpiar caché
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es privado y propietario.

## 🆘 Soporte

- **Documentación**: Ver carpeta `docs/`
- **Issues**: GitHub Issues
- **Supabase**: [docs.supabase.com](https://docs.supabase.com)
- **Expo**: [docs.expo.dev](https://docs.expo.dev)

---

**Versión:** 1.0  
**Estado:** En desarrollo 🚧  
**Última actualización:** Enero 2026

---

## 🎯 Próximos Pasos

1. **Configurar el proyecto**: Ver [Guía de Inicio](docs/INICIO.md)
2. **Entender la arquitectura**: Leer [Arquitectura](docs/architecture/ARQUITECTURA.md)
3. **Comenzar desarrollo**: Seguir [Guía de Desarrollo](docs/DESARROLLO.md)
4. **Revisar casos de uso**: Ver [Casos de Uso](docs/CASOS-DE-USO.md)

¡Bienvenido a Clan Finance! 🎮💰
