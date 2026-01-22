# Soporte Web - Dashboard

## 🌐 Visión

El dashboard de Clan Finance está diseñado para funcionar tanto en mobile como en web, permitiendo a los administradores visualizar estadísticas y gráficas en pantallas más grandes.

## ✅ Ventajas del Dashboard Web

### Para Administradores

- 📊 **Gráficas más grandes**: Victory Native renderiza mejor en pantallas grandes
- 📈 **Análisis detallado**: Más espacio para visualizar datos
- 💻 **Acceso desde desktop**: Revisar estadísticas desde la computadora
- 🖨️ **Exportar datos**: Más fácil generar reportes

### Para el Proyecto

- 🎯 **Mejor UX**: Dashboards complejos son más usables en web
- 📱 **Flexibilidad**: Mobile para día a día, web para análisis
- 🚀 **Expo Web**: Sin configuración adicional, funciona out-of-the-box

## 🛠️ Implementación

### Iniciar en Web

```bash
npm run web
```

### Consideraciones Técnicas

#### ✅ Funciona en Web

- Victory Native (gráficas)
- Uniwind (Tailwind v4) (temas)
- Supabase (queries y RLS)
- TanStack Query (caché)
- React Native Reusables (componentes)

#### ⚠️ Requiere Adaptación

- Gestos táctiles → Click del mouse
- Notificaciones push → Web notifications API
- Expo Sharing → Web Share API (si está disponible)

### Responsive Design

Usar clases de Uniwind/Tailwind para adaptar UI:

```tsx
<View className="p-xs md:p-md lg:p-lg flex-col lg:flex-row">
  {/* Contenido adaptable */}
</View>
```

## 📊 Dashboard Recomendado

### Vista Mobile (Tabs)

```
├── Inicio (Dashboard resumido)
├── Quests (Lista de tareas)
├── Wallet (Balance y transacciones)
└── Perfil (Configuración)
```

### Vista Web (Sidebar + Contenido)

```
┌─────────────┬──────────────────────────┐
│             │                          │
│  Sidebar    │   Dashboard Principal    │
│             │                          │
│  - Inicio   │   ┌────────┬────────┐   │
│  - Quests   │   │ Gráfica│ Stats  │   │
│  - Wallet   │   │  Prog. │ Clan   │   │
│  - Perfil   │   └────────┴────────┘   │
│             │                          │
│             │   Tabla de Miembros      │
│             │   ┌──────────────────┐   │
│             │   │ Nombre | % | $   │   │
│             │   └──────────────────┘   │
└─────────────┴──────────────────────────┘
```

## 🎨 Gráficas en Web

### Victory Native en Web

Victory Native funciona perfectamente en web:

```typescript
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';

// Funciona igual en mobile y web
<VictoryChart theme={VictoryTheme.material}>
  <VictoryBar
    data={[
      { member: 'Juan', completion: 85 },
      { member: 'María', completion: 92 },
      { member: 'Pedro', completion: 65 },
    ]}
    x="member"
    y="completion"
  />
</VictoryChart>
```

### Gráficas Recomendadas para Web

1. **Progreso del Clan** (Gráfica de barras)
   - Eje X: Miembros
   - Eje Y: % de completado

2. **Distribución de Gastos** (Gráfica de pie)
   - Segmentos: Tipos de transacción
   - Valores: Montos

3. **Tendencia Mensual** (Gráfica de línea)
   - Eje X: Meses
   - Eje Y: Balance total

## 🔐 Seguridad

### RLS en Web

Las políticas RLS funcionan igual en web:

- Usuario debe estar autenticado
- Solo puede ver datos de su clan
- Admin tiene permisos adicionales

### Autenticación

Supabase Auth funciona en web:

```typescript
// Mismo código para mobile y web
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

## 📱 Detección de Plataforma

```typescript
import { Platform } from "react-native";

if (Platform.OS === "web") {
  // Código específico para web
  // Ejemplo: Mostrar sidebar en lugar de tabs
}
```

## 🚀 Deployment Web (Futuro)

### Opciones

1. **Vercel** - Recomendado para Expo Web
2. **Netlify** - Alternativa popular
3. **GitHub Pages** - Gratis para proyectos públicos

### Build para Web

```bash
npx expo export:web
```

Genera carpeta `web-build/` lista para deploy.

---

**Nota:** El soporte web es un valor agregado para dashboards administrativos. Se implementará en Fase 5 (Wallet/Dashboard) siguiendo el roadmap de desarrollo.
