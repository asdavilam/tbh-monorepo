# CLAUDE.md — TBH Monorepo

Guía para Claude Code al trabajar en este proyecto. Lee este archivo antes de cualquier tarea.

---

## Descripcion del Proyecto

App web de inventario para negocios de comida (hamburguesas). Permite registrar conteo diario de insumos, detectar faltantes y generar listas de compra automáticas.

**Objetivo V1:** El inventario diario se registra en menos de 5 minutos, sin capacitación técnica.

---

## Stack Tecnico

- **Frontend:** React + TypeScript
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **Monorepo:** Turborepo
- **Arquitectura:** Clean Architecture pragmática
- **Estado UI:** React Hooks (`useState`, `useReducer`), Zustand opcional
- **Inyección de dependencias:** Manual

---

## Estructura del Monorepo

```
root/
├── apps/
│   ├── inventory-app/     # App principal
│   └── web-public/        # Landing page (solo "en construcción" en V1)
├── packages/
│   ├── domain/            # Entidades, interfaces de repos, reglas de negocio
│   ├── application/       # UseCases, DTOs, servicios de orquestación
│   ├── infrastructure/    # Supabase client, repos concretos, mappers
│   ├── ui/                # Componentes compartidos
│   ├── types/             # Tipos compartidos
│   └── config/            # Configuración compartida
├── supabase/
│   ├── migrations/
│   └── seed/
├── turbo.json
└── CLAUDE.md
```

### Estructura interna de `inventory-app`

```
src/
├── features/
│   ├── auth/
│   ├── inventory/
│   ├── products/
│   ├── purchases/
│   └── shopping-list/
├── shared/
└── main.tsx
```

---

## Arquitectura — Flujo de Dependencias

```
UI (apps) → Application → Domain
                      ↓
               Infrastructure
```

### Responsabilidades por capa

| Capa               | Responsabilidad                                                                     |
| ------------------ | ----------------------------------------------------------------------------------- |
| **Domain**         | Entidades, interfaces de repos, reglas de negocio puras. Sin dependencias externas. |
| **Application**    | UseCases (1 por operación). Orquesta Domain + Infrastructure. Sin lógica de UI.     |
| **Infrastructure** | Implementa repos. Comunica con Supabase. Mapea Entity ↔ DB.                         |
| **UI (apps)**      | Renderiza, maneja eventos, llama UseCases. Sin lógica de negocio.                   |

---

## Reglas de Negocio Criticas

1. **Inventario basado en conteo final** — NO en movimientos de entrada/salida.
2. **Stock inicial es derivado** — Siempre viene del último registro. El usuario NUNCA lo ingresa manualmente.
3. **Diferencias se calculan, no se persisten** — La DB guarda solo datos fuente (conteo final, compras).
4. **Frecuencia de conteo por producto** — Mostrar solo productos que corresponden al día actual.
5. **Asignación por usuario** — Cada trabajador ve solo sus productos asignados.
6. **Compras actualizan inventario** — Registrar una compra siempre impacta el stock actual.
7. **Unidades controladas** — `unit` (pz), `fraction` (g, l), `qualitative` (mucho/poco/nada). No mezclar sin validación.

---

## Roles

| Rol            | Permisos                                     |
| -------------- | -------------------------------------------- |
| **Admin**      | Control total, edita inventarios y productos |
| **Encargado**  | Registra inventario, gestiona compras        |
| **Trabajador** | Solo registra conteos de productos asignados |

---

## Violaciones Prohibidas

### Criticas (rompen el sistema)

- Lógica de negocio en componentes React, hooks o mappers
- UI accediendo a Supabase directamente
- Domain importando React, Supabase o cualquier lib externa
- Calcular diferencias de inventario en la UI
- Determinar stock inicial en frontend
- Generar lista de compras en componentes
- Registrar compra sin actualizar inventario
- Mostrar productos ignorando frecuencia de conteo
- Mostrar productos no asignados al usuario
- Implementar inventario por movimientos

### Por capa

- **Domain:** No importar React, Supabase, fetch, axios ni configs de entorno
- **Application:** UseCases no instancian repos ni acceden a Supabase directamente; un UseCase = una responsabilidad
- **Infrastructure:** No importar componentes UI, hooks ni UseCases; retornar siempre entidades del dominio (nunca raw JSON de Supabase)
- **UI:** No cálculos de negocio, no acceso directo a DB, no manejo de errores técnicos de Supabase

### Manejo de errores entre capas

```
DataSource → lanza errores
Repository → captura y transforma
UseCase    → interpreta
UI         → solo reacciona
```

---

## Alcance Negativo V1 (NO implementar)

- Sistema de ventas (POS)
- Facturación o contabilidad
- Gestión de proveedores
- Órdenes de compra formales
- Multi-sucursal
- Predicciones o reportes avanzados
- Offline mode
- Inventario por movimientos complejos

> Regla: Si agrega complejidad operativa diaria → NO implementar.

---

## Principios de Diseno

1. Simplicidad sobre complejidad
2. Basado en conteo real (no teórico)
3. El usuario nunca hace cálculos manuales
4. UX rápida tipo checklist
5. Separación de responsabilidades por usuario
6. Minimizar errores humanos
7. No persistir datos derivados innecesarios
8. Supabase RLS activo — datos filtrados por usuario
9. **Mobile-first obligatorio** — toda UI debe diseñarse primero para móvil y escalar hacia pantallas mayores

## Principios de UI / UX

- **Mobile-first**: breakpoints base para móvil, luego `sm:`, `md:`, `lg:`
- Tipografía mínima legible en pantallas pequeñas (≥14px body, ≥16px inputs)
- Áreas táctiles mínimas de 44×44px en elementos interactivos
- Formularios de una columna en móvil; grids opcionales en desktop
- Evitar tablas horizontales en móvil — preferir listas o cards
- Sin tooltips ocultos en hover — en móvil no hay hover
- El flujo de conteo diario debe ser completable con una mano en celular

---

## Decision arquitectonica ante dudas

> ¿Es una regla del negocio de inventario? → **Domain Layer**
> ¿Es flujo u orquestación? → **Application Layer**
> ¿Es visual o de estado? → **UI**
> ¿Es técnico (DB/API)? → **Infrastructure**

---

## Comandos

> Pendiente de configurar cuando se inicialice el proyecto con Turborepo.

```bash
# Instalar dependencias
pnpm install

# Dev
pnpm dev

# Build
pnpm build

# Tests
pnpm test
```

---

## Referencias

- [Definición del producto](docs/product_definition.md)
- [Arquitectura](docs/architecture.md)
- [Violaciones arquitectónicas](docs/architecture_violations.md)
