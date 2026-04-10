# 🎨 UI Design Specification – Web Pública (Trailer Burger Hall)

---

## 🎯 Objetivo del Documento

Definir el **diseño visual, experiencia de usuario (UX) y lineamientos de interfaz (UI)** de la página web pública orientada a clientes.

Este documento establece:

- Estilo visual (branding del negocio)
- Sistema de diseño (colores, tipografía, espaciado)
- Componentes UI
- Layouts por página
- Jerarquía visual
- Principios UX enfocados a conversión

❌ No define lógica de negocio  
❌ No define comportamiento técnico  
❌ No define estructura de backend

---

# 🧠 PRINCIPIOS DE DISEÑO

---

## 🎯 Filosofía General

La web debe sentirse como:

👉 **Una marca premium de hamburguesas artesanales**

La interfaz debe ser:

- **Visualmente atractiva (branding fuerte)**
- **Elegante y moderna**
- **Clara y directa**
- **Orientada a conversión (ver menú / contacto)**
- **Emocional (antojo + experiencia)**

---

## 🧩 Principios UX Clave

1. **Primero impacto visual (hero fuerte)**
2. **El usuario decide en < 5 segundos**
3. **Menú accesible en 1 clic**
4. **Contenido corto, directo y visual**
5. **Jerarquía clara (qué ver primero)**
6. **Call To Actions visibles siempre**

---

## 🚫 Anti-objetivos

- ❌ Diseño genérico tipo plantilla
- ❌ Exceso de texto
- ❌ Colores sin coherencia de marca
- ❌ Navegación confusa
- ❌ Secciones innecesarias
- ❌ Estética “barata”

---

# 🎨 SISTEMA DE DISEÑO

---

## 🎨 Paleta de Colores (Basada en tu diseño actual)

### 🎯 Identidad principal (IMPORTANTE CONSERVAR)

| Uso       | Color                        |
| --------- | ---------------------------- |
| Primary   | Vino oscuro (#5A1F1B aprox)  |
| Secondary | Beige claro (#EAE3D9 aprox)  |
| Accent    | Verde suave (#6FAF8D aprox)  |
| Highlight | Dorado tenue (#C9A46C aprox) |

---

### 🎯 Colores neutrales

| Uso        | Color                 |
| ---------- | --------------------- |
| Background | Beige claro           |
| Surface    | Blanco suave          |
| Text Main  | Café oscuro (#2A1A18) |
| Text Light | Gris medio            |

---

### 🎯 Uso de color

- Primary → Header, branding, footer
- Accent → Botones principales (CTA)
- Highlight → Bordes, detalles premium
- Background → Toda la página
- Surface → Cards

---

## 🔤 Tipografía

### 🎯 Estilo

Basado en tu diseño actual:

- **Serif elegante (para títulos)** → estilo clásico premium
- **Sans-serif limpia (para contenido)**

---

### 📌 Recomendación técnica

- Títulos: Playfair Display / Cinzel
- Body: Inter / Open Sans

---

### Jerarquía

| Nivel | Tamaño  | Uso            |
| ----- | ------- | -------------- |
| H1    | 48–64px | Hero principal |
| H2    | 32–40px | Secciones      |
| H3    | 20–24px | Cards          |
| Body  | 16–18px | Texto          |
| Small | 14px    | Secundario     |

---

### Reglas

- Máximo 2 fuentes
- Alto contraste
- Evitar párrafos largos
- Espaciado amplio entre líneas

---

## 📐 Espaciado

Sistema base:

- 8px → base
- 16px → estándar
- 24px → secciones internas
- 48px → separación de bloques
- 80–120px → separación de secciones grandes

---

## 🔘 Bordes y Estética

- Border radius: **16px (más premium)**
- Bordes dorados sutiles en cards
- Sombras suaves (no fuertes)
- Uso de overlays oscuros en imágenes

---

# 🧱 COMPONENTES UI

---

## 🔘 Botones

### Tipos

1. **Primary (CTA)**
   - Fondo verde suave
   - Texto blanco
   - Uso: “Ver Menú”

2. **Secondary**
   - Outline dorado
   - Fondo transparente
   - Uso: “Contacto”

3. **Ghost**
   - Solo texto
   - Uso: navegación

---

### Reglas

- Altura mínima: 44px
- Bordes redondeados
- Hover elegante (ligero brillo o cambio de tono)
- Transiciones suaves

---

## 🧭 Navbar

---

### Estructura

- Logo (izquierda)
- Navegación (derecha):
  - Inicio
  - Menú
  - Sobre nosotros
  - Contacto

---

### Comportamiento visual

- Sticky (se queda arriba)
- Fondo vino oscuro
- Texto claro
- Cambio leve al hacer scroll (más compacto)

---

## 🖼 Hero Section (CRÍTICO)

---

### Elementos

- Imagen de fondo (food truck / hamburguesas)
- Overlay oscuro
- Título grande (nombre del negocio)
- Subtítulo (propuesta de valor)
- Botones CTA:
  - Ver menú
  - Contacto

---

### Objetivo

👉 Generar antojo + identidad de marca

---

## 📦 Cards (Sección “¿Por qué elegirnos?”)

---

### Estructura

- Ícono
- Título
- Descripción corta

---

### Estilo

- Fondo blanco
- Bordes dorados
- Sombra suave
- Iconografía simple

---

## 🍔 Cards de Menú

---

### Elementos

- Imagen del producto
- Nombre
- Descripción breve
- Precio

---

### Reglas

- Imagen protagonista
- Texto mínimo
- Grid responsivo

---

## 🗺 Sección Contacto

---

### Elementos

- Dirección
- Horarios
- Teléfono / WhatsApp
- Botón “Cómo llegar”

---

### Opcional

- Mapa embebido

---

## 🧾 Footer

---

### Contenido

- Logo
- Redes sociales
- Derechos
- Links rápidos

---

### Estilo

- Fondo oscuro
- Texto claro
- Minimalista

---

# 📱 LAYOUTS PRINCIPALES

---

## 🏠 Página: Inicio

---

### Estructura

1. Navbar
2. Hero
3. Sección “¿Por qué elegirnos?”
4. Testimonios
5. CTA (Ver menú)
6. Footer

---

## 🍔 Página: Menú

---

### Estructura

1. Header simple
2. Categorías (opcional)
3. Grid de productos
4. CTA contacto/pedido

---

### UX

- Scroll vertical
- Fácil de escanear
- Visual primero, texto después

---

## 👨‍🍳 Página: Sobre Nosotros

---

### Contenido

- Historia del negocio
- Filosofía
- Fotos reales

---

### UX

- Storytelling corto
- Visual emocional

---

## 📞 Página: Contacto

---

### Contenido

- Información directa
- Botones de acción (llamar / WhatsApp)
- Mapa

---

# ♿ ACCESIBILIDAD

---

## Reglas

- Contraste suficiente (texto vs fondo)
- Botones grandes
- Texto legible
- Navegación clara

---

# ⚡ PERFORMANCE UX

---

## Reglas

- Imágenes optimizadas
- Carga rápida del hero
- Lazy loading en menú
- Evitar animaciones pesadas

---

# 🎯 CONSISTENCIA

---

## Reglas globales

- Mismo estilo de botones en toda la app
- Mismos colores = mismo significado
- Tipografía consistente
- Espaciado uniforme

---

# 🔥 PRINCIPIO FINAL

---

La web debe sentirse como:

👉 **Una marca premium, artesanal y confiable**

Debe provocar:

- Antojo
- Confianza
- Claridad
- Acción rápida

---

Si el usuario entra y no quiere ver el menú en menos de 3 segundos…

❌ El diseño está fallando
