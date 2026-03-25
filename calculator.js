export const SYMBOLS = { '+': '+', '-': '−', '*': '×', '/': '÷' };

export const state = {
  current: '0',
  previous: null,
  operator: null,
  justEvaluated: false,
  waitingForSecond: false,
};

export function inputNumber(value) {
  if (state.justEvaluated || state.waitingForSecond) {
    state.current = value;
    state.justEvaluated = false;
    state.waitingForSecond = false;
  } else {
    state.current =
      state.current === '0' ? value : state.current + value;
  }
}

export function inputDecimal() {
  if (state.justEvaluated || state.waitingForSecond) {
    state.current = '0.';
    state.justEvaluated = false;
    state.waitingForSecond = false;
    return;
  }
  if (!state.current.includes('.')) {
    state.current += '.';
  }
}

export function inputOperator(op) {
  if (state.operator && !state.justEvaluated) {
    calculate();
  }
  state.previous = state.current || state.previous;
  state.current = '';
  state.operator = op;
  state.justEvaluated = false;
  state.waitingForSecond = true;
}

export function calculate() {
  if (state.previous === null || state.operator === null || state.current === '') return null;

  const a = parseFloat(state.previous);
  const b = parseFloat(state.current);

  let result;
  switch (state.operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/':
      result = b === 0 ? 'Error: División por cero' : a / b;
      break;
  }

  const exprText = `${state.previous} ${SYMBOLS[state.operator]} ${state.current}`;
  const isError = typeof result === 'string';
  const resultStr = isError ? result : parseFloat(result.toFixed(10)).toString();

  state.current = resultStr;
  state.previous = null;
  state.operator = null;
  state.justEvaluated = true;
  state.waitingForSecond = false;

  return { exprText, result: resultStr };
}

export function clear() {
  state.current = '0';
  state.previous = null;
  state.operator = null;
  state.justEvaluated = false;
  state.waitingForSecond = false;
}

export function toggleSign() {
  if (state.current === '0' || state.current.startsWith('Error')) return;
  state.current = state.current.startsWith('-')
    ? state.current.slice(1)
    : '-' + state.current;
}

export function percent() {
  const value = parseFloat(state.current);
  if (isNaN(value)) return;
  state.current = (value / 100).toString();
}
