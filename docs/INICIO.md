# Guía de Inicio - Clan Finance

## 🚀 Instalación

### Requisitos Previos

- **Node.js** 18+ y npm
- **Cuenta en Supabase** ([supabase.com](https://supabase.com))
- **Expo CLI** (se instala automáticamente)

### Paso 1: Instalar Dependencias

```bash
# Instalar dependencias del proyecto
npm install

# Instalar dependencias adicionales recomendadas
npm install react-hook-form zod date-fns @react-native-async-storage/async-storage
```

**Dependencias principales (ya en package.json):**

- `expo-router` - Navegación file-based
- `react-native-unistyles` - Sistema de temas dinámicos
- `@gluestack-ui/themed` - Componentes UI
- `@supabase/supabase-js` - Cliente Supabase
- `@tanstack/react-query` - Gestión de estado y caché
- `victory-native` - Gráficos
- `expo-notifications` - Notificaciones locales
- `expo-sharing` - Compartir códigos de invitación
- `react-native-reanimated` - Animaciones
- `react-native-gesture-handler` - Gestos

**Dependencias adicionales recomendadas:**

- `react-hook-form` - Validación de formularios
- `zod` - Schemas de validación type-safe
- `date-fns` - Manejo de fechas
- `@react-native-async-storage/async-storage` - Storage persistente

Ver [DEPENDENCIAS.md](DEPENDENCIAS.md) para más detalles sobre por qué estas dependencias.

### Paso 2: Configurar Variables de Entorno

```bash
# Copiar template
cp .env.example .env
```

Editar `.env` con tus credenciales de Supabase:

```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
EXPO_PUBLIC_APP_ENV=development
```

### Paso 3: Configurar Base de Datos en Supabase

1. **Crear proyecto en Supabase:**
   - Ve a [supabase.com](https://supabase.com)
   - Crea un nuevo proyecto
   - Anota la URL y Anon Key

2. **Ejecutar script SQL:**
   - Ir al **SQL Editor** en Supabase
   - Copiar todo el contenido de `docs/database/supabase-schema.sql`
   - Ejecutar el script

**El script creará:**

- ✅ 6 ENUMs para tipos de datos
- ✅ 8 tablas con relaciones
- ✅ Índices para optimización
- ✅ Triggers automáticos (updated_at, balance, wallet)
- ✅ Row Level Security (RLS) policies
- ✅ Función para generar códigos de invitación
- ✅ Constraint de balance positivo

### Paso 4: Iniciar el Proyecto

```bash
npm start
```

**Opciones:**

- Presiona `i` para iOS Simulator
- Presiona `a` para Android Emulator
- Presiona `w` para Web
- Escanea el QR con **Expo Go** en tu dispositivo

---

## 📱 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm start              # Iniciar Expo Dev Server
npm run android        # Abrir en Android
npm run ios            # Abrir en iOS
npm run web            # Abrir en navegador

# Limpiar caché
npx expo start -c

# Generar tipos de Supabase (opcional)
npx supabase gen types typescript --project-id "tu-project-id" > src/types/database.types.ts
```

### Estructura de Desarrollo

```
src/
├── app/                    # Rutas de Expo Router
│   ├── (auth)/            # Pantallas de autenticación
│   ├── (tabs)/            # Navegación principal
│   └── _layout.tsx        # Layout raíz
├── features/              # Módulos por funcionalidad
│   ├── auth/
│   ├── clan/
│   ├── quests/
│   ├── wallet/
│   └── profile/
├── components/            # Componentes reutilizables
├── hooks/                 # Custom hooks
├── lib/                   # Servicios (Supabase, Query)
├── types/                 # Tipos TypeScript
├── theme/                 # Sistema de temas
└── constants/             # Constantes
```

### Path Aliases

El proyecto usa path aliases para imports limpios:

```typescript
// ❌ Evitar
import { supabase } from "../../../lib/supabase/client";

// ✅ Usar
import { supabase } from "@/lib/supabase/client";
```

---

## 🎨 Temas (Skins)

El proyecto incluye 5 temas inspirados en cultura pop:

| Tema            | Color Primario | Descripción              |
| --------------- | -------------- | ------------------------ |
| One Piece       | `#D91E1E`      | Estilo carteles "Wanted" |
| Demon Slayer    | `#2D5F5D`      | Patrones Hamon elegantes |
| Naruto          | `#FF9F1C`      | Estilo pergamino         |
| Dragon Ball     | `#F28F08`      | Colores saturados y bold |
| Stranger Things | `#E20713`      | Estética neón años 80    |

**Cambiar tema:**

```typescript
import { UnistylesRuntime } from "react-native-unistyles";

UnistylesRuntime.setTheme("naruto");
```

---

## 🔧 Troubleshooting

### Error: Cannot find module

```bash
# Limpiar caché e instalar
rm -rf node_modules
npm install
npx expo start -c
```

### Error: Supabase connection

1. Verifica que `.env` tenga las credenciales correctas
2. Verifica que el proyecto de Supabase esté activo
3. Verifica que el script SQL se haya ejecutado correctamente

### Error: Path aliases no funcionan

```bash
# Reiniciar Metro bundler
npx expo start -c
```

### Error: RLS policies

Si ves errores de permisos:

1. Verifica que el usuario esté autenticado
2. Revisa las políticas RLS en `docs/database/SEGURIDAD-RLS.md`
3. Usa el SQL Editor para probar queries manualmente

---

## 📚 Próximos Pasos

1. **Leer la documentación:**
   - [Casos de Uso](CASOS-DE-USO.md) - 43 casos de uso documentados
   - [Arquitectura](architecture/ARQUITECTURA.md) - Principios y patrones
   - [Seguridad RLS](database/SEGURIDAD-RLS.md) - Políticas de permisos

2. **Comenzar desarrollo:**
   - Ver [Guía de Desarrollo](DESARROLLO.md) para orden recomendado
   - Implementar autenticación primero
   - Luego perfil, clan, quests y wallet

3. **Testing:**
   - Crear usuario de prueba
   - Crear clan de prueba
   - Probar flujos completos

---

## 🆘 Soporte

- **Documentación:** Ver carpeta `docs/`
- **Issues:** Revisar casos de uso y flujos
- **Supabase:** [docs.supabase.com](https://docs.supabase.com)
- **Expo:** [docs.expo.dev](https://docs.expo.dev)

---

**Versión:** 1.0  
**Estado:** En desarrollo 🚧
