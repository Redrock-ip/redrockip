(() => {
  'use strict';
  const page = document.querySelector('main[data-workspace-page="recharge"]');
  if (!page) return;
  const $ = selector => page.querySelector(selector);
  const form = $('#recharge-form');
  const amount = $('#recharge-amount');
  const error = $('#recharge-error');
  const preview = $('#recharge-preview');
  const presets = [...page.querySelectorAll('[data-recharge-amount]')];
  const methods = [...page.querySelectorAll('input[name="recharge-method"]')];
  const dialog = $('#recharge-review-dialog');
  const demo = window.RedRockDemo;
  const demoConfirm = demo && $('#recharge-demo-confirm');
  const demoStatus = demo && $('#recharge-demo-status');
  let opener = null, backdropStart = false, reviewValue = null;

  function readAmount() {
    const raw = amount.value.trim();
    const number = Number(raw);
    if (!raw || !Number.isFinite(number) || number < 10 || number > 2000) return null;
    if (Math.abs(number * 100 - Math.round(number * 100)) > 0.000001) return null;
    return number;
  }
  function formatAmount(number) {
    return '$' + number.toFixed(2);
  }
  function method() {
    return methods.find(input => input.checked)?.value === 'crypto' ? 'crypto' : 'online';
  }
  function methodLabel() {
    return method() === 'crypto' ? 'USDT (TRC-20)' : 'Online payment';
  }
  function clearError() {
    error.hidden = true;
    error.textContent = '';
    amount.removeAttribute('aria-invalid');
  }
  function render() {
    const value = readAmount();
    const crypto = method() === 'crypto';
    $('#recharge-summary-amount').textContent = value === null ? '—' : formatAmount(value);
    $('#recharge-summary-method').textContent = methodLabel();
    $('#recharge-network-row').hidden = !crypto;
    $('#recharge-method-note').textContent = crypto
      ? 'Use USDT on TRC-20. The original confirmation page provides the payment address and exact amount.'
      : 'Available payment options and the exact amount are shown on the original confirmation page.';
    presets.forEach(button => button.setAttribute('aria-pressed', String(value !== null && Number(button.dataset.rechargeAmount) === value)));
  }
  presets.forEach(button => button.addEventListener('click', () => {
    amount.value = button.dataset.rechargeAmount;
    clearError();
    render();
  }));
  amount.addEventListener('input', () => { clearError(); render(); });
  methods.forEach(input => input.addEventListener('change', render));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const value = readAmount();
    if (value === null) {
      error.textContent = 'Enter an amount from $10 to $2,000 with up to two decimal places.';
      error.hidden = false;
      amount.setAttribute('aria-invalid', 'true');
      amount.focus();
      return;
    }
    clearError();
    reviewValue = value;
    if (demo) demoStatus.textContent = '';
    $('#recharge-review-amount').textContent = formatAmount(value);
    $('#recharge-review-method').textContent = methodLabel();
    $('#recharge-review-network-row').hidden = method() !== 'crypto';
    if (typeof dialog.showModal === 'function') {
      opener = document.activeElement || preview;
      if (!dialog.open) dialog.showModal();
    }
  });
  if (demo) {
    $('.ws-recharge-balance').hidden = true;
    $('.ws-recharge-next').hidden = true;
    $('.ws-recharge-history').hidden = true;
    $('.workspace-heading p').textContent = 'Choose an amount to add to your demo balance.';
    for (const anchor of page.querySelectorAll('a[href="https://redrock-ip.com/dashboard/recharge"]')) anchor.hidden = true;
    demoConfirm.hidden = false;
    demoConfirm.addEventListener('click', () => {
      const result = demo.recharge(reviewValue);
      if (result.ok) {
        demoConfirm.disabled = true;
        window.location.assign(demo.url('/dashboard/purchase',demo.selectedPlan()));
      } else demoStatus.textContent = demo.message(result);
    });
  }
  function closeReview() { if (dialog.open) dialog.close(); }
  $('#recharge-review-close').addEventListener('click', closeReview);
  $('#recharge-review-edit').addEventListener('click', closeReview);
  dialog.addEventListener('close', () => {
    backdropStart = false;
    if (opener?.isConnected !== false && typeof opener?.focus === 'function') opener.focus({ preventScroll: true });
    opener = null;
  });
  function outside(event) {
    const box = dialog.getBoundingClientRect();
    return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  }
  dialog.addEventListener('pointerdown', event => { backdropStart = event.target === dialog && outside(event); });
  dialog.addEventListener('pointercancel', () => { backdropStart = false; });
  dialog.addEventListener('click', event => {
    const dismiss = backdropStart && event.target === dialog && outside(event);
    backdropStart = false;
    if (dismiss) closeReview();
  });
  preview.disabled = false;
  render();
})();
