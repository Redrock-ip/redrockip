 preview.addEventListener('click', async () => {
  if (reviewing || preview.disabled) return;
  reviewing = true;
  preview.disabled = true;
  release.status(status,'');
  try {
   const current = await getQuote();
   if (!current) return;
   const { product, plan } = selected;
   const details = $('#purchase-order-details');
   details.replaceChildren();
   row(details,release.t('产品','Product'),product.name);
   row(details,release.t('套餐数量','Package quantity'),chosenQuantity());
   row(details,release.t('地区','Regions'),plan.area || productPrices[product.id].region);
   row(details,release.t('使用期限','Term'),chosenDuration());
   if (current.discountCents) row(details,release.t('优惠金额','Discount'),'−' + money(current.discountCents/100));
   $('#purchase-order-total').textContent = money(current.totalCents/100);
   release.status(confirmStatus,'');
   reviewedQuote = current;
   confirm.disabled = false;
   dialog.showModal();
   $('#purchase-order-title').focus();
  } catch {
   release.status(status,release.failed);
  } finally {
   reviewing = false;
   refreshActions();
  }
 });
 confirm.addEventListener('click', () => release.action(confirm,confirmStatus,async () => {
  if (!reviewedQuote) return;
  const result = await release.call('createOrder',{quoteId:reviewedQuote.quoteId});
  if (typeof result?.orderId !== 'string' || !result.orderId) throw new Error('Order not created');
  reviewedQuote = null;
  release.redirect(result.redirect,release.local('/dashboard/orders'));
 }));
 dialog.addEventListener('close', () => { reviewedQuote = null; });
