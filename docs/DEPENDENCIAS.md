# Gestión de Dependencias

## 📦 Instalación

```bash
npm install
```

Todas las dependencias están definidas en `package.json`.

---

## 📋 Dependencias del Proyecto

### Core (ya instaladas)

- `expo` - Framework principal
- `react` - Librería UI
- `react-native` - Plataforma móvil

### Navegación

- `expo-router` - Navegación file-based
- `react-native-safe-area-context` - Safe areas
- `react-native-screens` - Optimización de pantallas

### Estilos y UI

- `uniwind` - Sistema de temas (Tailwind v4)
- `@rn-primitives/*` - Componentes UI (React Native Reusables)

### Backend y Estado

- `@supabase/supabase-js` - Cliente Supabase
- `@tanstack/react-query` - Gestión de estado

### Gráficos

- `victory-native` - Gráficas y visualizaciones

### Funcionalidades

- `expo-notifications` - Notificaciones locales
- `expo-sharing` - Compartir contenido
- `react-native-reanimated` - Animaciones
- `react-native-gesture-handler` - Gestos

### Adicionales (instaladas)

- `react-hook-form` - Validación de formularios
- `zod` - Schemas de validación type-safe
- `date-fns` - Manejo de fechas
- `@react-native-async-storage/async-storage` - Storage persistente
- `expo-web-browser` - Soporte web para dashboard

---

## 🚀 Comandos Útiles

```bash
# Instalar dependencias
npm install

# Agregar nueva dependencia
npm install <package-name>

# Actualizar dependencias
npm update

# Ver dependencias desactualizadas
npm outdated

# Limpiar e instalar desde cero
rm -rf node_modules package-lock.json && npm install
```

---

## 🌐 Soporte Web

El proyecto funciona en web gracias a Expo Web. Para iniciar:

```bash
npm run web
```

Ver [SOPORTE-WEB.md](SOPORTE-WEB.md) para más detalles sobre el dashboard web.

---

**Nota:** Las dependencias están optimizadas para mantener el bundle size pequeño (~60KB adicionales). Solo se incluyen librerías esenciales para el MVP.
