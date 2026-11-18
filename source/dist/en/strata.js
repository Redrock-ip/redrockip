(() => {
  'use strict';
  const root = document.documentElement;
  const artwork = document.querySelector('.rock-strata');
  if (!artwork) return;
  const layers = [...artwork.querySelectorAll('.stratum')].map(group => ({
    index: Number(group.dataset.layer),
    fill: group.querySelector('.stratum-fill'),
    edge: group.querySelector('.stratum-edge')
  }));

  // Every band shares the same terrain; positive spacing keeps layers ordered.
  // Existing paths remain a complete static illustration if animation is disabled.
  function contour(layer, time) {
    const points = [];
    const ridge = 0.78 + 0.035 * Math.sin(time * 0.12);
    for (let index = 0; index < 29; index++) {
      const x = -100 + index * 1640 / 28;
      const u = x / 1440;
      const shared = 278 - 220 * Math.exp(-(((u - ridge) / 0.36) ** 2))
        + 26 * Math.sin(u * 5 + time * 0.18) + 10 * Math.sin(u * 10 - time * 0.12);
      const spacing = 10 + 1.6 * Math.sin(u * 6 - time * 0.13);
      const y = shared + layer * spacing + 1.5 * Math.sin(layer * 0.28 + u * 7 + time * 0.18);
      points.push({ x, y });
    }
    const number = value => value.toFixed(2);
    const pair = point => `${number(point.x)},${number(point.y)}`;
    let path = 'M' + pair(points[0]);
    for (let index = 0; index < points.length - 1; index++) {
      const p0 = points[Math.max(0, index - 1)];
      const p1 = points[index];
      const p2 = points[index + 1];
      const p3 = points[Math.min(points.length - 1, index + 2)];
      const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
      const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
      path += 'C' + pair(c1) + ' ' + pair(c2) + ' ' + pair(p2);
    }
    return path;
  }

  let inView = false;
  let frameId = null;
  let previousTime = null;
  let lastPaint = null;
  let elapsed = 0;
  function canRun() {
    return root.dataset.motion === 'on' && !document.hidden && inView;
  }
  function frame(now) {
    frameId = null;
    if (!canRun()) return;
    if (previousTime !== null) elapsed += Math.min((now - previousTime) / 1000, 0.05);
    previousTime = now;
    if (lastPaint === null || now - lastPaint >= 1000 / 24) {
      layers.forEach(layer => {
        const path = contour(layer.index, elapsed);
        layer.fill.setAttribute('d', path + 'L1540,600L-100,600Z');
        layer.edge.setAttribute('d', path);
      });
      lastPaint = now;
    }
    frameId = window.requestAnimationFrame(frame);
  }
  function syncMotion() {
    if (!canRun()) {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      frameId = null;
      previousTime = null;
      lastPaint = null;
      return;
    }
    if (frameId === null) frameId = window.requestAnimationFrame(frame);
  }
  new MutationObserver(syncMotion).observe(root, { attributes: true, attributeFilter: ['data-motion'] });
  document.addEventListener('visibilitychange', syncMotion);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      inView = entries.some(entry => entry.isIntersecting);
      syncMotion();
    });
    observer.observe(artwork);
  } else {
    // Fall back to a static illustration when visibility observation is unavailable.
    inView = false;
  }
  syncMotion();
})();
