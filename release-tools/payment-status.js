(() => {
  'use strict';
  const release = window.RedRockRelease;
  const url = new URL(window.location.href);
  const paymentRef = url.searchParams.get('paymentRef');
  const byId = id => document.getElementById('payment-status-' + id);
  const dialog = byId('window');
  if (!release || !dialog || typeof dialog.showModal !== 'function' ||
      !paymentRef || !/^[a-zA-Z0-9._~-]{1,200}$/.test(paymentRef)) return;

  const t = release.t;
  const title = byId('title');
  const description = byId('description');
  const retry = byId('retry');
  const confirming = t('正在确认支付结果','Confirming your payment');
  let timer;
  let pendingChecks = 0;

  function render(state, heading, message, allowRetry = false) {
    dialog.dataset.paymentStatus = state;
    if (title.textContent !== heading) title.textContent = heading;
    if (description.textContent !== message) description.textContent = message;
    retry.hidden = !allowRetry;
  }

  async function check() {
    if (!dialog.open) return;
    if (!release.has('loadPaymentStatus')) {
      render('unavailable',t('支付状态暂不可用','Payment status unavailable'),
        t('可在订单记录中查看更新。','Check the order history for updates.'));
      return;
    }
    render('pending',confirming,t('正在查询该笔付款的状态。','Checking the status of this payment.'));
    try {
      const payment = await release.call('loadPaymentStatus',{paymentRef});
      if (!dialog.open) return;
      const hasOrder = typeof payment?.orderId === 'string' && payment.orderId.trim() && payment.orderId.length <= 160;
      const hasAmount = Number.isSafeInteger(payment?.totalCents) && payment.totalCents >= 0;
      byId('order').textContent = hasOrder ? payment.orderId : '—';
      byId('amount').textContent = hasAmount ? '$' + (payment.totalCents / 100).toFixed(2) : '—';

      if (payment?.status === 'paid' && hasOrder && hasAmount) {
        render('paid',t('支付成功','Payment successful'),t('订单已确认收款。','Payment has been confirmed for this order.'));
      } else if (payment?.status === 'failed') {
        render('failed',t('支付未完成','Payment incomplete'),t('可在订单记录中查看详情。','Check the order history for details.'));
      } else if (payment?.status === 'pending') {
        if (++pendingChecks < 20) timer = window.setTimeout(check, 2500);
        else render('waiting',t('仍在等待支付确认','Awaiting payment confirmation'),
          t('你可以稍后重新查询。','You can check again shortly.'),true);
      } else {
        throw new Error('Invalid payment status');
      }
    } catch {
      if (dialog.open) render('unavailable',t('支付状态暂不可用','Payment status unavailable'),
        t('请稍后重新查询。','Try checking again shortly.'),true);
    }
  }

  retry.addEventListener('click', () => {
    pendingChecks = 0;
    title.focus({preventScroll:true});
    check();
  });
  byId('close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    window.clearTimeout(timer);
    url.searchParams.delete('paymentRef');
    window.history.replaceState(null,'',url.pathname + url.search + url.hash);
  });
  dialog.showModal();
  title.focus({preventScroll:true});
  check();
})();
