(() => {
  'use strict';
  const key = 'redrock-preview-journey-v1';
  const initial = () => ({ balanceCents: 2000, nextOrder: 1, orders: [] });
  const products = {
    dynamic: 'Rotating Residential', static: 'Static Residential', mobile: 'Mobile Proxies',
    datacenter: 'Datacenter Proxies', 'static-daily': 'Daily Residential', live: 'Live Connection',
    unlimited: 'Bandwidth Plans', short: 'Short-Term Residential'
  };
  const serviceRoutes = {
    dynamic: 'proxy-generator', static: 'static-proxies', mobile: 'mobile-generator',
    datacenter: 'datacenter-proxies', 'static-daily': 'static-daily-proxies', live: 'live-proxies',
    unlimited: 'unlimited-proxies', short: 'short-dynamic-proxies'
  };
  const money = cents => '$' + (cents / 100).toFixed(2);
  const gb = mb => (mb / 1000).toFixed(2) + ' GB';
  const isCount = n => Number.isSafeInteger(n) && n >= 0;

  function demoStore(storage, now = () => new Date()) {
    function read() {
      try {
        const state = JSON.parse(storage.getItem(key));
        if (state && isCount(state.balanceCents) && isCount(state.nextOrder) && state.nextOrder > 0 &&
            Array.isArray(state.orders) && state.orders.every(order => order && Object.hasOwn(products, order.productId) &&
              typeof order.id === 'string' && typeof order.createdAt === 'string' && isCount(order.costCents) &&
              isCount(order.quotaMB) && isCount(order.usedMB) && order.usedMB <= order.quotaMB && isCount(order.runs))) {
          return state;
        }
      } catch { /* The flow can still be browsed if local storage is unavailable. */ }
      return initial();
    }
    function save(state) {
      try {
        storage.setItem(key, JSON.stringify(state));
        return { ok: true, state };
      } catch {
        return { ok: false, reason: 'storage' };
      }
    }
    function purchase(productId, plan) {
      if (!Object.hasOwn(products, productId) || !plan || !Number.isFinite(plan.total) || plan.total <= 0) return { ok: false };
      const state = read();
      const costCents = Math.round(plan.total * 100);
      if (costCents > state.balanceCents) return { ok: false, reason: 'balance' };
      const traffic = productId === 'dynamic' || productId === 'mobile';
      const quotaMB = traffic ? Math.round(Number.parseFloat(plan.quantity.replaceAll(',', '')) * 1000) : 0;
      if (!isCount(quotaMB) || (traffic && !quotaMB)) return { ok: false };
      const order = {
        id: 'DEMO-' + String(state.nextOrder).padStart(4, '0'),
        productId, costCents, quotaMB, usedMB: 0, runs: 0,
        createdAt: now().toISOString()
      };
      state.balanceCents -= costCents;
      state.nextOrder++;
      state.orders.push(order);
      return { ...save(state), order };
    }
    function recharge(amount) {
      const cents = Math.round(amount * 100);
      if (!isCount(cents) || cents < 1000 || cents > 200000) return { ok: false };
      const state = read();
      state.balanceCents += cents;
      return save(state);
    }
    function consume(id) {
      const state = read();
      const order = state.orders.find(item => item.id === id);
      if (!order || (order.quotaMB && order.usedMB >= order.quotaMB)) return { ok: false, reason: 'quota' };
      const increment = Math.min(500, order.quotaMB - order.usedMB);
      order.usedMB += increment;
      order.runs++;
      return { ...save(state), order, increment };
    }
    function reset() {
      return save(initial());
    }
    return { read, purchase, recharge, consume, reset };
  }

  if (typeof module === 'object' && module.exports) module.exports = { demoStore };
  if (typeof window === 'undefined') return;
  const query = new URLSearchParams(window.location.search);
  if (query.get('demo') !== '1') return;
  const main = document.querySelector('main[data-workspace-page]');
  if (!main || !['purchase','recharge','orders','usage'].includes(main.dataset.workspacePage)) return;
  const page = main.dataset.workspacePage;
  const prefix = document.documentElement.lang === 'en' ? '/en' : '';
  const store = demoStore({
    getItem: name => window.localStorage.getItem(name),
    setItem: (name, value) => window.localStorage.setItem(name, value)
  });
  const url = (route, params = {}) => {
    const search = new URLSearchParams({ demo: '1', ...params });
    return prefix + route + '?' + search;
  };
  const selectedPlan = () => {
    const current = new URLSearchParams(window.location.search);
    return Object.fromEntries(['tab','plan','quantity','promo'].filter(field => current.has(field)).map(field => [field,current.get(field)]));
  };
  const message = result => result.reason === 'storage'
    ? 'Your browser could not save the demo. Allow local storage for this site.'
    : 'This action could not be completed. Choose again and retry.';
  main.dataset.demo = 'active';

  for (const link of document.querySelectorAll('a[href]')) {
    const target = new URL(link.getAttribute('href'), window.location.href);
    if (target.origin === window.location.origin &&
        /\/dashboard\/(purchase|recharge|orders|usage)(?:\.html)?\/?$/.test(target.pathname)) {
      target.searchParams.set('demo', '1');
      link.href = target.pathname + target.search + target.hash;
    }
  }

  function node(tag, text, className) {
    const element = document.createElement(tag);
    if (text) element.textContent = text;
    if (className) element.className = className;
    return element;
  }
  function link(label, href, className = 'workspace-secondary') {
    const anchor = node('a',label,className);
    anchor.href = href;
    return anchor;
  }
  const guide = node('section',null,'ws-panel demo-guide');
  guide.setAttribute('aria-label','Purchase walkthrough');
  const guideTop = node('div',null,'demo-guide-top');
  const lead = node('div');
  lead.append(node('h2','Purchase walkthrough'),
    node('p','Use a demo balance to choose a plan. Orders and usage stay in this browser.'));
  const balance = node('strong','Demo balance ' + money(store.read().balanceCents),'demo-balance');
  window.RedRockDemo = {
    ...store, url, selectedPlan, money, message,
    purchase(productId, plan) {
      const result = store.purchase(productId, plan);
      if (result.ok) balance.textContent = 'Demo balance ' + money(result.state.balanceCents);
      return result;
    }
  };
  guideTop.append(lead,balance);
  guide.append(guideTop);
  const steps = node('div',null,'demo-links');
  steps.append(link('Browse products',prefix+'/products?demo=1#product-solutions'));
  for (const [stage, label] of [['purchase','Choose a plan'],['orders','View orders'],['usage','View usage']]) {
    const action = link(label,url('/dashboard/'+stage));
    if (page === stage) action.setAttribute('aria-current','step');
    steps.append(action);
  }
  const rechargeLink = link('Simulate a top-up',url('/dashboard/recharge',selectedPlan()));
  rechargeLink.addEventListener('click',() => {
    rechargeLink.href = url('/dashboard/recharge',selectedPlan());
  });
  steps.append(rechargeLink);
  guide.append(steps);
  const foot = node('div',null,'demo-links demo-guide-foot');
  const reset = node('button','Reset demo records','workspace-secondary');
  reset.type = 'button';
  const guideStatus = node('p',null,'demo-status');
  guideStatus.setAttribute('role','status');
  let refreshing = () => {};
  reset.addEventListener('click',() => {
    if (!window.confirm('Clear demo orders and usage in this browser and restore the demo balance?')) return;
    const result = store.reset();
    if (result.ok) {
      balance.textContent = 'Demo balance ' + money(result.state.balanceCents);
      refreshing();
      guideStatus.textContent = 'The demo has been reset.';
    } else guideStatus.textContent = message(result);
  });
  foot.append(link('Exit demo',prefix+'/dashboard/'+page),reset);
  guide.append(foot,guideStatus);

  if (page === 'orders' || page === 'usage') {
    for (const child of main.children) child.hidden = true;
    const section = node('section',null,'ws-panel demo-records');
    const title = node('h1',page === 'orders' ? 'Demo orders' : 'Demo usage');
    title.tabIndex = -1;
    const status = node('p',null,'demo-status');
    status.setAttribute('role','status');
    const content = node('div',null,'demo-record-list');
    section.append(title,content,status);
    main.append(section);
    let selectedOrder = query.get('order');
    refreshing = () => {
      const orders = [...store.read().orders].reverse();
      content.replaceChildren();
      if (!orders.length) {
        const empty = node('div',null,'ws-empty');
        empty.append(node('h3','No demo orders yet'),node('p','Choose a plan to view its order and usage.'),
          link('Choose a plan',url('/dashboard/purchase'),'button'));
        content.append(empty);
        return;
      }

      if (page === 'orders') {
        for (const order of orders) {
          const card = node('article',null,'demo-record');
          const details = node('div');
          const shipDate = new Date(order.createdAt).toLocaleString(document.documentElement.lang);
          details.append(node('h2',products[order.productId]),
            node('p',order.id+' · '+shipDate),node('p','Demo purchase complete · '+money(order.costCents)));
          const actions = node('div',null,'demo-links');
          actions.append(link('Configuration preview',url('/dashboard/'+serviceRoutes[order.productId],{order:order.id})),
            link('View and simulate usage',url('/dashboard/usage',{order:order.id}),'button'));
          card.append(details,actions);
          content.append(card);
        }
        return;
      }

      const order = orders.find(item => item.id === selectedOrder) || orders[0];
      selectedOrder = order.id;
      const field = node('div',null,'ws-field');
      const label = node('label','Select a demo order');
      label.htmlFor = 'demo-usage-order';
      const select = node('select');
      select.id = 'demo-usage-order';
      for (const item of orders) {
        const option = node('option',products[item.productId]+' · '+item.id);
        option.value = item.id;
        option.selected = item.id === selectedOrder;
        select.append(option);
      }
      select.addEventListener('change',() => {
        selectedOrder = select.value;
        status.textContent = '';
        refreshing();
        content.querySelector('select').focus();
      });
      field.append(label,select);
      content.append(field);
      const metrics = node('div',null,'demo-metrics');
      const metric = (label, value) => {
        const cell = node('div',null,'ws-kpi');
        cell.append(node('span',label),node('strong',value));
        return cell;
      };
      if (order.quotaMB) {
        metrics.append(metric('Plan allowance',gb(order.quotaMB)),metric('Data used',gb(order.usedMB)),
          metric('Data remaining',gb(order.quotaMB-order.usedMB)));
        const progress = node('progress');
        progress.max = order.quotaMB;
        progress.value = order.usedMB;
        progress.setAttribute('aria-label','Data usage progress');
        content.append(metrics,progress);
      } else {
        metrics.append(metric('Simulated connections',String(order.runs)));
        content.append(metrics);
      }
      const remaining = order.quotaMB - order.usedMB;
      const available = !order.quotaMB || remaining > 0;
      const usageAmount = Math.min(500, remaining);
      const actionLabel = order.quotaMB ? 'Simulate '+usageAmount+' MB' : 'Simulate a connection';
      const consume = node('button',available ? actionLabel : 'Demo allowance used up','button');
      consume.type = 'button';
      consume.disabled = !available;
      consume.addEventListener('click',() => {
        const result = store.consume(order.id);
        if (result.ok) {
          status.textContent = result.increment ? 'Recorded demo usage of '+result.increment+' MB.' : 'Recorded one simulated connection.';
          refreshing();
          const next = content.querySelector('button');
          if (!next.disabled) next.focus();
          else title.focus();
        } else status.textContent = message(result);
      });
      const actions = node('div',null,'demo-links');
      actions.append(consume,link('Back to orders',url('/dashboard/orders')));
      content.append(actions);
    };
    refreshing();
  }
  main.prepend(guide);
  window.addEventListener('pageshow',event => {
    if (!event.persisted) return;
    balance.textContent = 'Demo balance ' + money(store.read().balanceCents);
    refreshing();
  });
})();
