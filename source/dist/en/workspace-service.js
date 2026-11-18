(() => {
  'use strict';
  const page = document.querySelector('main[data-workspace-page="service"]');
  if (!page) return;
  const mode = page.dataset.serviceMode;
  const product = page.dataset.serviceProduct;
  const $ = s => page.querySelector(s);
  const result = $('#service-result');
  const sample = $('#service-sample');
  const status = $('#service-status');
  const choice = id => $(id).value;
  const order = new URLSearchParams(window.location.search).get('order');
  if (order && /^DEMO-\d+$/.test(order)) {
    const usage = $('#service-usage');
    if (usage && !usage.getAttribute('href').startsWith('#')) {
      const target = new URL(usage.href);
      target.searchParams.set('order',order);
      usage.href = target.pathname + target.search;
    }
  }
  for (const field of page.querySelectorAll('[data-service-fields]')) {
    field.hidden = !field.dataset.serviceFields.split(' ').includes(mode);
  }

  function detail(label,value) {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = label;
    description.textContent = value;
    row.append(term,description);
    return row;
  }
  $('#service-form').addEventListener('submit',event => {
    event.preventDefault();
    const protocol = choice('#service-protocol');
    const port = protocol === 'socks5' ? 1080 : 8080;
    const orderType = mode === 'resources' ? choice('#service-resource') : '';
    const count = mode === 'batch' ? Number(choice('#service-quantity')) : 1;
    const lines = Array.from({length:count},(_,i) => {
      const host = mode === 'resources' ? '192.0.2.'+(10+Number(orderType)) : product+'-'+(i+1)+'.example.invalid';
      return protocol+'://'+host+':'+port;
    });
    const rows = [detail('Example region',choice('#service-region')),detail('Protocol',protocol.toUpperCase())];
    if (mode === 'generate' || mode === 'bandwidth') rows.push(detail('Session mode',choice('#service-session')));
    if (mode === 'bandwidth') rows.push(detail('Example bandwidth',choice('#service-bandwidth')));
    if (mode === 'batch') rows.push(detail('Example quantity',String(count)));
    if (mode === 'resources') rows.push(detail('Example resource',orderType === '1' ? 'Example route 01' : 'Example route 02'));
    $('#service-details').replaceChildren(...rows);
    sample.value = lines.join('\n');
    $('#service-empty').hidden = true;
    result.hidden = false;
    status.textContent = 'The connection format example was updated.';
  });

  $('#service-copy').addEventListener('click',async () => {
    try {
      await navigator.clipboard.writeText(sample.value);
      status.textContent = 'Example copied.';
    } catch {
      sample.focus();
      sample.select();
      status.textContent = 'The sample is selected and ready to copy.';
    }
  });
})();
