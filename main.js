import {
  state,
  SYMBOLS,
  inputNumber,
  inputDecimal,
  inputOperator,
  calculate,
  clear,
  toggleSign,
  percent,
} from './calculator.js';

import { addEntry, initClearButton } from './history.js';
import { updateDisplay, updateExpression, highlightOperator, clearOperatorHighlight } from './ui.js';

initClearButton();

const themeToggleBtn = document.getElementById('themeToggle');
let isDark = true;

themeToggleBtn.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.classList.toggle('light', !isDark);
  themeToggleBtn.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
});

function handleNumber(value) {
  inputNumber(value);
  updateDisplay();
}

function handleDecimal() {
  inputDecimal();
  updateDisplay();
}

function handleOperator(op) {
  inputOperator(op);
  updateExpression(`${state.previous} ${SYMBOLS[op]}`);
  highlightOperator(op);
  updateDisplay();
}

function handleCalculate() {
  const result = calculate();
  if (!result) return;
  updateExpression(`${result.exprText} =`);
  addEntry(result.exprText, result.result, (val) => {
    state.current = val;
    state.justEvaluated = true;
    updateDisplay();
  });
  clearOperatorHighlight();
  updateDisplay();
}

function handleClear() {
  clear();
  updateExpression('');
  clearOperatorHighlight();
  updateDisplay();
}

function handleToggleSign() {
  toggleSign();
  updateDisplay();
}

function handlePercent() {
  percent();
  updateDisplay();
}

// Button clicks
document.querySelector('.buttons').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const { action, value } = btn.dataset;

  switch (action) {
    case 'number':   handleNumber(value); break;
    case 'decimal':  handleDecimal(); break;
    case 'operator': handleOperator(value); break;
    case 'equals':   handleCalculate(); break;
    case 'clear':    handleClear(); break;
    case 'sign':     handleToggleSign(); break;
    case 'percent':  handlePercent(); break;
  }
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9')              handleNumber(e.key);
  else if (e.key === '.')                         handleDecimal();
  else if (['+', '-', '*', '/'].includes(e.key)) handleOperator(e.key);
  else if (e.key === 'Enter' || e.key === '=')   handleCalculate();
  else if (e.key === 'Escape')                   handleClear();
  else if (e.key === 'Backspace') {
    if (state.current.length > 1 && !state.justEvaluated) {
      state.current = state.current.slice(0, -1);
    } else {
      state.current = '0';
    }
    updateDisplay();
  }
});
