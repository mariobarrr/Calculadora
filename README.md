# Calculadora Web

Calculadora de operaciones aritméticas con tema oscuro inspirado en iOS. Construida con **Vite + HTML/CSS/JS vanilla**, sin frameworks ni librerías externas.

---

## Capturas

> Calculadora con panel de historial lateral, doble pantalla y cursor parpadeante.

```
┌─────────────────────────────────┐  ┌───────────────────┐
│         5 + 3 =                 │  │   HISTORIAL       │
│                          8|     │  │ ─────────────────  │
│  ┌───┬───┬───┬───┐              │  │  5 + 3            │
│  │ C │+/-│ % │ ÷ │              │  │           8       │
│  ├───┼───┼───┼───┤              │  │                   │
│  │ 7 │ 8 │ 9 │ × │              │  │  12 × 4           │
│  ├───┼───┼───┼───┤              │  │          48       │
│  │ 4 │ 5 │ 6 │ − │              │  │                   │
│  ├───┼───┼───┼───┤              │  │  [Borrar]         │
│  │ 1 │ 2 │ 3 │ + │              │  └───────────────────┘
│  ├───────┼───┼───┤              │
│  │   0   │ . │ = │              │
│  └───────┴───┴───┘              │
└─────────────────────────────────┘
```

---

## Características

- **Operaciones básicas** — suma, resta, multiplicación y división
- **Doble pantalla** — línea de expresión (ej. `5 + 3`) y resultado grande
- **Cursor parpadeante** — indicador visual naranja animado con CSS
- **Panel de historial** — registra cada cálculo; las entradas son clicables para reusar el resultado
- **Operaciones encadenadas** — al pulsar un operador con otro pendiente, calcula automáticamente
- **Botones auxiliares** — `+/-` (cambio de signo) y `%` (porcentaje)
- **Manejo de errores** — muestra `Error: División por cero` en rojo
- **Soporte de teclado completo** — ver tabla abajo

---

## Requisitos

- [Node.js](https://nodejs.org/) v18 o superior

---

## Instalación y uso

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd Calculadora

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

Abre el navegador en `http://localhost:5173`.

### Otros comandos

```bash
npm run build    # Compila para producción → carpeta dist/
npm run preview  # Vista previa del build de producción
```

---

## Uso

### Con ratón

Haz clic en los botones de la interfaz. El operador activo se resalta en blanco.
Haz clic en cualquier entrada del historial para cargar ese resultado en pantalla.

### Con teclado

| Tecla | Acción |
|---|---|
| `0` – `9` | Introducir dígito |
| `+` `-` `*` `/` | Seleccionar operador |
| `Enter` o `=` | Calcular resultado |
| `Escape` | Limpiar pantalla (C) |
| `.` | Añadir decimal |
| `Backspace` | Borrar último dígito |

---

## Estructura del proyecto

```
Calculadora/
├── index.html        # Estructura HTML y atributos data-action/data-value de botones
├── style.css         # Todos los estilos (tema oscuro, grid de botones, historial)
├── main.js           # Punto de entrada: captura eventos y orquesta los módulos
├── calculator.js     # Estado centralizado y lógica pura de cálculo
├── history.js        # Panel de historial: añadir entradas y botón borrar
├── ui.js             # Actualización del DOM (pantalla, expresión, resaltado)
├── package.json      # Configuración del proyecto y scripts de Vite
└── CLAUDE.md         # Referencia técnica completa para Claude Code
```

### Arquitectura modular

```
Evento (click / keydown)
        │
        ▼
    main.js          ← orquesta, no guarda estado
        │
        ├──▶ calculator.js   ← estado + lógica pura (sin DOM)
        │
        ├──▶ ui.js           ← actualiza pantalla y operador resaltado
        │
        └──▶ history.js      ← gestiona el panel lateral
```

El objeto `state` vive en `calculator.js` y es la única fuente de verdad. Ningún otro módulo guarda estado propio.

---

## Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| [Vite](https://vitejs.dev/) | 5.x | Build tool y servidor de desarrollo |
| HTML5 | — | Estructura y atributos `data-*` en botones |
| CSS3 | — | Estilos, Flexbox, CSS Grid, animaciones |
| JavaScript | ES6 (modules) | Lógica de la aplicación |

Sin dependencias de producción. La única devDependency es Vite.

---

## Desarrollo con Claude Code

Este proyecto se construyó usando [Claude Code](https://claude.ai/code) como copiloto de desarrollo. A continuación se documenta el flujo de trabajo real.

### Prompts clave durante el desarrollo

| Prompt | Resultado |
|---|---|
| *"Crea una app web de calculadora con Vite + HTML/CSS/JS vanilla"* | Generó la estructura completa con lógica, estilos y soporte de teclado desde el primer commit |
| *"Añade un panel lateral que muestre el historial de operaciones"* | Añadió el panel con scroll inverso, entradas clicables y botón de borrar |
| *"Hay un bug: si divido entre 0 la app falla"* | Identificó el punto exacto del código y añadió el mensaje de error en rojo |
| *"Refactoriza el código separando la lógica en módulos"* | Separó en `calculator.js`, `history.js` y `ui.js` manteniendo `main.js` como orquestador |
| *"Que cuando pulses cualquier operador se limpie la pantalla"* | Modificó el estado y el display para vaciar el campo al seleccionar un operador |

### Modos de permiso utilizados

- **Modo por defecto (confirmación manual)** — usado durante todo el proyecto. Claude propone cada cambio y el usuario lo aprueba antes de ejecutarlo, manteniendo control total.
- **Aprobación de comandos de terminal** — cada `npm install`, `git add`, `git commit` o `git push` requirió confirmación explícita para evitar acciones no deseadas.

### Lo que aprendí

**Prompts concretos dan mejores resultados.** Cuanto más específica era la petición, más precisa era la solución y menos código innecesario se generaba.

**Claude respeta el historial del proyecto.** Al pedir la refactorización, tuvo en cuenta todos los bugs corregidos y features añadidas previamente, integrándolos sin pérdida de funcionalidad.

**El flujo git se integra de forma natural.** Combinar commits propios con la generación de código permitió mantener un historial limpio y semántico desde el inicio.

**Sirve para aprender, no solo para generar código.** Tras cada cambio, Claude explicó qué se modificó y por qué, lo que ayudó a entender decisiones de arquitectura como la separación de módulos o el uso de flags de estado (`waitingForSecond`, `justEvaluated`).

---

## Estrategia de Contexto

_Esta sección documenta cómo se gestiona el contexto de Claude Code en este proyecto para trabajar con eficiencia entre sesiones._

### Archivos de contexto

| Archivo | Propósito |
|---|---|
| `CLAUDE.md` | Referencia técnica principal: stack, estructura, convenciones y estado actual |
| `docs/arquitectura.md` | Cómo están organizados los módulos y por qué |
| `docs/architecture.md` | ADRs detallados con alternativas consideradas (inglés) |
| `CLAUDE.local.md` | Preferencias personales del desarrollador (no versionado) |

### Flujo de trabajo entre sesiones

Cada sesión de trabajo comienza leyendo el `CLAUDE.md`. Esto permite a Claude retomar el proyecto desde cero sin perder información: conoce el estado actual de las funcionalidades, la estructura de archivos, las convenciones de código y los comandos necesarios para arrancar el proyecto.

El `CLAUDE.md` actúa como **memoria persistente entre sesiones**: aunque el contexto de la conversación se pierda al cerrar Claude Code, toda la información relevante para continuar el trabajo está documentada en ese archivo y se carga automáticamente al inicio de cada sesión.

### `/compact` vs `/clear`

Claude Code ofrece dos comandos para gestionar el contexto cuando la conversación crece:

| Comando | Qué hace | Cuándo usarlo |
|---|---|---|
| `/compact` | Resume el contexto manteniendo la información relevante del trabajo realizado | Cuando el contexto es largo pero quieres continuar la misma sesión sin perder el hilo |
| `/clear` | Borra todo el contexto completamente | Cuando vas a empezar una tarea totalmente nueva sin relación con lo anterior |

La diferencia clave: `/compact` es una **compresión** (mantiene coherencia), `/clear` es un **reset** (borrón y cuenta nueva). Usar `/clear` cuando el contexto aún es relevante significa perder el hilo de lo que se estaba construyendo y obligar a Claude a redescubrir el estado del proyecto desde los archivos.

### Ejemplo concreto: uso de `/compact` en la sesión 2

En la sesión 2 de este proyecto se implementaron tres funcionalidades seguidas:

1. Panel de historial con las últimas 5 operaciones y entradas clicables
2. Botones de porcentaje (`%`) y cambio de signo (`+/-`)
3. Toggle de tema oscuro / claro

Tras esas tres implementaciones, el historial de la conversación era extenso: incluía el código de cada cambio, las explicaciones, los mensajes de error encontrados y las correcciones aplicadas. En ese punto se usó `/compact` para resumir todo ese contexto y poder seguir trabajando en la misma sesión con eficiencia, sin perder la memoria de las decisiones tomadas ni el estado del código.

### Qué información se prioriza en el `CLAUDE.md`

Para que Claude pueda retomar el trabajo sin ambigüedades, el `CLAUDE.md` incluye:

- **Estado actual:** qué funcionalidades están implementadas y cuáles faltan, para no rehacer trabajo ya hecho ni proponer cambios ya descartados.
- **Estructura de archivos:** qué hace cada módulo y cuáles son sus responsabilidades exclusivas, para saber dónde añadir cada cambio.
- **Convenciones de código:** qué patrones seguir (sin TypeScript, sin frameworks, `state.current` como string, sin `innerHTML` con input del usuario, etc.) para que el código generado sea coherente con el existente.
- **Comandos útiles:** cómo arrancar el proyecto, compilarlo y previsualizarlo, para no tener que buscarlos en cada sesión.

### Checkpoints mediante commits

Cada commit relevante actúa como un **checkpoint** del proyecto. Si una nueva funcionalidad rompe algo o una refactorización sale mal, es posible volver a un estado estable conocido con `git checkout <hash>` o `git revert`.

Esta práctica combina bien con Claude Code: al hacer un commit tras cada funcionalidad completada y verificada, se garantiza que siempre hay un punto de retorno seguro antes de pedir el siguiente cambio. El historial de commits del proyecto refleja este patrón: cada funcionalidad tiene su propio commit con un mensaje descriptivo.

---

## Licencia

MIT
