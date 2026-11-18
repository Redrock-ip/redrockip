(() => {
  'use strict';
  const protocols = ['http', 'https', 'socks4', 'socks5'];
  function parseProxy(value, selectedProtocol = 'auto', requireAuth = false) {
    const raw = String(value || '').trim();
    const invalid = message => ({ valid: false, message, raw });
    if (!raw) return invalid('请输入代理信息');
    if (/\s/.test(raw)) return invalid('代理信息中不能包含空格或换行');
    let authority = raw;
    let protocol = selectedProtocol === 'auto' ? null : selectedProtocol;
    if (protocol && !protocols.includes(protocol)) return invalid('不支持所选协议');
    const scheme = raw.match(/^([a-z][a-z\d+.-]*):\/\//i);
    if (scheme) {
      const explicit = scheme[1].toLowerCase();
      if (!protocols.includes(explicit)) return invalid('仅支持 HTTP、HTTPS、SOCKS4 或 SOCKS5');
      if (protocol && protocol !== explicit) return invalid('输入协议与所选协议不一致');
      protocol = explicit;
      authority = raw.slice(scheme[0].length);
    }
    if (scheme && /[/?#]/.test(authority)) return invalid('代理地址不应包含路径、查询参数或片段');
    let username = '', password = '', authenticated = false;
    const at = authority.lastIndexOf('@');
    if (at !== -1) {
      const credential = authority.slice(0, at);
      const colon = credential.indexOf(':');
      if (colon < 1 || colon === credential.length - 1 || credential.includes('@')) return invalid('请提供完整的用户名和密码');
      username = credential.slice(0, colon);
      password = credential.slice(colon + 1);
      authority = authority.slice(at + 1);
      authenticated = true;
      try { decodeURIComponent(username); decodeURIComponent(password); } catch { return invalid('认证信息包含无效的百分号编码'); }
    }
    const match = authority.match(/^(\[[^\]]+\]|[^:\s]+):(\d+)(?::([^:]+):(.+))?$/);
    if (!match) return invalid('请按 host:port 或包含完整认证信息的格式输入');
    const host = match[1];
    const port = Number(match[2]);
    if (!Number.isInteger(port) || port < 1 || port > 65535) return invalid('端口必须是 1–65535 之间的整数');
    if (match[3] !== undefined) {
      if (authenticated || scheme) return invalid('请勿混用代理 URL 与冒号分隔的认证格式');
      username = match[3]; password = match[4]; authenticated = true;
    }
    if (host.startsWith('[')) {
      try {
        const parsed = new URL('http://' + host + ':' + port);
        if (!parsed.hostname.includes(':')) return invalid('IPv6 地址格式不正确');
      } catch { return invalid('IPv6 地址格式不正确'); }
    } else {
      if (host.length > 253 || !host.split('.').every(label => /^[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?$/i.test(label))) return invalid('主机名或 IPv4 地址格式不正确');
      if (/^\d+(?:\.\d+)+$/.test(host) && !(host.split('.').length === 4 && host.split('.').every(part => Number(part) <= 255))) return invalid('IPv4 地址格式不正确');
    }
    if (requireAuth && !authenticated) return invalid('设备连接查询需要完整的用户名和密码');
    return { valid: true, raw, host, port, protocol, authenticated, message: '地址、端口及认证结构已核对' };
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
        error.textContent = '请输入 1–10 条代理，每行一条。';
        error.hidden = false; input.setAttribute('aria-invalid', 'true'); input.focus(); return;
      }
      const results = entries.map(value => parseProxy(value, selector.value));
      validEntries = results.filter(result => result.valid).map(result => result.raw);
      const fragment = document.createDocumentFragment();
      results.forEach((result, index) => {
        const row = document.createElement('tr');
        const values = [String(index + 1), result.valid ? `${result.host}:${result.port}` : `第 ${index + 1} 条输入`, result.valid ? (result.protocol?.toUpperCase() || '未指定') : '—', result.valid ? (result.authenticated ? '已提供认证' : '无认证') : '—'];
        values.forEach(value => { const cell = document.createElement('td'); cell.textContent = value; row.append(cell); });
        const badgeCell = document.createElement('td');
        const badge = document.createElement('span');
        badge.className = 'tool-result-badge' + (result.valid ? ' is-valid' : '');
        badge.textContent = result.valid ? '格式正确' : '格式有误';
        badgeCell.append(badge); row.append(badgeCell);
        const detail = document.createElement('td'); detail.textContent = result.message; row.append(detail);
        fragment.append(row);
      });
      resultBody.append(fragment);
      resultWrap.hidden = false; empty.hidden = true; copy.disabled = !validEntries.length;
      status.textContent = `已核对 ${results.length} 条：${validEntries.length} 条格式正确，${results.length - validEntries.length} 条需修改。未进行网络连接检测。`;
    });
    copy.addEventListener('click', async () => {
      if (!validEntries.length) return;
      try {
        await navigator.clipboard.writeText(validEntries.join('\n'));
        status.textContent = `已复制 ${validEntries.length} 条格式正确的代理。复制内容包含原始认证信息，请妥善保管。`;
      } catch { status.textContent = '未能复制，请从上方输入框中手动选择需要的代理。'; }
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
      const result = entries.length === 1 ? parseProxy(entries[0], 'auto', true) : { valid: false, message: '请输入一条完整的静态住宅代理。' };
      if (!result.valid) {
        error.textContent = result.message; error.hidden = false; input.setAttribute('aria-invalid', 'true'); input.focus(); return;
      }
      description.textContent = `${result.host}:${result.port} · 已提供认证信息。`;
      ready.hidden = false;
    });
    reset();
  }
})();
