# 🎨 UI Design Specification – App de Inventario (Hamburguesas)

---

## 🎯 Objetivo del Documento

Definir el **diseño visual, experiencia de usuario (UX) y lineamientos de interfaz (UI)** de la aplicación.

Este documento establece:

- Estilo visual
- Sistema de diseño
- Componentes UI
- Layouts
- Jerarquía visual
- Accesibilidad
- Principios UX

❌ No define comportamiento funcional (eso vive en `ui_behavior.md`)  
❌ No contiene lógica de negocio

---

# 🧠 PRINCIPIOS DE DISEÑO

---

## 🎯 Filosofía General

La interfaz debe ser:

- **Mobile-first**
- **Rápida de usar (tipo checklist)**
- **Minimalista pero premium**
- **Altamente legible**
- **Operativa (no decorativa)**

---

## 🧩 Principios UX Clave

1. **Velocidad sobre estética**
2. **Menos pasos = mejor experiencia**
3. **El usuario no debe pensar**
4. **Todo debe ser evidente**
5. **Reducir errores humanos**
6. **Diseño basado en flujo real (papel → digital)**

---

## 🚫 Anti-objetivos

- ❌ UI recargada
- ❌ Animaciones innecesarias
- ❌ Inputs complicados
- ❌ Información irrelevante
- ❌ Pantallas profundas (máx 2 niveles)

---

# 🎨 SISTEMA DE DISEÑO

---

## 🎨 Paleta de Colores

### Colores Base

| Uso        | Color                    |
| ---------- | ------------------------ |
| Primary    | Negro profundo (#0B0B0B) |
| Secondary  | Gris oscuro (#1A1A1A)    |
| Background | Blanco (#FFFFFF)         |
| Surface    | Gris claro (#F5F5F5)     |

---

### Colores Funcionales

| Estado  | Color              |
| ------- | ------------------ |
| Success | Verde (#22C55E)    |
| Warning | Amarillo (#EAB308) |
| Error   | Rojo (#EF4444)     |
| Info    | Azul (#3B82F6)     |

---

### Uso de Color

- Primary → Botones principales
- Secondary → Navegación
- Surface → Cards
- Functional → Feedback del sistema

---

## 🔤 Tipografía

### Fuente recomendada

- Inter / SF Pro / Roboto

---

### Jerarquía

| Nivel | Tamaño | Peso     |
| ----- | ------ | -------- |
| H1    | 24px   | Bold     |
| H2    | 20px   | SemiBold |
| H3    | 18px   | Medium   |
| Body  | 16px   | Regular  |
| Small | 14px   | Regular  |

---

### Reglas

- Máximo 2 tamaños por pantalla
- Evitar textos largos
- Priorizar números grandes (inventario)

---

## 📐 Espaciado

Sistema basado en múltiplos de 8:

- 4px (micro)
- 8px (base)
- 16px (default)
- 24px (secciones)
- 32px (bloques grandes)

---

## 🔘 Bordes y Elevación

- Border radius: **12px (default)**
- Cards: sombra suave
- Inputs: sin bordes pesados

---

# 🧱 COMPONENTES UI

---

## 🔘 Botones

### Tipos

1. **Primary**
2. **Secondary**
3. **Ghost**
4. **Danger**

---

### Reglas

- Altura mínima: 44px
- Texto claro y directo
- Siempre con feedback visual (pressed, loading)

---

## 🧾 Inputs

---

### Tipos

- Text
- Number
- Selector (dropdown)
- Toggle
- Date

---

### Reglas

- Tamaño grande (usable con pulgar)
- Labels visibles SIEMPRE
- Validación inmediata
- Placeholder solo como ayuda (no reemplaza label)

---

## 📦 Cards

Usadas para:

- Productos
- Inventario
- Listas

---

### Estructura

- Título
- Subtexto
- Valor principal (grande)
- Acciones opcionales

---

## 📋 Listas

---

### Tipos

- Lista simple
- Lista con input (checklist)
- Lista con acciones

---

### Reglas

- Separación clara
- Scroll vertical único
- No nested scrolls

---

## ➕ FAB (Floating Action Button)

---

### Uso

- Crear entidad principal

---

### Reglas

- Solo 1 por pantalla
- Posición: bottom-right
- Acción clara

---

## 🧭 Navigation Bar

---

### Tipo

Bottom Navigation

---

### Items

1. Productos
2. Inventario
3. Compras
4. Perfil

---

### Reglas

- Íconos + label
- Estado activo visible
- Persistente

---

## 🔔 Feedback UI

---

### Tipos

- Snackbar (acciones rápidas)
- Toast
- Modal
- Alert

---

### Uso

| Tipo     | Uso               |
| -------- | ----------------- |
| Snackbar | Confirmaciones    |
| Modal    | Acciones críticas |
| Alert    | Errores           |

---

# 📱 LAYOUTS PRINCIPALES

---

## 🧱 Layout Base

Estructura:
[ Header ]
[ Content Scrollable ]
[ FAB ]
[ Bottom Navigation ]

---

## 📋 Layout Lista

- Header simple
- Lista vertical
- FAB visible

---

## 🧾 Layout Formulario

- Inputs en columna
- Botón fijo abajo
- Scroll si es necesario

---

## 📊 Layout Dashboard

- Cards resumen
- Indicadores clave
- Acceso rápido

---

# 🧩 DISEÑO POR FEATURES

---

## 🔐 Autenticación

---

### Diseño

- Pantalla centrada
- Fondo limpio
- Card con formulario

---

### UX

- Autofocus en email
- Botón grande
- Feedback inmediato

---

## 📦 Productos

---

### Lista

Cada item debe mostrar:

- Nombre
- Unidad
- Stock mínimo
- Usuario asignado

---

### UX

- Swipe actions (editar/eliminar)
- Búsqueda rápida (fase 2)

---

## 📋 Inventario (CRÍTICO)

---

### Diseño tipo checklist

Cada producto:

Nombre producto
Stock inicial (small)
[ INPUT GRANDE ] ← foco principal

---

### Reglas UX

- Input automático (focus)
- Navegación rápida entre inputs
- Sin pantallas extra

---

### Objetivo

Registrar inventario en **< 5 minutos**

---

## 🛒 Compras

---

### Diseño

- Formulario simple
- Selección rápida de producto

---

### UX

- Autocomplete (fase 2)
- Últimos productos usados primero

---

## 📊 Lista de Compras

---

### Diseño

- Lista clara
- Indicadores visuales

---

### Estados

- Bajo stock → rojo
- Normal → gris

---

## 📈 Historial

---

### Diseño

- Tabla simple
- Scroll vertical

---

### UX

- Priorizar claridad sobre densidad

---

## 👤 Perfil

---

### Diseño

- Minimalista
- Información básica

---

# ♿ ACCESIBILIDAD

---

## Reglas obligatorias

- Contraste mínimo AA
- Tamaño mínimo de touch: 44px
- Labels visibles (no solo íconos)
- Navegación clara

---

## Opcional (fase 2)

- Modo oscuro
- Soporte lector de pantalla

---

# ⚡ PERFORMANCE UX

---

## Reglas

- Evitar loaders largos
- Usar skeletons si aplica
- Feedback inmediato siempre

---

# 🎯 CONSISTENCIA

---

## Reglas globales

- Mismo componente → mismo comportamiento
- Mismos colores → mismo significado
- Mismos inputs → misma estructura

---

# 🔥 PRINCIPIO FINAL

---

La UI debe sentirse como:

👉 Una hoja de inventario física, pero mejorada

- Más rápida
- Más clara
- Sin errores
- Sin fricción

---

Si el usuario tiene que pensar…

❌ El diseño está mal
