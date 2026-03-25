# Calculadora Web

Aplicación de calculadora construida con **Vite + HTML/CSS/JS vanilla**, sin frameworks ni librerías externas. Desarrollada como proyecto de práctica con Claude Code como copiloto de desarrollo.

---

## Descripción

Una calculadora funcional con diseño oscuro inspirado en iOS que permite realizar operaciones aritméticas básicas, consultar el historial de cálculos y operar tanto con el ratón como con el teclado.

---

## Cómo ejecutarlo

**Requisitos:** Node.js instalado.

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre el navegador en `http://localhost:5173`.

---

## Features implementadas

- **Operaciones básicas** — suma, resta, multiplicación y división
- **Display doble** — muestra la expresión en curso y el resultado actual
- **Historial de operaciones** — panel lateral que registra cada cálculo con su resultado
  - Las entradas más recientes aparecen arriba
  - Haz clic en una entrada para reutilizar el resultado
  - Botón "Borrar" para limpiar el historial
- **Manejo de errores** — muestra "Error: División por cero" en rojo al dividir entre 0
- **Pantalla limpia al pulsar operador** — el display se vacía para escribir el segundo número sin borrar manualmente
- **Soporte de teclado completo**

  | Tecla | Acción |
  |---|---|
  | `0`–`9` | Introduce dígito |
  | `+` `-` `*` `/` | Operador |
  | `Enter` o `=` | Calcula el resultado |
  | `Escape` | Limpia la pantalla (C) |
  | `.` | Añade decimal |
  | `Backspace` | Borra el último dígito |

- **Botones auxiliares** — `+/-` para cambiar signo y `%` para porcentaje
- **Arquitectura modular** — código separado en tres módulos independientes

---

## Estructura del proyecto

```
Calculadora/
├── index.html        # Markup y estructura de botones
├── style.css         # Estilos (diseño oscuro)
├── main.js           # Punto de entrada — orquesta eventos
├── calculator.js     # Lógica de cálculo y estado
├── history.js        # Gestión del historial
├── ui.js             # Manipulación del DOM
└── package.json      # Configuración de Vite
```

---

## Cómo usé Claude Code

### Prompts clave durante el desarrollo

El flujo de trabajo fue iterativo: cada funcionalidad se pidió en un prompt concreto y se subió a GitHub tras revisarla.

| Prompt | Resultado |
|---|---|
| *"Crea una app web de calculadora con Vite + HTML/CSS/JS vanilla"* | Generó la estructura completa con lógica, estilos y soporte de teclado desde el primer commit |
| *"Añade un panel lateral que muestre el historial de operaciones"* | Añadió el panel con scroll inverso, entradas clicables y botón de borrar |
| *"Hay un bug: si divido entre 0 la app falla"* | Identificó el punto exacto del código y añadió el mensaje "Error: División por cero" en rojo |
| *"Refactoriza el código separando la lógica en tres módulos"* | Separó todo en `calculator.js`, `history.js` y `ui.js` manteniendo `main.js` como punto de entrada |
| *"Que cuando pulses cualquier operador se limpie la pantalla"* | Modificó el estado y el display para vaciar el campo al seleccionar un operador |

### Modos de permiso utilizados

Claude Code tiene diferentes niveles de permiso para controlar qué acciones puede ejecutar automáticamente:

- **Modo por defecto (confirmación manual)** — usado durante todo el proyecto. Claude propone los cambios y el usuario los aprueba antes de ejecutarse. Útil para mantener control total sobre cada modificación al código.
- **Aprobación de comandos de terminal** — cada vez que Claude ejecutó `npm install`, `git add`, `git commit` o `git push`, el sistema pidió confirmación explícita antes de lanzarlos. Esto evita que se ejecuten comandos destructivos o no deseados.

### Slash commands usados

| Comando | Para qué sirve |
|---|---|
| `/status` | Muestra un resumen del estado actual de la sesión: archivos modificados, tareas en curso y contexto del proyecto. Lo usé para revisar el estado antes de hacer commits. |
| `/help` | Lista todos los comandos disponibles en Claude Code con una descripción breve de cada uno. Útil al empezar a usar la herramienta. |

### Lo que aprendí usando Claude Code como copiloto

**Prompts concretos dan mejores resultados.** Cuanto más específica era la petición ("muestra el error en rojo", "vacía el display al pulsar el operador"), más precisa era la solución generada, sin cambios innecesarios en el resto del código.

**Claude respeta el historial del proyecto.** Al pedir la refactorización, tuvo en cuenta todos los bugs ya corregidos y las features añadidas, integrándolos en la nueva arquitectura sin perder funcionalidad.

**El flujo git se integra de forma natural.** Pude combinar mensajes de commit propios (`git commit -m "feat: ..."`) con la generación de código, manteniendo un historial limpio y semántico desde el primer commit.

**Sirve para aprender, no solo para generar código.** Tras cada cambio, Claude explicó qué parte del código se modificó y por qué, lo que ayudó a entender decisiones de arquitectura como la separación en módulos o el uso de flags de estado (`waitingForSecond`, `justEvaluated`).
