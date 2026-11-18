(() => {
  'use strict';
  const header = document.querySelector('.site-header--capsule');
  if (!header) return;
  const nav = header.querySelector('#nav');
  const brand = header.querySelector('.brand');
  const actions = header.querySelector('.header-actions');
  const logo = brand.querySelector('.original-logo');
  const menus = [...nav.querySelectorAll('details.nav-dropdown')];

  const hoverMedia = window.matchMedia('(hover: hover) and (pointer: fine)');
  const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
  const state = new Map(menus.map(menu => [menu, {
    timer: null, hovered: false, animation: null, version: 0,
    closing: false, visualOpen: menu.open, held: false
  }]));
  let lastWidth = window.innerWidth;
  const desktop = () => window.innerWidth > 1040;
  const allowsHover = () => hoverMedia.matches && desktop();
  const hasFocus = menu => menu.contains(document.activeElement) &&
    (document.activeElement.matches(':focus-visible') || menu.querySelector('.mega-panel')?.contains(document.activeElement));
  const isMouse = event => event.pointerType === 'mouse';
  const allowsMotion = () => document.documentElement.dataset?.motion === 'on' ||
    (document.documentElement.dataset?.motion !== 'off' && !motionMedia.matches);

  const surface = document.createElement('div');
  surface.className = 'nav-surface';
  surface.setAttribute('aria-hidden','true');
  header.prepend(surface);
  const highlight = document.createElement('span');
  highlight.className = 'nav-highlight';
  highlight.setAttribute('aria-hidden','true');
  nav.prepend(highlight);

  const itemSelector = '#nav > a, #nav > .nav-dropdown > summary, #nav > .nav-split';
  let hoveredItem = null;
  let stagePending = false;
  let lastScroll = window.scrollY;
  let descent = 0;

  function updateStage() {
    stagePending = false;
    if (!desktop()) return;
    const compact = header.hasAttribute('data-nav-compact');
    const active = menus.find(menu => state.get(menu).visualOpen);
    const panel = active?.querySelector('.mega-panel');
    const iconWidth = logo.offsetWidth + 16;
    const sideGap = 5;
    const rowShift = compact ? (iconWidth - actions.offsetWidth) / 2 : 0;
    const column = nav.offsetLeft + rowShift;
    const width = nav.offsetWidth + (compact ? iconWidth + actions.offsetWidth + sideGap * 2 : 0);
    const height = nav.offsetHeight + (panel ? panel.offsetHeight + 5 : 0);
    const values = {
      '--nav-surface-width':Math.max(width,panel?.offsetWidth || 0),
      '--nav-surface-height':height,
      '--nav-surface-top':nav.offsetTop,
      '--nav-row-shift':rowShift,
      '--nav-panel-shift':-rowShift,
      '--nav-brand-shift':compact ? column - iconWidth - sideGap - brand.offsetLeft : 0,
      '--nav-actions-shift':compact ? column + nav.offsetWidth + sideGap - actions.offsetLeft : 0
    };
    for (const [name,value] of Object.entries(values)) header.style.setProperty(name,value + 'px');
    header.toggleAttribute('data-nav-expanded',Boolean(panel));
    const focused = document.activeElement?.matches(':focus-visible')
      ? document.activeElement.closest(itemSelector) : null;
    const anchor = hoveredItem || focused || active?.querySelector('summary').closest(itemSelector) ||
      nav.querySelector(':scope > a[aria-current], :scope > .nav-dropdown.is-active > summary, :scope > .nav-split.is-active');
    highlight.toggleAttribute('data-visible',Boolean(anchor));
    if (anchor) {
      highlight.style.setProperty('--nav-highlight-x',anchor.offsetLeft+'px');
      highlight.style.setProperty('--nav-highlight-y',anchor.offsetTop+'px');
      highlight.style.setProperty('--nav-highlight-width',anchor.offsetWidth+'px');
      highlight.style.setProperty('--nav-highlight-height',anchor.offsetHeight+'px');
    }
    header.setAttribute('data-stage-ready','');
  }

  function queueStage() {
    if (stagePending) return;
    stagePending = true;
    window.requestAnimationFrame(updateStage);
  }

  function revealHeader() {
    descent = 0;
    header.removeAttribute('data-nav-tucked');
  }

  function syncScroll() {
    const y = Math.max(0,window.scrollY);
    const delta = y - lastScroll;
    lastScroll = y;
    const before = header.hasAttribute('data-nav-compact');
    const compact = desktop() && y > (before ? 22 : 62);
    header.toggleAttribute('data-nav-compact',compact);
    if (compact !== before) queueStage();
    if (!compact || !allowsMotion() || delta < -2 || nav.querySelector(':focus-visible')) {
      revealHeader();
    } else if (delta > 0 && y > 220) {
      descent += delta;
      if (descent > 150 && !header.matches(':hover') && !menus.some(menu => menu.open)) {
        header.setAttribute('data-nav-tucked','');
      }
    }
  }

  nav.addEventListener('pointerover',event => {
    const item = event.target.closest(itemSelector);
    if (!allowsHover() || !isMouse(event) || !item) return;
    hoveredItem = item;
    if (item.tagName === 'A' && !menus.some(menu => menu.querySelector('.mega-panel')?.contains(document.activeElement))) {
      menus.forEach(menu => close(menu));
    }
    queueStage();
  });
  nav.addEventListener('pointermove',event => {
    if (!allowsMotion() || !allowsHover() || !isMouse(event)) return;
    const area = surface.getBoundingClientRect();
    surface.style.setProperty('--glow-x',event.clientX-area.left+'px');
    surface.style.setProperty('--glow-y',event.clientY-area.top+'px');
    surface.setAttribute('data-lit','');
  },{passive:true});
  nav.addEventListener('pointerleave',() => {
    hoveredItem = null;
    surface.removeAttribute('data-lit');
    queueStage();
  });
  header.addEventListener('focusin',() => {revealHeader();queueStage();});
  header.addEventListener('focusout',queueStage);
  window.addEventListener('scroll',syncScroll,{passive:true});
  window.addEventListener('pointermove',event => {
    if (event.clientY < 24 && header.hasAttribute('data-nav-tucked')) revealHeader();
  },{passive:true});
  if (typeof ResizeObserver === 'function') {
    const sizes = new ResizeObserver(queueStage);
    for (const element of [nav,actions,...nav.querySelectorAll('.mega-panel')]) sizes.observe(element);
  }
  new MutationObserver(() => {
    if (!allowsMotion()) {
      revealHeader();
      surface.removeAttribute('data-lit');
    }
    queueStage();
  }).observe(document.documentElement,{attributes:true,attributeFilter:['data-motion']});
  syncScroll();
  updateStage();

  function stopAnimation(menu) {
    const current = state.get(menu);
    current.version += 1;
    const animation = current.animation;
    current.animation = null;
    animation?.cancel();
  }

  function opacity(panel, fallback) {
    if (typeof window.getComputedStyle !== 'function') return fallback;
    const value = Number.parseFloat(window.getComputedStyle(panel).opacity);
    return Number.isFinite(value) ? value : fallback;
  }

  function restorePanel(menu) {
    const panel = menu.querySelector('.mega-panel');
    if (panel) {
      panel.inert = false;
      panel.removeAttribute('aria-hidden');
    }
    delete menu.dataset.navClosing;
  }

  function finishClose(menu) {
    const current = state.get(menu);
    // Hide native details content before releasing the final animation frame.
    menu.open = false;
    current.closing = false;
    current.visualOpen = false;
    current.held = false;
    stopAnimation(menu);
    restorePanel(menu);
    queueStage();
  }

  function fade(menu, from, to, duration, complete) {
    const current = state.get(menu);
    const panel = menu.querySelector('.mega-panel');
    stopAnimation(menu);
    if (!allowsMotion() || typeof panel?.animate !== 'function') {
      complete?.();
      return;
    }
    const version = current.version;
    let animation;
    try {
      const frames = desktop() ? [
        {opacity:from,translate:to === 1 && from === 0 ? '0 -3px' : '0 0'},
        {opacity:to,translate:to === 1 ? '0 0' : '0 -7px'}
      ] : [{opacity:from},{opacity:to}];
      animation = panel.animate(frames, {
        duration, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'both'
      });
    } catch {
      complete?.();
      return;
    }
    current.animation = animation;
    animation.finished.then(() => {
      if (current.version !== version || current.animation !== animation) return;
      if (complete) complete();
      else {
        current.animation = null;
        animation.cancel();
      }
    }, () => { /* Re-entry and reset deliberately cancel unfinished fades. */ });
  }

  function cancelClose(menu) {
    const current = state.get(menu);
    if (current.timer !== null) window.clearTimeout(current.timer);
    current.timer = null;
  }

  function close(menu, { immediate = false } = {}) {
    if (!state.has(menu)) { menu.open = false; return; }
    cancelClose(menu);
    const current = state.get(menu);
    const panel = menu.querySelector('.mega-panel');
    if (panel?.contains(document.activeElement)) {
      menu.querySelector('summary')?.focus({ preventScroll: true });
    }
    if (immediate || !menu.open || !allowsMotion() || typeof panel?.animate !== 'function') {
      finishClose(menu);
      return;
    }
    if (current.closing) return;
    const from = opacity(panel, 1);
    current.closing = true;
    current.visualOpen = false;
    queueStage();
    menu.dataset.navClosing = 'true';
    panel.inert = true;
    panel.setAttribute('aria-hidden', 'true');
    fade(menu, from, 0, 140, () => finishClose(menu));
  }
  // Existing navigation handlers use this for Escape, outside clicks and links.
  window.redrockCloseNavMenu = close;

  function closeSiblings(menu) {
    menus.forEach(other => {
      if (other === menu || !other.open) return;
      // A deliberate native toggle may follow a touch interaction that did not
      // focus its summary. Never leave keyboard focus in a newly hidden panel.
      const oldPanel = other.querySelector('.mega-panel');
      if (oldPanel?.contains(document.activeElement)) {
        menu.querySelector('summary')?.focus({ preventScroll: true });
      }
      close(other);
    });
  }

  function open(menu) {
    const current = state.get(menu);
    cancelClose(menu);
    if (menu.open && current.visualOpen && !current.closing) return;
    const panel = menu.querySelector('.mega-panel');
    const from = current.closing ? opacity(panel, 0) : 0;
    current.closing = false;
    current.visualOpen = true;
    restorePanel(menu);
    menu.open = true;
    revealHeader();
    closeSiblings(menu);
    queueStage();
    fade(menu,from,1,desktop() ? 240 : 180);
  }

  function enter(menu, event) {
    if (!isMouse(event) || !allowsHover()) return;
    const current = state.get(menu);
    current.hovered = true;
    cancelClose(menu);
    // Pointer movement must not hide a different panel being used by keyboard.
    const focusedPanel = menus.some(other => other !== menu && other.open &&
      other.querySelector('.mega-panel')?.contains(document.activeElement));
    if (focusedPanel) return;
    open(menu);
  }

  function scheduleClose(menu) {
    cancelClose(menu);
    if (!menu.open) return;
    const current = state.get(menu);
    current.timer = window.setTimeout(() => {
      current.timer = null;
      if (!current.hovered && !hasFocus(menu)) close(menu);
    }, 200);
  }

  menus.forEach(menu => {
    const triggerArea = menu.closest('.nav-split') || menu;
    triggerArea.addEventListener('pointerenter', event => enter(menu, event));
    menu.querySelector('.mega-panel')?.addEventListener('pointerenter', event => enter(menu, event));
    triggerArea.addEventListener('pointerleave', event => {
      if (!isMouse(event) || triggerArea.contains(event.relatedTarget)) return;
      state.get(menu).hovered = false;
      scheduleClose(menu);
    });
    // Native summary keyboard activation dispatches click. Focus alone must not
    // reopen a menu after the existing Escape handler.
    menu.addEventListener('focusin', () => cancelClose(menu));
    menu.addEventListener('focusout', event => {
      if (!menu.contains(event.relatedTarget)) scheduleClose(menu);
    });
    menu.querySelector('summary')?.addEventListener('click', event => {
      event.preventDefault();
      // Enter/Space dispatches the same native summary click. Start the fade in
      // this task so no fully opaque frame appears before the toggle event.
      const current = state.get(menu);
      if (!menu.open || current.closing) open(menu);
      else if (allowsHover() && current.hovered && event.detail > 0 && !current.held) current.held = true;
      else close(menu);
    });
    menu.addEventListener('toggle', () => {
      const current = state.get(menu);
      if (menu.open) {
        if (!current.closing) {
          closeSiblings(menu);
          if (!current.visualOpen) open(menu);
        }
      } else {
        cancelClose(menu);
        finishClose(menu);
      }
    });
  });

  function reset() {
    hoveredItem = null;
    revealHeader();
    syncScroll();
    queueStage();
    menus.forEach(menu => {
      state.get(menu).hovered = false;
      if (menu.querySelector('.mega-panel')?.contains(document.activeElement)) {
        menu.querySelector('summary')?.focus({ preventScroll: true });
      }
      close(menu, { immediate: true });
    });
  }
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    reset();
  }, { passive: true });
  hoverMedia.addEventListener('change', reset);
  motionMedia.addEventListener('change', () => {
    if (allowsMotion()) return;
    revealHeader();
    menus.forEach(menu => {
      if (state.get(menu).closing) finishClose(menu);
      else stopAnimation(menu);
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') menus.forEach(cancelClose);
  });
})();
