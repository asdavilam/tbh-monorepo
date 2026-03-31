🎯 Propósito del Documento

Este documento define las violaciones arquitectónicas que deben evitarse estrictamente.

Cualquier código que incumpla estas reglas:
• Introduce acoplamiento innecesario
• Rompe Clean Architecture
• Genera inconsistencias en inventario
• Complica mantenimiento
• Puede provocar errores operativos reales

Estas reglas aplican tanto a desarrollo humano como asistido por IA.

⸻

🧱 REGLAS GLOBALES

⸻

❌ Dependencias inversas prohibidas

Nunca se permite que una capa dependa de una capa superior.

Flujo válido
UI (apps) → Application → Domain
↓
Infrastructure
Violaciones
• Domain importando React
• Domain importando Supabase
• Application importando componentes UI
• Infrastructure importando UseCases
• UI importando implementaciones concretas de repositorios

⸻

❌ Lógica de negocio fuera del dominio

Nunca implementar lógica de negocio en:
• Componentes React
• Hooks
• Servicios de infraestructura
• Mappers
• API calls

⸻

Ejemplos de violación
• Calcular diferencia de inventario en UI
• Determinar stock inicial en frontend
• Generar lista de compras en componentes
• Validar frecuencia de conteo en hooks

⸻

👉 Toda esta lógica pertenece a:
• Domain (reglas)
• Application (orquestación)

⸻

❌ Persistir datos derivados incorrectamente

Prohibido almacenar en base de datos:
• Diferencia calculada (si puede derivarse)
• Stock inicial (si depende del registro anterior)
• Listas de compras generadas automáticamente

⸻

Regla

La base de datos debe guardar:
• Datos fuente (conteo final, compras)

NO resultados calculados.

⸻

💾 INFRASTRUCTURE LAYER VIOLATIONS

⸻

❌ Importar capas superiores

Infrastructure nunca debe importar:
• React components
• Hooks
• UI logic
• UseCases

⸻

❌ Implementar lógica del negocio

Infrastructure NO puede:
• Calcular diferencias
• Definir stock inicial
• Evaluar reglas de frecuencia
• Determinar faltantes

⸻

❌ Acceso desorganizado a Supabase

Toda interacción con Supabase debe vivir exclusivamente en:
/packages/infrastructure/supabase/

Violaciones
• UI usando cliente de Supabase directamente
• UseCases llamando Supabase
• Código duplicado de queries

⸻

❌ Retornar estructuras incorrectas

Repositorios deben retornar:
• ✅ Entities del dominio
• ❌ Nunca raw JSON
• ❌ Nunca respuestas directas de Supabase

⸻

🧠 DOMAIN LAYER VIOLATIONS

⸻

❌ Dependencias externas prohibidas

Domain nunca debe importar:
• React
• Supabase
• Fetch / Axios
• Librerías externas
• Configuración de entorno

⸻

❌ Conocimiento de infraestructura

Domain NO puede conocer:
• Base de datos
• Tablas
• Esquemas SQL
• APIs externas

⸻

❌ Lógica incompleta del modelo de inventario

Violaciones críticas del modelo:
• Permitir inventario basado en movimientos
• No respetar que el stock inicial es derivado
• Mezclar compras con conteo directo sin reglas claras

⸻

👉 El modelo correcto SIEMPRE es:
• Conteo final
• Historial
• Diferencia derivada

⸻

❌ Uso incorrecto de unidades

Domain debe controlar:
• unit
• fraction
• qualitative

⸻

Violaciones
• Tratar valores cualitativos como numéricos
• Mezclar tipos sin validación
• Permitir operaciones inválidas entre unidades

⸻

⚙️ APPLICATION LAYER VIOLATIONS

⸻

❌ UseCases con múltiples responsabilidades

Cada UseCase debe hacer UNA sola cosa.

⸻

Violaciones
• UseCase que:
• registra inventario
• calcula lista de compras
• actualiza compras

⸻

❌ Lógica en UI en lugar de UseCases

Ejemplos prohibidos:
• Hook que calcula faltantes
• Componente que decide qué productos mostrar por frecuencia

⸻

❌ Dependencia de infraestructura directa

UseCases NO deben:
• Instanciar repositorios
• Acceder a Supabase
• Crear clientes

⸻

🖥 UI LAYER (React) VIOLATIONS

⸻

❌ Acceso directo a Supabase

Prohibido:
• fetch directo desde componentes
• usar cliente de Supabase en hooks de negocio

⸻

❌ Lógica de negocio en UI

Componentes NO deben:
• Calcular diferencias
• Definir stock inicial
• Evaluar reglas de inventario
• Generar lista de compras

⸻

❌ Hooks con lógica crítica

Hooks NO deben:
• Contener reglas del dominio
• Ejecutar cálculos de inventario

⸻

❌ Render basado en lógica incorrecta

Ejemplo:
• Mostrar productos sin respetar frecuencia
• Mostrar productos no asignados al usuario

⸻

🛒 INVENTORY-SPECIFIC VIOLATIONS (CRÍTICAS)

⸻

❌ Convertir el sistema en inventario por movimientos

Esto rompe completamente el diseño.

⸻

Violación
• Registrar entradas/salidas como base principal
• Ignorar conteo físico

⸻

👉 El sistema SIEMPRE es:
• Basado en conteo final
• No en movimientos

⸻

❌ No respetar el stock inicial derivado

Violación
• Permitir al usuario ingresar stock inicial manualmente
• No usar el último registro

⸻

❌ No respetar frecuencia de conteo

Violación
• Mostrar todos los productos todos los días
• Ignorar configuración de días

⸻

❌ No respetar asignación por usuario

Violación
• Usuario viendo productos que no le corresponden
• Mezcla de responsabilidades

⸻

❌ Compras sin impacto en inventario

Violación
• Registrar compra sin actualizar inventario

⸻

💉 DEPENDENCY INJECTION VIOLATIONS

⸻

❌ Crear dependencias dentro de UseCases

UseCases NO deben:
• Instanciar repositorios
• Crear clientes de Supabase

⸻

❌ Dependencias globales ocultas

Evitar:
• Singletons implícitos
• Variables globales

⸻

🧮 ERROR HANDLING VIOLATIONS

⸻

❌ Excepciones cruzando capas

Reglas
• DataSources → pueden lanzar errores
• Repository → captura y transforma
• UseCases → interpretan
• UI → solo reacciona

⸻

❌ UI manejando errores técnicos

UI nunca debe:
• Interpretar errores de Supabase
• Manejar códigos HTTP
• Procesar errores de red

⸻

🚨 VIOLACIONES CRÍTICAS (ROMPEN EL SISTEMA)

Estas deben considerarse errores graves:
• ❌ Implementar inventario basado en movimientos
• ❌ Calcular lógica de inventario en UI
• ❌ Domain usando Supabase
• ❌ UI accediendo directamente a DB
• ❌ Ignorar frecuencia de conteo
• ❌ Ignorar asignación por usuario
• ❌ No actualizar inventario tras compra
• ❌ Mezclar unidades sin control

⸻

🎯 PRINCIPIO FUNDAMENTAL

Si surge duda sobre dónde implementar algo:

👉 ¿Es una regla del negocio de inventario?
• SI → Domain Layer
• ES flujo → Application Layer
• ES visual → UI
• ES técnico (DB/API) → Infrastructure

⸻

🔥 NOTA FINAL

Este sistema es operativo, no solo técnico.

Una mala decisión arquitectónica aquí puede provocar:
• Inventario incorrecto
• Compras erróneas
• Pérdidas económicas
