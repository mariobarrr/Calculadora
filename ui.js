import { SYMBOLS, state } from './calculator.js';

const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');

export function updateDisplay() {
  resultEl.textContent = state.current;
  const isError = state.current.startsWith('Error');
  resultEl.classList.toggle('error', isError);
  resultEl.classList.toggle('small', !isError && state.current.length > 9);
  resultEl.classList.toggle('placeholder', state.current === '');
}

export function updateExpression(text) {
  expressionEl.textContent = text;
}

export function highlightOperator(activeOp) {
  document.querySelectorAll('.btn--operator').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === activeOp);
  });
}

export function clearOperatorHighlight() {
  document.querySelectorAll('.btn--operator').forEach(btn =>
    btn.classList.remove('active')
  );
}

export function getExpressionText() {
  return `${state.previous} ${SYMBOLS[state.operator]}`;
}
