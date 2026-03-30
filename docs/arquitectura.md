# Arquitectura — Calculadora Web

Resumen de cómo está organizado el proyecto y por qué.

---

## Módulos y responsabilidades

El proyecto usa cuatro módulos con responsabilidades estrictamente separadas:

| Archivo | Responsabilidad |
|---|---|
| `calculator.js` | Estado + lógica pura. **Nunca toca el DOM.** |
| `ui.js` | Actualiza `#result` y `#expression`. **Nunca calcula.** |
| `history.js` | Gestiona el panel lateral de historial. **Nunca calcula.** |
| `main.js` | Captura eventos y orquesta las otras capas. **No guarda estado.** |

---

## Estado centralizado

Todo el estado de la calculadora vive en el objeto `state` exportado desde `calculator.js`:

```js
export const state = {
  current: '0',           // Lo que se muestra en pantalla grande (siempre string)
  previous: null,         // Primer operando guardado
  operator: null,         // '+' | '-' | '*' | '/'
  justEvaluated: false,   // true justo después de '='; el siguiente número reinicia
  waitingForSecond: false, // true tras pulsar operador; la pantalla está vacía
};
```

Los demás módulos importan `state` por referencia. Ninguno guarda estado propio.

---

## Flujo de un cálculo completo

```
Usuario pulsa "5"
  → main.js → inputNumber('5') → state.current = '5'
  → ui.js → updateDisplay()

Usuario pulsa "+"
  → main.js → inputOperator('+') → state.previous = '5', state.operator = '+'
  → ui.js → updateDisplay(), updateExpression(), highlightOperator('+')

Usuario pulsa "3"
  → main.js → inputNumber('3') → state.current = '3'
  → ui.js → updateDisplay()

Usuario pulsa "="
  → main.js → handleCalculate()
  → calculator.js → calculate() → devuelve { exprText: '5 + 3', result: 8 }
  → ui.js → updateDisplay(), updateExpression()
  → history.js → addEntry('5 + 3', '8')
```

---

## Convención de botones en el HTML

Cada botón usa atributos `data-*` para identificar su acción:

```html
<button class="btn" data-action="number" data-value="7">7</button>
<button class="btn btn--operator" data-action="operator" data-value="+">+</button>
<button class="btn btn--equals" data-action="equals">=</button>
```

`main.js` usa **event delegation** en el contenedor `.buttons`: un único listener gestiona los 19 botones leyendo `dataset.action` y `dataset.value`.

---

## Por qué `state.current` es un string

Almacenar el valor mostrado como `number` causa problemas:

- `1.` (decimal pendiente) se convierte a `1`, perdiendo el punto
- Floats como `0.1 + 0.2` acumulan error de precisión visible en pantalla
- No hay forma de distinguir `"0"` (inicial) de `0` (resultado de cálculo)

Como string, la pantalla muestra exactamente lo que el usuario escribe. La conversión a `parseFloat` ocurre solo en `calculate()`, justo antes de operar.

---

## Decisiones de arquitectura detalladas

Ver `docs/architecture.md` para los ADRs completos (en inglés) con alternativas consideradas y consecuencias de cada decisión.
