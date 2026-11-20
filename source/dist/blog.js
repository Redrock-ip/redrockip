(() => {
  'use strict';
  const english = document.documentElement.lang === 'en';
  const filters = [...document.querySelectorAll('[data-blog-filter]')];
  const cards = [...document.querySelectorAll('[data-blog-kind]')];
  const count = document.getElementById('blog-count');

  function setFilter(category) {
    let visible = 0;
    for (const card of cards) {
      card.hidden = category !== 'all' && card.dataset.blogKind !== category;
      if (!card.hidden) visible++;
    }
    for (const button of filters) {
      button.setAttribute('aria-pressed', String(button.dataset.blogFilter === category));
    }
    if (count) count.textContent = english ? (visible === 1 ? '1 post' : visible + ' posts') : '共 ' + visible + ' 篇';
  }

  for (const button of filters) {
    button.addEventListener('click', () => setFilter(button.dataset.blogFilter));
  }

  if (!navigator.clipboard?.writeText) return;
  for (const code of document.querySelectorAll('.blog-prose pre > code')) {
    const copy = document.createElement('button');
    const label = english ? 'Copy code' : '复制代码';
    copy.type = 'button';
    copy.className = 'blog-code-copy';
    copy.textContent = label;
    code.parentElement.before(copy);
    let timer;
    copy.addEventListener('click', async () => {
      window.clearTimeout(timer);
      try {
        await navigator.clipboard.writeText(code.textContent);
        copy.textContent = english ? 'Copied' : '已复制';
      } catch {
        copy.textContent = english ? 'Copy unavailable' : '暂时无法复制';
      }
      timer = window.setTimeout(() => { copy.textContent = label; }, 1600);
    });
  }
})();
