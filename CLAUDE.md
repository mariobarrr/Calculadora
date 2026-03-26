@docs/architecture.md

# CLAUDE.md — Calculadora Web

Documento de referencia completo para que cualquier instancia de Claude entienda este proyecto sin explicación adicional.

---

## Proyecto

**Calculadora Web** es una aplicación de calculadora con tema oscuro inspirado en iOS, construida con Vanilla JavaScript (ES6 modules) y Vite como build tool. No usa ningún framework (sin React, Vue, ni Angular).

- **Idioma de la UI:** Español
- **Idioma del código:** Inglés (variables, funciones, comentarios)
- **Puerto de desarrollo:** `http://localhost:5173` (Vite por defecto)
- **Entorno:** Node.js + navegador moderno

### Funcionalidades implementadas

- Operaciones aritméticas: suma (`+`), resta (`-`), multiplicación (`*`), división (`/`)
- Porcentaje (`%`): divide el valor actual entre 100
- Cambio de signo (`+/-`)
- Números decimales (`.`)
- Doble pantalla: línea de expresión (pequeña, gris) + resultado (grande, blanco)
- Cursor parpadeante naranja (`|`) implementado con CSS `::after` + animación `blink`
- Panel de historial lateral: guarda cada cálculo completado, clicable para reusar el resultado
- Soporte de teclado completo
- Error de división por cero: muestra `"Error: División por cero"` en rojo
- Operadores encadenados: si hay operador pendiente al pulsar otro, calcula primero automáticamente

---

## Comandos Esenciales

```bash
npm install        # Instalar dependencias (solo Vite)
npm run dev        # Servidor de desarrollo en localhost:5173
npm run build      # Compilar para producción → carpeta dist/
npm run preview    # Vista previa del build de producción
```

No hay tests automatizados ni linter configurado.

---

## Arquitectura

El proyecto usa **módulos ES6** con separación estricta de responsabilidades. No hay estado global oculto fuera de `calculator.js`.

### Estructura de archivos

```
Calculadora/
├── index.html        # Estructura HTML y atributos data-action / data-value
├── style.css         # Todos los estilos (sin preprocesador)
├── main.js           # Punto de entrada: captura eventos y orquesta llamadas
├── calculator.js     # Estado + lógica pura de cálculo
├── ui.js             # Actualización del DOM (pantalla y resaltado de operadores)
├── history.js        # Panel de historial (DOM + evento de borrar)
├── package.json      # Solo Vite como devDependency
└── package-lock.json
```

### Flujo de datos

```
Evento (click/keydown)
    → main.js handler (ej. handleOperator)
        → calculator.js modifica state
        → ui.js actualiza DOM (updateDisplay, updateExpression, highlightOperator)
        → history.js añade entrada si hubo cálculo (addEntry)
```

### `calculator.js` — Estado y lógica

Exporta el objeto `state` (mutable, compartido por referencia) y funciones puras que lo modifican:

```js
state = {
  current: '0',        // String. Lo que se muestra en pantalla grande.
  previous: null,      // String. Primer operando guardado.
  operator: null,      // '+' | '-' | '*' | '/'
  justEvaluated: false,// true justo después de pulsar '='. El siguiente número reinicia.
  waitingForSecond: false, // true después de pulsar operador. La pantalla está vacía.
}
```

Funciones exportadas:
- `inputNumber(value)` — añade dígito a `state.current`
- `inputDecimal()` — añade `.` si no existe ya
- `inputOperator(op)` — guarda en `previous`, limpia `current`, encadena si había operador pendiente
- `calculate()` — opera `previous op current`, devuelve `{ exprText, result }` o `null`
- `clear()` — resetea todo el estado
- `toggleSign()` — invierte signo de `state.current`
- `percent()` — divide `state.current` entre 100
- `SYMBOLS` — mapa `{ '+': '+', '-': '−', '*': '×', '/': '÷' }` para display

`calculate()` devuelve `null` si el cálculo no es posible (faltan operandos). El resultado se trunca a 10 decimales con `parseFloat(result.toFixed(10)).toString()`.

### `main.js` — Orquestador de eventos

- Usa **event delegation** en `.buttons` para capturar todos los clicks de botones
- Los botones usan atributos `data-action` y `data-value` en el HTML para identificarse
- El handler de `Backspace` está directamente en `main.js` (manipula `state.current` directamente)
- `handleCalculate()` es el único lugar que llama a `addEntry()` del historial

### `ui.js` — Actualización del DOM

Referencia dos elementos del DOM al cargarse:
- `#result` — span del resultado grande
- `#expression` — span de la expresión pequeña

Clases CSS que aplica dinámicamente sobre `#result`:
- `.error` — texto rojo, fuente 16px (cuando `state.current` empieza con `"Error"`)
- `.small` — fuente 28px en vez de 42px (cuando hay más de 9 caracteres y no es error)
- `.placeholder` — altura mínima para que el display no colapse (cuando `state.current === ''`)

### `history.js` — Historial

- Añade `<li>` al `#historyList` con la expresión y el resultado
- El clic en un item llama al callback `onClickResult(result)` que `main.js` pasa: asigna el resultado a `state.current` y llama `updateDisplay()`
- Al borrar, reemplaza el innerHTML por el placeholder `<li class="history__empty">Sin operaciones aún</li>`
- Las entradas se muestran de más nueva a más antigua gracias a `flex-direction: column-reverse` en CSS (se hace append pero visualmente aparecen al principio)

### `index.html` — Convenciones de botones

Cada botón tiene `data-action` y opcionalmente `data-value`:

| `data-action` | `data-value` | Descripción |
|---|---|---|
| `number` | `"0"`–`"9"` | Dígito |
| `decimal` | — | Punto decimal |
| `operator` | `"+"`, `"-"`, `"*"`, `"/"` | Operador aritmético |
| `equals` | — | Calcular resultado |
| `clear` | — | Borrar todo (C) |
| `sign` | — | Cambiar signo (+/-) |
| `percent` | — | Porcentaje (%) |

El botón `0` y el botón `C` tienen clase `btn--wide` (ocupan 2 columnas en el grid).

### CSS — Paleta de colores y clases relevantes

| Elemento | Color / HEX |
|---|---|
| Fondo de página | `#1a1a2e` |
| Fondo calculadora e historial | `#16213e` |
| Fondo display | `#0f3460` |
| Botones normales | `#1a3a5c` |
| Botones secundarios (C, +/-, %) | `#2d4a6e`, texto `#a0d8ef` |
| Botones operador y `=` | `#e07b39` (naranja) |
| Operador activo (`.active`) | fondo blanco, texto naranja |
| Error | `#ff6b6b` |
| Cursor parpadeante | `#e07b39` (via `::after`) |

Clases de botón: `.btn`, `.btn--wide`, `.btn--secondary`, `.btn--operator`, `.btn--equals`

---

## Convenciones

- **Sin framework:** todo es DOM vanilla. No usar React, Vue ni ninguna librería de UI.
- **Sin TypeScript:** el proyecto es JS puro. No añadir `.ts` ni `tsconfig`.
- **Sin CSS preprocesador:** todo en `style.css` plano. No añadir Sass/Less.
- **Sin tests:** no hay setup de testing. No añadir Jest, Vitest, etc. salvo que se pida explícitamente.
- **Estado centralizado:** toda la lógica y estado vive en `calculator.js`. Las otras capas no guardan estado propio.
- **Separación de capas:** `ui.js` solo toca el DOM de pantalla; `history.js` solo toca el DOM del historial; `calculator.js` no toca el DOM nunca.
- **El operador interno es siempre `+`, `-`, `*`, `/`** (ASCII). La conversión a símbolo de display (`×`, `÷`, `−`) se hace con `SYMBOLS` al construir textos para el usuario.
- **`state.current` es siempre un string**, no un número. Las operaciones lo convierten con `parseFloat` al calcular.
- **Idioma:** los textos visibles al usuario van en español. El código (nombres de variables, funciones, comentarios) va en inglés.

---

## Qué NO debe hacer Claude

- **No añadir frameworks** (React, Vue, Angular, Svelte, etc.) sin que se pida explícitamente.
- **No añadir TypeScript** ni renombrar archivos a `.ts`.
- **No añadir librerías de estilos** (Tailwind, Bootstrap, etc.).
- **No introducir un store externo** (Redux, Zustand, etc.); el estado ya está centralizado en `calculator.js`.
- **No mover el estado** fuera de `calculator.js` ni duplicarlo en otros módulos.
- **No hacer que `calculator.js` toque el DOM** — eso rompe la separación de capas.
- **No usar `innerHTML` para insertar input del usuario** sin sanitizar — riesgo de XSS. (El historial usa `textContent` para la expresión y resultado numérico, lo cual es seguro.)
- **No añadir `console.log` de depuración** al código final.
- **No crear archivos nuevos** salvo que la funcionalidad lo justifique claramente y no quepa en los módulos existentes.
- **No cambiar la paleta de colores** sin que se pida — el diseño oscuro azul/naranja es intencional.
- **No añadir comentarios obvios** al código; solo comentar lógica no evidente.

---

## Estado Actual

El proyecto está **completo y funcional** como calculadora básica. No hay bugs conocidos.

### Lo que funciona

- Todas las operaciones aritméticas básicas
- Encadenado de operaciones (5 + 3 × 2 calcula 5+3=8 primero al pulsar ×)
- División por cero con mensaje de error
- Historial persistente en sesión (no en localStorage)
- Teclado completo incluyendo Backspace
- Cursor parpadeante
- Resaltado del operador activo

### Lo que NO está implementado (posibles mejoras futuras)

- Persistencia del historial (localStorage / sessionStorage)
- Operaciones avanzadas (raíz cuadrada, potencia, trigonometría)
- Responsive/mobile (el layout tiene ancho fijo de 320px + 220px)
- Tema claro / dark mode toggle
- Animaciones de transición entre pantallas
- Soporte para expresiones complejas con paréntesis
- Tests automatizados
