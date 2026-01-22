# Índice de Documentación - Clan Finance

## 📚 Estructura de Documentación

```
docs/
├── README.md                # Este archivo (índice)
├── INICIO.md                # Instalación y configuración
├── DESARROLLO.md            # Roadmap con checkboxes por fase
├── CASOS-DE-USO.md          # 43 casos de uso atómicos
├── DEPENDENCIAS.md          # Gestión de dependencias
├── LOGICA-DE-NEGOCIO.md     # Flujos y reglas de negocio
├── SOPORTE-WEB.md           # Dashboard web
├── architecture/            # Arquitectura del sistema
│   ├── ARQUITECTURA.md      # Principios y patrones
│   ├── DIAGRAMAS.md         # UML, ER, capas, componentes
│   └── FLUJOS.md            # Diagramas de secuencia
└── database/                # Base de datos
    ├── supabase-schema.sql  # Script SQL completo
    └── SEGURIDAD-RLS.md     # Políticas de seguridad
```

## 📖 Guías de Lectura

### Para Comenzar

1. **[README.md](../README.md)** - Visión general y guía rápida
2. **[INICIO.md](INICIO.md)** - Instalación paso a paso

### Desarrollo

3. **[DESARROLLO.md](DESARROLLO.md)** - Roadmap con checkboxes
4. **[CASOS-DE-USO.md](CASOS-DE-USO.md)** - 43 casos de uso documentados
5. **[LOGICA-DE-NEGOCIO.md](LOGICA-DE-NEGOCIO.md)** - Flujos y reglas

### Arquitectura

6. **[architecture/ARQUITECTURA.md](architecture/ARQUITECTURA.md)** - Principios y capas
7. **[architecture/DIAGRAMAS.md](architecture/DIAGRAMAS.md)** - Diagramas visuales
8. **[architecture/FLUJOS.md](architecture/FLUJOS.md)** - Diagramas de secuencia

### Base de Datos

9. **[database/supabase-schema.sql](database/supabase-schema.sql)** - Script SQL
10. **[database/SEGURIDAD-RLS.md](database/SEGURIDAD-RLS.md)** - Políticas RLS

## 🎯 Documentos por Rol

### Desarrollador Frontend

- [README.md](../README.md) - Overview del proyecto
- [INICIO.md](INICIO.md) - Setup y configuración
- [DESARROLLO.md](DESARROLLO.md) - Roadmap de desarrollo
- [CASOS-DE-USO.md](CASOS-DE-USO.md) - Funcionalidades a implementar
- [database/SEGURIDAD-RLS.md](database/SEGURIDAD-RLS.md) - Queries recomendadas

### Desarrollador Backend

- [database/supabase-schema.sql](database/supabase-schema.sql) - Schema completo
- [database/SEGURIDAD-RLS.md](database/SEGURIDAD-RLS.md) - Políticas RLS
- [LOGICA-DE-NEGOCIO.md](LOGICA-DE-NEGOCIO.md) - Reglas de negocio

### Product Owner / Arquitecto

- [README.md](../README.md) - Visión del proyecto
- [CASOS-DE-USO.md](CASOS-DE-USO.md) - Funcionalidades completas
- [LOGICA-DE-NEGOCIO.md](LOGICA-DE-NEGOCIO.md) - Flujos de negocio
- [architecture/ARQUITECTURA.md](architecture/ARQUITECTURA.md) - Decisiones arquitectónicas

### DevOps / Configuración

- [INICIO.md](INICIO.md) - Instalación y setup
- [database/supabase-schema.sql](database/supabase-schema.sql) - Setup de BD

## 📋 Resumen de Documentos

### README.md

**Contenido:**

- Visión del proyecto
- Stack tecnológico
- Temas (5 skins)
- Estructura del proyecto
- Inicio rápido
- Enlaces a documentación

**Cuándo leer:** Primera vez que ves el proyecto

### INICIO.md

**Contenido:**

- Requisitos previos
- Instalación de dependencias
- Configuración de variables de entorno
- Setup de Supabase
- Comandos de desarrollo
- Troubleshooting

**Cuándo leer:** Al configurar el proyecto por primera vez

### CASOS-DE-USO.md

**Contenido:**

- 43 casos de uso atómicos
- Tabla organizada por ID, módulo y actores
- Matriz de permisos (Admin/Member/Sistema)
- Descripción detallada por módulo
- Flujos de cada caso de uso

**Cuándo leer:** Antes de implementar cualquier funcionalidad

### DESARROLLO.md

**Contenido:**

- Roadmap de desarrollo en 7 fases
- Checkboxes para marcar progreso
- Setup, implementación y testing por fase
- Estimaciones de tiempo
- Checklist de lanzamiento

**Cuándo leer:** Al planificar el desarrollo

### LOGICA-DE-NEGOCIO.md

**Contenido:**

- Flujos principales (onboarding, cierre mensual, bonos)
- Reglas de negocio
- Validaciones críticas
- Constraints y triggers
- Casos especiales

**Cuándo leer:** Al implementar lógica de negocio

### architecture/ARQUITECTURA.md

**Contenido:**

- Principios arquitectónicos
- Capas de la arquitectura
- Patrones de diseño
- Flujo de datos
- Gestión de estado
- Seguridad y escalabilidad

**Cuándo leer:** Para entender decisiones arquitectónicas

### architecture/DIAGRAMAS.md

**Contenido:**

- Diagrama UML de clases
- Diagrama ER (entidad-relación)
- Diagrama de arquitectura de capas
- Diagrama de flujo de datos
- Diagrama de componentes

**Cuándo leer:** Para visualizar la arquitectura

### architecture/FLUJOS.md

**Contenido:**

- 9 diagramas de secuencia de casos de uso críticos
- Flujos de onboarding
- Flujos de quests
- Flujos de wallet
- Flujos de payouts

**Cuándo leer:** Para entender flujos específicos

### database/supabase-schema.sql

**Contenido:**

- 6 ENUMs
- 8 tablas con relaciones
- Índices de optimización
- Triggers automáticos
- Políticas RLS completas
- Funciones auxiliares

**Cuándo ejecutar:** Una sola vez al configurar Supabase

### database/SEGURIDAD-RLS.md

**Contenido:**

- Roles del sistema
- Matriz de permisos por tabla
- Políticas RLS implementadas
- Principios de seguridad
- Queries recomendadas para dashboard
- Guía de testing

**Cuándo leer:** Antes de hacer queries a Supabase

## 🔗 Enlaces Rápidos

| Necesito...           | Ir a...                                                      |
| --------------------- | ------------------------------------------------------------ |
| Instalar el proyecto  | [INICIO.md](INICIO.md)                                       |
| Ver casos de uso      | [CASOS-DE-USO.md](CASOS-DE-USO.md)                           |
| Roadmap de desarrollo | [DESARROLLO.md](DESARROLLO.md)                               |
| Entender flujos       | [LOGICA-DE-NEGOCIO.md](LOGICA-DE-NEGOCIO.md)                 |
| Ver arquitectura      | [architecture/ARQUITECTURA.md](architecture/ARQUITECTURA.md) |
| Ver diagramas         | [architecture/DIAGRAMAS.md](architecture/DIAGRAMAS.md)       |
| Entender permisos     | [database/SEGURIDAD-RLS.md](database/SEGURIDAD-RLS.md)       |
| Crear base de datos   | [database/supabase-schema.sql](database/supabase-schema.sql) |

## 📝 Convenciones

### Nomenclatura de Casos de Uso

- **CU-XX**: Identificador único (01-43)
- **Módulo**: Autenticación, Perfil, Clan, Quests, Wallet, Dashboard, Notificaciones
- **Actor**: Admin, Member, Sistema

### Niveles de Acceso

- ✅ Permitido
- ❌ No permitido
- 🔒 Requiere autenticación
- 👑 Solo Admin

### Estados de Desarrollo

- [ ] Por hacer
- [/] En progreso
- [x] Completado

---

**Última actualización:** Enero 2026  
**Versión de documentación:** 1.0
