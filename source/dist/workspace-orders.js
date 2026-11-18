(() => {
 'use strict';
 const page = document.querySelector('main[data-workspace-page="orders"]');
 if (!page) return;
 const $ = selector => page.querySelector(selector);
 const products = {
  dynamic: '动态住宅代理', static: '静态住宅代理', mobile: '移动代理', datacenter: '数据中心代理',
  'static-daily': '静态住宅日租', live: '直播专线', unlimited: '动态不限量', short: '短效住宅'
 };
 const orders = [
  { id: 'DEMO-20261118-1008', product: 'dynamic', specification: '5 GB 流量包', cents: 800, status: 'paid', method: '余额（示例）', date: '2026-11-18', time: '14:32', location: '地区与会话按所选配置' },
  { id: 'DEMO-20261117-1007', product: 'static', specification: '1 IP · 10 天', cents: 400, status: 'paid', method: '余额（示例）', date: '2026-11-17', time: '10:18', location: '美国马里兰州' },
  { id: 'DEMO-20261117-1006', product: 'mobile', specification: '3 GB 流量包', cents: 960, status: 'unpaid', method: '尚未付款', date: '2026-11-17', time: '09:06', location: '网络类型与地区按所选配置' },
  { id: 'DEMO-20261116-1005', product: 'datacenter', specification: '1 IP · 30 天', cents: 55, status: 'paid', method: 'USDT（示例）', date: '2026-11-16', time: '16:42', location: '西班牙' },
  { id: 'DEMO-20261115-1004', product: 'static-daily', specification: '10 IP · 1 天', cents: 500, status: 'unpaid', method: '尚未付款', date: '2026-11-15', time: '11:25', location: '美国' },
  { id: 'DEMO-20261114-1003', product: 'live', specification: '1 IP · 10 天', cents: 2400, status: 'paid', method: 'USDT（示例）', date: '2026-11-14', time: '15:04', location: '马来西亚' },
  { id: 'DEMO-20261113-1002', product: 'unlimited', specification: '200M 带宽档位 · 1 小时', cents: 1500, status: 'unpaid', method: '尚未付款', date: '2026-11-13', time: '08:50', location: '地区与 KEY 按所选配置' },
  { id: 'DEMO-20261112-1001', product: 'short', specification: '60 IP 额度', cents: 600, status: 'paid', method: '余额（示例）', date: '2026-11-12', time: '13:12', location: '有效期以生成记录为准' }
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
   const state = make('td'); state.append(make('span', order.status === 'paid' ? '已支付' : '未支付', 'ws-record-badge' + (order.status === 'unpaid' ? ' is-unpaid' : '')));
   const time = make('td'); time.append(make('span', order.date), make('small', order.time));
   const action = make('td'), button = make('button', '查看详情', 'ws-record-detail-button');
   button.type = 'button'; button.setAttribute('aria-label', `查看示例订单 ${order.id} 的详情`);
   button.addEventListener('click', () => openDetails(order, button)); action.append(button);
   row.append(name, amount, state, make('td', order.method), time, action); body.append(row);
  });
  $('#records-table-wrap').hidden = rows.length === 0;
  $('#records-empty').hidden = rows.length > 0;
  $('#records-empty-title').textContent = sample ? '没有匹配的示例订单' : '订单数据尚未接入';
  $('#records-empty-description').textContent = sample ? '试试其他关键词，或重置筛选条件。' : '登录原站控制台后，可查看真实订单与付款状态。';
  $('#records-count').textContent = sample ? `共 ${rows.length} 条示例订单` : '等待真实订单数据';
  $('#records-page').textContent = sample && rows.length ? `${pageNumber} / ${pages}` : '—';
  prev.disabled = !sample || pageNumber <= 1; next.disabled = !sample || pageNumber >= pages;
  $('#records-total-count').textContent = sample ? String(rows.length) : '—';
  $('#records-paid-count').textContent = sample ? String(rows.filter(order => order.status === 'paid').length) : '—';
  $('#records-unpaid-count').textContent = sample ? String(rows.filter(order => order.status === 'unpaid').length) : '—';
  $('#records-total-amount').textContent = sample ? money(rows.reduce((sum, order) => sum + order.cents, 0)) : '—';
  $('#records-filter-status').textContent = !sample ? '当前为未接入状态，未查询任何账户订单。' : from.value && to.value && from.value > to.value ? '开始日期不能晚于结束日期，请调整日期范围。' : `当前筛选匹配 ${rows.length} 条示例订单。`;
 }
 function updateMode() {
  mode.setAttribute('aria-pressed', String(sample)); mode.textContent = sample ? '查看未接入状态' : '查看示例数据';
  $('#records-mode-note').textContent = sample ? '示例数据 · 非真实账户。以下订单仅用于展示筛选与详情，未读取或创建真实订单。' : '未接入账户数据。真实订单、付款状态与订单详情，请前往原站控制台查看。';
  $('#records-source-label').textContent = sample ? '示例订单' : '未接入';
  [search,status,product,from,to,$('#records-reset')].forEach(control => { control.disabled = !sample; });
  pageNumber = 1; render();
 }
 function openDetails(order, trigger) {
  if (!sample || typeof dialog.showModal !== 'function') return;
  selected = order; opener = trigger; backdropStart = false;
  $('#records-detail-status').textContent = '';
  const fields = [
   ['订单编号', order.id], ['产品', products[order.product]], ['套餐配置', order.specification],
   ['地区 / 说明', order.location], ['订单金额', money(order.cents)], ['支付状态', order.status === 'paid' ? '已支付' : '未支付'],
   ['支付方式', order.method], ['创建时间', order.date + ' ' + order.time], ['数据来源', '界面示例，非真实交易']
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
  try { if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable'); await navigator.clipboard.writeText(selected.id); $('#records-detail-status').textContent = '示例订单号已复制。'; }
  catch { $('#records-detail-status').textContent = `请手动复制示例订单号：${selected.id}`; }
 });
 updateMode();
})();
