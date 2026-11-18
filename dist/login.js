(() => {
  'use strict';
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.querySelector('.motion-control');
  const motionLabel = document.querySelector('#motion-label');
  const motionIcon = document.querySelector('.motion-icon');
  let storedMotion;
  try { storedMotion = localStorage.getItem('redrock-motion'); } catch { /* Session-only preference. */ }
  let motionEnabled = storedMotion ? storedMotion === 'on' : !reducedMotion.matches;
  function applyMotion() {
    root.dataset.motion = motionEnabled ? 'on' : 'off';
    motionButton.setAttribute('aria-pressed', String(motionEnabled));
    motionButton.setAttribute('aria-label', motionEnabled ? '暂停页面动态效果' : '开启页面动态效果');
    motionLabel.textContent = motionEnabled ? '暂停动效' : '开启动效';
    motionIcon.textContent = motionEnabled ? 'Ⅱ' : '▷';
  }
  applyMotion();
  motionButton.addEventListener('click', () => {
    motionEnabled = !motionEnabled;
    storedMotion = motionEnabled ? 'on' : 'off';
    try { localStorage.setItem('redrock-motion', storedMotion); } catch { /* Keep preference in memory. */ }
    applyMotion();
  });
  reducedMotion.addEventListener('change', () => {
    if (storedMotion === null || storedMotion === undefined) {
      motionEnabled = !reducedMotion.matches;
      applyMotion();
    }
  });

})();
