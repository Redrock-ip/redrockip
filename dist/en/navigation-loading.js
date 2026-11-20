(() => {
  'use strict';

  const navigation = window.navigation;
  if (!navigation) return;
  const excluded = new Set(['/dashboard/purchase', '/payment-preview', '/payment-options', '/loading-options']);
  const route = path => path.replace(/^\/en(?=\/|$)/, '').replace(/\/$/, '').replace(/\.html$/, '') || '/';
  if (excluded.has(route(location.pathname))) return;

  let pending;
  let screen;

  function clearLoading() {
    if (pending) {
      window.clearTimeout(pending.timer);
      pending.signal.removeEventListener('abort', pending.abort);
      pending = null;
    }
    screen?.remove();
    screen = null;
  }

  function showLoading() {
    screen = document.createElement('div');
    screen.className = 'navigation-loading-screen';
    screen.setAttribute('role', 'progressbar');
    screen.setAttribute('aria-label', 'Loading page');
    const spinner = document.createElement('span');
    spinner.className = 'loading-spinner';
    spinner.dataset.spinner = 'dual';
    spinner.setAttribute('aria-hidden', 'true');
    screen.append(spinner);
    document.body.append(screen);
  }

  navigation.addEventListener('navigate', event => {
    clearLoading();
    const destination = new URL(event.destination.url);
    const targetRoute = route(destination.pathname);
    if (event.destination.sameDocument || event.hashChange || event.downloadRequest != null || event.formData ||
        event.signal.aborted || destination.origin !== location.origin || excluded.has(targetRoute) ||
        !/^\/[a-z0-9/-]*$/i.test(targetRoute)) return;
    const change = {
      signal: event.signal,
      abort() { if (pending === change) clearLoading(); },
      timer: window.setTimeout(() => {
        if (pending === change && !change.signal.aborted) showLoading();
      }, 200)
    };
    pending = change;
    change.signal.addEventListener('abort', change.abort, { once: true });
  });

  navigation.addEventListener('navigatesuccess', clearLoading);
  navigation.addEventListener('navigateerror', clearLoading);
  window.addEventListener('pagehide', clearLoading);
  window.addEventListener('pageshow', event => { if (event.persisted) clearLoading(); });
})();
