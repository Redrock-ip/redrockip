(() => {
  'use strict';

  const dialog = document.getElementById('payment-window');
  const open = document.getElementById('payment-open');
  const launcher = document.getElementById('payment-launcher');
  const pageLoading = document.getElementById('page-loading-preview');
  const panels = new Map([...dialog.querySelectorAll('[data-payment-stage]')].map(panel => [
    panel.dataset.paymentStage, panel
  ]));
  const actions = {
    connect: document.getElementById('payment-forward'),
    return: document.getElementById('payment-confirm'),
    complete: document.getElementById('payment-replay')
  };
  const motion = document.getElementById('payment-motion');
  const motionLabel = document.getElementById('payment-motion-label');
  const motionIcon = document.getElementById('payment-motion-icon');
  const language = dialog.querySelector('[data-language-switch]');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let savedMotion;

  try { savedMotion = localStorage.getItem('redrock-motion'); } catch { /* Follow the system preference. */ }

  function showMotion() {
    const enabled = savedMotion ? savedMotion === 'on' : !preference.matches;
    document.documentElement.dataset.motion = enabled ? 'on' : 'off';
    motion.setAttribute('aria-pressed', String(enabled));
    motionLabel.textContent = enabled ? '暂停动效' : '开启动效';
    motionIcon.textContent = enabled ? 'Ⅱ' : '▷';
  }

  function showStage(stage, updateUrl = true) {
    pageLoading.hidden = true;
    launcher.hidden = false;
    delete document.documentElement.dataset.paymentLoading;
    for (const [name, panel] of panels) {
      panel.hidden = name !== stage;
      actions[name].hidden = name !== stage;
    }
    const title = panels.get(stage).querySelector('h2');
    dialog.dataset.paymentStatus = stage === 'complete' ? 'paid' : 'pending';
    dialog.setAttribute('aria-labelledby', title.id);
    if (!dialog.open) dialog.showModal();
    title.focus({ preventScroll: true });

    if (updateUrl) {
      const url = new URL(location.href);
      url.searchParams.set('stage', stage);
      url.searchParams.delete('spinner');
      url.searchParams.delete('play');
      url.searchParams.delete('destination');
      history.replaceState(null, '', url);
    }
    if (language) {
      const destination = new URL(language.href, location.origin);
      destination.search = location.search;
      language.href = destination.pathname + destination.search + destination.hash;
    }
  }

  motion.addEventListener('click', () => {
    savedMotion = document.documentElement.dataset.motion === 'on' ? 'off' : 'on';
    try { localStorage.setItem('redrock-motion', savedMotion); } catch { /* Use the page preference. */ }
    showMotion();
  });
  preference.addEventListener('change', showMotion);

  actions.connect.addEventListener('click', () => showStage('return'));
  actions.return.addEventListener('click', () => showStage('complete'));
  actions.complete.addEventListener('click', () => showStage('connect'));
  open.addEventListener('click', () => showStage('connect'));
  document.getElementById('payment-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => open.focus({ preventScroll: true }));

  const query = new URLSearchParams(location.search);
  const fromUrl = query.get('stage');
  showMotion();
  if (fromUrl === 'loading') {
    const spinner = query.get('spinner');
    if (['arc', 'comet', 'dual', 'dots'].includes(spinner)) {
      pageLoading.querySelector('.loading-spinner').dataset.spinner = spinner;
    }
    launcher.hidden = true;
    pageLoading.hidden = false;
    if (query.get('play') === '1') {
      const destination = query.get('destination');
      window.setTimeout(() => {
        if (destination === 'orders' || destination === 'usage') {
          const locale = document.documentElement.lang === 'en' ? '/en' : '';
          window.location.replace(locale + '/dashboard/' + destination);
        } else {
          showStage('connect');
        }
      }, 2250);
    }
  } else {
    showStage(panels.has(fromUrl) ? fromUrl : 'connect', false);
  }
})();
