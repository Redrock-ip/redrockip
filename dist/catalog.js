(() => {
  'use strict';
  const products = {
    dynamic: { name: '动态住宅代理', unit: 'GB', traffic: true },
    static: { name: '静态住宅代理', unit: '个 IP', traffic: false },
    mobile: { name: '移动代理', unit: 'GB', traffic: true },
    datacenter: { name: '数据中心代理', unit: '个 IP', traffic: false }
  };
  const page = document.querySelector('main[data-page]');
  if (!page) return;

  const filterGroup = page.querySelector('[data-catalog-filters]');
  if (filterGroup) {
    const filters = [...filterGroup.querySelectorAll('[data-product-filter]')];
    const cards = [...page.querySelectorAll('[data-product-family]')];
    const status = page.querySelector('[data-filter-status]');
    function filterProducts(value) {
      let count = 0;
      cards.forEach(card => {
        card.hidden = value !== 'all' && card.dataset.productFamily !== value;
        if (!card.hidden) count++;
      });
      filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.productFilter === value)));
      status.textContent = value === 'all' ? `显示全部 ${cards.length} 类产品` : `显示 ${count} 类产品`;
    }
    filters.forEach(button => button.addEventListener('click', () => filterProducts(button.dataset.productFilter)));
    filterGroup.hidden = false;
    status.hidden = false;
    // A linked product always stays visible, including after browser Back/Forward.
    const revealLinkedProduct = () => {
      const key = location.hash.slice(1);
      const card = cards.find(item => item.id === key);
      if (card && card.hidden) { filterProducts('all'); card.scrollIntoView({ behavior: 'auto', block: 'start' }); }
    };
    window.addEventListener('hashchange', revealLinkedProduct);
    revealLinkedProduct();
  }

  const tabsGroup = page.querySelector('[data-price-tabs]');
  if (!tabsGroup) return;
  const tabs = [...tabsGroup.querySelectorAll('[data-plan-tab]')];
  const panels = [...page.querySelectorAll('[data-plan-panel]')];
  const form = page.querySelector('#catalog-request-form');
  const productField = page.querySelector('#request-product');
  const quantity = page.querySelector('#request-quantity');
  const quantityLabel = page.querySelector('#request-quantity-label');
  const quantityHint = page.querySelector('#request-quantity-hint');
  const empty = page.querySelector('#request-empty');
  const result = page.querySelector('#request-result');
  const summary = page.querySelector('#request-summary');
  const status = page.querySelector('#request-status');
  const copy = page.querySelector('#request-copy');
  const email = page.querySelector('#request-email');
  let selected = null;

  tabsGroup.setAttribute('role', 'tablist');
  tabsGroup.setAttribute('aria-orientation', 'horizontal');
  tabs.forEach(tab => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', tab.dataset.planTab);
  });
  panels.forEach(panel => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', 'plan-tab-' + panel.dataset.planPanel);
    panel.setAttribute('tabindex', '0');
  });

  function invalidateSummary() {
    result.hidden = true;
    empty.hidden = false;
    summary.textContent = '';
    email.href = 'mailto:support@redrock-ip.com';
    status.textContent = '';
  }
  function selectPlan(key, updateUrl = false) {
    if (!Object.hasOwn(products, key)) key = 'dynamic';
    const previous = selected;
    selected = key;
    tabs.forEach(tab => {
      const active = tab.dataset.planTab === key;
      tab.setAttribute('aria-selected', String(active));
      tab.setAttribute('tabindex', active ? '0' : '-1');
    });
    panels.forEach(panel => { panel.hidden = panel.dataset.planPanel !== key; });
    productField.value = key;
    const product = products[key];
    quantityLabel.textContent = product.traffic ? '预计流量（GB）' : '计划 IP 数量（个）';
    quantityHint.textContent = product.traffic ? '用于沟通流量需求，不计算套餐价格。' : '用于沟通 IP 数量；具体期限与单价需另行确认。';
    quantity.min = product.traffic ? '0.1' : '1';
    quantity.step = product.traffic ? '0.1' : '1';
    quantity.inputMode = product.traffic ? 'decimal' : 'numeric';
    if (previous && products[previous].traffic !== product.traffic) quantity.value = '';
    if (previous !== key) invalidateSummary();
    if (updateUrl && location.hash !== '#' + key) {
      try { history.replaceState(null, '', '#' + key); } catch { /* Tabs still work without history access. */ }
    }
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', event => {
      event.preventDefault();
      selectPlan(tab.dataset.planTab, true);
    });
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[next].focus();
      selectPlan(tabs[next].dataset.planTab, true);
    });
  });
  productField.addEventListener('change', () => selectPlan(productField.value, true));
  form.addEventListener('input', invalidateSummary);
  window.addEventListener('hashchange', () => {
    const key = location.hash.slice(1);
    if (Object.hasOwn(products, key)) selectPlan(key);
  });
  const initial = location.hash.slice(1);
  selectPlan(Object.hasOwn(products, initial) ? initial : 'dynamic');

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const region = form.elements.region.value.trim();
    const duration = form.elements.duration.value.trim();
    if (!region || !duration) {
      status.textContent = '请填写所需地区与使用周期。';
      (region ? form.elements.duration : form.elements.region).focus();
      return;
    }
    const product = products[selected];
    const scenario = form.elements.scenario.value.trim();
    const lines = [
      'RED ROCK · 代理服务需求',
      `代理类型：${product.name}`,
      `所需地区：${region}`,
      `${product.traffic ? '预计流量' : '计划 IP 数量'}：${Number(quantity.value)} ${product.unit}`,
      `预计使用周期：${duration}`,
      `业务场景与要求：${scenario || '待沟通'}`,
      '',
      '请协助确认可用地区、产品配置、计费规则及当前报价。',
      '此摘要不构成订单或报价。'
    ];
    summary.textContent = lines.join('\n');
    email.href = 'mailto:support@redrock-ip.com?subject=' + encodeURIComponent('产品咨询：' + product.name) + '&body=' + encodeURIComponent(summary.textContent);
    empty.hidden = true;
    result.hidden = false;
    status.textContent = '需求摘要已生成，可复制或在邮件客户端中打开。';
    summary.focus();
  });
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(summary.textContent);
      status.textContent = '需求摘要已复制。';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(summary);
      if (selection) { selection.removeAllRanges(); selection.addRange(range); }
      summary.focus();
      status.textContent = '请手动复制已选中的摘要文字。';
    }
  });
  page.querySelector('#request-generate').disabled = false;
})();
