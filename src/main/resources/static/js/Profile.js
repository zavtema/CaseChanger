document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('visible', entry.isIntersecting);
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  });

  document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tabs button');
  const indicator = document.querySelector('.tabs::after'); // псевдокод: мы не можем выбрать псевдоэлемент напрямую
  // Вместо этого создадим настоящий элемент:
  const line = document.createElement('div');
  line.className = 'tabs-indicator';
  document.querySelector('.tabs').appendChild(line);

  function moveIndicator(el) {
    const { offsetLeft: left, offsetWidth: width } = el;
    line.style.left  = left + 'px';
    line.style.width = width + 'px';
  }

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.tabs button.active').classList.remove('active');
      btn.classList.add('active');
      moveIndicator(btn);
      // тут можно ещё переключать содержимое секций…
    });
  });

  // инициализируем положение при загрузке
  moveIndicator(document.querySelector('.tabs button.active'));
});

document.addEventListener('DOMContentLoaded', () => {
  const tabs     = document.querySelectorAll('.tabs button');
  const panes    = document.querySelectorAll('.tab-content');
  const indicator = document.createElement('div');
  indicator.className = 'tabs-indicator';
  document.querySelector('.tabs').appendChild(indicator);

  function hideAll() {
    panes.forEach(p => p.style.display = 'none');
  }

  function show(id) {
    const pane = document.getElementById(id);
    if (pane) pane.style.display = 'block';
  }

  function moveIndicator(el) {
    const { offsetLeft: left, offsetWidth: width } = el;
    indicator.style.left  = left + 'px';
    indicator.style.width = width + 'px';
  }

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      // 1) переключаем активную кнопку
      document.querySelector('.tabs button.active').classList.remove('active');
      btn.classList.add('active');

      // 2) скрываем все вкладки
      hideAll();
      // 3) показываем нужную
      show(btn.dataset.tab);

      // 4) двигаем индикацию
      moveIndicator(btn);
    });
  });

  // Инициализация: показываем первую активную
  const first = document.querySelector('.tabs button.active');
  if (first) {
    hideAll();
    show(first.dataset.tab);
    moveIndicator(first);
  }
});

document.addEventListener('DOMContentLoaded', () => {
const copyBtn = document.getElementById('copyBtn');
const refInput = document.getElementById('refLink');

copyBtn.addEventListener('click', async () => {
  try {
    // Скопировать текст
    await navigator.clipboard.writeText(refInput.value.trim());

    // Визуальный фидбэк
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Скопировано!';
    copyBtn.disabled = true;
    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.disabled = false;
    }, 1500);
  } catch (err) {
    console.error('Ошибка при копировании: ', err);
  }
});
});