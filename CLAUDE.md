@docs/architecture.md

# CLAUDE.md — Calculadora Web

Referencia rápida para cualquier instancia de Claude que trabaje en este proyecto.

---

## Descripción del proyecto

**Calculadora Web** es una aplicación de calculadora con tema oscuro/claro inspirado en iOS. Construida con HTML, CSS y JavaScript vanilla (ES6 modules) usando Vite como build tool. Sin frameworks, sin librerías de UI.

Funcionalidades implementadas:
- Operaciones aritméticas: `+`, `-`, `*`, `/`
- Porcentaje (`%`) y cambio de signo (`+/-`)
- Números decimales
- Doble pantalla: línea de expresión (gris, pequeña) + resultado (blanco, grande)
- Cursor parpadeante naranja animado con CSS
- Panel de historial lateral con entradas clicables (últimas 5 operaciones)
- Operadores encadenados (calcula automáticamente si hay operador pendiente)
- Error de división por cero mostrado en rojo
- Soporte de teclado completo (0–9, operadores, Enter, Escape, Backspace)
- Toggle de tema oscuro / claro (botón sobre la calculadora)

---

## Stack técnico

| Tecnología | Versión | Uso |
|---|---|---|
| Vite | 5.x | Build tool y servidor de desarrollo |
| HTML5 | — | Estructura y atributos `data-action` / `data-value` en botones |
| CSS3 | — | Estilos, Grid, Flexbox, animaciones |
| JavaScript | ES6 modules | Lógica de la aplicación |

Sin dependencias de producción. La única `devDependency` es Vite.

- **Idioma de la UI:** Español
- **Idioma del código:** Inglés (variables, funciones, comentarios)
- **Puerto de desarrollo:** `http://localhost:5173`

---

## Estructura de archivos

```
Calculadora/
├── index.html        # Estructura HTML; botones con data-action y data-value
├── style.css         # Todos los estilos (sin preprocesador)
├── main.js           # Punto de entrada: captura eventos, orquesta módulos
├── calculator.js     # Estado centralizado + lógica pura de cálculo
├── ui.js             # Actualización del DOM (pantalla, expresión, operador activo)
├── history.js        # Panel de historial (DOM + borrar)
├── docs/
│   ├── architecture.md  # ADRs: decisiones de arquitectura (inglés)
│   └── arquitectura.md  # Resumen de arquitectura (español)
├── CLAUDE.md         # Este archivo
├── package.json
└── package-lock.json
```

Flujo de datos:

```
Evento (click / keydown)
    → main.js
        → calculator.js  (modifica state)
        → ui.js          (actualiza DOM de pantalla)
        → history.js     (añade entrada si hubo cálculo)
```

---

## Estado actual

### Qué está hecho

- Todas las operaciones aritméticas básicas
- Encadenado de operaciones
- División por cero con mensaje de error
- Historial de las últimas 5 operaciones, persistente en sesión (no en localStorage)
- Teclado completo incluyendo Backspace
- Cursor parpadeante naranja
- Resaltado del operador activo
- Toggle de tema oscuro / claro con CSS custom properties en `:root` y `:root.light`

### Qué falta (posibles mejoras futuras)

- Persistencia del historial con `localStorage` / `sessionStorage`
- Diseño responsive / mobile (layout actual tiene ancho fijo 320 px + 220 px)
- Operaciones avanzadas (raíz cuadrada, potencia, trigonometría)
- Soporte para expresiones con paréntesis
- Tests automatizados

---

## Convenciones de código

- **Sin framework:** todo es DOM vanilla. No añadir React, Vue, Angular, etc.
- **Sin TypeScript:** JS puro. No añadir `.ts` ni `tsconfig`.
- **Sin CSS preprocesador:** todo en `style.css`. No añadir Sass/Less.
- **Estado centralizado:** toda la lógica y el estado viven en `calculator.js`. Las otras capas no guardan estado propio.
- **Separación de capas:**
  - `calculator.js` nunca toca el DOM
  - `ui.js` solo actualiza la pantalla; nunca calcula
  - `history.js` solo gestiona el panel lateral; nunca calcula
  - `main.js` orquesta; no guarda estado propio
- **`state.current` es siempre un string**, no un número. La conversión a `parseFloat` ocurre solo en `calculate()`.
- **Los operadores internos son `+`, `-`, `*`, `/`** (ASCII). La conversión a símbolo de display (`×`, `÷`, `−`) se hace con `SYMBOLS`.
- **Sin `console.log`** en código final.
- **Sin `innerHTML` con input del usuario** (riesgo XSS). Usar `textContent`.
- Comentarios solo donde la lógica no sea evidente.

---

## Comandos útiles

```bash
npm install        # Instalar dependencias (solo Vite)
npm run dev        # Servidor de desarrollo → http://localhost:5173
npm run build      # Compilar para producción → carpeta dist/
npm run preview    # Vista previa del build de producción
```

No hay tests automatizados ni linter configurado.
