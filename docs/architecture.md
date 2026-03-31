🎯 Filosofía Arquitectónica

La aplicación adopta una variante pragmática de Clean Architecture con los siguientes objetivos:
• Separación clara de responsabilidades
• Mantenibilidad para desarrollador único
• Compatibilidad con desarrollo asistido por IA
• Escalabilidad progresiva (sin sobreingeniería)
• Minimizar acoplamiento entre UI y lógica de negocio
• Adaptación directa al flujo real del negocio (conteo físico)

⸻

🧩 Estilo Arquitectónico

Se adopta:
• ✅ Clean Architecture (pragmática)
• ✅ Monorepo modular (Turborepo recomendado)
• ✅ Organización Feature-First
• ✅ Backend Supabase (BaaS)
• ✅ Online-First
• ✅ Inyección de dependencias manual
• ✅ Separación estricta entre apps (inventory / web)

⸻

📦 ESTRUCTURA GLOBAL

⸻

Root del Monorepo
root/
│
├── apps/
│ ├── inventory-app/
│ └── web-public/
│
├── packages/
│ ├── domain/
│ ├── application/
│ ├── infrastructure/
│ ├── ui/
│ ├── types/
│ └── config/
│
├── supabase/
│ ├── migrations/
│ └── seed/
│
├── package.json
└── turbo.json

🧱 ORGANIZACIÓN POR APP

⸻

apps/inventory-app

Aplicación principal del sistema.

inventory-app/
│
├── src/
│ ├── features/
│ │ ├── auth/
│ │ ├── inventory/
│ │ ├── products/
│ │ ├── purchases/
│ │ └── shopping-list/
│ │
│ ├── shared/
│ └── main.tsx

apps/web-public

Landing page simple.
web-public/
│
├── src/
│ ├── pages/
│ ├── components/
│ └── main.tsx

🧠 DOMAIN LAYER (/packages/domain)

⸻

Propósito

Contiene exclusivamente lógica del negocio.

No depende de:
• React
• Supabase
• APIs
• UI
• Frameworks

⸻

Contenido
domain/
├── entities/
├── repositories/
├── value-objects/
└── rules/

Responsabilidades
• ✅ Definir entidades (Product, InventoryRecord, Purchase, User)
• ✅ Definir contratos (interfaces de repositorios)
• ✅ Reglas del negocio:
• Inventario basado en conteo
• Stock inicial derivado
• Restricciones de roles
• ✅ Validaciones críticas
• ✅ Manejo de unidades (unit, fraction, qualitative)

⸻

⚙️ APPLICATION LAYER (/packages/application)

⸻

Propósito

Orquestar la lógica del sistema mediante casos de uso.

⸻

Contenido
application/
├── usecases/
├── dto/
└── services/

Responsabilidades
• ✅ Ejecutar lógica de negocio
• ✅ Coordinar repositorios
• ✅ Aplicar reglas del dominio
• ✅ Transformar datos (DTOs)

⸻

Ejemplos de UseCases
• RegisterInventoryUseCase
• GenerateShoppingListUseCase
• RegisterPurchaseUseCase
• GetProductsByUserUseCase

⸻

Reglas
• ✅ Un UseCase = una responsabilidad
• ❌ No lógica de UI
• ❌ No acceso directo a Supabase

⸻

💾 INFRASTRUCTURE LAYER (/packages/infrastructure)

⸻

Propósito

Implementación técnica y acceso a servicios externos.

⸻

Contenido
infrastructure/
├── supabase/
│ ├── client/
│ ├── repositories/
│ └── mappers/
│
├── auth/
└── config/

Responsabilidades
• ✅ Comunicación con Supabase
• ✅ Implementación de repositorios
• ✅ Mapeo Entity ↔ DB
• ✅ Manejo de errores
• ✅ Configuración de cliente

⸻

Reglas
• ❌ No lógica de negocio
• ❌ No dependencias hacia UI

⸻

🖥 INTERFACE LAYER (React Apps)

⸻

Propósito

Gestionar UI y experiencia del usuario.

⸻

Contenido (Inventory App)
features/
├── inventory/
│ ├── components/
│ ├── hooks/
│ ├── pages/
│ └── state/

Responsabilidades
• ✅ Renderizado UI
• ✅ Manejo de eventos
• ✅ Estado local
• ✅ Llamadas a UseCases
• ✅ Validaciones básicas

⸻

Reglas
• ❌ No lógica de negocio compleja
• ❌ No acceso directo a Supabase
• ❌ No cálculos críticos

⸻

🔁 FLUJO DE DEPENDENCIAS

⸻

Regla estricta
UI (apps) → Application → Domain
↓
Infrastructure

Permitido
• UI usa UseCases
• UseCases usan interfaces de repositorios
• Infrastructure implementa repositorios

⸻

Prohibido
• UI accediendo a Supabase directamente
• Domain con dependencias externas
• UseCases usando implementaciones concretas
• Infrastructure accediendo a UI

⸻

⚙️ GESTIÓN DE ESTADO

Se adopta:
• ✅ React Hooks (useState, useReducer)
• ✅ Posible uso de Zustand (opcional)

⸻

Justificación
• Ligero y suficiente para MVP
• Menor complejidad que Redux
• Ideal para flujo tipo checklist
• Compatible con desarrollo rápido

⸻

🧩 PATRÓN DE USE CASES

Cada operación del sistema es un caso de uso independiente.

⸻

Ejemplos
• RegisterInventory
• GenerateShoppingList
• RegisterPurchase
• UpdateProduct

⸻

Reglas
• ✅ Enfoque atómico
• ✅ Sin dependencias de UI
• ✅ Lógica clara y testeable

⸻

💉 INYECCIÓN DE DEPENDENCIAS

Se adopta:
• ✅ Inyección manual

⸻

Flujo 1. Se crea cliente de Supabase 2. Se crean repositorios (Infrastructure) 3. Se inyectan en UseCases 4. UseCases se usan en UI

⸻

Ventajas
• Control total
• Sin magia
• Fácil debugging

⸻

🌐 BACKEND & DATOS

⸻

Backend
• ✅ Supabase (PostgreSQL + Auth)

⸻

Reglas
• Row Level Security habilitado
• Datos filtrados por usuario
• No lógica de negocio en DB (excepto casos necesarios)
• No persistir datos derivados innecesarios

⸻

Modelo clave del sistema

👉 El sistema NO usa movimientos

👉 Se basa en:
• Conteo final
• Historial de registros
• Diferencias calculadas

⸻

🧮 LÓGICA DE NEGOCIO CRÍTICA

Debe vivir exclusivamente en Domain/Application:
• Cálculo de stock inicial
• Cálculo de diferencias
• Generación de lista de compras
• Validación de roles
• Reglas de frecuencia de conteo

⸻

🧱 PRINCIPIOS ARQUITECTÓNICOS FUNDAMENTALES 1. Domain completamente independiente 2. Application orquesta lógica 3. Infrastructure implementa detalles 4. UI desacoplada del backend 5. Inventario basado en conteo (no movimientos) 6. Dependencias unidireccionales 7. Simplicidad sobre complejidad 8. Código predecible y mantenible

⸻

🚨 DECISIONES ARQUITECTÓNICAS CLAVE
• Monorepo desde inicio
• Supabase como único backend
• Web pública desacoplada
• Inventario centrado en conteo real
• Roles estrictos por usuario

⸻

🎯 OBJETIVO DE ESTA ARQUITECTURA

Permitir:
• ✅ Desarrollo rápido y ordenado
• ✅ Escalabilidad sin refactor masivo
• ✅ Fácil integración con futuras apps (POS, pedidos)
• ✅ Bajo acoplamiento
• ✅ Alta claridad para agentes de IA
