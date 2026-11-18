(() => {
 'use strict';
 const page = document.querySelector('main[data-workspace-page="orders"]');
 if (!page) return;
 const $ = selector => page.querySelector(selector);
 const products = {
  dynamic: 'Rotating Residential', static: 'Static Residential', mobile: 'Mobile Proxies', datacenter: 'Datacenter Proxies',
  'static-daily': 'Daily Residential', live: 'Live Connection', unlimited: 'Bandwidth Plans', short: 'Short-Term Residential'
 };
 const orders = [
  { id: 'DEMO-20261118-1008', product: 'dynamic', specification: '5 GB data package', cents: 800, status: 'paid', method: 'Balance (sample)', date: '2026-11-18', time: '14:32', location: 'Locations and sessions follow the selected configuration' },
  { id: 'DEMO-20261117-1007', product: 'static', specification: '1 IP · 10 days', cents: 400, status: 'paid', method: 'Balance (sample)', date: '2026-11-17', time: '10:18', location: 'Maryland, US' },
  { id: 'DEMO-20261117-1006', product: 'mobile', specification: '3 GB data package', cents: 960, status: 'unpaid', method: 'Not paid yet', date: '2026-11-17', time: '09:06', location: 'Network type and location follow the selected configuration' },
  { id: 'DEMO-20261116-1005', product: 'datacenter', specification: '1 IP · 30 days', cents: 55, status: 'paid', method: 'USDT (sample)', date: '2026-11-16', time: '16:42', location: 'Spain' },
  { id: 'DEMO-20261115-1004', product: 'static-daily', specification: '10 IPs · 1 day', cents: 500, status: 'unpaid', method: 'Not paid yet', date: '2026-11-15', time: '11:25', location: 'US' },
  { id: 'DEMO-20261114-1003', product: 'live', specification: '1 IP · 10 days', cents: 2400, status: 'paid', method: 'USDT (sample)', date: '2026-11-14', time: '15:04', location: 'Malaysia' },
  { id: 'DEMO-20261113-1002', product: 'unlimited', specification: '200M bandwidth tier · 1 hour', cents: 1500, status: 'unpaid', method: 'Not paid yet', date: '2026-11-13', time: '08:50', location: 'Locations and KEY follow the selected configuration' },
  { id: 'DEMO-20261112-1001', product: 'short', specification: '60-IP allowance', cents: 600, status: 'paid', method: 'Balance (sample)', date: '2026-11-12', time: '13:12', location: 'Validity follows the generated record' }
 ];
 const search = $('#records-search'), status = $('#records-status'), product = $('#records-product');
 const from = $('#records-from'), to = $('#records-to'), mode = $('#records-mode');
 const prev = $('#records-prev'), next = $('#records-next'), body = $('#records-rows');
 const dialog = $('#records-dialog');
 const pageSize = 5;
 let sample = true, pageNumber = 1, selected = null, opener = null, backdropStart = false;
 const money = cents => '$' + (cents / 100).toFixed(2);
 const normalize = value => value.normalize('NFKC').toLocaleLowerCase().trim();
 function make(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
 }
 function filterOrders() {
  if (!sample || (from.value && to.value && from.value > to.value)) return [];
  const query = normalize(search.value);
  return orders.filter(order => (status.value === 'all' || order.status === status.value) &&
   (product.value === 'all' || order.product === product.value) &&
   (!from.value || order.date >= from.value) && (!to.value || order.date <= to.value) &&
   normalize(order.id + ' ' + products[order.product] + ' ' + order.specification).includes(query));
 }
 function render() {
  const rows = filterOrders();
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  pageNumber = Math.max(1, Math.min(pageNumber, pages));
  body.replaceChildren();
  rows.slice((pageNumber - 1) * pageSize, pageNumber * pageSize).forEach(order => {
   const row = make('tr'), name = make('td'), amount = make('td', money(order.cents), 'ws-record-money');
   name.append(make('strong', products[order.product]), make('small', order.id));
   const state = make('td'); state.append(make('span', order.status === 'paid' ? 'Paid' : 'Unpaid', 'ws-record-badge' + (order.status === 'unpaid' ? ' is-unpaid' : '')));
   const time = make('td'); time.append(make('span', order.date), make('small', order.time));
   const action = make('td'), button = make('button', 'View details', 'ws-record-detail-button');
   button.type = 'button'; button.setAttribute('aria-label', `View details for sample order ${order.id}`);
   button.addEventListener('click', () => openDetails(order, button)); action.append(button);
   row.append(name, amount, state, make('td', order.method), time, action); body.append(row);
  });
  $('#records-table-wrap').hidden = rows.length === 0;
  $('#records-empty').hidden = rows.length > 0;
  $('#records-empty-title').textContent = sample ? 'No matching sample orders' : 'Order data is not connected';
  $('#records-empty-description').textContent = sample ? 'Try another keyword or reset the filters.' : 'Sign in to the original dashboard to view real orders and payment status.';
  $('#records-count').textContent = sample ? `Sample orders: ${rows.length}` : 'Waiting for real order data';
  $('#records-page').textContent = sample && rows.length ? `${pageNumber} / ${pages}` : '—';
  prev.disabled = !sample || pageNumber <= 1; next.disabled = !sample || pageNumber >= pages;
  $('#records-total-count').textContent = sample ? String(rows.length) : '—';
  $('#records-paid-count').textContent = sample ? String(rows.filter(order => order.status === 'paid').length) : '—';
  $('#records-unpaid-count').textContent = sample ? String(rows.filter(order => order.status === 'unpaid').length) : '—';
  $('#records-total-amount').textContent = sample ? money(rows.reduce((sum, order) => sum + order.cents, 0)) : '—';
  $('#records-filter-status').textContent = !sample ? 'The account is disconnected. No account orders have been queried.' : from.value && to.value && from.value > to.value ? 'The start date must not be later than the end date. Adjust the date range.' : `Sample orders matching the current filters: ${rows.length}.`;
 }
 function updateMode() {
  mode.setAttribute('aria-pressed', String(sample)); mode.textContent = sample ? 'Show disconnected state' : 'Show sample data';
  $('#records-mode-note').textContent = sample ? 'Sample data · Not a real account. These orders demonstrate filters and details; no real orders have been read or created.' : 'Account data is not connected. View real orders, payment status and order details on the original dashboard.';
  $('#records-source-label').textContent = sample ? 'Sample orders' : 'Disconnected';
  [search,status,product,from,to,$('#records-reset')].forEach(control => { control.disabled = !sample; });
  pageNumber = 1; render();
 }
 function openDetails(order, trigger) {
  if (!sample || typeof dialog.showModal !== 'function') return;
  selected = order; opener = trigger; backdropStart = false;
  $('#records-detail-status').textContent = '';
  const fields = [
   ['Order ID', order.id], ['Products', products[order.product]], ['Plan configuration', order.specification],
   ['Location / notes', order.location], ['Order amount', money(order.cents)], ['Payment status', order.status === 'paid' ? 'Paid' : 'Unpaid'],
   ['Payment method', order.method], ['Created at', order.date + ' ' + order.time], ['Data source', 'Interface sample, no real transaction']
  ];
  const list = $('#records-detail-list'); list.replaceChildren();
  fields.forEach(([label, value]) => { const group = make('div'); group.append(make('dt', label), make('dd', value)); list.append(group); });
  dialog.showModal();
 }
 $('#records-filters').addEventListener('submit', event => event.preventDefault());
 [search,status,product,from,to].forEach(control => control.addEventListener(control === search ? 'input' : 'change', () => { pageNumber = 1; render(); }));
 $('#records-reset').addEventListener('click', () => { search.value = ''; status.value = 'all'; product.value = 'all'; from.value = ''; to.value = ''; pageNumber = 1; render(); search.focus(); });
 mode.addEventListener('click', () => { sample = !sample; if (dialog.open) dialog.close(); updateMode(); });
 prev.addEventListener('click', () => { pageNumber -= 1; render(); }); next.addEventListener('click', () => { pageNumber += 1; render(); });
 $('#records-dialog-close').addEventListener('click', () => dialog.close());
 const outside = event => { const box = dialog.getBoundingClientRect(); return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom; };
 dialog.addEventListener('pointerdown', event => { backdropStart = event.target === dialog && outside(event); });
 dialog.addEventListener('pointercancel', () => { backdropStart = false; });
 dialog.addEventListener('click', event => { if (backdropStart && event.target === dialog && outside(event)) dialog.close(); backdropStart = false; });
 dialog.addEventListener('close', () => { const trigger = opener; opener = null; if (trigger?.isConnected !== false) trigger?.focus({ preventScroll: true }); });
 $('#records-copy-id').addEventListener('click', async () => {
  if (!selected || !sample) return;
  try { if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable'); await navigator.clipboard.writeText(selected.id); $('#records-detail-status').textContent = 'Sample order ID copied.'; }
  catch { $('#records-detail-status').textContent = `Copy the sample order ID manually: ${selected.id}`; }
 });
 updateMode();
})();
