(() => {
  'use strict';
  document.querySelectorAll('[data-language-switch]').forEach(link => {
    const destination = new URL(link.getAttribute('href'), window.location.origin);
    destination.search = window.location.search;
    destination.hash = window.location.hash;
    link.href = destination.pathname + destination.search + destination.hash;
  });
})();
