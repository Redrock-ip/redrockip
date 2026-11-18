(() => {
  'use strict';
  const header = document.querySelector('.site-header');
  if (!header) return;
  const menus = [...header.querySelectorAll('details.nav-dropdown')];
  if (!menus.length) return;

  const hoverMedia = window.matchMedia('(hover: hover) and (pointer: fine)');
  const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
  const state = new Map(menus.map(menu => [menu, {
    timer: null, hovered: false, animation: null, version: 0,
    closing: false, visualOpen: menu.open
  }]));
  let lastWidth = window.innerWidth;
  const breakpoint = () => document.documentElement.lang === 'en' ? 1180 : 900;
  const allowsHover = () => hoverMedia.matches && window.innerWidth > breakpoint();
  const hasFocus = menu => menu.contains(document.activeElement);
  const isMouse = event => event.pointerType === 'mouse';
  const allowsMotion = () => document.documentElement.dataset?.motion === 'on' ||
    (document.documentElement.dataset?.motion !== 'off' && !motionMedia.matches);

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
    stopAnimation(menu);
    restorePanel(menu);
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
      animation = panel.animate([{ opacity: from }, { opacity: to }], {
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
    closeSiblings(menu);
    fade(menu, from, 1, 180);
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
    menu.addEventListener('pointerenter', event => enter(menu, event));
    menu.querySelector('.mega-panel')?.addEventListener('pointerenter', event => enter(menu, event));
    menu.addEventListener('pointerleave', event => {
      if (!isMouse(event) || menu.contains(event.relatedTarget)) return;
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
      if (!menu.open || state.get(menu).closing) open(menu);
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
    menus.forEach(menu => {
      if (state.get(menu).closing) finishClose(menu);
      else stopAnimation(menu);
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') menus.forEach(cancelClose);
  });
})();
