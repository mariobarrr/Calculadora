const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');

export function addEntry(expression, result, onClickResult) {
  const empty = historyList.querySelector('.history__empty');
  if (empty) empty.remove();

  const li = document.createElement('li');
  li.className = 'history__item';
  li.innerHTML = `
    <div class="history__item-expr">${expression}</div>
    <div class="history__item-result">${result}</div>
  `;
  li.addEventListener('click', () => onClickResult(result));
  historyList.appendChild(li);
}

export function initClearButton() {
  clearHistoryBtn.addEventListener('click', () => {
    historyList.innerHTML = '<li class="history__empty">Sin operaciones aún</li>';
  });
}
