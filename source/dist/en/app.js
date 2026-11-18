(() => {
  'use strict';
  const root = document.documentElement;
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('#nav');
  const header = document.querySelector('header');
  const motionButton = document.querySelector('.motion-control');
  const motionLabel = document.querySelector('#motion-label');
  const motionIcon = document.querySelector('.motion-icon');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let storedMotion;
  try { storedMotion = localStorage.getItem('redrock-motion'); } catch { /* Storage may be unavailable. */ }
  let motionEnabled = storedMotion ? storedMotion === 'on' : !reducedMotion.matches;
  const activeAnimations = new Set();

  function applyMotion() {
    root.dataset.motion = motionEnabled ? 'on' : 'off';
    motionButton.setAttribute('aria-pressed', String(motionEnabled));
    motionButton.setAttribute('aria-label', motionEnabled ? 'Pause page animations' : 'Enable page animations');
    motionLabel.textContent = motionEnabled ? 'Pause motion' : 'Enable motion';
    motionIcon.textContent = motionEnabled ? 'Ⅱ' : '▷';
    if (!motionEnabled) {
      activeAnimations.forEach(animation => animation.cancel());
      activeAnimations.clear();
    }
  }
  applyMotion();
  motionButton.addEventListener('click', () => {
    motionEnabled = !motionEnabled;
    storedMotion = motionEnabled ? 'on' : 'off';
    try { localStorage.setItem('redrock-motion', storedMotion); } catch { /* Keep session preference. */ }
    applyMotion();
  });
  reducedMotion.addEventListener('change', () => {
    if (storedMotion === null || storedMotion === undefined) {
      motionEnabled = !reducedMotion.matches;
      applyMotion();
    }
  });

  const dropdowns = [...document.querySelectorAll('.nav-dropdown')];
  function closeDropdown(detail) {
    if (typeof window.redrockCloseNavMenu === 'function') window.redrockCloseNavMenu(detail);
    else detail.open = false;
  }
  function closeDropdowns() { dropdowns.forEach(closeDropdown); }
  function closeMenu() {
    closeDropdowns();
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const dropdown = dropdowns.find(detail => detail.open && !detail.dataset?.navClosing);
      if (dropdown) { closeDropdown(dropdown); dropdown.querySelector('summary').focus(); return; }
    }
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menu.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) closeMenu();
    else if (!event.target.closest?.('.nav-dropdown')) closeDropdowns();
  });

  // One-shot reveals; observing continues while paused so switching motion back on never hides read content.
  const revealGroups = [
    ['.principles>p, .principles>div', 80],
    ['.section-head', 0],
    ['.product', 90],
    ['.usecase-nav, .case-panel', 100],
    ['.guide>div, .guide li', 80],
    ['.faq details', 60],
    ['.contact>div', 100]
  ];
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    revealGroups.forEach(([selector, stagger]) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        element.classList.add('reveal');
        element.style.setProperty('--reveal-delay', `${Math.min(index * stagger, 240)}ms`);
        revealObserver.observe(element);
      });
    });
  }
  root.classList.add('motion-ready');

  // Scroll progress and current section use a single animation frame per scroll update.
  const navLinks = [...nav.querySelectorAll('a')];
  const sections = navLinks.map(link => { const href = link.getAttribute('href'); return href?.startsWith('#') ? document.querySelector(href) : null; });
  let scrollQueued = false;
  function updateScroll() {
    const y = window.scrollY;
    const travel = root.scrollHeight - window.innerHeight;
    root.style.setProperty('--scroll', travel > 0 ? String(Math.min(1, Math.max(0, y / travel))) : '0');
    header.classList.toggle('is-scrolled', y > 12);
    let current = -1;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= 170) current = index;
    });
    navLinks.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scrollQueued = false;
  }
  function queueScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(updateScroll);
  }
  window.addEventListener('scroll', queueScroll, { passive: true });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1040) closeMenu();
    queueScroll();
  }, { passive: true });
  updateScroll();

  // Track the pointer locally, avoiding global mouse handlers and layout work on touch devices.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.product').forEach(element => {
      let frame = 0;
      let pointer = null;
      element.addEventListener('pointermove', event => {
        if (!motionEnabled) return;
        pointer = { x: event.clientX, y: event.clientY };
        if (frame) return;
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          if (!motionEnabled || !pointer) return;
          const rect = element.getBoundingClientRect();
          const x = (pointer.x - rect.left) / rect.width;
          const y = (pointer.y - rect.top) / rect.height;
          element.style.setProperty('--pointer-x', `${x * 100}%`);
          element.style.setProperty('--pointer-y', `${y * 100}%`);
        });
      }, { passive: true });
      element.addEventListener('pointerleave', () => {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        pointer = null;
      });
    });
  }

  function animateContent(element) {
    if (!motionEnabled || !element.animate) return;
    const animation = element.animate([
      { opacity: 0, transform: 'translateY(12px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' });
    activeAnimations.add(animation);
    animation.onfinish = () => activeAnimations.delete(animation);
    animation.oncancel = () => activeAnimations.delete(animation);
  }
  const cases = [
    ['MARKET RESEARCH','Explore markets<br>across regions.','Observe public product information and prices across regions, within permitted access rules, to inform market research.',['Choose a region','Visit public pages','Review findings']],
    ['AD VERIFICATION','See how ads appear<br>in different regions.','View ads and landing pages from a selected network environment to check regional delivery and page experience.',['Select target regions','Review ad delivery','Check landing pages']],
    ['SEARCH OBSERVATION','Observe search results.<br>Understand regional differences.','Review public search results across regions and track brand visibility, rankings and content changes for research.',['Choose a region','View search results','Compare changes']],
    ['APPLICATION TESTING','Test user experience<br>across networks.','Test websites and apps through different network exits to identify regional compatibility and access issues.',['Choose a test environment','Run authorized tests','Record and investigate issues']]
  ];
  const tabs = [...document.querySelectorAll('[data-case]')];
  const panel = document.querySelector('#case-panel');
  function selectCase(index) {
    if (tabs[index].getAttribute('aria-selected') === 'true') return;
    tabs.forEach((tab, tabIndex) => {
      tab.setAttribute('aria-selected', String(index === tabIndex));
      tab.setAttribute('tabindex', index === tabIndex ? '0' : '-1');
    });
    const content = cases[index];
    document.querySelector('#case-tag').textContent = content[0];
    document.querySelector('#case-title').innerHTML = content[1];
    document.querySelector('#case-desc').textContent = content[2];
    document.querySelector('#case-flow').innerHTML = content[3].join(' <b>→</b> ');
    panel.setAttribute('aria-labelledby', tabs[index].id);
    activeAnimations.forEach(animation => animation.cancel());
    [...panel.children].forEach(animateContent);
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectCase(index));
    tab.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowUp') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[next].focus();
      selectCase(next);
    });
  });
  document.querySelectorAll('.faq details').forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (detail.open) animateContent(detail.querySelector('p'));
    });
  });
  document.querySelectorAll('[data-product]').forEach(link => link.addEventListener('click', () => {
    document.querySelector('#email-link').href = 'mailto:support@redrock-ip.com?subject=' + encodeURIComponent('Product enquiry: ' + link.dataset.product);
  }));
  document.querySelector('#copy-email').addEventListener('click', async () => {
    const status = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText('support@redrock-ip.com');
      status.textContent = 'Email address copied';
    } catch {
      status.textContent = 'Copy the email address manually: support@redrock-ip.com';
    }
  });
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
