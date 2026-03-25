const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');

const state = {
  current: '0',
  previous: null,
  operator: null,
  justEvaluated: false,
};

function updateDisplay() {
  resultEl.textContent = state.current;
  resultEl.classList.toggle('small', state.current.length > 9);
}

function inputNumber(value) {
  if (state.justEvaluated) {
    state.current = value;
    state.justEvaluated = false;
  } else {
    state.current =
      state.current === '0' ? value : state.current + value;
  }
  updateDisplay();
}

function inputDecimal() {
  if (state.justEvaluated) {
    state.current = '0.';
    state.justEvaluated = false;
    updateDisplay();
    return;
  }
  if (!state.current.includes('.')) {
    state.current += '.';
    updateDisplay();
  }
}

function inputOperator(op) {
  if (state.operator && !state.justEvaluated) {
    calculate();
  }
  state.previous = state.current;
  state.operator = op;
  state.justEvaluated = false;

  const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  expressionEl.textContent = `${state.previous} ${symbols[op]}`;

  document.querySelectorAll('.btn--operator').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === op);
  });
}

function calculate() {
  if (state.previous === null || state.operator === null) return;

  const a = parseFloat(state.previous);
  const b = parseFloat(state.current);
  const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };

  let result;
  switch (state.operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/':
      result = b === 0 ? 'Error' : a / b;
      break;
  }

  const exprText = `${state.previous} ${symbols[state.operator]} ${state.current}`;
  expressionEl.textContent = `${exprText} =`;

  state.current =
    result === 'Error'
      ? 'Error'
      : parseFloat(result.toFixed(10)).toString();

  addToHistory(exprText, state.current);
  state.previous = null;
  state.operator = null;
  state.justEvaluated = true;

  document.querySelectorAll('.btn--operator').forEach(btn =>
    btn.classList.remove('active')
  );

  updateDisplay();
}

function clear() {
  state.current = '0';
  state.previous = null;
  state.operator = null;
  state.justEvaluated = false;
  expressionEl.textContent = '';
  document.querySelectorAll('.btn--operator').forEach(btn =>
    btn.classList.remove('active')
  );
  updateDisplay();
}

function toggleSign() {
  if (state.current === '0' || state.current === 'Error') return;
  state.current = state.current.startsWith('-')
    ? state.current.slice(1)
    : '-' + state.current;
  updateDisplay();
}

function percent() {
  const value = parseFloat(state.current);
  if (isNaN(value)) return;
  state.current = (value / 100).toString();
  updateDisplay();
}

function addToHistory(expression, result) {
  const empty = historyList.querySelector('.history__empty');
  if (empty) empty.remove();

  const li = document.createElement('li');
  li.className = 'history__item';
  li.innerHTML = `
    <div class="history__item-expr">${expression}</div>
    <div class="history__item-result">${result}</div>
  `;
  li.addEventListener('click', () => {
    state.current = result;
    state.justEvaluated = true;
    updateDisplay();
  });
  historyList.appendChild(li);
}

clearHistoryBtn.addEventListener('click', () => {
  historyList.innerHTML = '<li class="history__empty">Sin operaciones aún</li>';
});

// Button clicks
document.querySelector('.buttons').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const { action, value } = btn.dataset;

  switch (action) {
    case 'number':   inputNumber(value); break;
    case 'decimal':  inputDecimal(); break;
    case 'operator': inputOperator(value); break;
    case 'equals':   calculate(); break;
    case 'clear':    clear(); break;
    case 'sign':     toggleSign(); break;
    case 'percent':  percent(); break;
  }
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
  else if (e.key === '.') inputDecimal();
  else if (['+', '-', '*', '/'].includes(e.key)) inputOperator(e.key);
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Escape') clear();
  else if (e.key === 'Backspace') {
    if (state.current.length > 1 && !state.justEvaluated) {
      state.current = state.current.slice(0, -1);
      updateDisplay();
    } else {
      state.current = '0';
      updateDisplay();
    }
  }
});
