📦 Product Definition – App de Inventario para Negocio de Hamburguesas

⸻

🎯 Nombre Provisional

(Definir posteriormente)

⸻

🧩 Descripción del Producto

Aplicación web enfocada en ayudar a negocios de comida a:
• Gestionar inventario basado en conteo real
• Registrar inventario diario de forma rápida
• Controlar insumos, desechables y básicos operativos
• Detectar faltantes automáticamente
• Generar listas de compra de forma visual

El sistema replica el flujo físico en papel, priorizando rapidez, claridad y mínima fricción operativa.

⸻

🚀 Objetivo del Producto

Permitir que el negocio pueda:
• Tener control claro del inventario real
• Reducir errores humanos en conteo
• Delegar el inventario por áreas (usuarios)
• Detectar faltantes sin cálculos manuales

Sin necesidad de conocimientos técnicos o sistemas complejos.

⸻

👥 Usuario Objetivo

La aplicación está diseñada para:
• Negocios de comida (principalmente hamburguesas)
• Operaciones pequeñas o medianas
• Equipos de trabajo reducidos
• Negocios con inventario manual actual

⸻

❌ Alcance Negativo (MUY IMPORTANTE)

La aplicación NO debe incluir en V1:
• Sistema de ventas (POS)
• Facturación
• Contabilidad
• Gestión de proveedores compleja
• Órdenes de compra formales
• Multi-sucursal
• Inventario basado en movimientos complejos
• Predicciones avanzadas
• Offline mode

Evitar convertir el sistema en ERP.

⸻

✅ Funcionalidades V1 (Core)

🔐 Autenticación
• Login
• Persistencia de sesión
• Control por roles

⸻

👥 Roles
• Admin
• Control total
• Puede editar inventarios
• Encargado
• Registra inventario
• Gestiona compras
• Trabajador
• Solo registra conteos
• Solo ve productos asignados

⸻

📦 Productos (Insumos)

El usuario puede:
• Crear productos
• Editar productos
• Eliminar productos

Cada producto define:
• Tipo:
• Materia prima
• Desechable
• Básico (sal, aceite, etc.)
• Unidad:
• Unidad (pz)
• Fracción (g, l)
• Cualitativo (mucho, poco, nada)
• Frecuencia de conteo:
• Diario
• Días específicos
• Usuario asignado
• Stock mínimo

⸻

📋 Registro de Inventario (CORE DEL SISTEMA)

El usuario puede:
• Ver solo productos asignados
• Registrar conteo diario
• Ingresar stock final

El sistema:
• Calcula automáticamente el stock inicial (del último registro)
• Calcula diferencia entre días

⸻

🔁 Regla Crítica de Inventario
• El sistema NO maneja movimientos
• El inventario es basado en conteo final
• El stock inicial siempre es derivado del registro anterior

⸻

📅 Frecuencia de Conteo

El sistema permite:
• Definir días específicos por producto
• Mostrar solo productos que deben contarse ese día

⸻

🛒 Lista de Compras

El sistema:
• Genera lista automática basada en:
• Stock actual
• Stock mínimo
• Permite agregar productos manualmente (Admin/Encargado)

⸻

➕ Registro de Compras

El usuario puede:
• Registrar cantidad comprada

El sistema:
• Actualiza automáticamente el inventario actual

⸻

📊 Historial

El usuario puede:
• Ver historial por producto
• Ver diferencias entre días
• Detectar inconsistencias

⸻

🧠 Principios de Diseño del Producto 1. Simplicidad sobre complejidad 2. Basado en conteo real (no teórico) 3. Evitar cálculos manuales del usuario 4. UX rápida tipo checklist 5. Separación de responsabilidades por usuario 6. Minimizar errores humanos 7. Adaptado al flujo físico existente

⸻

⚠️ Restricciones Técnicas Globales
• Online-first
• Backend con Supabase
• Arquitectura Clean Architecture
• Monorepo (multi-app)
• No lógica de negocio en UI
• No persistir datos derivados innecesarios
• Seguridad basada en roles

⸻

🧱 Estructura del Producto

Apps
• inventory-app → sistema principal
• web-public → landing page

⸻

Web Pública (V1)

Debe incluir únicamente:
• Nombre del negocio
• Mensaje “En construcción”
• Diseño básico responsive

⸻

🧱 Escalabilidad Futura (NO IMPLEMENTAR EN V1)

Posibles extensiones:
• POS (sistema de ventas)
• Integración con pedidos online
• Reportes avanzados
• Predicción de consumo
• Multi-sucursal
• Alertas inteligentes
• Offline mode

Estas NO deben afectar decisiones actuales.

⸻

🎯 Métrica de Éxito de V1

La app es exitosa si:
• El inventario diario se registra en menos de 5 minutos
• Los usuarios entienden el sistema sin capacitación
• Se reducen errores de conteo
• La lista de compras refleja necesidades reales
• El sistema se usa diariamente

NO se mide por cantidad de funcionalidades.

⸻

🚨 Regla Fundamental del Proyecto

Antes de agregar cualquier funcionalidad:

¿Esto hace el sistema más complicado de usar en el día a día?

Si la respuesta es sí → NO IMPLEMENTAR.
