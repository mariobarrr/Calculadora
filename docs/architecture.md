# Decisiones de Arquitectura — Calculadora Web

Registro de decisiones de arquitectura (ADR) del proyecto. Cada entrada documenta una decisión significativa: el contexto, las alternativas consideradas y las razones de la elección.

---

## ADR-001 — Vanilla JS sin framework

**Estado:** Aceptado
**Fecha:** 2025

### Contexto

Es el primer proyecto construido con Claude Code como copiloto. El objetivo es aprender el flujo de trabajo humano-IA sobre una base técnica conocida.

### Decisión

Usar HTML, CSS y JavaScript puro (ES6 modules) sin ningún framework de UI.

### Alternativas consideradas

| Alternativa | Razón de descarte |
|---|---|
| React | Overhead innecesario para una app de una sola pantalla sin estado complejo |
| Vue | Misma razón; añade una capa de abstracción que oculta el DOM real |
| Svelte | Requiere compilación adicional y curva de aprendizaje |

### Consecuencias

- El código del DOM es más verboso (`document.getElementById`, `classList.toggle`)
- No hay reactividad automática: cada cambio de estado requiere llamar manualmente a `updateDisplay()`
- La arquitectura es completamente transparente y fácil de leer sin conocer ningún framework

---

## ADR-002 — Estado centralizado en un único módulo

**Estado:** Aceptado
**Fecha:** 2025

### Contexto

Con múltiples módulos (`main.js`, `ui.js`, `history.js`) existe el riesgo de que el estado se fragmente o duplique entre ellos.

### Decisión

Todo el estado de la calculadora vive en el objeto `state` exportado desde `calculator.js`. El resto de módulos lo importan por referencia y nunca guardan estado propio.

```js
// calculator.js — única fuente de verdad
export const state = {
  current: '0',
  previous: null,
  operator: null,
  justEvaluated: false,
  waitingForSecond: false,
};
```

### Alternativas consideradas

| Alternativa | Razón de descarte |
|---|---|
| Estado distribuido en cada módulo | Difícil de sincronizar; fuente de bugs |
| Estado en `main.js` pasado como parámetro | Convierte `main.js` en un god module |
| `localStorage` como estado | Innecesario para estado efímero de sesión |

### Consecuencias

- `calculator.js` es el único módulo con lógica de negocio
- Los demás módulos son capas de presentación puras
- `state` es mutable y compartido por referencia: cualquier módulo podría modificarlo, lo que requiere disciplina (solo `calculator.js` y `main.js` lo hacen intencionalmente)

---

## ADR-003 — Separación estricta en tres capas

**Estado:** Aceptado
**Fecha:** 2025

### Contexto

El código inicial tenía toda la lógica mezclada: cálculo, DOM y historial en el mismo archivo. Esto dificultaba leer, modificar y razonar sobre el código.

### Decisión

Refactorizar en cuatro archivos con responsabilidades exclusivas:

| Archivo | Responsabilidad única |
|---|---|
| `calculator.js` | Estado + lógica de cálculo. **Nunca toca el DOM.** |
| `ui.js` | Actualiza los elementos `#result` y `#expression`. **Nunca calcula.** |
| `history.js` | Gestiona el DOM del panel historial. **Nunca calcula.** |
| `main.js` | Captura eventos, llama a las otras capas en orden. **No guarda estado propio.** |

### Alternativas consideradas

| Alternativa | Razón de descarte |
|---|---|
| Un único archivo | Difícil de mantener al crecer; mezcla conceptos distintos |
| Separar por tipo de archivo (MVC estricto) | Innecesario a esta escala; añade burocracia sin beneficio real |

### Consecuencias

- Añadir una nueva operación solo requiere tocar `calculator.js` y el HTML
- Cambiar el diseño visual solo requiere tocar `style.css` y `ui.js`
- El flujo es predecible: evento → lógica → DOM (siempre en ese orden)

---

## ADR-004 — Event delegation en el grid de botones

**Estado:** Aceptado
**Fecha:** 2025

### Contexto

La calculadora tiene 19 botones. Hay que decidir cómo gestionar sus eventos.

### Decisión

Un único listener en el contenedor `.buttons`, con `e.target.closest('.btn')` para identificar el botón pulsado. El tipo de acción se lee del atributo `data-action` del botón.

```js
document.querySelector('.buttons').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  const { action, value } = btn.dataset;
  // ...
});
```

### Alternativas consideradas

| Alternativa | Razón de descarte |
|---|---|
| Un listener por botón (×19) | Más memoria, más código repetitivo |
| Listeners por clase CSS | Rompe separación entre estilos y comportamiento |

### Consecuencias

- Añadir un botón nuevo solo requiere añadir el HTML con el `data-action` correcto; el JS no cambia
- `e.target.closest('.btn')` es necesario porque el texto dentro del botón puede ser el target real del click

---

## ADR-005 — Historial solo en memoria de sesión

**Estado:** Aceptado
**Fecha:** 2025

### Contexto

El historial de operaciones podría persistirse entre sesiones del navegador.

### Decisión

El historial vive solo en el DOM durante la sesión. Al recargar la página, se pierde. No se usa `localStorage` ni ningún mecanismo de persistencia.

### Alternativas consideradas

| Alternativa | Razón de descarte |
|---|---|
| `localStorage` | Añade complejidad (serialización, límite de 5MB, sincronización con DOM) para un beneficio marginal en esta fase |
| `sessionStorage` | Similar a `localStorage`; mismo trade-off |
| Backend / base de datos | Fuera del alcance del proyecto |

### Consecuencias

- La implementación de `history.js` es simple: solo manipulación de DOM
- Si se decide añadir persistencia en el futuro, es un cambio aislado en `history.js` sin afectar al resto

---

## ADR-006 — Vite como build tool

**Estado:** Aceptado
**Fecha:** 2025

### Contexto

El proyecto usa ES6 modules, que requieren ser servidos desde un servidor HTTP (no se pueden abrir directamente como `file://`). Se necesita un servidor de desarrollo.

### Decisión

Usar Vite 5.x como único build tool y servidor de desarrollo.

### Alternativas consideradas

| Alternativa | Razón de descarte |
|---|---|
| `http-server` o `live-server` | No procesa módulos; requiere configuración adicional para HMR |
| Webpack | Configuración más compleja para un proyecto tan pequeño |
| Parcel | Buena opción, pero Vite tiene mejor rendimiento y es más estándar actualmente |
| Sin build tool (importmaps) | Requiere soporte explícito en el HTML y no está soportado en todos los entornos |

### Consecuencias

- `npm install` instala solo Vite como devDependency (sin dependencias de producción)
- `npm run build` genera un `dist/` optimizado listo para desplegar en cualquier servidor estático
- HMR (Hot Module Replacement) durante el desarrollo: los cambios se reflejan sin recargar la página

---

## ADR-007 — `state.current` como string, no como número

**Estado:** Aceptado
**Fecha:** 2025

### Contexto

El valor mostrado en pantalla podría almacenarse como `number` o como `string`.

### Decisión

`state.current` es siempre un `string`. La conversión a `number` ocurre solo en `calculate()` con `parseFloat`.

### Razón

Almacenar como `number` causa problemas inmediatos con la entrada del usuario:

```js
// Si current fuera number:
current = 1;
current = current * 10 + 2; // → 12 ✓, pero...
current = 1.0;               // → no hay forma de distinguir "1." de "1"
current = 0.1 + 0.2;        // → 0.30000000000000004 (punto flotante)
```

Como `string`, la pantalla muestra exactamente lo que el usuario escribe, sin conversiones intermedias.

### Consecuencias

- `state.current` puede ser `"0"`, `"1."`, `"0.5"`, `"-42"` o `"Error: División por cero"`
- Hay que validar con `parseFloat` y manejar `NaN` antes de operar
- El resultado se convierte de vuelta a string con `parseFloat(result.toFixed(10)).toString()` para eliminar trailing zeros y limitar decimales
