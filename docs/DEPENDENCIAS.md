# Clan Finance - Instalación de Dependencias

## ✅ Dependencias Ya Instaladas

Si ya ejecutaste `bash install-dependencies.sh` anteriormente, **no necesitas volver a ejecutarlo**.

Simplemente usa:

```bash
npm install
```

Esto instalará cualquier dependencia faltante basándose en `package.json`.

---

## 📦 Script de Instalación Inicial

El archivo `install-dependencies.sh` es útil **solo la primera vez** que configuras el proyecto o si necesitas reinstalar todo desde cero.

### Cuándo usar el script:

- ✅ Primera vez configurando el proyecto
- ✅ Después de clonar el repositorio
- ✅ Si borraste `node_modules` y quieres reinstalar todo

### Cuándo NO usar el script:

- ❌ Si ya instalaste las dependencias
- ❌ Para agregar una sola dependencia nueva
- ❌ Para actualizar dependencias

---

## 🔄 Comandos Comunes

### Instalar dependencias (normal)

```bash
npm install
```

### Agregar nueva dependencia

```bash
npm install nombre-del-paquete
```

### Actualizar dependencias

```bash
npm update
```

### Limpiar e instalar desde cero

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📋 Dependencias del Proyecto

### Core

- `expo` - Framework principal
- `react` - Librería UI
- `react-native` - Plataforma móvil

### Navegación

- `expo-router` - Navegación file-based
- `react-native-safe-area-context` - Safe areas
- `react-native-screens` - Optimización de pantallas
- `expo-linking` - Deep linking
- `expo-constants` - Constantes del sistema
- `expo-status-bar` - Barra de estado

### Estilos y UI

- `react-native-unistyles` - Sistema de temas
- `@gluestack-ui/themed` - Componentes UI
- `@gluestack-style/react` - Sistema de estilos

### Backend y Estado

- `@supabase/supabase-js` - Cliente Supabase
- `@tanstack/react-query` - Gestión de estado

### Gráficos

- `victory-native` - Gráficas y visualizaciones

### Funcionalidades

- `expo-notifications` - Notificaciones locales
- `expo-device` - Info del dispositivo
- `expo-sharing` - Compartir contenido
- `react-native-reanimated` - Animaciones
- `react-native-gesture-handler` - Gestos

---

## 🎯 Dependencias Recomendadas Adicionales

### Para Validación de Formularios

```bash
npm install react-hook-form zod @hookform/resolvers
```

**Uso:** Validación de formularios (login, registro, crear clan)

### Para Manejo de Fechas

```bash
npm install date-fns
```

**Uso:** Formateo de fechas en transacciones y payouts

### Para Async Storage

```bash
npm install @react-native-async-storage/async-storage
```

**Uso:** Persistir tema seleccionado, caché offline

### Para Imágenes Optimizadas

```bash
npm install expo-image
```

**Uso:** Avatares de perfil con caché automático

### Para Clipboard

```bash
npm install @react-native-clipboard/clipboard
```

**Uso:** Copiar código de invitación

### Para Haptic Feedback

```bash
npm install expo-haptics
```

**Uso:** Feedback táctil al completar tareas

### Para Deep Linking Avanzado

```bash
npm install expo-web-browser
```

**Uso:** Abrir links externos (términos, privacidad)

---

## 🔧 Dependencias de Desarrollo

### Para Testing (Futuro)

```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
```

### Para Linting

```bash
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### Para Formateo

```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

---

## 📝 Notas

### Legacy Peer Dependencies

El proyecto usa `.npmrc` con `legacy-peer-deps=true` para evitar conflictos de dependencias.

### Path Aliases

TypeScript está configurado con path aliases (`@/*`) en `tsconfig.json`.

### Expo SDK

El proyecto usa Expo SDK 50+. Asegúrate de que todas las dependencias sean compatibles.

---

**Última actualización:** Enero 2026
