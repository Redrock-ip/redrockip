(() => {
  'use strict';
  const protocols = ['http', 'https', 'socks4', 'socks5'];
  function parseProxy(value, selectedProtocol = 'auto', requireAuth = false) {
    const raw = String(value || '').trim();
    const invalid = message => ({ valid: false, message, raw });
    if (!raw) return invalid('Enter proxy details');
    if (/\s/.test(raw)) return invalid('Proxy details must not contain spaces or line breaks');
    let authority = raw;
    let protocol = selectedProtocol === 'auto' ? null : selectedProtocol;
    if (protocol && !protocols.includes(protocol)) return invalid('The selected protocol is not supported');
    const scheme = raw.match(/^([a-z][a-z\d+.-]*):\/\//i);
    if (scheme) {
      const explicit = scheme[1].toLowerCase();
      if (!protocols.includes(explicit)) return invalid('Only HTTP, HTTPS, SOCKS4 and SOCKS5 are supported');
      if (protocol && protocol !== explicit) return invalid('The protocol in the entry does not match the selected protocol');
      protocol = explicit;
      authority = raw.slice(scheme[0].length);
    }
    if (scheme && /[/?#]/.test(authority)) return invalid('The proxy address must not include a path, query string or fragment');
    let username = '', password = '', authenticated = false;
    const at = authority.lastIndexOf('@');
    if (at !== -1) {
      const credential = authority.slice(0, at);
      const colon = credential.indexOf(':');
      if (colon < 1 || colon === credential.length - 1 || credential.includes('@')) return invalid('Provide both a username and a password');
      username = credential.slice(0, colon);
      password = credential.slice(colon + 1);
      authority = authority.slice(at + 1);
      authenticated = true;
      try { decodeURIComponent(username); decodeURIComponent(password); } catch { return invalid('The credentials contain invalid percent encoding'); }
    }
    const match = authority.match(/^(\[[^\]]+\]|[^:\s]+):(\d+)(?::([^:]+):(.+))?$/);
    if (!match) return invalid('Enter host:port or a supported format with complete credentials');
    const host = match[1];
    const port = Number(match[2]);
    if (!Number.isInteger(port) || port < 1 || port > 65535) return invalid('The port must be an integer between 1 and 65535');
    if (match[3] !== undefined) {
      if (authenticated || scheme) return invalid('Do not mix a proxy URL with colon-separated credentials');
      username = match[3]; password = match[4]; authenticated = true;
    }
    if (host.startsWith('[')) {
      try {
        const parsed = new URL('http://' + host + ':' + port);
        if (!parsed.hostname.includes(':')) return invalid('Invalid IPv6 address format');
      } catch { return invalid('Invalid IPv6 address format'); }
    } else {
      if (host.length > 253 || !host.split('.').every(label => /^[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?$/i.test(label))) return invalid('Invalid hostname or IPv4 address format');
      if (/^\d+(?:\.\d+)+$/.test(host) && !(host.split('.').length === 4 && host.split('.').every(part => Number(part) <= 255))) return invalid('Invalid IPv4 address format');
    }
    if (requireAuth && !authenticated) return invalid('Connected-device queries require both a username and a password');
    return { valid: true, raw, host, port, protocol, authenticated, message: 'Host, port and credential structure checked' };
  }
  function uniqueEntries(text) {
    return [...new Set(String(text || '').split(/\r?\n/).map(value => value.trim()).filter(Boolean))];
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { parseProxy, uniqueEntries };
  if (typeof document === 'undefined') return;

  const proxyForm = document.querySelector('#proxy-format-form');
  if (proxyForm) {
    const input = document.querySelector('#proxy-list');
    const selector = document.querySelector('#proxy-protocol');
    const submit = document.querySelector('#proxy-check-submit');
    const clear = document.querySelector('#proxy-clear');
    const error = document.querySelector('#proxy-form-error');
    const counter = document.querySelector('#proxy-line-count');
    const resultBody = document.querySelector('#proxy-result-body');
    const resultWrap = document.querySelector('#proxy-result-wrap');
    const empty = document.querySelector('#proxy-empty');
    const copy = document.querySelector('#proxy-copy-valid');
    const status = document.querySelector('#proxy-result-status');
    let validEntries = [];
    function reset() {
      const entries = uniqueEntries(input.value);
      counter.textContent = `${entries.length} / 10`;
      submit.disabled = entries.length === 0;
      clear.disabled = input.value.length === 0;
      input.removeAttribute('aria-invalid');
      error.hidden = true;
      resultWrap.hidden = true;
      empty.hidden = false;
      resultBody.replaceChildren();
      copy.disabled = true;
      validEntries = [];
      status.textContent = '';
    }
    input.addEventListener('input', reset);
    selector.addEventListener('change', reset);
    document.querySelector('#proxy-fill-example').addEventListener('click', () => {
      input.value = '203.0.113.10:8080\nproxy.example.com:1080:demo-user:demo-password\nsocks5://demo-user:demo-password@proxy.example.com:1080';
      selector.value = 'auto'; reset(); input.focus();
    });
    clear.addEventListener('click', () => { input.value = ''; reset(); input.focus(); });
    proxyForm.addEventListener('submit', event => {
      event.preventDefault();
      reset();
      const entries = uniqueEntries(input.value);
      if (!entries.length || entries.length > 10) {
        error.textContent = 'Enter 1–10 proxies, one per line.';
        error.hidden = false; input.setAttribute('aria-invalid', 'true'); input.focus(); return;
      }
      const results = entries.map(value => parseProxy(value, selector.value));
      validEntries = results.filter(result => result.valid).map(result => result.raw);
      const fragment = document.createDocumentFragment();
      results.forEach((result, index) => {
        const row = document.createElement('tr');
        const values = [String(index + 1), result.valid ? `${result.host}:${result.port}` : `Entry ${index + 1}`, result.valid ? (result.protocol?.toUpperCase() || 'Not specified') : '—', result.valid ? (result.authenticated ? 'Credentials supplied' : 'No credentials') : '—'];
        values.forEach(value => { const cell = document.createElement('td'); cell.textContent = value; row.append(cell); });
        const badgeCell = document.createElement('td');
        const badge = document.createElement('span');
        badge.className = 'tool-result-badge' + (result.valid ? ' is-valid' : '');
        badge.textContent = result.valid ? 'Valid syntax' : 'Invalid syntax';
        badgeCell.append(badge); row.append(badgeCell);
        const detail = document.createElement('td'); detail.textContent = result.message; row.append(detail);
        fragment.append(row);
      });
      resultBody.append(fragment);
      resultWrap.hidden = false; empty.hidden = true; copy.disabled = !validEntries.length;
      status.textContent = `Checked ${results.length} entries: ${validEntries.length} have valid syntax; ${results.length - validEntries.length} need changes. No network connectivity test was performed.`;
    });
    copy.addEventListener('click', async () => {
      if (!validEntries.length) return;
      try {
        await navigator.clipboard.writeText(validEntries.join('\n'));
        status.textContent = `Copied ${validEntries.length} entries with valid syntax. The copied text includes the original credentials; keep it secure.`;
      } catch { status.textContent = 'Could not copy. Select the required proxies manually from the input above.'; }
    });
    reset();
  }

  const deviceForm = document.querySelector('#device-format-form');
  if (deviceForm) {
    const input = document.querySelector('#device-proxy');
    const submit = document.querySelector('#device-check-submit');
    const clear = document.querySelector('#device-clear');
    const error = document.querySelector('#device-form-error');
    const ready = document.querySelector('#device-ready');
    const description = document.querySelector('#device-ready-description');
    function reset() {
      submit.disabled = !input.value.trim(); clear.disabled = !input.value;
      input.removeAttribute('aria-invalid'); error.hidden = true; ready.hidden = true;
    }
    input.addEventListener('input', reset);
    document.querySelector('#device-fill-example').addEventListener('click', () => {
      input.value = 'proxy.example.com:1080:demo-user:demo-password'; reset(); input.focus();
    });
    clear.addEventListener('click', () => { input.value = ''; reset(); input.focus(); });
    deviceForm.addEventListener('submit', event => {
      event.preventDefault(); reset();
      const entries = uniqueEntries(input.value);
      const result = entries.length === 1 ? parseProxy(entries[0], 'auto', true) : { valid: false, message: 'Enter one complete static residential proxy.' };
      if (!result.valid) {
        error.textContent = result.message; error.hidden = false; input.setAttribute('aria-invalid', 'true'); input.focus(); return;
      }
      description.textContent = `${result.host}:${result.port} · Credentials supplied.`;
      ready.hidden = false;
    });
    reset();
  }
})();
